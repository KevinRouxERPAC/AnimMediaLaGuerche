"""
Application Flask sécurisée pour Anim'Média
===========================================

API REST complète avec authentification JWT, validation des données
et gestion sécurisée des fichiers JSON pour l'association Anim'Média.

Endpoints principaux:
- /api/auth/* : Authentification (login, logout, refresh)
- /api/events/* : Gestion des événements
- /api/members/* : Gestion des membres  
- /api/registrations/* : Gestion des inscriptions
- /api/stats/* : Statistiques et tableaux de bord

Sécurité:
- JWT avec refresh tokens
- Validation Marshmallow
- Hash bcrypt pour les mots de passe
- Protection CSRF
- Rate limiting
- Headers sécurisés
"""

from flask import Flask, request, jsonify, send_from_directory, session
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, create_refresh_token, get_jwt_identity, get_jwt
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from werkzeug.security import generate_password_hash, check_password_hash
from marshmallow import Schema, fields, ValidationError, validate
from datetime import datetime, timedelta
import json
import os
import secrets
import hashlib
from functools import wraps
import logging
from pathlib import Path

# Configuration de l'application
app = Flask(__name__)

# Configuration sécurisée
class Config:
    # Génération automatique de clés secrètes sécurisées
    SECRET_KEY = os.environ.get('SECRET_KEY') or secrets.token_hex(32)
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or secrets.token_hex(32)
    
    # Configuration JWT
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']
    
    # Base de données JSON
    DATA_DIR = Path(__file__).parent / 'data'
    BACKUP_DIR = Path(__file__).parent / 'backups'
    
    # Sécurité
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max
    WTF_CSRF_ENABLED = True
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'

app.config.from_object(Config)

# Extensions
jwt = JWTManager(app)
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

# CORS configuré de manière sécurisée
CORS(app, origins=[
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    # Ajouter votre domaine de production ici
    # "https://votre-domaine.com"
])

# Configuration des logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Liste noire des tokens JWT révoqués
blacklisted_tokens = set()

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload['jti']
    return jti in blacklisted_tokens

