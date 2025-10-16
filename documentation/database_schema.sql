-- =============================================
-- SCHÉMA DE BASE DE DONNÉES ANIM'MÉDIA
-- Structure complète pour une association culturelle
-- =============================================

-- ============================================= 
-- TABLE: UTILISATEURS (MEMBRES & STAFF)
-- =============================================
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    
    -- Informations personnelles
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    
    -- Adresse
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(10),
    country VARCHAR(100) DEFAULT 'France',
    
    -- Informations d'adhésion
    member_number VARCHAR(20) UNIQUE,
    membership_type_id INTEGER,
    membership_start_date DATE,
    membership_end_date DATE,
    membership_status ENUM('active', 'expired', 'suspended', 'cancelled') DEFAULT 'active',
    
    -- Informations techniques
    role ENUM('member', 'instructor', 'admin', 'super_admin') DEFAULT 'member',
    password_hash VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    
    -- Préférences
    preferences JSON, -- Types d'activités préférées, notifications, etc.
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    
    -- Données de suivi
    total_events_attended INTEGER DEFAULT 0,
    total_amount_paid DECIMAL(10,2) DEFAULT 0.00,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (membership_type_id) REFERENCES membership_types(id)
);

-- ============================================= 
-- TABLE: TYPES D'ADHÉSION
-- =============================================
CREATE TABLE membership_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(8,2) NOT NULL,
    duration_days INTEGER NOT NULL, -- Durée en jours
    benefits JSON, -- Avantages inclus
    max_events_per_month INTEGER,
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================= 
-- TABLE: ÉVÉNEMENTS
-- =============================================
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    
    -- Informations de base
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    
    -- Classification
    event_type_id INTEGER NOT NULL,
    category_id INTEGER,
    level ENUM('beginner', 'intermediate', 'advanced', 'all_levels') DEFAULT 'all_levels',
    
    -- Programmation
    start_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_date DATE,
    end_time TIME,
    duration_minutes INTEGER,
    
    -- Lieu
    location_id INTEGER,
    room VARCHAR(100),
    
    -- Participants
    max_participants INTEGER,
    min_participants INTEGER DEFAULT 1,
    current_participants INTEGER DEFAULT 0,
    waiting_list_enabled BOOLEAN DEFAULT TRUE,
    
    -- Finances
    price DECIMAL(8,2) DEFAULT 0.00,
    member_price DECIMAL(8,2),
    materials_included BOOLEAN DEFAULT FALSE,
    materials_cost DECIMAL(8,2) DEFAULT 0.00,
    
    -- Staff
    instructor_id INTEGER,
    assistant_id INTEGER,
    
    -- Médias
    featured_image VARCHAR(255),
    gallery_images JSON,
    
    -- Statut et publication
    status ENUM('draft', 'published', 'cancelled', 'completed', 'full') DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    publish_date TIMESTAMP,
    registration_deadline TIMESTAMP,
    
    -- Métadonnées
    tags JSON,
    requirements TEXT,
    what_to_bring TEXT,
    additional_info TEXT,
    
    -- Données de suivi
    views_count INTEGER DEFAULT 0,
    registrations_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0.00,
    rating_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (event_type_id) REFERENCES event_types(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (location_id) REFERENCES locations(id),
    FOREIGN KEY (instructor_id) REFERENCES users(id),
    FOREIGN KEY (assistant_id) REFERENCES users(id)
);

-- ============================================= 
-- TABLE: TYPES D'ÉVÉNEMENTS
-- =============================================
CREATE TABLE event_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7), -- Code couleur hexadécimal
    icon VARCHAR(50), -- Classe FontAwesome
    default_duration INTEGER, -- Durée par défaut en minutes
    default_price DECIMAL(8,2),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================= 
-- TABLE: CATÉGORIES
-- =============================================
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- ============================================= 
-- TABLE: LIEUX
-- =============================================
CREATE TABLE locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Adresse
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(10),
    country VARCHAR(100) DEFAULT 'France',
    
    -- Coordonnées
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Capacité et équipements
    max_capacity INTEGER,
    rooms JSON, -- Liste des salles disponibles
    equipment JSON, -- Équipements disponibles
    
    -- Contact
    contact_person VARCHAR(255),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    
    -- Informations pratiques
    parking_info TEXT,
    accessibility_info TEXT,
    public_transport_info TEXT,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================= 
