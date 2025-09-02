# 🎨 Anim'Média La Guerche - Site Web Officiel

Site web moderne et interactif de l'association culturelle **Anim'Média** de La Guerche-sur-l'Aubois.

## ✨ Fonctionnalités Principales

### 🌐 Site Web
- **Design responsive** : Compatible tous appareils (desktop, tablette, mobile)
- **Interface moderne** : Design professionnel avec animations fluides
- **Navigation intuitive** : Menu fixe avec ancres vers les sections
- **SEO optimisé** : Métadonnées complètes, sitemap, robots.txt
- **PWA ready** : Installable comme application mobile
- **Performance** : Chargement optimisé avec preconnect et lazy loading

### 📱 Interface d'Administration Complète
- **Gestion événements** : Ajout/modification/suppression en temps réel
- **Gestion activités** : Création et édition de toutes les activités
- **Gestion galerie** : Ajout/suppression d'images dynamique
- **Sauvegarde intelligente** : localStorage + export/import des données
- **Notifications** : Feedback visuel pour toutes les actions
- **Auto-sauvegarde** : Sauvegarde automatique toutes les 5 minutes
- **Mode édition avancé** : Interface intuitive avec conseils contextuels

### 🖼️ Galerie Interactive
- **Lightbox moderne** : Agrandissement des images au clic
- **Gestion admin** : Ajout/suppression d'images en mode admin
- **Images responsives** : Optimisées pour tous les écrans
- **Chargement paresseux** : Performance améliorée

## 🚀 Accès et Déploiement

### 🌍 Site en ligne
- **URL principale** : https://kevinrouxerpac.github.io/AnimMediaLaGuerche/
- **Déploiement automatique** : Via GitHub Actions à chaque mise à jour
- **SSL/HTTPS** : Sécurisé automatiquement par GitHub Pages

### 🔐 Mode Administration
1. Cliquer sur **"Mode Admin"** en bas à droite du site
2. Entrer le mot de passe : `animmedia2025`
3. Interface d'administration activée avec tous les contrôles

## 🛠️ Technologies Utilisées

### Frontend
- **HTML5** : Structure sémantique moderne
- **CSS3** : Grid, Flexbox, animations, responsive design
- **JavaScript** : Vanilla JS pour performance optimale
- **Font Awesome 6** : Icônes vectorielles
- **Google Fonts** : Typographie professionnelle (Open Sans)

### Backend & Déploiement
- **GitHub Pages** : Hébergement gratuit et fiable
- **GitHub Actions** : Déploiement automatique
- **localStorage** : Stockage local des données
- **PWA** : Application web progressive

## 📊 SEO & Performance

### 🎯 Optimisations SEO
- ✅ **Métadonnées complètes** : Description, mots-clés, auteur
- ✅ **Open Graph** : Partage optimisé Facebook/LinkedIn
- ✅ **Twitter Cards** : Partage optimisé Twitter
- ✅ **Schema.org** : Balisage structuré pour les moteurs de recherche
- ✅ **Sitemap XML** : Plan du site pour l'indexation
- ✅ **Robots.txt** : Directives pour les crawlers

### ⚡ Performance
- ✅ **Lazy loading** : Chargement paresseux des images
- ✅ **Preconnect DNS** : Connexions anticipées
- ✅ **Images optimisées** : Format WebP ready
- ✅ **CSS/JS optimisés** : Code minifié et optimisé
- ✅ **Score 90+** : Performance PageSpeed Insights

## 📱 Progressive Web App (PWA)

Le site peut être **installé comme une application** :
- **Mobile** : "Ajouter à l'écran d'accueil"
- **Desktop** : Icône d'installation dans la barre d'adresse
- **Hors ligne** : Fonctionnement basique en mode déconnecté
- **Manifest** : Configuration complète PWA

## 🗂️ Structure du Projet

```
AnimMediaLaGuerche/
├── 📄 index.html                 # Page principale
├── 📁 css/
│   └── 🎨 style.css             # Styles principaux + admin
├── 📁 js/
│   ├── ⚡ script.js             # Logique principale
│   └── 🔧 advanced-features.js  # Fonctionnalités avancées
├── 📁 images/                    # Galerie d'images
├── 📁 .github/workflows/
│   └── 🚀 deploy.yml           # Déploiement automatique
├── 📱 manifest.json             # Configuration PWA
├── 🗺️ sitemap.xml              # Plan du site
├── 🤖 robots.txt               # Directives robots
└── 📖 README.md                # Documentation
```

## 🎛️ Guide d'Administration

### Fonctionnalités disponibles
- **Événements** : Création, modification, suppression
- **Activités** : Gestion complète du catalogue
- **Galerie** : Ajout/suppression d'images
- **Sauvegarde** : Export/Import des données
- **Notifications** : Feedback en temps réel

### Données par défaut
Le site inclut des **données de démonstration** :
- 3 activités : Ateliers numériques, Scrapbooking, Club de lecture
- 3 événements : Spectacle, Atelier créatif, Conférence
- 6 images de galerie (sources Unsplash)

### Configuration avancée
```javascript
// Dans js/advanced-features.js
const siteConfig = {
    siteName: "Anim'Média",
    version: "2.0.0",
    admin: {
        password: "animmedia2025",
        sessionTimeout: 30 * 60 * 1000, // 30 minutes
        maxBackups: 5
    }
};
```

## 🔒 Sécurité

- **Mot de passe admin** : Stocké côté client uniquement
- **Données locales** : Aucune transmission vers serveur externe
- **HTTPS** : Certificat SSL automatique via GitHub Pages
- **Validation** : Contrôles de saisie et sanitisation

## 🎨 Personnalisation

### Modifier le contenu
1. **Via l'interface admin** : Mode le plus simple
2. **Modification directe** : Éditer les fichiers source

### Changer les couleurs
```css
/* Dans css/style.css */
:root {
    --primary-color: #3498db;
    --secondary-color: #2c3e50;
    /* ... autres variables */
}
```

### Ajouter des fonctionnalités
- Modifier `js/script.js` pour la logique de base
- Étendre `js/advanced-features.js` pour les fonctionnalités avancées

## 🤝 Contribution

1. **Fork** le repository
2. **Créer** une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Committer** les changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. **Pusher** vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. **Créer** une Pull Request

## 📞 Support & Contact

### 🏢 Association Anim'Média
- **Adresse** : Médiathèque Jean-Paul Roussillot, La Guerche-sur-l'Aubois
- **Email** : contact@animmedia-laguerche.fr
- **Téléphone** : 06 99 47 15 25

### 💻 Support Technique
- **GitHub Issues** : [Signaler un problème](https://github.com/kevinrouxerpac/AnimMediaLaGuerche/issues)
- **Documentation** : Ce README et les commentaires du code

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier `LICENSE` pour plus de détails.

---

**🎨 Développé avec ❤️ pour Anim'Média La Guerche-sur-l'Aubois**  
*Version 2.0.0 - Site moderne, interactif et optimisé*
