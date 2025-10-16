-- =============================================
-- BASE DE DONNÉES SIMPLE ET SÉCURISÉE
-- Anim'Média La Guerche-sur-l'Aubois
-- SQLite optimisé pour association locale
-- =============================================

-- =============================================
-- CONFIGURATION SÉCURISÉE
-- =============================================
PRAGMA foreign_keys = ON;          -- Activer les contraintes
PRAGMA journal_mode = WAL;         -- Mode journal sécurisé
PRAGMA synchronous = FULL;         -- Synchronisation complète
PRAGMA secure_delete = ON;         -- Suppression sécurisée

-- =============================================
-- 1. UTILISATEURS (Membres et Admins)
-- =============================================
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Informations personnelles essentielles
    first_name TEXT NOT NULL CHECK(length(first_name) >= 2),
    last_name TEXT NOT NULL CHECK(length(last_name) >= 2),
    email TEXT UNIQUE NOT NULL CHECK(email LIKE '%@%.%'),
    phone TEXT CHECK(phone IS NULL OR length(phone) >= 10),
    
    -- Adhésion simplifiée
    membership_type TEXT DEFAULT 'ponctuel' CHECK(membership_type IN ('annuel', 'mensuel', 'ponctuel')),
    membership_expires DATE,
    membership_paid DECIMAL(8,2) DEFAULT 0,
    
    -- Sécurité (seulement pour admins)
    password_hash TEXT, -- bcrypt hash pour admins uniquement
    role TEXT DEFAULT 'member' CHECK(role IN ('member', 'admin')),
    last_login DATETIME,
    
    -- Données système
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    
    -- RGPD
    consent_date DATETIME, -- Date de consentement RGPD
    consent_newsletter BOOLEAN DEFAULT 0
);

-- Index pour performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_membership ON users(membership_type, membership_expires);

-- =============================================
-- 2. ÉVÉNEMENTS
-- =============================================
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Informations essentielles
    title TEXT NOT NULL CHECK(length(title) >= 3),
    description TEXT,
    event_type TEXT NOT NULL CHECK(event_type IN ('atelier', 'formation', 'exposition', 'conference', 'sortie')),
    
    -- Planning
    event_date DATE NOT NULL CHECK(event_date >= date('now')),
    event_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 120 CHECK(duration_minutes > 0),
    
    -- Lieu et capacité
    location TEXT NOT NULL,
    room TEXT,
    max_participants INTEGER DEFAULT 10 CHECK(max_participants > 0),
    current_participants INTEGER DEFAULT 0 CHECK(current_participants >= 0),
    
    -- Finances
    price DECIMAL(8,2) DEFAULT 0 CHECK(price >= 0),
    member_discount DECIMAL(5,2) DEFAULT 0 CHECK(member_discount >= 0 AND member_discount <= 100),
    
    -- Gestion
    instructor_name TEXT,
    materials_needed TEXT,
    notes TEXT,
    
    -- Statut
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'cancelled', 'completed', 'full')),
    
    -- Système
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index pour performance
CREATE INDEX idx_events_date ON events(event_date, event_time);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_status ON events(status);

-- =============================================
-- 3. INSCRIPTIONS
-- =============================================
CREATE TABLE registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Relations
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    
    -- Statut inscription
    status TEXT DEFAULT 'confirmed' CHECK(status IN ('confirmed', 'cancelled', 'attended', 'absent')),
    
    -- Paiement
    amount_paid DECIMAL(8,2) DEFAULT 0 CHECK(amount_paid >= 0),
    payment_method TEXT CHECK(payment_method IN ('cash', 'card', 'transfer', 'check', 'free')),
    payment_date DATETIME,
    
    -- Informations pratiques
    special_needs TEXT,
    emergency_contact TEXT,
    
    -- Feedback simple
    rating INTEGER CHECK(rating IS NULL OR (rating >= 1 AND rating <= 5)),
    comment TEXT,
    
    -- Système
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Contraintes
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(event_id, user_id) -- Pas de doublon d'inscription
);

