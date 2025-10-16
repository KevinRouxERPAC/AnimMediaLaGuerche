# 🚀 Guide de Déploiement - Anim'Média
## Application Web Sécurisée

### 📋 Vue d'ensemble

Anim'Média est maintenant une application web sécurisée avec :
- **API REST Flask** avec authentification JWT
- **Base de données JSON** sécurisée avec sauvegarde automatique
- **Interface d'administration** protégée
- **Headers de sécurité** renforcés
- **Validation des données** côté client et serveur
- **Prêt pour la production**

---

## 🔧 Déploiement Rapide

### Méthode 1: Hébergement Web Standard

#### 1. Prérequis
- Serveur web avec support Python 3.8+
- Accès SSH ou FTP
- Domaine configuré

#### 2. Upload des fichiers
```bash
# Transférer tous les fichiers vers le serveur
rsync -av --exclude='.*' ./ user@your-server.com:/var/www/animmedia/
```

#### 3. Installation des dépendances
```bash
cd /var/www/animmedia
pip install -r requirements.txt
```

#### 4. Configuration
```bash
# Copier et personnaliser le fichier d'environnement
cp .env.example .env

# IMPORTANT: Modifier les clés secrètes dans .env
nano .env
```

#### 5. Démarrage
```bash
# Démarrage en production avec Gunicorn
gunicorn --bind 0.0.0.0:8000 --workers 4 app:app

# Ou utiliser le script de démarrage
python app.py
```

### Méthode 2: Docker (Recommandé)

#### 1. Construction de l'image
```bash
docker build -t animmedia .
```

#### 2. Démarrage avec Docker Compose
```bash
# Créer le fichier .env avec vos secrets
echo "SECRET_KEY=$(openssl rand -hex 32)" > .env
echo "JWT_SECRET_KEY=$(openssl rand -hex 32)" >> .env

# Démarrer l'application
docker-compose up -d
```

#### 3. Vérification
```bash
# Vérifier que l'application fonctionne
curl http://localhost:8000/api/events

# Voir les logs
docker-compose logs -f
```

---

## 🔐 Configuration de Sécurité

### 1. Variables d'Environnement Obligatoires

Créer un fichier `.env` avec :
```env
# OBLIGATOIRE: Générer des clés uniques !
SECRET_KEY=your-unique-secret-key-32-chars-min
JWT_SECRET_KEY=your-unique-jwt-secret-32-chars-min

# Admin (CHANGER le mot de passe !)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=votre-mot-de-passe-securise

# Domaine autorisé
ALLOWED_ORIGINS=https://votre-domaine.com
```

### 2. Génération de clés sécurisées
```bash
# Générer des clés aléatoires sécurisées
python -c "import secrets; print('SECRET_KEY=' + secrets.token_hex(32))"
python -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_hex(32))"
```

### 3. Configuration HTTPS

Pour la production, HTTPS est obligatoire :
```apache
# Dans votre configuration Apache/Nginx
# Redirection automatique HTTP → HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## 📊 Structure de l'Application

```
📁 animmedia/
├── 🐍 app.py                 # API Flask principale
├── 📄 requirements.txt       # Dépendances Python
├── 🐳 Dockerfile            # Configuration Docker
├── 🐳 docker-compose.yml    # Orchestration Docker
├── ⚙️ .env.example          # Template de configuration
├── 📁 data/                 # Base de données JSON
│   ├── events.json          # Événements
│   ├── members.json         # Membres
│   └── registrations.json   # Inscriptions
├── 📁 assets/               # Ressources statiques
│   ├── css/                 # Styles
│   └── js/                  # JavaScript sécurisé
├── 📁 admin/                # Interface d'administration
├── 📁 logs/                 # Fichiers de log (auto-créé)
└── 📁 backups/              # Sauvegardes automatiques
```

---

## 🔄 API Endpoints

### Endpoints Publics
- `GET /api/events` - Liste des événements
- `GET /api/events/{id}` - Détail d'un événement
- `POST /api/registrations` - Inscription à un événement

### Endpoints Admin (JWT requis)
- `POST /api/auth/login` - Connexion admin
- `DELETE /api/auth/logout` - Déconnexion
- `POST /api/events` - Créer un événement
- `PUT /api/events/{id}` - Modifier un événement
- `DELETE /api/events/{id}` - Supprimer un événement
- `GET /api/registrations` - Liste des inscriptions
- `GET /api/members` - Liste des membres
- `GET /api/stats/dashboard` - Statistiques

---

## 🛠️ Maintenance

### Sauvegarde Automatique
Les données JSON sont automatiquement sauvegardées avant chaque modification dans le dossier `backups/`.

### Logs
Les logs de l'application sont disponibles dans `logs/animmedia.log`.

### Surveillance
```bash
# Vérifier l'état de l'application
curl -f http://localhost:8000/api/events || echo "Application down"

# Statistiques de performance
docker stats animmedia-web
```

### Mise à jour
```bash
# Arrêter l'application
docker-compose down

# Mettre à jour le code
git pull

# Redémarrer
docker-compose up -d
```

---

## 🔧 Hébergeurs Recommandés

### 1. VPS/Serveurs Dédiés
- **DigitalOcean** - Droplets à partir de 5€/mois
- **Hetzner** - Serveurs performants et économiques
- **OVH** - Hébergeur français avec support local

### 2. Hébergement Web Partagé
- **o2switch** - Support Python, hébergement français
- **PlanetHoster** - Support technique réactif
- **Hostinger** - Économique avec support Python

### 3. Plateformes Cloud
- **Heroku** - Déploiement simplifié
- **Railway** - Alternative moderne à Heroku  
- **DigitalOcean App Platform** - Déploiement automatique

---

## 📞 Support et Dépannage

### Problèmes Courants

#### 1. Erreur 500 - Serveur Interne
```bash
# Vérifier les logs
tail -f logs/animmedia.log

# Vérifier les permissions
chmod 755 app.py
chown -R www-data:www-data /path/to/app
```

#### 2. Problèmes de Connexion Admin
```bash
# Vérifier la configuration
python -c "from app import ADMIN_USERS; print(ADMIN_USERS)"

# Réinitialiser les tokens JWT (redémarrer l'app)
```

#### 3. Erreurs de CORS
```bash
# Vérifier la configuration CORS dans app.py
# Ajouter votre domaine dans ALLOWED_ORIGINS
```

### Contacts
- **Documentation** : Consultez ce guide
- **Issues** : Créez une issue sur le repository GitHub
- **Support** : Contactez l'équipe de développement

---

## 🎯 Checklist de Production

### Avant le déploiement
- [ ] Clés secrètes uniques générées
- [ ] Mot de passe admin changé
- [ ] Domaine configuré dans CORS
- [ ] HTTPS activé
- [ ] Headers de sécurité configurés
- [ ] Sauvegardes automatiques activées

### Après le déploiement  
- [ ] Test de l'interface publique
- [ ] Test de connexion admin
- [ ] Test de création d'événement
- [ ] Test d'inscription
- [ ] Vérification des logs
- [ ] Test des sauvegardes

---

## 🚀 Optimisations Futures

1. **Base de données PostgreSQL** pour de gros volumes
2. **Redis** pour la mise en cache
3. **CDN** pour les assets statiques
4. **Monitoring** avec Prometheus/Grafana
5. **CI/CD** avec GitHub Actions

---

*Anim'Média est maintenant une application sécurisée prête pour la production ! 🎉*