# 🔥 Solution Firebase - Backend Simple et Gratuit

## Vue d'ensemble
Firebase offre une base de données NoSQL en temps réel, parfaite pour votre site d'association.

## Avantages
- ✅ **Gratuit** jusqu'à 1GB de stockage
- ✅ **Temps réel** : Modifications instantanées
- ✅ **Authentification** intégrée
- ✅ **Hosting** gratuit inclus
- ✅ **Sécurité** gérée par Google
- ✅ **Interface admin** personnalisable

## Architecture
```
Site Public (GitHub Pages)
    ↓
Firebase Realtime Database
    ↓
Page Admin Sécurisée
```

## Mise en œuvre

### 1. Configuration Firebase
```javascript
// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "votre-api-key",
    authDomain: "animmedia-laguerche.firebaseapp.com",
    databaseURL: "https://animmedia-laguerche-default-rtdb.firebaseio.com/",
    projectId: "animmedia-laguerche",
    storageBucket: "animmedia-laguerche.appspot.com",
    messagingSenderId: "123456789",
    appId: "votre-app-id"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
```

### 2. Structure Base de Données
```json
{
  "events": {
    "event1": {
      "id": "event1",
      "title": "Atelier Scrapbooking",
      "date": "2025-09-15",
      "time": "14:00",
      "location": "Médiathèque",
      "description": "Créez vos albums photos",
      "image": "url-image",
      "published": true,
      "createdAt": "2025-09-02T10:00:00Z"
    }
  },
  "activities": {
    "activity1": {
      "id": "activity1",
      "title": "Ateliers numériques",
      "icon": "fas fa-desktop",
      "items": ["Initiation informatique", "Café informatique"],
      "published": true,
      "order": 1
    }
  },
  "gallery": {
    "image1": {
      "id": "image1",
      "url": "https://...",
      "title": "Atelier créatif",
      "alt": "Photo atelier",
      "order": 1
    }
  }
}
```

### 3. Page Admin (admin.html)
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Admin Anim'Média</title>
    <link rel="stylesheet" href="css/admin.css">
</head>
<body>
    <div id="admin-app">
        <!-- Interface complète d'administration -->
        <header class="admin-header">
            <h1>🎨 Anim'Média - Administration</h1>
            <button id="logout-btn">Déconnexion</button>
        </header>
        
        <nav class="admin-nav">
            <button data-section="events" class="nav-btn active">Événements</button>
            <button data-section="activities" class="nav-btn">Activités</button>
            <button data-section="gallery" class="nav-btn">Galerie</button>
            <button data-section="settings" class="nav-btn">Paramètres</button>
        </nav>
        
        <main class="admin-content">
            <!-- Contenu dynamique -->
        </main>
    </div>
    
    <script type="module" src="js/admin.js"></script>
</body>
</html>
```

### 4. JavaScript Admin (admin.js)
```javascript
import { database, auth } from './firebase-config.js';
import { ref, push, update, remove, onValue } from 'firebase/database';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

class AdminPanel {
    constructor() {
        this.currentSection = 'events';
        this.init();
    }
    
    init() {
        this.checkAuth();
        this.bindEvents();
        this.loadData();
    }
    
    checkAuth() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.showAdminPanel();
            } else {
                this.showLoginForm();
            }
        });
    }
    
    async addEvent(eventData) {
        try {
            await push(ref(database, 'events'), {
                ...eventData,
                createdAt: new Date().toISOString()
            });
            this.showNotification('Événement ajouté avec succès!', 'success');
        } catch (error) {
            this.showNotification('Erreur: ' + error.message, 'error');
        }
    }
    
    async updateEvent(eventId, eventData) {
        try {
            await update(ref(database, `events/${eventId}`), eventData);
            this.showNotification('Événement modifié avec succès!', 'success');
        } catch (error) {
            this.showNotification('Erreur: ' + error.message, 'error');
        }
    }
    
    async deleteEvent(eventId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
            try {
                await remove(ref(database, `events/${eventId}`));
                this.showNotification('Événement supprimé avec succès!', 'success');
            } catch (error) {
                this.showNotification('Erreur: ' + error.message, 'error');
            }
        }
    }
    
    loadData() {
        // Charger en temps réel
        onValue(ref(database, this.currentSection), (snapshot) => {
            const data = snapshot.val();
            this.renderData(data);
        });
    }
}

// Initialisation
new AdminPanel();
```

### 5. Intégration Site Public
```javascript
// Modifier script.js pour utiliser Firebase
import { database } from './firebase-config.js';
import { ref, onValue } from 'firebase/database';

// Remplacer localStorage par Firebase
function loadDataFromFirebase() {
    onValue(ref(database, 'events'), (snapshot) => {
        const events = snapshot.val();
        if (events) {
            renderEvents(Object.values(events));
        }
    });
    
    onValue(ref(database, 'activities'), (snapshot) => {
        const activities = snapshot.val();
        if (activities) {
            renderActivities(Object.values(activities));
        }
    });
}
```

## Installation

### 1. Créer Projet Firebase
1. Aller sur https://console.firebase.google.com/
2. Créer nouveau projet "animmedia-laguerche"
3. Activer Realtime Database
4. Configurer authentification Email/Password

### 2. Ajouter au Site
```bash
npm install firebase
# ou via CDN dans HTML
```

### 3. Déployer
- Site public : GitHub Pages (comme actuellement)
- Admin : Firebase Hosting ou sous-dossier GitHub

## Coût
- **Gratuit** pour usage association (limite généreuse)
- Payant seulement si > 1GB données ou > 100k connexions/mois