-- Index pour performance
CREATE INDEX idx_registrations_event ON registrations(event_id);
CREATE INDEX idx_registrations_user ON registrations(user_id);
CREATE INDEX idx_registrations_status ON registrations(status);

-- =============================================
-- 4. PAIEMENTS
-- =============================================
CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Relations
    user_id INTEGER NOT NULL,
    registration_id INTEGER, -- NULL pour adhésions
    
    -- Détails paiement
    amount DECIMAL(8,2) NOT NULL CHECK(amount > 0),
    payment_type TEXT NOT NULL CHECK(payment_type IN ('event', 'membership', 'material')),
    payment_method TEXT NOT NULL CHECK(payment_method IN ('cash', 'card', 'transfer', 'check')),
    
    -- Informations
    description TEXT NOT NULL,
    receipt_number TEXT UNIQUE, -- Numéro de reçu unique
    
    -- Dates
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Système
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Contraintes
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (registration_id) REFERENCES registrations(id)
);

-- Index pour performance
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_payments_type ON payments(payment_type);

-- =============================================
-- 5. COMMUNICATIONS
-- =============================================
CREATE TABLE communications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Contenu
    subject TEXT NOT NULL CHECK(length(subject) >= 3),
    content TEXT NOT NULL,
    type TEXT DEFAULT 'newsletter' CHECK(type IN ('newsletter', 'reminder', 'welcome', 'info')),
    
    -- Ciblage simple
    target_group TEXT DEFAULT 'all' CHECK(target_group IN ('all', 'members', 'participants')),
    
    -- Envoi
    sent_to_count INTEGER DEFAULT 0 CHECK(sent_to_count >= 0),
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Statistiques simples
    opened_count INTEGER DEFAULT 0 CHECK(opened_count >= 0),
    
    -- Système
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index pour performance
CREATE INDEX idx_communications_type ON communications(type);
CREATE INDEX idx_communications_date ON communications(sent_at);

-- =============================================
-- 6. LOGS SYSTÈME (Audit de sécurité)
-- =============================================
CREATE TABLE system_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Qui et quoi
    user_id INTEGER, -- NULL pour actions système
    action TEXT NOT NULL,
    entity_type TEXT, -- 'user', 'event', 'registration', etc.
    entity_id INTEGER,
    
    -- Détails
    details TEXT,
    ip_address TEXT,
    
    -- Niveau de sécurité
    severity TEXT DEFAULT 'info' CHECK(severity IN ('info', 'warning', 'error', 'security')),
    
    -- Système
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Contraintes
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Index pour performance et sécurité
CREATE INDEX idx_logs_user ON system_logs(user_id);
CREATE INDEX idx_logs_date ON system_logs(created_at);
CREATE INDEX idx_logs_severity ON system_logs(severity);

-- =============================================
-- TRIGGERS DE SÉCURITÉ ET COHÉRENCE
-- =============================================

-- Trigger : Mettre à jour updated_at automatiquement
CREATE TRIGGER update_users_timestamp 
    AFTER UPDATE ON users
    FOR EACH ROW
BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_events_timestamp 
    AFTER UPDATE ON events
    FOR EACH ROW
BEGIN
    UPDATE events SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_registrations_timestamp 
    AFTER UPDATE ON registrations
    FOR EACH ROW
BEGIN
    UPDATE registrations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger : Mettre à jour le nombre de participants
CREATE TRIGGER update_event_participants_add
    AFTER INSERT ON registrations
    WHEN NEW.status = 'confirmed'
BEGIN
    UPDATE events 
    SET current_participants = current_participants + 1 
    WHERE id = NEW.event_id;
END;

CREATE TRIGGER update_event_participants_remove
    AFTER UPDATE ON registrations
    WHEN OLD.status = 'confirmed' AND NEW.status != 'confirmed'
