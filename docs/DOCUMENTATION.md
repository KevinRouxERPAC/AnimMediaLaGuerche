# 📚 Documentation Anim'Média

Documentation complète du site web de l'association Anim'Média La Guerche-sur-l'Aubois.

## 🎨 Présentation

Site web moderne et responsive pour l'association culturelle et d'éducation populaire Anim'Média, proposant des ateliers créatifs, formations numériques et événements culturels.

## 🌈 Palette de Couleurs Associative

- **Vert forêt** `#2E8B57` - Primaire (nature, croissance, durabilité)
- **Corail** `#FF7F50` - Secondaire (chaleur, convivialité) 
- **Violet** `#9370DB` - Accent (créativité, arts)
- **Beige** `#F5F5DC` - Fond doux (naturel, accessible)
- **Gris ardoise** `#708090` - Textes neutres

## 🔧 Architecture Technique

### Frontend
- **HTML5** semantic et accessible
- **CSS3** avec variables personnalisées et mode sombre
- **JavaScript** vanilla moderne (ES6+)
- **PWA** complète avec Service Worker

### Styles
- **Mode sombre automatique** (prefers-color-scheme)
- **Responsive design** mobile-first
- **Animations fluides** avec prefers-reduced-motion
- **Accessibilité WCAG** niveau AA

### Fonctionnalités
- **Interface d'administration** sécurisée
- **Système d'authentification** avec sessions
- **Notifications toast** interactives
- **Gestion hors ligne** avec cache intelligent

## 📁 Organisation des Fichiers

### Fichiers Principaux
```
index.html          # Page d'accueil responsive
manifest.json       # Configuration PWA
sw.js              # Service Worker pour cache
offline.html       # Page hors ligne
robots.txt         # Directives robots
sitemap.xml        # Plan du site
```

### Interface Admin
```
admin/
└── index.html     # Dashboard d'administration
```

### Ressources
```
assets/
├── css/
│   ├── main.css   # Styles principaux (700+ lignes)
│   └── admin.css  # Styles administration (300+ lignes)
├── js/
│   ├── main.js    # Logique principale (500+ lignes)
│   ├── admin.js   # Logique admin (200+ lignes)  
│   └── security.js # Module sécurité
└── images/
    └── icons/     # Icônes PWA SVG
```

## 🔐 Administration

### Accès
- **URL** : `/admin/`
- **Utilisateur** : `admin`
- **Mot de passe** : `animmedia2024`

### Fonctionnalités Admin
- Tableau de bord avec statistiques
- Gestion des adhérents (en développement)
- Planification d'activités (en développement)
- Rapports et analytics (en développement) 
- Gestion de galerie (en développement)
- Communication/newsletter (en développement)
- Configuration système (en développement)

## 🚀 Déploiement

### Développement Local
```bash
# Démarrage simple
demarrer.bat

# Outils avancés
cd dev-tools
node serveur.js
```

### Production
- Compatible hébergement statique
- Aucune dépendance serveur
- Optimisé pour CDN
- HTTPS recommandé pour PWA

## 🎯 Performance

### Optimisations
- **CSS** : Variables personnalisées, pas de frameworks
- **JavaScript** : Vanilla, pas de dépendances externes  
- **Images** : SVG vectorielles légères
- **Cache** : Service Worker intelligent
- **Fonts** : Inter via Google Fonts avec preload

### Métriques Cibles
- **LCP** < 2.5s (Largest Contentful Paint)
- **FID** < 100ms (First Input Delay)
- **CLS** < 0.1 (Cumulative Layout Shift)
- **Accessibilité** score 100%

## 🔄 Historique des Versions

### v2.0.0 (Octobre 2025)
- ✅ Refonte complète avec palette associative
- ✅ Mode sombre automatique
- ✅ Interface d'administration moderne
- ✅ Architecture modulaire (CSS/JS séparés)
- ✅ PWA complète avec Service Worker
- ✅ Système d'authentification
- ✅ Responsive design mobile-first

### v1.0.0 (Version initiale)
- Site statique basique
- Styles inline
- Pas d'administration

## 🎨 Guide de Style

### Typographie
- **Titre principal** : Inter 700, 2.5rem
- **Titres sections** : Inter 600, 2rem  
- **Corps de texte** : Inter 400, 1rem
- **Texte secondaire** : Inter 400, 0.9rem

### Espacement
- **Sections** : 4rem padding vertical
- **Cartes** : 1.5rem padding  
- **Éléments** : 1rem gap standard

### Animations
- **Transition** : 0.3s ease pour hover
- **Scroll** : smooth behavior
- **Respect** : prefers-reduced-motion

---

**Association Anim'Média La Guerche-sur-l'Aubois**  
*Site développé avec passion pour la culture et le numérique* ❤️