-- TABLE: INSCRIPTIONS
-- =============================================
CREATE TABLE registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    
    -- Relations
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    
    -- Statut d'inscription
    status ENUM('pending', 'confirmed', 'cancelled', 'no_show', 'completed') DEFAULT 'pending',
    registration_type ENUM('normal', 'waiting_list', 'staff', 'guest') DEFAULT 'normal',
    
    -- Informations de paiement
    amount_paid DECIMAL(8,2) DEFAULT 0.00,
    payment_status ENUM('pending', 'partial', 'paid', 'refunded') DEFAULT 'pending',
    payment_method ENUM('cash', 'card', 'transfer', 'check', 'free') DEFAULT 'cash',
    payment_reference VARCHAR(255),
    
    -- Dates importantes
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    
    -- Informations supplémentaires
    notes TEXT,
    special_requirements TEXT,
    emergency_contact JSON,
    
    -- Feedback
    attended BOOLEAN,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    feedback_date TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_registration (event_id, user_id)
);

-- ============================================= 
-- TABLE: LISTE D'ATTENTE
-- =============================================
CREATE TABLE waiting_list (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    position INTEGER NOT NULL,
    status ENUM('waiting', 'offered', 'confirmed', 'declined', 'expired') DEFAULT 'waiting',
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    offered_at TIMESTAMP,
    expires_at TIMESTAMP,
    notes TEXT,
    
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_waiting (event_id, user_id)
);

-- ============================================= 
-- TABLE: PAIEMENTS
-- =============================================
CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    
    -- Relations
    user_id INTEGER NOT NULL,
    registration_id INTEGER,
    membership_id INTEGER,
    
    -- Informations de paiement
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    payment_type ENUM('registration', 'membership', 'materials', 'donation', 'other') NOT NULL,
    payment_method ENUM('cash', 'card', 'transfer', 'check', 'online') NOT NULL,
    
    -- Statut et références
    status ENUM('pending', 'completed', 'failed', 'refunded', 'cancelled') DEFAULT 'pending',
    external_reference VARCHAR(255), -- Référence banque/Stripe/etc
    internal_reference VARCHAR(255), -- Référence interne
    
    -- Dates
    payment_date TIMESTAMP,
    processed_at TIMESTAMP,
    refunded_at TIMESTAMP,
    
    -- Métadonnées
    description TEXT,
    receipt_number VARCHAR(100) UNIQUE,
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (registration_id) REFERENCES registrations(id),
    FOREIGN KEY (membership_id) REFERENCES membership_types(id)
);

-- ============================================= 
-- TABLE: COMMUNICATIONS
-- =============================================
CREATE TABLE communications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    
    -- Type et contenu
    type ENUM('newsletter', 'notification', 'reminder', 'announcement', 'welcome', 'feedback_request') NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    content_html TEXT,
    
    -- Envoi
    sender_id INTEGER,
    status ENUM('draft', 'scheduled', 'sending', 'sent', 'failed') DEFAULT 'draft',
    
    -- Programmation
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    
    -- Ciblage
    target_type ENUM('all', 'members', 'instructors', 'event_participants', 'custom') DEFAULT 'all',
    target_criteria JSON, -- Critères de sélection
    
    -- Statistiques
    recipients_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    unsubscribed_count INTEGER DEFAULT 0,
    
    -- Métadonnées
    template_used VARCHAR(255),
    attachments JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- ============================================= 
