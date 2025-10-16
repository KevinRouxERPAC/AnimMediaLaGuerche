-- =============================================
-- EXEMPLES DE DONNÉES POUR ANIM'MÉDIA
-- Jeu de données de démonstration
-- =============================================

-- =============================================
-- TYPES D'ADHÉSION
-- =============================================
INSERT INTO membership_types (name, description, price, duration_days, benefits, max_events_per_month, discount_percentage) VALUES
('Adhésion Annuelle', 'Adhésion complète pour une année', 25.00, 365, '["Accès à tous les ateliers", "Réductions sur les formations", "Newsletter mensuelle", "Priorité d\'inscription"]', NULL, 15.00),
('Adhésion Mensuelle', 'Adhésion pour un mois', 3.00, 30, '["Accès aux ateliers du mois", "Newsletter mensuelle"]', 4, 0.00),
('Adhésion Étudiante', 'Tarif préférentiel pour les étudiants', 15.00, 365, '["Accès à tous les ateliers", "Newsletter mensuelle"]', NULL, 20.00),
('Participation Ponctuelle', 'Sans adhésion', 0.00, 1, '["Accès à un événement spécifique"]', 0, 0.00);

-- =============================================
-- TYPES D'ÉVÉNEMENTS
-- =============================================
INSERT INTO event_types (name, slug, description, color, icon, default_duration, default_price) VALUES
('Atelier', 'atelier', 'Ateliers créatifs et pratiques', '#3B82F6', 'fas fa-hands-helping', 120, 15.00),
('Formation', 'formation', 'Formations techniques et pédagogiques', '#F59E0B', 'fas fa-graduation-cap', 180, 20.00),
('Exposition', 'exposition', 'Expositions artistiques et culturelles', '#8B5CF6', 'fas fa-image', 120, 0.00),
('Conférence', 'conference', 'Conférences et débats', '#10B981', 'fas fa-microphone', 90, 5.00),
('Sortie', 'sortie', 'Sorties culturelles et découvertes', '#EF4444', 'fas fa-map-marked-alt', 240, 25.00);

-- =============================================
-- CATÉGORIES
-- =============================================
INSERT INTO categories (name, slug, description, parent_id) VALUES
('Arts Créatifs', 'arts-creatifs', 'Tous les ateliers créatifs et artistiques', NULL),
('Numérique', 'numerique', 'Formations et ateliers numériques', NULL),
('Culture', 'culture', 'Événements culturels et patrimoine', NULL),
('Scrapbooking', 'scrapbooking', 'Ateliers de scrapbooking', 1),
('Peinture', 'peinture', 'Ateliers de peinture', 1),
('Informatique', 'informatique', 'Formations informatiques', 2),
('Photographie', 'photographie', 'Ateliers et formations photo', 2),
('Histoire Locale', 'histoire-locale', 'Histoire et patrimoine local', 3);

-- =============================================
-- LIEUX
-- =============================================
INSERT INTO locations (name, description, address_line1, city, postal_code, max_capacity, rooms, equipment, contact_person, contact_phone) VALUES
('Médiathèque de La Guerche-sur-l''Aubois', 'Lieu principal des activités de l''association', 'Maison des Associations', 'La Guerche-sur-l''Aubois', '18150', 50, '["Salle principale", "Salle informatique", "Atelier créatif", "Salle de réunion"]', '["Vidéoprojecteur", "Ordinateurs", "Tables modulables", "Matériel créatif", "Sonorisation"]', 'Marie Responsable', '02 48 80 00 00'),
('Salle des Fêtes', 'Grande salle pour les événements', '1 Place de la République', 'La Guerche-sur-l''Aubois', '18150', 200, '["Grande salle", "Cuisine", "Vestiaires"]', '["Sonorisation", "Scène", "Tables et chaises"]', 'Jean Concierge', '02 48 80 00 01');