BEGIN
    UPDATE events 
    SET current_participants = current_participants - 1 
    WHERE id = NEW.event_id;
END;

-- Trigger : Log automatique des actions sensibles
CREATE TRIGGER log_user_creation
    AFTER INSERT ON users
BEGIN
    INSERT INTO system_logs (user_id, action, entity_type, entity_id, details)
    VALUES (NEW.id, 'USER_CREATED', 'user', NEW.id, 'Nouvel utilisateur: ' || NEW.first_name || ' ' || NEW.last_name);
END;

CREATE TRIGGER log_event_creation
    AFTER INSERT ON events
BEGIN
    INSERT INTO system_logs (action, entity_type, entity_id, details)
    VALUES ('EVENT_CREATED', 'event', NEW.id, 'Nouvel événement: ' || NEW.title);
END;

CREATE TRIGGER log_registration
    AFTER INSERT ON registrations
BEGIN
    INSERT INTO system_logs (user_id, action, entity_type, entity_id, details)
    VALUES (NEW.user_id, 'USER_REGISTERED', 'registration', NEW.id, 'Inscription à l''événement ID: ' || NEW.event_id);
END;

-- Trigger : Vérifier la capacité des événements
CREATE TRIGGER check_event_capacity
    BEFORE INSERT ON registrations
    WHEN NEW.status = 'confirmed'
BEGIN
    SELECT CASE
        WHEN (SELECT current_participants FROM events WHERE id = NEW.event_id) >= 
             (SELECT max_participants FROM events WHERE id = NEW.event_id)
        THEN RAISE(ABORT, 'Événement complet - capacité maximale atteinte')
    END;
END;

-- =============================================
-- VUES UTILES POUR SIMPLIFIER LES REQUÊTES
-- =============================================

-- Vue : Événements avec nombre d'inscrits
CREATE VIEW events_with_stats AS
SELECT 
    e.*,
    COUNT(r.id) as total_registrations,
    COUNT(CASE WHEN r.status = 'confirmed' THEN 1 END) as confirmed_registrations,
    ROUND(AVG(r.rating), 1) as average_rating,
    (e.max_participants - e.current_participants) as places_remaining
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id
GROUP BY e.id;

-- Vue : Membres actifs avec statistiques
CREATE VIEW active_members AS
SELECT 
    u.*,
    COUNT(r.id) as total_events_attended,
    SUM(p.amount) as total_paid,
    MAX(r.registered_at) as last_registration
FROM users u
LEFT JOIN registrations r ON u.id = r.user_id AND r.status = 'attended'
LEFT JOIN payments p ON u.id = p.user_id
WHERE u.is_active = 1
GROUP BY u.id;

-- Vue : Rapport financier mensuel
CREATE VIEW monthly_revenue AS
SELECT 
    strftime('%Y-%m', payment_date) as month,
    payment_type,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount
FROM payments
GROUP BY strftime('%Y-%m', payment_date), payment_type
ORDER BY month DESC;

-- =============================================
-- DONNÉES INITIALES SÉCURISÉES
-- =============================================

-- Utilisateur admin par défaut (mot de passe à changer !)
INSERT INTO users (first_name, last_name, email, role, password_hash, consent_date) 
VALUES ('Admin', 'Principal', 'admin@animmedia.com', 'admin', 
        '$2b$12$dummy.hash.to.replace', CURRENT_TIMESTAMP);

-- Log de création de la base
INSERT INTO system_logs (action, details) 
VALUES ('DATABASE_CREATED', 'Base de données Anim''Média initialisée');

-- =============================================
-- PROCÉDURES DE MAINTENANCE
-- =============================================

-- Nettoyage automatique des logs (garder 1 an)
-- À exécuter mensuellement
-- DELETE FROM system_logs WHERE created_at < date('now', '-1 year');

-- Optimisation de la base
-- À exécuter trimestriellement  
-- VACUUM;
-- ANALYZE;