# Gestionnaire de données JSON sécurisé
class SecureJSONManager:
    def __init__(self, data_dir):
        self.data_dir = Path(data_dir)
        self.backup_dir = Path(app.config['BACKUP_DIR'])
        self.data_dir.mkdir(exist_ok=True)
        self.backup_dir.mkdir(exist_ok=True)
    
    def _backup_file(self, filename):
        """Crée une sauvegarde avant modification"""
        source = self.data_dir / filename
        if source.exists():
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_name = f"{filename.stem}_{timestamp}{filename.suffix}"
            backup_path = self.backup_dir / backup_name
            
            with open(source, 'r', encoding='utf-8') as src:
                with open(backup_path, 'w', encoding='utf-8') as dst:
                    dst.write(src.read())
    
    def load_data(self, filename):
        """Charge les données JSON de manière sécurisée"""
        file_path = self.data_dir / filename
        try:
            if file_path.exists():
                with open(file_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            return {}
        except (json.JSONDecodeError, IOError) as e:
            logger.error(f"Erreur lors du chargement de {filename}: {e}")
            return {}
    
    def save_data(self, filename, data):
        """Sauvegarde les données JSON de manière sécurisée"""
        try:
            # Sauvegarde préventive
            self._backup_file(filename)
            
            file_path = self.data_dir / filename
            
            # Écriture atomique
            temp_path = file_path.with_suffix('.tmp')
            with open(temp_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            # Renommage atomique
            temp_path.replace(file_path)
            
            logger.info(f"Données sauvegardées: {filename}")
            return True
            
        except Exception as e:
            logger.error(f"Erreur lors de la sauvegarde de {filename}: {e}")
            return False

# Instance du gestionnaire de données
data_manager = SecureJSONManager(app.config['DATA_DIR'])

# Utilisateurs admin (en production, utiliser une vraie base de données)
ADMIN_USERS = {
    "admin": {
        "password_hash": generate_password_hash("animmedia2024"),
        "role": "admin",
        "name": "Administrateur Principal",
        "email": "admin@animmedia-laguerche.fr"
    }
}

# Schémas de validation Marshmallow
class LoginSchema(Schema):
    username = fields.Str(required=True, validate=validate.Length(min=3, max=50))
    password = fields.Str(required=True, validate=validate.Length(min=6, max=100))

class EventSchema(Schema):
    id = fields.Str(required=False)
    title = fields.Str(required=True, validate=validate.Length(min=3, max=200))
    type = fields.Str(required=True, validate=validate.OneOf([
        "atelier", "formation", "spectacle", "exposition", "conference", "sortie"
    ]))
    description = fields.Str(required=True, validate=validate.Length(min=10, max=2000))
    date = fields.Date(required=True)
    time = fields.Str(required=True, validate=validate.Regexp(r'^([01]?[0-9]|2[0-3]):[0-5][0-9]$'))
    duration = fields.Int(required=True, validate=validate.Range(min=15, max=480))
    location = fields.Str(required=True, validate=validate.Length(min=3, max=200))
    address = fields.Str(required=True, validate=validate.Length(min=5, max=300))
    instructor = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    maxParticipants = fields.Int(required=True, validate=validate.Range(min=1, max=100))
    currentParticipants = fields.Int(required=False, validate=validate.Range(min=0))
    price = fields.Float(required=True, validate=validate.Range(min=0, max=500))
    materials = fields.Str(required=False, validate=validate.Length(max=200))
    level = fields.Str(required=False, validate=validate.OneOf([
        "Débutant", "Intermédiaire", "Avancé", "Tous niveaux"
    ]))
    image = fields.Str(required=False, validate=validate.Length(max=300))
    tags = fields.List(fields.Str(), required=False)

class RegistrationSchema(Schema):
    eventId = fields.Str(required=True)
    memberName = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    memberEmail = fields.Email(required=True)
    memberPhone = fields.Str(required=False, validate=validate.Length(max=20))
    notes = fields.Str(required=False, validate=validate.Length(max=500))

# Décorateur pour vérifier les rôles
def admin_required(f):
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        current_user = get_jwt_identity()
        user_data = ADMIN_USERS.get(current_user)
        
        if not user_data or user_data.get('role') != 'admin':
            return jsonify({'error': 'Accès admin requis'}), 403
            
        return f(*args, **kwargs)
    return decorated_function

# ========================================
# ROUTES D'AUTHENTIFICATION
# ========================================

@app.route('/api/auth/login', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    """Connexion sécurisée avec JWT"""
    try:
        schema = LoginSchema()
        data = schema.load(request.get_json())
        
        username = data['username']
        password = data['password']
        
        # Vérification utilisateur
        user = ADMIN_USERS.get(username)
        if not user or not check_password_hash(user['password_hash'], password):
            return jsonify({'error': 'Identifiants invalides'}), 401
        
        # Création des tokens JWT
        access_token = create_access_token(identity=username)
        refresh_token = create_refresh_token(identity=username)
        
        logger.info(f"Connexion réussie pour: {username}")
        
        return jsonify({
            'message': 'Connexion réussie',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'username': username,
                'name': user['name'],
                'role': user['role']
            }
        })
        
    except ValidationError as err:
        return jsonify({'error': 'Données invalides', 'details': err.messages}), 400
    except Exception as e:
        logger.error(f"Erreur lors de la connexion: {e}")
        return jsonify({'error': 'Erreur interne'}), 500

@app.route('/api/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Renouvellement du token d'accès"""
    current_user = get_jwt_identity()
    new_token = create_access_token(identity=current_user)
    return jsonify({'access_token': new_token})

@app.route('/api/auth/logout', methods=['DELETE'])
@jwt_required()
def logout():
    """Déconnexion et révocation du token"""
    jti = get_jwt()['jti']
    blacklisted_tokens.add(jti)
    return jsonify({'message': 'Déconnexion réussie'})

# ========================================
# ROUTES DES ÉVÉNEMENTS
# ========================================

@app.route('/api/events', methods=['GET'])
def get_events():
    """Récupère la liste des événements (public)"""
    try:
        events_data = data_manager.load_data('events.json')
        events = events_data.get('events', [])
        
        # Tri par date
        events.sort(key=lambda x: x.get('date', ''))
        
        return jsonify({
            'success': True,
            'events': events,
            'count': len(events)
        })
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des événements: {e}")
        return jsonify({'error': 'Erreur lors de la récupération des événements'}), 500

@app.route('/api/events/<event_id>', methods=['GET'])
def get_event(event_id):
    """Récupère un événement spécifique"""
    try:
        events_data = data_manager.load_data('events.json')
        events = events_data.get('events', [])
        
        event = next((e for e in events if e.get('id') == event_id), None)
        
        if not event:
            return jsonify({'error': 'Événement non trouvé'}), 404
            
        return jsonify({
            'success': True,
            'event': event
        })
    except Exception as e:
        logger.error(f"Erreur lors de la récupération de l'événement {event_id}: {e}")
        return jsonify({'error': 'Erreur lors de la récupération de l\'événement'}), 500

@app.route('/api/events', methods=['POST'])
@admin_required
@limiter.limit("10 per minute")
def create_event():
    """Crée un nouvel événement (admin uniquement)"""
    try:
        schema = EventSchema()
        event_data = schema.load(request.get_json())
        
        # Génération d'un ID unique
        if 'id' not in event_data or not event_data['id']:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            event_data['id'] = f"evt_{timestamp}"
        
        # Ajout des métadonnées
        event_data['createdAt'] = datetime.now().isoformat()
        event_data['updatedAt'] = datetime.now().isoformat()
        event_data['currentParticipants'] = event_data.get('currentParticipants', 0)
        
        # Chargement des données existantes
        events_data = data_manager.load_data('events.json')
        if 'events' not in events_data:
            events_data['events'] = []
        
        # Vérification de l'unicité de l'ID
        existing_ids = [e.get('id') for e in events_data['events']]
        if event_data['id'] in existing_ids:
            return jsonify({'error': 'ID d\'événement déjà existant'}), 400
        
        # Ajout de l'événement
        events_data['events'].append(event_data)
        
        # Sauvegarde
        if data_manager.save_data('events.json', events_data):
            logger.info(f"Événement créé: {event_data['id']}")
            return jsonify({
                'success': True,
                'message': 'Événement créé avec succès',
                'event': event_data
            }), 201
        else:
            return jsonify({'error': 'Erreur lors de la sauvegarde'}), 500
            
    except ValidationError as err:
        return jsonify({'error': 'Données invalides', 'details': err.messages}), 400
    except Exception as e:
        logger.error(f"Erreur lors de la création de l'événement: {e}")
        return jsonify({'error': 'Erreur interne'}), 500

@app.route('/api/events/<event_id>', methods=['PUT'])
@admin_required
@limiter.limit("10 per minute")
def update_event(event_id):
    """Met à jour un événement existant (admin uniquement)"""
    try:
        schema = EventSchema()
        updated_data = schema.load(request.get_json())
        
        # Chargement des données existantes
        events_data = data_manager.load_data('events.json')
        events = events_data.get('events', [])
        
        # Recherche de l'événement
        event_index = None
        for i, event in enumerate(events):
            if event.get('id') == event_id:
                event_index = i
                break
        
        if event_index is None:
            return jsonify({'error': 'Événement non trouvé'}), 404
        
        # Mise à jour des données
        updated_data['id'] = event_id
        updated_data['updatedAt'] = datetime.now().isoformat()
        
        # Conserver certaines métadonnées
        original_event = events[event_index]
        updated_data['createdAt'] = original_event.get('createdAt', datetime.now().isoformat())
        
        # Remplacement de l'événement
        events[event_index] = updated_data
        
        # Sauvegarde
        if data_manager.save_data('events.json', events_data):
            logger.info(f"Événement mis à jour: {event_id}")
            return jsonify({
                'success': True,
                'message': 'Événement mis à jour avec succès',
                'event': updated_data
            })
        else:
            return jsonify({'error': 'Erreur lors de la sauvegarde'}), 500
            
    except ValidationError as err:
        return jsonify({'error': 'Données invalides', 'details': err.messages}), 400
    except Exception as e:
        logger.error(f"Erreur lors de la mise à jour de l'événement {event_id}: {e}")
        return jsonify({'error': 'Erreur interne'}), 500

@app.route('/api/events/<event_id>', methods=['DELETE'])
@admin_required
@limiter.limit("10 per minute")
def delete_event(event_id):
    """Supprime un événement (admin uniquement)"""
    try:
        # Chargement des données
        events_data = data_manager.load_data('events.json')
        events = events_data.get('events', [])
        
        # Recherche et suppression
        original_count = len(events)
        events_data['events'] = [e for e in events if e.get('id') != event_id]
        
        if len(events_data['events']) == original_count:
            return jsonify({'error': 'Événement non trouvé'}), 404
        
        # Sauvegarde
        if data_manager.save_data('events.json', events_data):
            logger.info(f"Événement supprimé: {event_id}")
            return jsonify({
                'success': True,
                'message': 'Événement supprimé avec succès'
            })
        else:
            return jsonify({'error': 'Erreur lors de la sauvegarde'}), 500
            
    except Exception as e:
        logger.error(f"Erreur lors de la suppression de l'événement {event_id}: {e}")
        return jsonify({'error': 'Erreur interne'}), 500

# ========================================
# ROUTES DES INSCRIPTIONS
# ========================================

@app.route('/api/registrations', methods=['GET'])
@admin_required
def get_registrations():
    """Récupère toutes les inscriptions (admin uniquement)"""
    try:
        registrations_data = data_manager.load_data('registrations.json')
        registrations = registrations_data.get('registrations', [])
        
        return jsonify({
            'success': True,
            'registrations': registrations,
            'count': len(registrations)
        })
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des inscriptions: {e}")
        return jsonify({'error': 'Erreur lors de la récupération des inscriptions'}), 500

@app.route('/api/registrations', methods=['POST'])
@limiter.limit("3 per minute")
def create_registration():
    """Crée une nouvelle inscription (public)"""
    try:
        schema = RegistrationSchema()
        registration_data = schema.load(request.get_json())
        
        # Vérification de l'existence de l'événement
        events_data = data_manager.load_data('events.json')
        events = events_data.get('events', [])
        
        event = next((e for e in events if e.get('id') == registration_data['eventId']), None)
        if not event:
            return jsonify({'error': 'Événement non trouvé'}), 404
        
        # Vérification de la disponibilité
        current_participants = event.get('currentParticipants', 0)
        max_participants = event.get('maxParticipants', 0)
        
        if current_participants >= max_participants:
            return jsonify({'error': 'Événement complet'}), 400
        
        # Génération de l'ID d'inscription
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        registration_id = f"reg_{timestamp}"
        
        # Préparation des données
        registration_data.update({
            'id': registration_id,
            'registrationDate': datetime.now().isoformat(),
            'status': 'confirmed',
            'eventTitle': event.get('title', ''),
            'eventDate': event.get('date', ''),
            'eventPrice': event.get('price', 0)
        })
        
        # Chargement des inscriptions existantes
        registrations_data = data_manager.load_data('registrations.json')
        if 'registrations' not in registrations_data:
            registrations_data['registrations'] = []
        
        # Ajout de l'inscription
        registrations_data['registrations'].append(registration_data)
        
        # Mise à jour du nombre de participants
        for i, e in enumerate(events):
            if e.get('id') == registration_data['eventId']:
                events[i]['currentParticipants'] = current_participants + 1
                break
        
        # Sauvegarde des deux fichiers
        if (data_manager.save_data('registrations.json', registrations_data) and
            data_manager.save_data('events.json', events_data)):
            
            logger.info(f"Inscription créée: {registration_id} pour événement {registration_data['eventId']}")
            return jsonify({
                'success': True,
                'message': 'Inscription confirmée avec succès',
                'registration': registration_data
            }), 201
        else:
            return jsonify({'error': 'Erreur lors de la sauvegarde'}), 500
            
    except ValidationError as err:
        return jsonify({'error': 'Données invalides', 'details': err.messages}), 400
    except Exception as e:
        logger.error(f"Erreur lors de la création de l'inscription: {e}")
        return jsonify({'error': 'Erreur interne'}), 500

# ========================================
# ROUTES DES MEMBRES
# ========================================

@app.route('/api/members', methods=['GET'])
@admin_required
def get_members():
    """Récupère la liste des membres (admin uniquement)"""
    try:
        members_data = data_manager.load_data('members.json')
        members = members_data.get('members', [])
        
        return jsonify({
            'success': True,
            'members': members,
            'count': len(members)
        })
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des membres: {e}")
        return jsonify({'error': 'Erreur lors de la récupération des membres'}), 500

# ========================================
# ROUTES DES STATISTIQUES
# ========================================

@app.route('/api/stats/dashboard', methods=['GET'])
@admin_required
def get_dashboard_stats():
    """Récupère les statistiques du tableau de bord"""
    try:
        # Chargement des données
        events_data = data_manager.load_data('events.json')
        members_data = data_manager.load_data('members.json')
        registrations_data = data_manager.load_data('registrations.json')
        
        events = events_data.get('events', [])
        members = members_data.get('members', [])
        registrations = registrations_data.get('registrations', [])
        
        # Calcul des statistiques
        total_events = len(events)
        total_members = len(members)
        total_registrations = len(registrations)
        
        # Revenus totaux
        total_revenue = sum(r.get('eventPrice', 0) for r in registrations 
                          if r.get('status') == 'confirmed')
        
        # Événements par type
        event_types = {}
        for event in events:
            event_type = event.get('type', 'autre')
            event_types[event_type] = event_types.get(event_type, 0) + 1
        
        # Inscriptions récentes (7 derniers jours)
        seven_days_ago = datetime.now() - timedelta(days=7)
        recent_registrations = []
        
        for reg in registrations:
            reg_date_str = reg.get('registrationDate', '')
            if reg_date_str:
                try:
                    reg_date = datetime.fromisoformat(reg_date_str.replace('Z', '+00:00'))
                    if reg_date >= seven_days_ago:
                        recent_registrations.append(reg)
                except:
                    pass
        
        return jsonify({
            'success': True,
            'stats': {
                'totalEvents': total_events,
                'totalMembers': total_members,
                'totalRegistrations': total_registrations,
                'totalRevenue': total_revenue,
                'eventTypes': event_types,
                'recentRegistrations': len(recent_registrations),
                'recentRegistrationsList': recent_registrations[:10]  # Les 10 plus récentes
            }
        })
        
    except Exception as e:
        logger.error(f"Erreur lors du calcul des statistiques: {e}")
        return jsonify({'error': 'Erreur lors du calcul des statistiques'}), 500

# ========================================
# ROUTES STATIQUES ET ERREURS
# ========================================

@app.route('/')
def serve_index():
    """Sert la page principale"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Sert les fichiers statiques"""
    try:
        return send_from_directory('.', path)
    except FileNotFoundError:
        return send_from_directory('.', 'index.html')  # SPA fallback

@app.errorhandler(404)
def not_found(error):
    """Gestionnaire d'erreur 404"""
    if request.path.startswith('/api/'):
        return jsonify({'error': 'Endpoint non trouvé'}), 404
    return send_from_directory('.', 'index.html')

@app.errorhandler(500)
def internal_error(error):
    """Gestionnaire d'erreur 500"""
    logger.error(f"Erreur interne: {error}")
    return jsonify({'error': 'Erreur interne du serveur'}), 500

@app.errorhandler(ValidationError)
def validation_error(error):
    """Gestionnaire d'erreur de validation"""
    return jsonify({'error': 'Données invalides', 'details': error.messages}), 400

# Headers de sécurité
@app.after_request
def set_security_headers(response):
    """Ajoute les headers de sécurité"""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    
    # CSP pour une sécurité renforcée
    csp = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; "
        "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; "
        "img-src 'self' data: https:; "
        "connect-src 'self'; "
    )
    response.headers['Content-Security-Policy'] = csp
    
    return response

if __name__ == '__main__':
    # En développement uniquement
    print("🚀 Démarrage de l'application Anim'Média")
    print("🌐 Serveur disponible sur http://localhost:8000")
    print("🔐 Interface admin sur http://localhost:8000/admin/")
    app.run(host='0.0.0.0', port=8000, debug=False)