-- =============================================
-- UTILISATEURS EXEMPLES
-- =============================================
INSERT INTO users (uuid, first_name, last_name, email, phone, birth_date, address_line1, city, postal_code, member_number, membership_type_id, membership_start_date, membership_end_date, role, preferences, emergency_contact_name, emergency_contact_phone) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Marie', 'Dupont', 'marie.dupont@email.com', '06 12 34 56 78', '1975-03-15', '15 Rue de la Paix', 'La Guerche-sur-l''Aubois', '18150', 'ADH001', 1, '2025-01-01', '2025-12-31', 'member', '["atelier", "formation"]', 'Pierre Dupont', '06 12 34 56 79'),
('550e8400-e29b-41d4-a716-446655440002', 'Jean', 'Martin', 'jean.martin@email.com', '06 98 76 54 32', '1962-08-22', '42 Avenue des Roses', 'La Guerche-sur-l''Aubois', '18150', 'ADH002', 1, '2024-09-01', '2025-08-31', 'member', '["formation", "conference"]', 'Sylvie Martin', '06 98 76 54 33'),
('550e8400-e29b-41d4-a716-446655440003', 'Sophie', 'Dubois', 'sophie.dubois@email.com', '06 45 67 89 12', '1988-11-03', '8 Place du Marché', 'La Guerche-sur-l''Aubois', '18150', 'ADH003', 2, '2025-10-01', '2025-10-31', 'member', '["atelier", "exposition"]', 'Paul Dubois', '06 45 67 89 13'),
('550e8400-e29b-41d4-a716-446655440004', 'Claire', 'Lemoine', 'claire.lemoine@email.com', '06 33 44 55 66', '1980-05-12', '25 Rue Victor Hugo', 'La Guerche-sur-l''Aubois', '18150', 'INST001', 1, '2025-01-01', '2025-12-31', 'instructor', '["atelier", "formation"]', 'Marc Lemoine', '06 33 44 55 67'),
('550e8400-e29b-41d4-a716-446655440005', 'Admin', 'Principal', 'admin@animmedia.com', '02 48 80 00 00', '1970-01-01', 'Maison des Associations', 'La Guerche-sur-l''Aubois', '18150', 'ADMIN', 1, '2025-01-01', '2025-12-31', 'admin', '[]', 'Secrétariat', '02 48 80 00 01');

-- =============================================
-- ÉVÉNEMENTS EXEMPLES
-- =============================================
INSERT INTO events (uuid, title, slug, description, short_description, event_type_id, category_id, start_date, start_time, end_time, duration_minutes, location_id, room, max_participants, min_participants, price, member_price, instructor_id, featured_image, status, tags, requirements, what_to_bring) VALUES
('evt-550e8400-e29b-41d4-a716-446655440001', 'Atelier Scrapbooking Débutant', 'atelier-scrapbooking-debutant', 'Découvrez l''art du scrapbooking ! Créez vos premiers albums photos personnalisés avec des techniques simples et créatives. Cet atelier s''adresse aux débutants qui souhaitent s''initier à cette pratique relaxante et créative.', 'Découvrez l''art du scrapbooking avec des techniques simples et créatives.', 1, 4, '2025-10-22', '14:00:00', '16:00:00', 120, 1, 'Atelier créatif', 8, 3, 15.00, 12.00, 4, 'assets/images/events/scrapbooking-001.jpg', 'published', '["créatif", "scrapbooking", "débutant", "relaxation"]', 'Aucun prérequis nécessaire', 'Photos personnelles (10-15), ciseaux si vous en avez'),
('evt-550e8400-e29b-41d4-a716-446655440002', 'Formation Informatique : Tablette Android', 'formation-informatique-tablette-android', 'Apprenez à utiliser votre tablette Android de manière optimale. Cette formation couvre les applications essentielles, la navigation internet sécurisée, la gestion des photos et vidéos, ainsi que les paramètres de sécurité.', 'Maîtrisez votre tablette Android : apps, internet, photos et sécurité.', 2, 6, '2025-10-25', '10:00:00', '13:00:00', 180, 1, 'Salle informatique', 6, 2, 20.00, 15.00, 2, 'assets/images/events/formation-tablette.jpg', 'published', '["numérique", "tablette", "android", "formation"]', 'Posséder une tablette Android', 'Votre tablette Android, chargeur, carnet de notes'),
('evt-550e8400-e29b-41d4-a716-446655440003', 'Exposition Photos : La Guerche à travers l''objectif', 'exposition-photos-la-guerche-objectif', 'Découvrez une collection unique de photographies historiques et contemporaines de La Guerche-sur-l''Aubois et ses environs. Cette exposition retrace l''évolution de notre commune à travers les décennies.', 'Collection de photos historiques et contemporaines de La Guerche.', 3, 8, '2025-11-05', '18:00:00', '20:00:00', 120, 1, 'Salle principale', 50, 1, 0.00, 0.00, NULL, 'assets/images/events/expo-photos.jpg', 'published', '["exposition", "histoire", "photographie", "patrimoine"]', 'Tout public', 'Aucun'),
('evt-550e8400-e29b-41d4-a716-446655440004', 'Atelier Cuisine : Biscuits de Noël', 'atelier-cuisine-biscuits-noel', 'Préparez les fêtes de fin d''année en apprenant à réaliser de délicieux biscuits de Noël traditionnels et modernes. Techniques de pâtisserie, décoration et conservation seront au programme.', 'Réalisez de délicieux biscuits de Noël traditionnels et modernes.', 1, 1, '2025-12-10', '14:30:00', '17:00:00', 150, 1, 'Atelier créatif', 10, 4, 12.00, 10.00, 4, 'assets/images/events/cuisine-noel.jpg', 'published', '["cuisine", "noël", "traditionnel", "pâtisserie"]', 'Aucun prérequis', 'Tablier, boîtes de conservation'),
('evt-550e8400-e29b-41d4-a716-446655440005', 'Conférence : L''Histoire de La Guerche', 'conference-histoire-la-guerche', 'Plongez dans l''histoire fascinante de notre commune avec l''historien local Pierre Moreau. De la fondation médiévale aux défis contemporains, découvrez les événements qui ont façonné La Guerche-sur-l''Aubois.', 'Histoire fascinante de La Guerche avec l''historien Pierre Moreau.', 4, 8, '2025-11-18', '16:00:00', '17:30:00', 90, 1, 'Salle principale', 40, 1, 5.00, 3.00, NULL, 'assets/images/events/conference-histoire.jpg', 'published', '["histoire", "conférence", "patrimoine", "local"]', 'Tout public', 'Carnet de notes si souhaité');

