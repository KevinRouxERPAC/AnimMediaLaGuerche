# 🎨 Anim'Média La Guerche-sur-l'Aubois# 🎨 Anim'Média La Guerche-sur-l'Aubois# 🎨 Anim'Média La Guerche-sur-l'Aubois



Site web moderne de l'association culturelle et d'éducation populaire Anim'Média, proposant des ateliers créatifs, formations numériques et événements culturels.



## 🚀 Démarrage RapideSite web de l'association culturelle et d'éducation populaire.Site web de l'association culturelle et d'éducation populaire Anim'Média.



### Option 1: Script Automatique (Recommandé)

**Double-cliquez sur :** `demarrer.bat`

## 🚀 Démarrage Rapide## 🚀 Lancement du Site

### Option 2: Manuel

```bash

# Dans le répertoire du projet

python -m http.server 8000**Double-cliquez sur :** `demarrer.bat`### ✅ Serveur Actuellement ACTIF !

```



**🌐 Site accessible sur :** http://localhost:8000

Puis ouvrez : **http://localhost:8000****🌐 Votre site est accessible sur :**

## 🔐 Administration

- **Principal** : http://localhost:8000  

**Interface admin :** http://localhost:8000/admin/

- **Utilisateur :** `admin`  ## 🔐 Administration- **Admin** : http://localhost:8000/admin/

- **Mot de passe :** `animmedia2024`



### Fonctionnalités Admin

- Tableau de bord avec statistiques**Interface admin :** http://localhost:8000/admin/### Options de Serveur Local

- Gestion des adhérents (en développement)

- Planification d'activités (en développement)- Utilisateur : `admin`  

- Rapports et analytics (en développement)

- Gestion de galerie (en développement)- Mot de passe : `animmedia2024`**1. Python (ACTUEL) ✅**

- Communication/newsletter (en développement)

- Configuration système (en développement)```bash



## 📁 Structure du Projet## 📁 Structurepython -m http.server 8000



``````

📄 index.html          # Page principale responsive

📄 demarrer.bat        # Script de démarrage simple```

📄 manifest.json       # Configuration PWA

📄 sw.js              # Service Worker pour cache📄 index.html          # Page principale  **2. Node.js (Recommandé si installé)**

📄 offline.html       # Page hors ligne

📄 robots.txt         # Directives SEO📄 demarrer.bat        # Script de démarrage```bash

📄 sitemap.xml        # Plan du site

📁 admin/              # Interface administrationnode serveur.js

📁 admin/              # Interface d'administration

  └── index.html       # Dashboard admin sécurisé📁 assets/             # Ressources (CSS, JS, images)# OU



📁 assets/             # Ressources du site📁 dev-tools/          # Outils de développementnpm start

  ├── css/

  │   ├── main.css     # Styles principaux (700+ lignes)📁 docs/               # Documentation complète```

  │   └── admin.css    # Styles administration (300+ lignes)

  ├── js/```

  │   ├── main.js      # Logique principale (500+ lignes)

  │   ├── admin.js     # Logique admin (200+ lignes)**3. Windows (Batch)**

  │   └── security.js  # Module sécurité

  └── images/## 📚 Documentation```

      └── icons/       # Icônes PWA SVG

Double-cliquez sur serveur-local.bat

📁 dev-tools/          # Outils de développement

  ├── serveur.js       # Serveur Node.js optimiséPour plus d'informations : `docs/README.md````

  ├── serveur-local.*  # Scripts de démarrage avancés

  ├── controle-serveur.bat # Interface de contrôle

  └── package.json     # Configuration Node.js

---**4. VS Code Live Server**

📁 docs/               # Documentation technique

  └── DOCUMENTATION.md # Guide complet développeur**Association Anim'Média** • *Culture • Numérique • Loisirs Créatifs*- Extension "Live Server" → Clic droit sur index.html

