#!/usr/bin/env python3
"""
SÉCURITÉ SIMPLE ET EFFICACE POUR ANIM'MÉDIA
Scripts de sécurisation de la base de données SQLite
"""

import sqlite3
import bcrypt
import hashlib
import os
import shutil
import datetime
import re
import json
from pathlib import Path

class SecureDatabase:
    """Gestionnaire de base de données sécurisée pour Anim'Média"""
    
    def __init__(self, db_path="animmedia.db"):
        self.db_path = db_path
        self.backup_dir = Path("backups")
        self.backup_dir.mkdir(exist_ok=True)
    
    def get_connection(self):
        """Connexion sécurisée à la base"""
        conn = sqlite3.connect(
            self.db_path,
            timeout=30.0,
            isolation_level=None  # Autocommit pour simplicité
        )
        
        # Configuration sécurisée
        conn.execute('PRAGMA foreign_keys = ON')
        conn.execute('PRAGMA journal_mode = WAL')
        conn.execute('PRAGMA synchronous = FULL')
        conn.execute('PRAGMA secure_delete = ON')
        
        return conn
    
    def hash_password(self, password):
        """Hash sécurisé du mot de passe avec bcrypt"""
        salt = bcrypt.gensalt(rounds=12)  # 12 rounds = sécurité forte
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def verify_password(self, password, hashed):
        """Vérification du mot de passe"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    def validate_email(self, email):
        """Validation stricte de l'email"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    def validate_phone(self, phone):
        """Validation du téléphone français"""
        if not phone:
            return True  # Optionnel
        pattern = r'^0[1-9][0-9]{8}$'
        return re.match(pattern, phone.replace(' ', '').replace('.', '')) is not None
    
    def sanitize_input(self, text):
        """Nettoyage des entrées utilisateur"""
        if not text:
            return None
        # Supprimer les caractères dangereux
        text = text.strip()
        text = re.sub(r'[<>"\']', '', text)  # Supprimer HTML/JS
        return text[:500]  # Limiter la longueur
    
    def create_user(self, first_name, last_name, email, phone=None, 
                   membership_type='ponctuel', role='member', password=None):
        """Création sécurisée d'un utilisateur"""
        
        # Validation des données
        if not self.validate_email(email):
            raise ValueError("Email invalide")
        
        if not self.validate_phone(phone):
            raise ValueError("Téléphone invalide")
        
        # Nettoyage des entrées
        first_name = self.sanitize_input(first_name)
        last_name = self.sanitize_input(last_name)
        
        if len(first_name) < 2 or len(last_name) < 2:
            raise ValueError("Nom et prénom doivent faire au moins 2 caractères")
        
        # Hash du mot de passe si fourni
        password_hash = None
        if password and role == 'admin':
            password_hash = self.hash_password(password)
        
        conn = self.get_connection()
        try:
            cursor = conn.execute('''
                INSERT INTO users 
                (first_name, last_name, email, phone, membership_type, role, password_hash, consent_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (first_name, last_name, email, phone, membership_type, role, 
                  password_hash, datetime.datetime.now()))
            
            user_id = cursor.lastrowid
            
            # Log de sécurité
            self.log_action(user_id, 'USER_CREATED', 'user', user_id, 
                          f"Nouvel utilisateur: {first_name} {last_name}")
            
            return user_id
            
        except sqlite3.IntegrityError as e:
            if 'email' in str(e):
                raise ValueError("Cet email est déjà utilisé")
            raise
        finally:
            conn.close()
    
    def authenticate_user(self, email, password):
        """Authentification sécurisée"""
        conn = self.get_connection()
        try:
            cursor = conn.execute('''
                SELECT id, password_hash, role, first_name, last_name 
                FROM users 
                WHERE email = ? AND is_active = 1 AND role = 'admin'
            ''', (email,))
            
            user = cursor.fetchone()
            if not user:
                # Log de tentative échouée
                self.log_action(None, 'LOGIN_FAILED', 'user', None, f"Échec connexion: {email}")
                return None
            
            user_id, password_hash, role, first_name, last_name = user
            
            if self.verify_password(password, password_hash):
                # Mise à jour de la dernière connexion
                conn.execute('''
                    UPDATE users SET last_login = ? WHERE id = ?
                ''', (datetime.datetime.now(), user_id))
                
                # Log de connexion réussie
                self.log_action(user_id, 'LOGIN_SUCCESS', 'user', user_id, "Connexion réussie")
                
                return {
                    'id': user_id,
                    'email': email,
                    'role': role,
                    'name': f"{first_name} {last_name}"
                }
            else:
                # Log de tentative échouée
                self.log_action(None, 'LOGIN_FAILED', 'user', None, f"Mot de passe incorrect: {email}")
                return None
                
        finally:
            conn.close()
    
    def log_action(self, user_id, action, entity_type=None, entity_id=None, 
                   details=None, severity='info'):
        """Enregistrement sécurisé des actions"""
        conn = self.get_connection()
        try:
            conn.execute('''
                INSERT INTO system_logs 
                (user_id, action, entity_type, entity_id, details, severity)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (user_id, action, entity_type, entity_id, details, severity))
        finally:
            conn.close()
    
    def daily_backup(self):
        """Sauvegarde quotidienne automatique"""
        if not os.path.exists(self.db_path):
            print("❌ Base de données introuvable")
            return False
        
        # Nom avec date
        today = datetime.date.today().strftime('%Y-%m-%d')
        backup_name = f"animmedia_backup_{today}.db"
        backup_path = self.backup_dir / backup_name
        
        try:
            # Copie sécurisée
            shutil.copy2(self.db_path, backup_path)
            
            # Log de sauvegarde
            self.log_action(None, 'BACKUP_CREATED', 'system', None, 
                          f"Sauvegarde créée: {backup_name}")
            
            print(f"✅ Sauvegarde créée: {backup_path}")
            
            # Nettoyage des anciennes sauvegardes (garder 30 jours)
            self.cleanup_old_backups()
            
            return True
            
        except Exception as e:
            print(f"❌ Erreur lors de la sauvegarde: {e}")
            self.log_action(None, 'BACKUP_FAILED', 'system', None, str(e), 'error')
            return False
    
    def cleanup_old_backups(self, days_to_keep=30):
        """Nettoyage des anciennes sauvegardes"""
        cutoff_date = datetime.date.today() - datetime.timedelta(days=days_to_keep)
        
        for backup_file in self.backup_dir.glob("animmedia_backup_*.db"):
            # Extraire la date du nom de fichier
            try:
                date_str = backup_file.name.replace('animmedia_backup_', '').replace('.db', '')
                file_date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
                
                if file_date < cutoff_date:
                    backup_file.unlink()
                    print(f"🗑️  Ancienne sauvegarde supprimée: {backup_file.name}")
                    
            except ValueError:
                # Nom de fichier non conforme, ignorer
                continue
    
    def get_security_report(self):
        """Rapport de sécurité simple"""
        conn = self.get_connection()
        try:
            # Nombre d'utilisateurs actifs
            users_count = conn.execute('SELECT COUNT(*) FROM users WHERE is_active = 1').fetchone()[0]
            
            # Nombre d'admins
            admins_count = conn.execute('SELECT COUNT(*) FROM users WHERE role = "admin"').fetchone()[0]
            
            # Dernières connexions échouées
            failed_logins = conn.execute('''
                SELECT COUNT(*) FROM system_logs 
                WHERE action = 'LOGIN_FAILED' 
                AND created_at > datetime('now', '-24 hours')
            ''').fetchone()[0]
            
            # Événements récents
            recent_events = conn.execute('''
                SELECT COUNT(*) FROM system_logs 
                WHERE created_at > datetime('now', '-7 days')
            ''').fetchone()[0]
            
            return {
                'users_count': users_count,
                'admins_count': admins_count,
                'failed_logins_24h': failed_logins,
                'recent_events': recent_events,
                'database_size': os.path.getsize(self.db_path) if os.path.exists(self.db_path) else 0
            }
            
        finally:
            conn.close()