-- =============================================
-- INSCRIPTIONS EXEMPLES
-- =============================================
INSERT INTO registrations (uuid, event_id, user_id, status, amount_paid, payment_status, payment_method, registered_at, confirmed_at, notes, attended, rating, feedback) VALUES
('reg-550e8400-e29b-41d4-a716-446655440001', 1, 1, 'confirmed', 12.00, 'paid', 'cash', '2025-10-02 14:30:00', '2025-10-02 14:30:00', 'Première fois en scrapbooking', TRUE, 5, 'Excellent atelier, très bien expliqué !'),
('reg-550e8400-e29b-41d4-a716-446655440002', 1, 3, 'confirmed', 12.00, 'paid', 'card', '2025-10-05 10:15:00', '2025-10-05 10:15:00', '', TRUE, 4, 'Très créatif, j''ai adoré'),
('reg-550e8400-e29b-41d4-a716-446655440003', 2, 2, 'confirmed', 15.00, 'paid', 'transfer', '2025-10-08 16:45:00', '2025-10-08 16:45:00', 'Apporte sa propre tablette Samsung', NULL, NULL, NULL),
('reg-550e8400-e29b-41d4-a716-446655440004', 5, 2, 'confirmed', 3.00, 'paid', 'cash', '2025-10-10 11:20:00', '2025-10-10 11:20:00', 'Passionné d''histoire locale', NULL, NULL, NULL),
('reg-550e8400-e29b-41d4-a716-446655440005', 3, 3, 'confirmed', 0.00, 'paid', 'free', '2025-10-12 13:00:00', '2025-10-12 13:00:00', 'Exposition gratuite', NULL, NULL, NULL);

