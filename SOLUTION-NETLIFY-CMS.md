# 🌐 Solution Netlify CMS - Moderne et Gratuite

## Vue d'ensemble
Interface d'administration moderne utilisant Git comme base de données, parfait pour sites statiques.

## Avantages
- ✅ **Gratuit** (Netlify Free Tier)
- ✅ **Interface moderne** prête à l'emploi
- ✅ **Git-based** : historique complet
- ✅ **Déploiement automatique**
- ✅ **Aucun serveur** à gérer
- ✅ **Sécurité** par authentification GitHub

## Architecture
```
Interface CMS (admin/)
    ↓
Netlify CMS
    ↓
GitHub Repository
    ↓
Netlify Build & Deploy
    ↓
Site Public
```

## Configuration

### 1. Structure Fichiers
```
/
├── admin/
│   ├── index.html (CMS interface)
│   └── config.yml (configuration CMS)
├── _data/ (fichiers de données)
│   ├── events.yml
│   ├── activities.yml
│   └── gallery.yml
├── index.html (site public)
└── netlify.toml (configuration build)
```

### 2. Configuration CMS (admin/config.yml)
```yaml
backend:
  name: git-gateway
  branch: main

media_folder: "images/uploads"
public_folder: "/images/uploads"

collections:
  - name: "events"
    label: "Événements"
    folder: "_data/events"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - { label: "Titre", name: "title", widget: "string" }
      - { label: "Date", name: "date", widget: "datetime" }
      - { label: "Heure", name: "time", widget: "string" }
      - { label: "Lieu", name: "location", widget: "string" }
      - { label: "Description", name: "description", widget: "text" }
      - { label: "Image", name: "image", widget: "image", required: false }
      - { label: "Publié", name: "published", widget: "boolean", default: true }
      
  - name: "activities"
    label: "Activités"
    folder: "_data/activities"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Titre", name: "title", widget: "string" }
      - { label: "Icône", name: "icon", widget: "string", hint: "Classe Font Awesome (ex: fas fa-desktop)" }
      - { label: "Éléments", name: "items", widget: "list", field: { label: "Élément", name: "item", widget: "string" } }
      - { label: "Ordre", name: "order", widget: "number", default: 1 }
      - { label: "Publié", name: "published", widget: "boolean", default: true }
      
  - name: "gallery"
    label: "Galerie"
    folder: "_data/gallery"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Titre", name: "title", widget: "string" }
      - { label: "Image", name: "image", widget: "image" }
      - { label: "Texte alternatif", name: "alt", widget: "string" }
      - { label: "Ordre", name: "order", widget: "number", default: 1 }
      
  - name: "settings"
    label: "Paramètres"
    files:
      - label: "Configuration générale"
        name: "general"
        file: "_data/settings.yml"
        fields:
          - { label: "Nom du site", name: "site_name", widget: "string" }
          - { label: "Description", name: "description", widget: "text" }
          - { label: "Email contact", name: "contact_email", widget: "string" }
          - { label: "Téléphone", name: "phone", widget: "string" }
          - { label: "Adresse", name: "address", widget: "text" }
```

### 3. Interface CMS (admin/index.html)
```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin - Anim'Média</title>
  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
</head>
<body>
  <!-- Include the script that builds the page and powers Netlify CMS -->
  <script src="https://unpkg.com/netlify-cms@^2.0.0/dist/netlify-cms.js"></script>
  
  <script>
    // Configuration supplémentaire si nécessaire
    CMS.registerPreviewStyle("/css/style.css");
    
    // Widget personnalisé pour icônes
    CMS.registerWidget("icon-picker", {
      control: ({ value, onChange }) => {
        const icons = [
          "fas fa-desktop", "fas fa-paint-brush", 
          "fas fa-book-open", "fas fa-gamepad",
          "fas fa-calendar", "fas fa-users"
        ];
        
        return h('select', {
          value: value || '',
          onChange: (e) => onChange(e.target.value)
        }, [
          h('option', { value: '' }, 'Choisir une icône'),
          ...icons.map(icon => 
            h('option', { value: icon }, icon)
          )
        ]);
      },
      preview: ({ value }) => h('i', { className: value })
    });
  </script>
</body>
</html>
```

### 4. Configuration Netlify (netlify.toml)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/admin/*"
  to = "/admin/index.html"
  status = 200

[context.production.environment]
  NODE_ENV = "production"
```

### 5. Script de Build (build.js)
```javascript
// Script pour convertir YAML en JSON pour le site
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

function buildData() {
    const dataDir = '_data';
    const outputDir = 'data';
    
    // Créer dossier de sortie
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    
    // Traiter événements
    const eventsDir = path.join(dataDir, 'events');
    if (fs.existsSync(eventsDir)) {
        const events = [];
        fs.readdirSync(eventsDir).forEach(file => {
            if (file.endsWith('.md')) {
                const content = fs.readFileSync(path.join(eventsDir, file), 'utf8');
                const parsed = matter(content);
                events.push(parsed.data);
            }
        });
        
        // Trier par date
        events.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        fs.writeFileSync(
            path.join(outputDir, 'events.json'),
            JSON.stringify(events, null, 2)
        );
    }
    
    // Même process pour activités et galerie
    // ...
}

buildData();
```

### 6. Intégration Site Public
```javascript
// Modifier script.js pour charger depuis fichiers JSON
async function loadDataFromFiles() {
    try {
        // Charger événements
        const eventsResponse = await fetch('/data/events.json');
        const events = await eventsResponse.json();
        renderEvents(events.filter(e => e.published));
        
        // Charger activités
        const activitiesResponse = await fetch('/data/activities.json');
        const activities = await activitiesResponse.json();
        renderActivities(activities.filter(a => a.published));
        
        // Charger galerie
        const galleryResponse = await fetch('/data/gallery.json');
        const gallery = await galleryResponse.json();
        renderGallery(gallery);
        
    } catch (error) {
        console.error('Erreur chargement données:', error);
        // Fallback vers données statiques
        loadDefaultData();
    }
}

// Appeler au chargement
document.addEventListener('DOMContentLoaded', loadDataFromFiles);
```

## Installation

### 1. Configuration Netlify
1. Connecter repo GitHub à Netlify
2. Activer Netlify Identity
3. Configurer Git Gateway
4. Inviter utilisateurs admin

### 2. Déploiement
```bash
# Ajouter dépendances
npm init -y
npm install js-yaml gray-matter

# Build automatique sur Netlify
git push origin main
```

### 3. Accès Admin
- URL : `https://votre-site.netlify.app/admin/`
- Connexion via GitHub ou email invité

## Avantages Spécifiques
- **Version control** : Chaque modification trackée
- **Rollback facile** : Retour arrière possible
- **Collaboration** : Plusieurs admins possibles
- **Preview** : Aperçu avant publication
- **Média management** : Upload images intégré
- **Workflow** : Validation avant publication

## Coût
- **Gratuit** jusqu'à 100GB bande passante/mois
- **Build minutes** : 300min/mois gratuit
- Au-delà : 9$/mois pour usage professionnel
