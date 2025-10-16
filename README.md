# 🎨 Anim'Média - Application Web Sécurisée

Application web sécurisée pour l'association culturelle Anim'Média à La Guerche-sur-l'Aubois.

## 🚀 Démarrage Rapide

### Méthode 1: Production (Recommandé)
```bash
# Démarrage automatique avec configuration sécurisée
python start-production.py
```

### Méthode 2: Développement
```bash
# Installation des dépendances
pip install -r requirements.txt

# Démarrage en mode développement
python app.py
```

### Méthode 3: Docker
```bash
# Construction et démarrage
docker-compose up -d

# Accès à l'application
curl http://localhost:8000
```

## 🔐 Nouvelle Architecture Sécurisée

### API REST Flask
- **Authentification JWT** avec refresh tokens
- **Validation des données** avec Marshmallow  
- **Rate limiting** pour éviter les abus
- **Headers de sécurité** renforcés
- **Sauvegarde automatique** des données

### Endpoints API
- `GET /api/events` - Liste des événements (public)
- `POST /api/auth/login` - Connexion admin
- `POST /api/events` - Créer un événement (admin)
- `POST /api/registrations` - Inscription (public)

## 📱 Fonctionnalités

### Section Publique
- ✅ **Événements dynamiques** avec filtres par type
- ✅ **Cartes interactives** avec détails complets
- ✅ **Inscription directe** via formulaire de contact
- ✅ **Design responsive** (mobile/desktop)
- ✅ **PWA** avec notifications

### Interface d'Administration
1. Aller sur `/admin/`
2. Se connecter avec: `admin` / `animmedia2024`
3. Cliquer sur "Gérer les Événements"
4. ✅ **Créer/modifier/supprimer** des événements
5. ✅ **Vue calendrier** interactive
6. ✅ **Gestion des inscriptions**

## 🎨 Nouvelles Couleurs (2025)

- **🔵 Primaire**: Bleu moderne (#3B82F6)
- **🟠 Secondaire**: Orange ambré (#F59E0B)
- **🟣 Accent**: Violet moderne (#8B5CF6)

## 📂 Structure du Projet

```
📁 AnimMediaLaGuerche/
├── 📄 index.html              # Page principale
├── 📄 manifest.json           # Configuration PWA
├── 📄 sw.js                   # Service Worker
├── 📁 admin/                  # Interface d'administration
├── 📁 assets/
│   ├── 📁 css/                # Styles
│   ├── 📁 js/                 # Scripts JavaScript
│   └── 📁 images/             # Images
├── 📁 data/
│   └── 📄 events.json         # Base de données événements
├── 📄 server.py               # Serveur de test
└── 📄 start-server.bat        # Lanceur Windows
```

## 🛠️ Technologies Utilisées

- **HTML5** sémantique
- **CSS3** avec variables et Grid/Flexbox
- **JavaScript ES6+** (Vanilla, pas de framework)
- **PWA** avec Service Worker
- **JSON** pour les données

## 🔧 Développement

Pour ajouter de nouveaux événements:
1. Modifier `data/events.json` pour les données persistantes
2. Ou utiliser l'interface d'administration

## 📞 Support

Association Anim'Média  
Médiathèque de La Guerche-sur-l'Aubois  
18150 La Guerche-sur-l'Aubois