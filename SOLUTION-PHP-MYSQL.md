# 🐘 Solution PHP + MySQL - Backend Traditionnel

## Vue d'ensemble
Solution classique avec hébergement web traditionnel supportant PHP et MySQL.

## Avantages
- ✅ **Contrôle total** de la base de données
- ✅ **Flexible** et personnalisable
- ✅ **Mature** et bien documenté
- ✅ **Hébergement** pas cher (3-10€/mois)
- ✅ **Backup** facile

## Architecture
```
Site Public (HTML/JS)
    ↓ API REST
Backend PHP (api/)
    ↓
Base MySQL
    ↓
Admin Panel PHP
```

## Structure Fichiers
```
/
├── index.html (site public)
├── admin/ (interface admin)
│   ├── index.php
│   ├── login.php
│   └── dashboard.php
├── api/ (endpoints REST)
│   ├── events.php
│   ├── activities.php
│   └── gallery.php
├── includes/
│   ├── config.php
│   ├── auth.php
│   └── database.php
└── js/
    └── api-client.js
```

## Base de Données MySQL
```sql
-- Structure des tables
CREATE DATABASE animmedia_db;

CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME,
    location VARCHAR(255),
    description TEXT,
    image_url VARCHAR(500),
    published BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    items JSON,
    published BOOLEAN DEFAULT 1,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gallery (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    order_index INT DEFAULT 0,
    published BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role ENUM('admin', 'editor') DEFAULT 'editor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API REST (api/events.php)
```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../includes/database.php';
require_once '../includes/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch($method) {
    case 'GET':
        $events = getEvents();
        echo json_encode($events);
        break;
        
    case 'POST':
        if (!isAuthenticated()) {
            http_response_code(401);
            echo json_encode(['error' => 'Non autorisé']);
            exit;
        }
        $result = createEvent($input);
        echo json_encode($result);
        break;
        
    case 'PUT':
        if (!isAuthenticated()) {
            http_response_code(401);
            echo json_encode(['error' => 'Non autorisé']);
            exit;
        }
        $id = $_GET['id'];
        $result = updateEvent($id, $input);
        echo json_encode($result);
        break;
        
    case 'DELETE':
        if (!isAuthenticated()) {
            http_response_code(401);
            echo json_encode(['error' => 'Non autorisé']);
            exit;
        }
        $id = $_GET['id'];
        $result = deleteEvent($id);
        echo json_encode($result);
        break;
}

function getEvents() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM events WHERE published = 1 ORDER BY date ASC");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function createEvent($data) {
    global $pdo;
    $stmt = $pdo->prepare("
        INSERT INTO events (title, date, time, location, description, image_url) 
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $data['title'],
        $data['date'],
        $data['time'],
        $data['location'],
        $data['description'],
        $data['image_url']
    ]);
    
    return ['id' => $pdo->lastInsertId(), 'success' => true];
}
?>
```

## Interface Admin (admin/dashboard.php)
```php
<?php
session_start();
require_once '../includes/auth.php';

if (!isLoggedIn()) {
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Admin - Anim'Média</title>
    <link rel="stylesheet" href="../css/admin.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <div class="admin-layout">
        <nav class="sidebar">
            <div class="sidebar-header">
                <h2><i class="fas fa-palette"></i> Anim'Média</h2>
            </div>
            <ul class="sidebar-menu">
                <li><a href="#events" class="menu-link active"><i class="fas fa-calendar"></i> Événements</a></li>
                <li><a href="#activities" class="menu-link"><i class="fas fa-list"></i> Activités</a></li>
                <li><a href="#gallery" class="menu-link"><i class="fas fa-images"></i> Galerie</a></li>
                <li><a href="#settings" class="menu-link"><i class="fas fa-cog"></i> Paramètres</a></li>
                <li><a href="logout.php" class="menu-link"><i class="fas fa-sign-out-alt"></i> Déconnexion</a></li>
            </ul>
        </nav>
        
        <main class="main-content">
            <header class="content-header">
                <h1 id="page-title">Gestion des Événements</h1>
                <button id="add-btn" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Ajouter
                </button>
            </header>
            
            <div id="content-area">
                <!-- Contenu dynamique chargé via AJAX -->
            </div>
        </main>
    </div>
    
    <script src="../js/admin-panel.js"></script>
</body>
</html>
```

## Client JavaScript (js/api-client.js)
```javascript
class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.token = localStorage.getItem('admin_token');
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}/${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` })
            },
            ...options
        };
        
        const response = await fetch(url, config);
        return await response.json();
    }
    
    // Événements
    async getEvents() {
        return this.request('api/events.php');
    }
    
    async createEvent(eventData) {
        return this.request('api/events.php', {
            method: 'POST',
            body: JSON.stringify(eventData)
        });
    }
    
    async updateEvent(id, eventData) {
        return this.request(`api/events.php?id=${id}`, {
            method: 'PUT',
            body: JSON.stringify(eventData)
        });
    }
    
    async deleteEvent(id) {
        return this.request(`api/events.php?id=${id}`, {
            method: 'DELETE'
        });
    }
    
    // Activités
    async getActivities() {
        return this.request('api/activities.php');
    }
    
    // Galerie
    async getGallery() {
        return this.request('api/gallery.php');
    }
}

// Utilisation
const api = new ApiClient('https://votre-domaine.com');

// Charger les événements dans le site public
async function loadEvents() {
    try {
        const events = await api.getEvents();
        renderEvents(events);
    } catch (error) {
        console.error('Erreur chargement événements:', error);
    }
}
```

## Hébergement Recommandé
- **OVH** : 3-5€/mois (PHP + MySQL)
- **O2Switch** : 6€/mois (illimité)
- **Hostinger** : 2-4€/mois
- **1&1 IONOS** : 4-8€/mois

## Installation
1. Créer base de données MySQL
2. Exécuter scripts SQL
3. Configurer PHP (config.php)
4. Uploader fichiers sur serveur
5. Tester API endpoints
6. Configurer admin par défaut

## Sécurité
- Authentification par sessions PHP
- Hashage passwords (password_hash)
- Protection CSRF
- Validation/sanitisation données
- Backup régulier base