-- TABLE: HISTORIQUE DES COMMUNICATIONS
-- =============================================
CREATE TABLE communication_recipients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    communication_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    
    -- Statut d'envoi
    status ENUM('pending', 'sent', 'delivered', 'opened', 'clicked', 'failed', 'unsubscribed') DEFAULT 'pending',
    
    -- Tracking
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    failed_reason TEXT,
    
    -- Métadonnées
    email_address VARCHAR(255),
    user_agent TEXT,
    ip_address VARCHAR(45),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (communication_id) REFERENCES communications(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================= 
-- TABLE: MÉDIAS / GALERIE
-- =============================================
CREATE TABLE media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    
    -- Informations du fichier
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(64), -- Hash pour éviter les doublons
    
    -- Classification
    type ENUM('image', 'video', 'audio', 'document') NOT NULL,
    category VARCHAR(100),
    
    -- Métadonnées
    title VARCHAR(255),
    description TEXT,
    alt_text VARCHAR(255),
    tags JSON,
    
    -- Relations
    uploader_id INTEGER NOT NULL,
    event_id INTEGER, -- Si lié à un événement
    
    -- Statut
    status ENUM('private', 'public', 'archived') DEFAULT 'private',
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Données techniques (pour images)
    width INTEGER,
    height INTEGER,
    thumbnail_path VARCHAR(500),
    
    -- Utilisation
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (uploader_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);

-- ============================================= 
-- TABLE: ÉVALUATIONS / FEEDBACK
-- =============================================
CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Relations
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    registration_id INTEGER NOT NULL,
    
    -- Évaluation
    overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    content_rating INTEGER CHECK (content_rating >= 1 AND content_rating <= 5),
    instructor_rating INTEGER CHECK (instructor_rating >= 1 AND instructor_rating <= 5),
    organization_rating INTEGER CHECK (organization_rating >= 1 AND organization_rating <= 5),
    venue_rating INTEGER CHECK (venue_rating >= 1 AND venue_rating <= 5),
    
    -- Commentaires
    comment TEXT,
    suggestions TEXT,
    would_recommend BOOLEAN,
    
    -- Statut
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Modération
    reviewed_by INTEGER,
    reviewed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (registration_id) REFERENCES registrations(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id),
    
    UNIQUE KEY unique_review (event_id, user_id)
);

-- ============================================= 
-- TABLE: RESSOURCES / DOCUMENTS
-- =============================================
CREATE TABLE resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    
    -- Informations de base
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('document', 'link', 'video', 'tutorial') NOT NULL,
    
    -- Contenu
    file_path VARCHAR(500),
    external_url VARCHAR(500),
    content TEXT,
    
    -- Classification
    category VARCHAR(100),
    tags JSON,
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    
    -- Relations
    event_id INTEGER, -- Si lié à un événement
    created_by INTEGER NOT NULL,
    
    -- Accès
    access_level ENUM('public', 'members', 'participants', 'instructors') DEFAULT 'members',
    is_downloadable BOOLEAN DEFAULT TRUE,
    
    -- Statistiques
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ============================================= 
-- TABLE: PARAMÈTRES / CONFIGURATION
-- =============================================
CREATE TABLE settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'integer', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE, -- Visible côté public
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================= 
-- TABLE: LOGS / AUDIT
-- =============================================
CREATE TABLE activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Qui et quoi
    user_id INTEGER,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100), -- 'event', 'user', 'registration', etc.
    entity_id INTEGER,
    
    -- Détails
    description TEXT,
    changes JSON, -- Ancien/nouveau état
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Niveau et catégorie
    level ENUM('info', 'warning', 'error', 'critical') DEFAULT 'info',
    category VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ============================================= 
-- TABLE: SESSIONS
-- =============================================
CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INTEGER,
    ip_address VARCHAR(45),
    user_agent TEXT,
    payload TEXT NOT NULL,
    last_activity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- INDEX POUR PERFORMANCE
-- =============================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_member_number ON users(member_number);
CREATE INDEX idx_users_membership_status ON users(membership_status);

-- Events
CREATE INDEX idx_events_date ON events(start_date, start_time);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_type ON events(event_type_id);
CREATE INDEX idx_events_instructor ON events(instructor_id);

-- Registrations
CREATE INDEX idx_registrations_event ON registrations(event_id);
CREATE INDEX idx_registrations_user ON registrations(user_id);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_date ON registrations(registered_at);

-- Payments
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_payments_status ON payments(status);

-- Communications
CREATE INDEX idx_communications_type ON communications(type);
CREATE INDEX idx_communications_status ON communications(status);
CREATE INDEX idx_communications_scheduled ON communications(scheduled_at);

-- Media
CREATE INDEX idx_media_type ON media(type);
CREATE INDEX idx_media_event ON media(event_id);
CREATE INDEX idx_media_uploader ON media(uploader_id);

-- Activity Logs
CREATE INDEX idx_logs_user ON activity_logs(user_id);
CREATE INDEX idx_logs_date ON activity_logs(created_at);
CREATE INDEX idx_logs_entity ON activity_logs(entity_type, entity_id);