```

### Option 2: Ouverture Directe (Limité)

## 🎨 Fonctionnalités

Vous pouvez ouvrir `index.html` directement dans un navigateur, mais :

### Design & UX- ⚠️ Certaines fonctionnalités PWA ne fonctionneront pas

- ✅ **Responsive design** mobile-first- ⚠️ Messages d'erreur CORS dans la console (sans impact visuel)

- ✅ **Mode sombre automatique** (prefers-color-scheme)

- ✅ **Palette associative** (vert forêt, corail, violet)### Option 3: VS Code Live Server

- ✅ **Animations fluides** avec respect prefers-reduced-motion

- ✅ **Accessibilité WCAG** niveau AASi vous utilisez VS Code :

1. Installez l'extension "Live Server"

### Technique2. Clic droit sur `index.html` → "Open with Live Server"

- ✅ **Progressive Web App** (PWA) complète

- ✅ **Service Worker** pour cache intelligent## 🌐 Fonctionnalités

- ✅ **Système d'authentification** avec sessions

- ✅ **Architecture modulaire** (CSS/JS séparés)- ✅ Site responsive (mobile-friendly)

- ✅ **Notifications toast** interactives- ✅ Mode sombre automatique

- ✅ **Gestion hors ligne** avec fallback- ✅ Interface d'administration

- ✅ Progressive Web App (PWA)

## 🌈 Palette de Couleurs- ✅ Palette de couleurs associative



- **🌿 Vert forêt** `#2E8B57` - Primaire (nature, croissance)## 🔐 Administration

- **🧡 Corail** `#FF7F50` - Secondaire (chaleur, convivialité)

- **💜 Violet** `#9370DB` - Accent (créativité, art)Accès admin: `/admin/`

- **🤎 Beige** `#F5F5DC` - Fond doux (naturel, accessible)- Identifiant: `admin`

- **⚫ Gris ardoise** `#708090` - Textes neutres- Mot de passe: `animmedia2024`



Le mode sombre s'active automatiquement selon les préférences système avec des couleurs adaptées pour un contraste optimal.## 📁 Structure



## 🛠️ Développement```

AnimMediaLaGuerche/

### Serveur Local Avancé├── index.html              # Page principale

├── admin/

**Node.js (Recommandé si installé) :**│   └── index.html          # Interface admin

```bash├── assets/

cd dev-tools│   ├── css/

node serveur.js│   │   ├── main.css        # Styles principaux

```│   │   └── admin.css       # Styles admin

│   └── js/

**Python (Alternative) :**│       ├── main.js         # Logique principale

```bash│       └── admin.js        # Logique admin

python -m http.server 8000├── manifest.json           # Configuration PWA

```├── sw.js                   # Service Worker

└── offline.html            # Page hors ligne

**Scripts Windows :**```

```bash

# Interface de contrôle complète## 🎨 Palette de Couleurs

dev-tools\controle-serveur.bat

- **Vert forêt** `#2E8B57` - Primaire (nature, croissance)

# Démarrage automatique avec détection- **Corail** `#FF7F50` - Secondaire (chaleur, convivialité)  

dev-tools\serveur-local.bat- **Violet** `#9370DB` - Accent (créativité, art)

```- **Beige** `#F5F5DC` - Fond doux (naturel)



### Outils Développement (dossier dev-tools/)## 🔧 Résolution des Problèmes



- **`serveur.js`** - Serveur Node.js optimisé avec CORS complet### Erreurs CORS

- **`serveur-local.bat`** - Script de démarrage automatique Windows  Si vous voyez des erreurs de type "CORS policy", utilisez un serveur local au lieu d'ouvrir le fichier directement.

- **`serveur-local.ps1`** - Script PowerShell alternatif

- **`controle-serveur.bat`** - Interface de contrôle avec restart/stop### Mode Sombre

- **`package.json`** - Configuration Node.js avec scripts npmLe site s'adapte automatiquement aux préférences système. Changez le thème de votre OS pour tester.



**Fonctionnalités serveur :**---

- Support CORS complet