-- =============================================
-- PAIEMENTS EXEMPLES
-- =============================================
INSERT INTO payments (uuid, user_id, registration_id, amount, payment_type, payment_method, status, payment_date, description, receipt_number) VALUES
('pay-550e8400-e29b-41d4-a716-446655440001', 1, 1, 12.00, 'registration', 'cash', 'completed', '2025-10-02 14:30:00', 'Atelier Scrapbooking Débutant - Tarif membre', 'REC001'),
('pay-550e8400-e29b-41d4-a716-446655440002', 3, 2, 12.00, 'registration', 'card', 'completed', '2025-10-05 10:15:00', 'Atelier Scrapbooking Débutant - Tarif membre', 'REC002'),
('pay-550e8400-e29b-41d4-a716-446655440003', 2, 3, 15.00, 'registration', 'transfer', 'completed', '2025-10-08 16:45:00', 'Formation Tablette Android - Tarif membre', 'REC003'),
('pay-550e8400-e29b-41d4-a716-446655440004', 2, 4, 3.00, 'registration', 'cash', 'completed', '2025-10-10 11:20:00', 'Conférence Histoire - Tarif membre', 'REC004'),
('pay-550e8400-e29b-41d4-a716-446655440005', 1, NULL, 25.00, 'membership', 'transfer', 'completed', '2025-01-01 00:00:00', 'Adhésion Annuelle 2025', 'REC005'),
('pay-550e8400-e29b-41d4-a716-446655440006', 2, NULL, 25.00, 'membership', 'cash', 'completed', '2024-09-01 00:00:00', 'Adhésion Annuelle 2024-2025', 'REC006'),
('pay-550e8400-e29b-41d4-a716-446655440007', 3, NULL, 3.00, 'membership', 'card', 'completed', '2025-10-01 00:00:00', 'Adhésion Mensuelle Octobre 2025', 'REC007');

-- =============================================
-- COMMUNICATIONS EXEMPLES
-- =============================================
INSERT INTO communications (uuid, type, subject, content, sender_id, status, sent_at, target_type, recipients_count, opened_count, clicked_count) VALUES
('com-550e8400-e29b-41d4-a716-446655440001', 'newsletter', 'Newsletter Octobre 2025 - Nouveaux Ateliers', 'Découvrez nos nouveaux ateliers d''automne ! Ce mois-ci, nous vous proposons du scrapbooking, de la formation tablette et bien plus...', 5, 'sent', '2025-10-01 09:00:00', 'members', 156, 124, 45),
('com-550e8400-e29b-41d4-a716-446655440002', 'reminder', 'Rappel : Atelier Scrapbooking demain', 'N''oubliez pas votre atelier de scrapbooking demain à 14h. Pensez à apporter vos photos !', 5, 'sent', '2025-10-21 18:00:00', 'event_participants', 3, 3, 1),
('com-550e8400-e29b-41d4-a716-446655440003', 'welcome', 'Bienvenue à Anim''Média !', 'Bienvenue Sophie dans notre association ! Nous sommes ravis de vous accueillir...', 5, 'sent', '2025-10-01 10:30:00', 'custom', 1, 1, 0);

-- =============================================
-- MÉDIAS EXEMPLES
-- =============================================
INSERT INTO media (uuid, filename, original_filename, file_path, file_size, mime_type, type, title, description, uploader_id, event_id, status, width, height, thumbnail_path) VALUES
('med-550e8400-e29b-41d4-a716-446655440001', 'scrapbooking-001-2025.jpg', 'atelier_scrap_photo1.jpg', '/uploads/events/2025/10/scrapbooking-001-2025.jpg', 245760, 'image/jpeg', 'image', 'Atelier Scrapbooking - Participants au travail', 'Photo des participants durant l''atelier scrapbooking débutant', 4, 1, 'public', 1920, 1280, '/uploads/events/2025/10/thumb_scrapbooking-001-2025.jpg'),
('med-550e8400-e29b-41d4-a716-446655440002', 'formation-tablette-demo.jpg', 'demo_tablette.jpg', '/uploads/events/2025/10/formation-tablette-demo.jpg', 189440, 'image/jpeg', 'image', 'Formation Tablette - Démonstration', 'Photo de démonstration durant la formation tablette Android', 2, 2, 'public', 1600, 1200, '/uploads/events/2025/10/thumb_formation-tablette-demo.jpg'),
('med-550e8400-e29b-41d4-a716-446655440003', 'guerche-historique-1950.jpg', 'guerche_1950.jpg', '/uploads/gallery/2025/11/guerche-historique-1950.jpg', 156880, 'image/jpeg', 'image', 'La Guerche en 1950', 'Photo historique de La Guerche-sur-l''Aubois en 1950', 5, 3, 'public', 1024, 768, '/uploads/gallery/2025/11/thumb_guerche-historique-1950.jpg');

