# 🎨 Anim'Média - Site de l'Association Culturelle

Site web de l'association culturelle Anim'Média à La Guerche-sur-l'Aubois.

## 🚀 Comment tester le site

### Méthode 1: Ouverture directe (mode local)
1. Double-cliquez sur `index.html`
2. Le site s'ouvre avec des données d'exemple
3. ✅ Les événements se chargent automatiquement en mode local

### Méthode 2: Serveur HTTP local (recommandé)
1. **Windows**: Double-cliquez sur `start-server.bat`
2. **Linux/Mac**: `python3 server.py`
3. Le navigateur s'ouvre automatiquement sur `http://localhost:8000`
4. ✅ Toutes les fonctionnalités sont disponibles (JSON, PWA, etc.)

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