- Types MIME optimisés  **Association Anim'Média La Guerche-sur-l'Aubois**  

- Gestion d'erreurs 404 avec fallback*Culture • Numérique • Loisirs Créatifs*
- Logs en temps réel pour debugging
- Auto-ouverture du navigateur

## 🚀 Déploiement

### Hébergement Statique
Le site est compatible avec tous les hébergeurs statiques :
- GitHub Pages
- Netlify  
- Vercel
- Surge.sh
- Hébergement traditionnel

### Optimisations Production
- **Aucune dépendance** serveur backend
- **Assets optimisés** (CSS/JS minifiables)
- **PWA complète** pour installation native
- **Cache intelligent** via Service Worker
- **SEO optimisé** (sitemap, robots.txt, meta tags)

## 🎯 Performance & Techniques

### Métriques Cibles
- **LCP** < 2.5s (Largest Contentful Paint)
- **FID** < 100ms (First Input Delay)  
- **CLS** < 0.1 (Cumulative Layout Shift)
- **Accessibilité** score 100%

### Stack Technique
- **HTML5** sémantique et accessible
- **CSS3** avec variables personnalisées et mode sombre
- **JavaScript** vanilla moderne (ES6+), zéro dépendance
- **PWA** avec Service Worker et manifest
- **Fonts** Inter via Google Fonts avec preload
- **Icons** SVG optimisés pour toutes résolutions

## 📚 Documentation

### Fichier Principal (vous lisez actuellement)
Ce README unique contient toutes les informations nécessaires pour utiliser, développer et déployer le site.

### Documentation Technique Supplémentaire
- **`docs/DOCUMENTATION.md`** - Guide complet développeur avec architecture détaillée

## 📝 Historique des Versions

### v2.0.0 (Octobre 2025) - Version Actuelle
- ✅ Refonte complète avec palette associative chaleureuse
- ✅ Mode sombre automatique avec adaptation des couleurs
- ✅ Interface d'administration moderne et sécurisée  
- ✅ Architecture modulaire (extraction CSS/JS des fichiers HTML)
- ✅ PWA complète avec Service Worker et cache intelligent
- ✅ Système d'authentification avec sessions
- ✅ Organisation optimisée des fichiers et dossiers
- ✅ Scripts de démarrage automatique et outils développement
- ✅ Documentation consolidée (README unique)

### v1.0.0 (Version initiale)
- Site statique basique avec styles inline
- Pas d'interface d'administration
- Structure non organisée

## 🤝 Contribution & Standards

### Structure du Code
- **CSS** : Variables personnalisées, approche mobile-first, pas de frameworks  
- **JavaScript** : Vanilla ES6+, pas de dépendances externes, modules séparés
- **HTML** : Sémantique, accessible WCAG AA, valide W3C
- **Assets** : SVG optimisés, compression images, lazy loading

### Conventions de Code
- **Indentation** : 4 espaces pour HTML/CSS/JS
- **Nommage** : kebab-case pour CSS, camelCase pour JS  
- **Commentaires** : Français, descriptifs et utiles
- **Commits** : Messages clairs suivant convention conventional commits
- **Architecture** : Séparation claire HTML/CSS/JS, modularité

### Workflow Développement
1. **Local** : Utiliser `demarrer.bat` ou serveur dev-tools
2. **Test** : Vérifier responsive, accessibilité, performance  
3. **Validation** : HTML/CSS valides, JS sans erreur console
4. **Commit** : Messages descriptifs, fichiers organisés
5. **Deploy** : Compatible hébergement statique

---

## 📞 Contact & Association

**Association Anim'Média La Guerche-sur-l'Aubois**  
*Association culturelle et d'éducation populaire*

**Mission :** Promouvoir la culture, le numérique et les loisirs créatifs  
**Activités :** Ateliers créatifs • Formations numériques • Événements culturels

---

*Site développé avec passion pour servir la communauté locale* ❤️  
*Architecture moderne, accessible et performante au service de la culture*