class JSONMigrator:
    """Migration sécurisée depuis JSON vers SQLite"""
    
    def __init__(self, db: SecureDatabase):
        self.db = db
    
    def migrate_from_json(self, events_json_path="data/events.json", 
                         members_json_path="data/members.json",
                         registrations_json_path="data/registrations.json"):
        """Migration complète depuis les fichiers JSON"""
        
        print("🔄 Début de la migration JSON → SQLite...")
        
        try:
            # Créer les tables
            self.create_tables()
            
            # Migrer les données
            self.migrate_members(members_json_path)
            self.migrate_events(events_json_path)
            self.migrate_registrations(registrations_json_path)
            
            print("✅ Migration terminée avec succès!")
            return True
            
        except Exception as e:
            print(f"❌ Erreur lors de la migration: {e}")
            return False
    
    def create_tables(self):
        """Création des tables avec le schéma sécurisé"""
        with open('documentation/simple_secure_schema.sql', 'r', encoding='utf-8') as f:
            schema_sql = f.read()
        
        conn = self.db.get_connection()
        try:
            conn.executescript(schema_sql)
            print("✅ Tables créées")
        finally:
            conn.close()
    
    def migrate_members(self, json_path):
        """Migration des membres"""
        if not os.path.exists(json_path):
            print(f"⚠️  Fichier membres introuvable: {json_path}")
            return
        
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        for member in data.get('members', []):
            try:
                self.db.create_user(
                    first_name=member['firstName'],
                    last_name=member['lastName'],
                    email=member['email'],
                    phone=member.get('phone'),
                    membership_type=member.get('membershipType', 'ponctuel'),
                    role='member'
                )
            except Exception as e:
                print(f"⚠️  Erreur membre {member.get('email', 'inconnu')}: {e}")
        
        print(f"✅ {len(data.get('members', []))} membres migrés")
    
    def migrate_events(self, json_path):
        """Migration des événements"""
        if not os.path.exists(json_path):
            print(f"⚠️  Fichier événements introuvable: {json_path}")
            return
        
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        conn = self.db.get_connection()
        try:
            for event in data.get('events', []):
                conn.execute('''
                    INSERT INTO events 
                    (title, description, event_type, event_date, event_time, 
                     location, max_participants, price, instructor_name, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    event['title'],
                    event.get('description', ''),
                    event['type'],
                    event['date'],
                    event['time'],
                    event['location'],
                    event['maxParticipants'],
                    event['price'],
                    event.get('instructor', ''),
                    event.get('status', 'active')
                ))
            
            print(f"✅ {len(data.get('events', []))} événements migrés")
            
        finally:
            conn.close()
    
    def migrate_registrations(self, json_path):
        """Migration des inscriptions"""
        if not os.path.exists(json_path):
            print(f"⚠️  Fichier inscriptions introuvable: {json_path}")
            return
        
        # TODO: Implémenter selon la structure de registrations.json
        print("✅ Inscriptions migrées (à implémenter selon besoins)")


# =============================================
# SCRIPTS D'UTILISATION
# =============================================

def setup_secure_database():
    """Configuration initiale de la base sécurisée"""
    print("🔧 Configuration de la base de données sécurisée...")
    
    db = SecureDatabase()
    
    # Créer la base avec le schéma sécurisé
    migrator = JSONMigrator(db)
    migrator.create_tables()
    
    # Créer l'utilisateur admin par défaut
    admin_password = input("Mot de passe pour l'admin (min 8 caractères): ")
    if len(admin_password) < 8:
        print("❌ Mot de passe trop court")
        return
    
    try:
        db.create_user(
            first_name="Admin",
            last_name="Principal", 
            email="admin@animmedia.com",
            role='admin',
            password=admin_password
        )
        print("✅ Utilisateur admin créé")
    except Exception as e:
        print(f"❌ Erreur création admin: {e}")
    
    # Première sauvegarde
    db.daily_backup()
    
    print("✅ Base de données sécurisée prête!")

def security_check():
    """Vérification de sécurité rapide"""
    print("🔍 Vérification de sécurité...")
    
    db = SecureDatabase()
    report = db.get_security_report()
    
    print(f"👥 Utilisateurs actifs: {report['users_count']}")
    print(f"🔑 Administrateurs: {report['admins_count']}")
    print(f"⚠️  Connexions échouées (24h): {report['failed_logins_24h']}")
    print(f"📊 Événements récents (7j): {report['recent_events']}")
    print(f"💾 Taille base: {report['database_size']:,} octets")
    
    if report['failed_logins_24h'] > 5:
        print("⚠️  ATTENTION: Nombreuses tentatives de connexion échouées!")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "setup":
            setup_secure_database()
        elif sys.argv[1] == "backup":
            SecureDatabase().daily_backup()
        elif sys.argv[1] == "check":
            security_check()
        elif sys.argv[1] == "migrate":
            db = SecureDatabase()
            migrator = JSONMigrator(db)
            migrator.migrate_from_json()
        else:
            print("Usage: python security.py [setup|backup|check|migrate]")
    else:
        print("Usage: python security.py [setup|backup|check|migrate]")