# 🚀 Guide de Déploiement - Anim'Média La Guerche

Ce guide explique comment déployer et maintenir le site web de l'association Anim'Média La Guerche.

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Déploiement sur GitHub Pages](#déploiement-sur-github-pages)
3. [Configuration du Domaine](#configuration-du-domaine)
4. [Optimisations SEO](#optimisations-seo)
5. [Configuration PWA](#configuration-pwa)
6. [Maintenance](#maintenance)
7. [Sauvegarde](#sauvegarde)
8. [Dépannage](#dépannage)

## 🔧 Prérequis

### Outils Nécessaires
- Compte GitHub (gratuit)
- Éditeur de code (VS Code recommandé)
- Navigateur web moderne
- Git (optionnel mais recommandé)

### Connaissances Requises
- Navigation web de base
- Édition de fichiers texte
- Notions de GitHub (recommandées)

## 🌐 Déploiement sur GitHub Pages

### Étape 1 : Création du Dépôt GitHub

1. **Créer un compte GitHub** (si pas déjà fait)
   - Aller sur [github.com](https://github.com)
   - Cliquer sur "Sign up" 
   - Choisir le nom d'utilisateur : `animmedia-laguerche` (recommandé)

2. **Créer un nouveau repository**
   - Cliquer sur le bouton "+" en haut à droite
   - Sélectionner "New repository"
   - Nom : `site-web` ou `animmedia-site`
   - Description : "Site web officiel d'Anim'Média La Guerche"
   - Cocher "Public"
   - Cocher "Add a README file"

### Étape 2 : Upload des Fichiers

#### Méthode 1 : Interface Web GitHub (Plus Simple)

1. **Aller dans le repository créé**
2. **Cliquer sur "uploading an existing file"**
3. **Glisser-déposer tous les fichiers** du projet :
   ```
   📁 Fichiers à uploader :
   ├── index.html
   ├── manifest.json
   ├── sw.js
   ├── offline.html
   ├── robots.txt
   ├── sitemap.xml
   ├── assets/
   │   ├── css/
   │   │   ├── main.css
   │   │   └── admin.css
   │   ├── js/
   │   │   ├── main.js
   │   │   ├── admin.js
   │   │   └── animations.js
   │   └── images/
   ├── admin/
   │   └── index.html
   └── docs/
       └── README.md
   ```

4. **Commit des fichiers**
   - Message : "🚀 Déploiement initial du site Anim'Média"
   - Cliquer "Commit changes"

#### Méthode 2 : Git (Pour Utilisateurs Avancés)

```bash
# Cloner le repository
git clone https://github.com/animmedia-laguerche/site-web.git
cd site-web

# Copier tous les fichiers dans le dossier
# Puis faire le commit
git add .
git commit -m "🚀 Déploiement initial du site"
git push origin main
```

### Étape 3 : Activation de GitHub Pages

1. **Aller dans Settings** du repository
2. **Scroller jusqu'à "Pages"** dans le menu de gauche
3. **Configuration :**
   - Source : "Deploy from a branch"
   - Branch : `main` (ou `master`)
   - Folder : `/ (root)`
4. **Cliquer "Save"**

### Étape 4 : Vérification

- **URL générée :** `https://animmedia-laguerche.github.io/site-web/`
- **Délai :** 5-10 minutes pour la première activation
- **Vérification :** Ouvrir l'URL dans le navigateur

## 🌍 Configuration du Domaine

### Domaine Personnalisé (Optionnel)

1. **Acheter un domaine** (ex: `animmedia-laguerche.fr`)
   - Recommandations : OVH, Gandi, Namecheap
   - Coût : ~15€/an

2. **Configuration DNS**
   ```
   Type: CNAME
   Nom: www
   Valeur: animmedia-laguerche.github.io
   
   Type: A
   Nom: @
   Valeurs: 
   - 185.199.108.153
   - 185.199.109.153
   - 185.199.110.153
   - 185.199.111.153
   ```

3. **Configuration GitHub Pages**
   - Aller dans Settings > Pages
   - Custom domain : `www.animmedia-laguerche.fr`
   - Cocher "Enforce HTTPS"

4. **Fichier CNAME**
   - Créer un fichier `CNAME` à la racine
   - Contenu : `www.animmedia-laguerche.fr`

## 🔍 Optimisations SEO

### Fichiers à Vérifier

#### robots.txt
```txt
User-agent: *
Allow: /

# Plan du site
Sitemap: https://votre-domaine.fr/sitemap.xml

# Interdictions
Disallow: /admin/
Disallow: /*.json$
```

#### sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://votre-domaine.fr/</loc>
    <lastmod>2024-02-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://votre-domaine.fr/#activites</loc>
    <lastmod>2024-02-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://votre-domaine.fr/#evenements</loc>
    <lastmod>2024-02-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

### Soumission aux Moteurs de Recherche

1. **Google Search Console**
   - Aller sur [search.google.com/search-console](https://search.google.com/search-console)
   - Ajouter la propriété avec l'URL du site
   - Vérifier la propriété via le fichier HTML fourni

2. **Bing Webmaster Tools**
   - Aller sur [www.bing.com/webmasters](https://www.bing.com/webmasters)
   - Même processus que Google

## 📱 Configuration PWA

### Vérification de l'Installation PWA

1. **Test dans Chrome :**
   - F12 > Application > Manifest
   - Vérifier que tous les champs sont présents
   - Tester "Add to homescreen"

2. **Test Service Worker :**
   - F12 > Application > Service Workers
   - Vérifier l'état "activated and is running"

3. **Test Offline :**
   - F12 > Network > Offline
   - Recharger la page
   - Vérifier que la page offline s'affiche

### Génération des Icônes PWA

#### Outils Recommandés
- [PWA Builder](https://www.pwabuilder.com/imageGenerator)
- [Favicon Generator](https://favicon.io/)

#### Tailles Requises
```
📏 Tailles d'icônes à créer :
├── 16x16 (favicon)
├── 32x32 (favicon)
├── 72x72 (mobile)
├── 96x96 (mobile)
├── 128x128 (desktop)
├── 144x144 (mobile)
├── 152x152 (iOS)
├── 192x192 (Android)
├── 384x384 (Android)
└── 512x512 (splash)
```

## 🔧 Maintenance

### Mise à Jour du Contenu

#### Événements
1. **Modifier le fichier** `assets/js/main.js`
2. **Trouver la section** `SAMPLE_EVENTS`
3. **Ajouter/modifier** les événements :
   ```javascript
   {
     id: 4,
     title: 'Nouvel Événement',
     date: '2024-03-15',
     time: '14:00',
     location: 'Salle Polyvalente',
     description: 'Description de l\'événement...',
     image: 'assets/images/events/nouvel-event.jpg',
     category: 'Spectacle'
   }
   ```

#### Activités
1. **Modifier le fichier** `assets/js/main.js`
2. **Trouver la section** `SAMPLE_ACTIVITIES`
3. **Ajouter/modifier** les activités de la même manière

### Mise à Jour des Images

1. **Ajouter les images** dans `assets/images/`
2. **Optimiser avant upload** :
   - Format : JPEG pour photos, PNG pour logos
   - Taille : max 1920px de largeur
   - Compression : 80% qualité

### Déploiement des Modifications

#### Via Interface GitHub
1. **Aller sur le fichier** à modifier
2. **Cliquer sur l'icône crayon** (Edit)
3. **Faire les modifications**
4. **Commit** avec message descriptif
5. **Attendre 2-5 minutes** pour déploiement

#### Via Git (Avancé)
```bash
# Modifications locales
git add .
git commit -m "📅 Ajout nouvel événement mars"
git push origin main
```

## 💾 Sauvegarde

### Sauvegarde Automatique
- GitHub sauvegarde automatiquement tout l'historique
- Chaque modification est tracée et récupérable

### Sauvegarde Manuelle
1. **Télécharger le repository**
   - Code > Download ZIP
   - Sauvegarder sur disque local

2. **Export des données admin**
   - Interface admin > Paramètres > Export
   - Sauvegarder le fichier JSON

### Planning de Sauvegarde
```
📅 Fréquence recommandée :
├── Quotidien : Données admin (automatique)
├── Hebdomadaire : Export manuel
├── Mensuel : Archive complète
└── Avant modifications importantes
```

## 🚨 Dépannage

### Problèmes Courants

#### Site ne se charge pas
**Causes possibles :**
- Déploiement en cours (attendre 5-10min)
- Erreur dans le code HTML/CSS/JS
- Cache du navigateur

**Solutions :**
1. Vérifier l'état du déploiement : Repository > Actions
2. Vider le cache : Ctrl+F5
3. Tester en navigation privée
4. Vérifier la console développeur : F12 > Console

#### PWA ne s'installe pas
**Vérifications :**
1. HTTPS activé (GitHub Pages l'active automatiquement)
2. Manifest.json accessible : `votre-site.com/manifest.json`
3. Service Worker actif : F12 > Application > Service Workers
4. Icônes présentes dans les bonnes tailles

#### Service Worker ne fonctionne pas
**Diagnostic :**
```javascript
// Dans la console développeur
navigator.serviceWorker.getRegistrations()
  .then(registrations => console.log('SW:', registrations));
```

**Solutions :**
1. Vérifier que `sw.js` est à la racine
2. Forcer la mise à jour : F12 > Application > Storage > Clear storage
3. Désactiver/Réactiver le SW dans les DevTools

### Contacts Support

#### Ressources Officielles
- **GitHub Support :** [support.github.com](https://support.github.com)
- **GitHub Pages :** [docs.github.com/pages](https://docs.github.com/en/pages)

#### Communauté
- **Stack Overflow :** Tag `github-pages`
- **GitHub Community :** [github.community](https://github.community)

## 📊 Monitoring et Analytics

### Google Analytics (Recommandé)

1. **Créer un compte** : [analytics.google.com](https://analytics.google.com)
2. **Ajouter le code** dans `index.html` avant `</head>` :
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

### Métriques PWA
- **Lighthouse :** F12 > Lighthouse > Generate report
- **Web Vitals :** Extension Chrome "Web Vitals"

## ✅ Checklist de Déploiement

### Avant le Premier Déploiement
- [ ] Tous les fichiers sont présents
- [ ] Les liens internes fonctionnent
- [ ] Les images sont optimisées
- [ ] Le manifest.json est valide
- [ ] Le service worker est configuré
- [ ] Les métadonnées SEO sont complètes

### Après le Déploiement
- [ ] Site accessible via l'URL GitHub Pages
- [ ] PWA installable sur mobile/desktop
- [ ] Mode offline fonctionnel
- [ ] Interface admin accessible
- [ ] Formulaires de contact opérationnels
- [ ] Analytics configuré (optionnel)

### Tests Réguliers
- [ ] Vérification mensuelle des liens
- [ ] Test PWA sur différents appareils
- [ ] Mise à jour du contenu
- [ ] Sauvegarde des données
- [ ] Vérification des métriques de performance

---

## 🆘 Aide Rapide

**🚀 Déployer rapidement :**
1. Créer repository GitHub
2. Upload des fichiers
3. Activer Pages dans Settings
4. Attendre 5-10 minutes

**📱 Tester PWA :**
1. Ouvrir le site sur mobile
2. Menu navigateur > "Ajouter à l'écran d'accueil"
3. Vérifier l'icône sur l'écran d'accueil

**🔧 Maintenance :**
1. Modifier les fichiers sur GitHub
2. Commit avec message clair
3. Attendre déploiement automatique

**📞 Contact Technique :**
- GitHub Issues du projet
- Documentation officielle GitHub Pages
- Communauté GitHub

---

> 💡 **Conseil :** Gardez ce guide à portée de main et n'hésitez pas à tester les modifications sur une copie avant de les appliquer au site principal !