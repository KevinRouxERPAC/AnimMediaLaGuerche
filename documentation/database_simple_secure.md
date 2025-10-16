# 🔒 Base de Données Simple et Sécurisée pour Anim'Média

## 🎯 **Principe : KISS (Keep It Simple & Secure)**

Pour une association comme Anim'Média, la base de données doit être :
- ✅ **Simple** : Facile à comprendre et maintenir
- ✅ **Sécurisée** : Protection des données personnelles
- ✅ **Fiable** : Sauvegardes automatiques
- ✅ **Performante** : Rapide même avec peu de ressources

---

## 📊 **STRUCTURE SIMPLIFIÉE - 6 TABLES ESSENTIELLES**

### **🎯 Choix technique : SQLite**
- **Pourquoi ?** Fichier unique, pas de serveur, très sécurisé
- **Performance** : Parfait jusqu'à 100 000 enregistrements
- **Simplicité** : Une seule base = un seul fichier à sauvegarder
- **Sécurité** : Chiffrement natif possible

---

## 📋 **TABLES ESSENTIELLES UNIQUEMENT**

### **1. 👥 users (Utilisateurs)**
```sql
-- Table simplifiée pour les membres et admins
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Essentiel uniquement
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    
    -- Adhésion simplifié
    membership_type TEXT DEFAULT 'ponctuel', -- 'annuel', 'mensuel', 'ponctuel'
    membership_expires DATE,
    
    -- Sécurité minimal
    password_hash TEXT, -- Seulement pour les admins
    role TEXT DEFAULT 'member', -- 'member', 'admin'
    
    -- Système
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1
);
```

### **2. 🎯 events (Événements)**
```sql
-- Table simplifiée pour les événements
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Essentiel uniquement
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT NOT NULL, -- 'atelier', 'formation', 'exposition', etc.
    
    -- Planning
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 120,
    
    -- Pratique
    location TEXT NOT NULL,
    max_participants INTEGER DEFAULT 10,
    price DECIMAL(8,2) DEFAULT 0,
    
    -- Système
    status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'completed'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### **3. 📝 registrations (Inscriptions)**
```sql
-- Table pour les inscriptions
CREATE TABLE registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Relations
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    
    -- Essentiel
    status TEXT DEFAULT 'confirmed', -- 'confirmed', 'cancelled', 'attended'
    amount_paid DECIMAL(8,2) DEFAULT 0,
    payment_method TEXT, -- 'cash', 'card', 'transfer'
    
    -- Dates
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Contraintes
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(event_id, user_id) -- Pas de doublon
);
```

### **4. 💰 payments (Paiements)**
```sql
-- Table simplifiée pour les paiements
CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Relations
    user_id INTEGER NOT NULL,
    registration_id INTEGER, -- NULL pour adhésions
    
    -- Essentiel
    amount DECIMAL(8,2) NOT NULL,
    payment_type TEXT NOT NULL, -- 'event', 'membership'
    payment_method TEXT NOT NULL,
    description TEXT,
    
    -- Dates
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (registration_id) REFERENCES registrations(id)
);
```

### **5. 📧 communications (Communications)**
```sql
-- Table simplifiée pour newsletters
CREATE TABLE communications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Contenu
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'newsletter', -- 'newsletter', 'reminder'
    
    -- Envoi
    sent_to_count INTEGER DEFAULT 0,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Stats simples
    opened_count INTEGER DEFAULT 0
);
```

### **6. 🔒 system_logs (Logs système)**
```sql
-- Table pour audit simple
CREATE TABLE system_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Qui et quoi
    user_id INTEGER,
    action TEXT NOT NULL,
    details TEXT,
    
    -- Quand
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🔒 **MESURES DE SÉCURITÉ SIMPLES MAIS EFFICACES**

### **1. Chiffrement des données sensibles**
```python
# Exemple Python pour chiffrer la base
import sqlite3
from cryptography.fernet import Fernet

# Chiffrement de la base SQLite
def encrypt_database():
    key = Fernet.generate_key()  # À sauvegarder séparément !
    cipher = Fernet(key)
    
    # Chiffrer les données sensibles avant insertion
    encrypted_email = cipher.encrypt(email.encode())
```

### **2. Validation stricte des données**
```python
# Validation avant insertion
def validate_user_data(data):
    # Email valide
    if not re.match(r'^[^@]+@[^@]+\.[^@]+$', data['email']):
        raise ValueError("Email invalide")
    
    # Téléphone français
    if data['phone'] and not re.match(r'^0[1-9][0-9]{8}$', data['phone']):
        raise ValueError("Téléphone invalide")
    
    # Noms propres
    if len(data['first_name']) < 2 or len(data['last_name']) < 2:
        raise ValueError("Noms trop courts")
```