-- =============================================
-- ÉVALUATIONS EXEMPLES
-- =============================================
INSERT INTO reviews (event_id, user_id, registration_id, overall_rating, content_rating, instructor_rating, organization_rating, comment, suggestions, would_recommend, status) VALUES
(1, 1, 1, 5, 5, 5, 5, 'Excellent atelier ! Claire est une formatrice exceptionnelle qui sait expliquer les techniques avec patience. J''ai appris énormément et je repars avec de belles créations.', 'Peut-être prévoir un atelier niveau intermédiaire pour la suite ?', TRUE, 'approved'),
(1, 3, 2, 4, 4, 5, 4, 'Très bon atelier créatif. J''ai découvert le scrapbooking et c''est vraiment relaxant. Le matériel fourni était de qualité.', 'Un peu plus de temps serait apprécié pour finir les projets.', TRUE, 'approved');

-- =============================================
-- RESSOURCES EXEMPLES
-- =============================================
INSERT INTO resources (uuid, title, description, type, file_path, category, tags, difficulty_level, event_id, created_by, access_level) VALUES
('res-550e8400-e29b-41d4-a716-446655440001', 'Guide du Scrapbooking pour Débutants', 'Document PDF avec les techniques de base du scrapbooking, liste du matériel et idées créatives', 'document', '/uploads/resources/guide_scrapbooking_debutants.pdf', 'Guides', '["scrapbooking", "débutant", "technique"]', 'beginner', 1, 4, 'participants'),
('res-550e8400-e29b-41d4-a716-446655440002', 'Aide-mémoire Tablette Android', 'Fiche récapitulative des principales fonctions d''une tablette Android', 'document', '/uploads/resources/aide_memoire_android.pdf', 'Informatique', '["android", "tablette", "aide-mémoire"]', 'beginner', 2, 2, 'participants'),
('res-550e8400-e29b-41d4-a716-446655440003', 'Chronologie de La Guerche-sur-l''Aubois', 'Frise chronologique interactive de l''histoire de La Guerche', 'link', NULL, 'Histoire', '["histoire", "chronologie", "patrimoine"]', 'beginner', 5, 5, 'public');

-- =============================================
-- PARAMÈTRES SYSTÈME
-- =============================================
INSERT INTO settings (setting_key, setting_value, setting_type, description, is_public, category) VALUES
('site_name', 'Anim''Média La Guerche-sur-l''Aubois', 'string', 'Nom du site', TRUE, 'general'),
('site_description', 'Association culturelle proposant ateliers, formations et événements', 'string', 'Description du site', TRUE, 'general'),
('contact_email', 'contact@animmedia-laguerche.fr', 'string', 'Email de contact principal', TRUE, 'contact'),
('contact_phone', '02 48 80 00 00', 'string', 'Téléphone de contact', TRUE, 'contact'),
('max_registrations_per_user', '5', 'integer', 'Nombre maximum d''inscriptions simultanées par utilisateur', FALSE, 'registration'),
('registration_deadline_hours', '24', 'integer', 'Délai minimum en heures avant un événement pour s''inscrire', FALSE, 'registration'),
('auto_confirm_registration', 'true', 'boolean', 'Confirmation automatique des inscriptions', FALSE, 'registration'),
('enable_waiting_list', 'true', 'boolean', 'Activer les listes d''attente', FALSE, 'registration'),
('default_event_duration', '120', 'integer', 'Durée par défaut des événements en minutes', FALSE, 'events'),
('theme_primary_color', '#3B82F6', 'string', 'Couleur principale du thème', TRUE, 'appearance'),
('theme_secondary_color', '#F59E0B', 'string', 'Couleur secondaire du thème', TRUE, 'appearance');

-- =============================================
-- LOGS D'ACTIVITÉ EXEMPLES
-- =============================================
INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description, level, category, ip_address) VALUES
(5, 'LOGIN', 'user', 5, 'Connexion administrateur réussie', 'info', 'authentication', '192.168.1.100'),
(4, 'CREATE', 'event', 1, 'Création de l''événement "Atelier Scrapbooking Débutant"', 'info', 'content', '192.168.1.101'),
(1, 'REGISTER', 'registration', 1, 'Inscription à l''événement "Atelier Scrapbooking Débutant"', 'info', 'registration', '192.168.1.102'),
(5, 'UPDATE', 'event', 1, 'Modification des détails de l''événement', 'info', 'content', '192.168.1.100'),
(3, 'PAYMENT', 'payment', 2, 'Paiement de 12.00€ pour inscription', 'info', 'financial', '192.168.1.103'),
(5, 'SEND', 'communication', 1, 'Envoi de newsletter à 156 destinataires', 'info', 'communication', '192.168.1.100');