### **3. Accès protégé**
```python
# Connexion sécurisée uniquement
def get_secure_connection():
    conn = sqlite3.connect('animmedia.db')
    
    # Activer les contraintes
    conn.execute('PRAGMA foreign_keys = ON')
    
    # Activer le journal WAL (plus sûr)
    conn.execute('PRAGMA journal_mode = WAL')
    
    return conn
```

### **4. Mots de passe sécurisés**
```python
import bcrypt

def hash_password(password):
    # Hash sécurisé avec bcrypt
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt)

def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed)
```

---

## 💾 **SAUVEGARDE AUTOMATIQUE SIMPLE**

### **1. Script de sauvegarde quotidienne**
```python
import shutil
import datetime
import os

def daily_backup():
    # Nom avec date
    today = datetime.date.today().strftime('%Y-%m-%d')
    backup_name = f"animmedia_backup_{today}.db"
    
    # Copie sécurisée
    shutil.copy2('animmedia.db', f'backups/{backup_name}')
    
    # Conserver seulement 30 jours
    cleanup_old_backups()

def cleanup_old_backups():
    # Supprimer les sauvegardes > 30 jours
    cutoff = datetime.date.today() - datetime.timedelta(days=30)
    # ... logique de nettoyage
```

### **2. Sauvegarde vers le cloud**
```python
# Synchronisation simple vers Google Drive, Dropbox, etc.
def sync_to_cloud():
    # Upload de la sauvegarde vers le cloud
    # Utilisation d'APIs simples (Google Drive, Dropbox)
    pass
```

---

## 🚀 **MIGRATION SIMPLE DEPUIS JSON**

### **Étape 1 : Script de migration**
```python
import json
import sqlite3

def migrate_from_json():
    # Lire les données JSON actuelles
    with open('data/events.json', 'r') as f:
        events_data = json.load(f)
    
    with open('data/members.json', 'r') as f:
        members_data = json.load(f)
    
    # Créer la base SQLite
    conn = sqlite3.connect('animmedia.db')
    
    # Migrer les événements
    for event in events_data['events']:
        conn.execute('''
            INSERT INTO events (title, description, event_type, event_date, event_time, location, max_participants, price)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (event['title'], event['description'], event['type'], event['date'], event['time'], 
              event['location'], event['maxParticipants'], event['price']))
    
    # Migrer les membres
    for member in members_data['members']:
        conn.execute('''
            INSERT INTO users (first_name, last_name, email, phone, membership_type)
            VALUES (?, ?, ?, ?, ?)
        ''', (member['firstName'], member['lastName'], member['email'], 
              member['phone'], member['membershipType']))
    
    conn.commit()
    conn.close()
```

---

## 📋 **AVANTAGES DE CETTE APPROCHE**

### ✅ **Simplicité maximale**
- **6 tables seulement** vs 15 dans le schéma complet
- **Champs essentiels uniquement**
- **Relations simples et claires**
- **Maintenance facile**

### ✅ **Sécurité robuste**
- **Chiffrement des données sensibles**
- **Validation stricte des entrées**
- **Mots de passe hashés avec bcrypt**
- **Logs d'audit pour traçabilité**

### ✅ **Fiabilité**
- **SQLite = très stable**
- **Sauvegardes automatiques quotidiennes**
- **Un seul fichier à gérer**
- **Mode WAL pour la robustesse**

### ✅ **Performance**
- **Optimisé pour <10,000 enregistrements**
- **Index automatiques sur les clés**
- **Requêtes simples et rapides**

---

## 🎯 **RECOMMANDATION POUR ANIM'MÉDIA**

### **Phase actuelle :** Rester avec JSON étendu ✅
- Votre système actuel fonctionne parfaitement
- Ajout des fichiers `members.json` et `registrations.json` suffit

### **Migration vers SQLite simple quand :**
- **>100 adhérents actifs**
- **>50 événements par an**
- **Besoin d'inscriptions en ligne automatiques**
- **Demande de statistiques avancées**

### **Seuil critique pour migration :**
- **Données deviennent lentes à charger**
- **Modifications simultanées fréquentes**
- **Besoin de recherche complexe**

Cette approche vous donne **le meilleur des deux mondes** : simplicité du JSON aujourd'hui, avec une voie d'évolution claire et sécurisée vers SQLite quand nécessaire ! 🚀