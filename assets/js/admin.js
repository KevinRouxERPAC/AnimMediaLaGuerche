/*!
 * ANIM'MÉDIA - INTERFACE D'ADMINISTRATION
 * Logique principale de l'interface d'administration
 * Version: 1.0.0
 */

// ========================================
// CONFIGURATION ET CONSTANTS
// ========================================

const ADMIN_CONFIG = {
    // Utilisateurs autorisés (en production, ceci serait géré côté serveur)
    users: {
        'admin': { 
            password: 'animmedia2024', 
            role: 'administrateur',
            permissions: ['read', 'write', 'delete', 'manage_users']
        },
        'benevole1': { 
            password: 'benevole123', 
            role: 'éditeur',
            permissions: ['read', 'write']
        },
        'benevole2': { 
            password: 'benevole456', 
            role: 'éditeur',
            permissions: ['read', 'write']
        }
    },
    
    // Données de démonstration
    demo: {
        stats: {
            adherents: 150,
            activites: 12,
            evenements: 8,
            satisfaction: 95
        },
        
        recentEvents: [
            { id: 1, title: 'Atelier Scrapbooking', date: '2024-10-15', participants: 12 },
            { id: 2, title: 'Formation Informatique', date: '2024-10-18', participants: 8 },
            { id: 3, title: 'Soirée Jeux', date: '2024-10-22', participants: 25 }
        ]
    }
};

// ========================================
// GESTIONNAIRE PRINCIPAL DE L'APPLICATION
// ========================================

class AdminApp {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'dashboard';
        this.isInitialized = false;
        
        this.init();
    }
    
    // Initialisation de l'application
    init() {
        if (this.isInitialized) return;
        
        try {
            this.bindEvents();
            this.checkExistingSession();
            this.isInitialized = true;
            
            console.log('✅ Application d\'administration initialisée');
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
        }
    }
    
    // Lier les événements
    bindEvents() {
        // Formulaire de connexion
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Bouton de déconnexion
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
        
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });
        
        // Toggle mot de passe
        const passwordToggle = document.getElementById('passwordToggle');
        if (passwordToggle) {
            passwordToggle.addEventListener('click', () => this.togglePassword());
        }
        
        // Événements de sécurité
        window.addEventListener('sessionExpired', (e) => {
            this.handleSessionExpired(e.detail.reason);
        });
        
        // Raccourcis clavier
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }
    
    // ========================================
    // GESTION DE LA CONNEXION
    // ========================================
    
    // Gérer la connexion
    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');
        
        // Vérifier si l'utilisateur est bloqué
        if (Security.Manager.isLockedOut()) {
            const timeRemaining = Security.Manager.getLockoutTimeRemaining();
            const timeString = Security.Utils.formatTimeRemaining(timeRemaining);
            
            this.showNotification(
                `Compte temporairement bloqué. Réessayez dans ${timeString}`,
                'error'
            );
            return;
        }
        
        // Valider les entrées
        const usernameValidation = Security.Validator.validateUsername(username);
        const passwordValidation = Security.Validator.validatePassword(password);
        
        if (!usernameValidation.valid) {
            this.showNotification(usernameValidation.message, 'error');
            return;
        }
        
        if (!passwordValidation.valid) {
            this.showNotification(passwordValidation.message, 'error');
            return;
        }
        
        // Vérifier les identifiants
        const user = ADMIN_CONFIG.users[usernameValidation.value];
        
        if (!user || user.password !== passwordValidation.value) {
            // Enregistrer l'échec
            const isBlocked = Security.Manager.recordFailedAttempt();
            
            if (isBlocked) {
                this.showNotification(
                    'Trop de tentatives échouées. Compte bloqué temporairement.',
                    'error'
                );
            } else {
                const remaining = Security.Manager.getRemainingAttempts();
                this.showNotification(
                    `Identifiants incorrects. ${remaining} tentative(s) restante(s).`,
                    'error'
                );
            }
            
            // Réinitialiser le champ mot de passe
            document.getElementById('password').value = '';
            return;
        }
        
        // Connexion réussie
        await this.performLogin({
            username: usernameValidation.value,
            role: user.role,
            permissions: user.permissions
        });
    }
    
    // Effectuer la connexion
    async performLogin(user) {
        try {
            // Simulation d'une authentification avec délai
            this.setLoginButtonLoading(true);
            
            // Créer la session
            Security.Session.createSession(user);
            Security.Manager.resetAttempts();
            
            this.currentUser = user;
            
            // Mettre à jour l'interface
            this.updateUserInfo();
            this.switchToMainInterface();
            
            // Charger le tableau de bord
            await this.loadDashboard();
            
            this.showNotification(`Bienvenue ${user.username} !`, 'success');
            
            console.log('✅ Connexion réussie pour:', user.username);
            
        } catch (error) {
            console.error('❌ Erreur lors de la connexion:', error);
            this.showNotification('Erreur lors de la connexion', 'error');
        } finally {
            this.setLoginButtonLoading(false);
        }
    }
    
    // Gérer l'état de chargement du bouton de connexion
    setLoginButtonLoading(loading) {
        const button = document.querySelector('#loginForm button[type="submit"]');
        if (!button) return;
        
        if (loading) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
        } else {
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-sign-in-alt"></i> Se connecter';
        }
    }
    
    // ========================================
    // GESTION DE LA DÉCONNEXION
    // ========================================
    
    // Déconnexion
    logout() {
        Security.Session.destroySession();
        this.currentUser = null;
        
        this.switchToLoginInterface();
        this.resetLoginForm();
        
        this.showNotification('Déconnexion réussie', 'info');
        console.log('🚪 Déconnexion effectuée');
    }
    
    // Gérer l'expiration de session
    handleSessionExpired(reason) {
        const messages = {
            'inactivity': 'Session expirée par inactivité',
            'timeout': 'Session expirée (délai dépassé)',
            'security': 'Session fermée pour des raisons de sécurité'
        };
        
        this.showNotification(messages[reason] || 'Session expirée', 'warning');
        this.logout();
    }
    
    // ========================================
    // GESTION DE L'INTERFACE
    // ========================================
    
    // Basculer vers l'interface principale
    switchToMainInterface() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainInterface').classList.remove('hidden');
    }
    
    // Basculer vers l'interface de connexion
    switchToLoginInterface() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('mainInterface').classList.add('hidden');
    }
    
    // Mettre à jour les informations utilisateur
    updateUserInfo() {
        const userElement = document.getElementById('currentUser');
        const timeElement = document.getElementById('loginTime');
        
        if (userElement && this.currentUser) {
            userElement.textContent = this.currentUser.username;
        }
        
        if (timeElement) {
            timeElement.textContent = `Connecté le ${new Date().toLocaleDateString('fr-FR')}`;
        }
    }
    
    // Réinitialiser le formulaire de connexion
    resetLoginForm() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.reset();
        }
    }
    
    // Toggle visibilité mot de passe
    togglePassword() {
        const passwordInput = document.getElementById('password');
        const toggle = document.getElementById('passwordToggle');
        const icon = toggle.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    }
    
    // ========================================
    // NAVIGATION ET SECTIONS
    // ========================================
    
    // Gérer la navigation
    handleNavigation(e) {
        const section = e.currentTarget.dataset.section;
        if (!section) return;
        
        // Mettre à jour les classes actives
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        e.currentTarget.classList.add('active');
        
        // Charger la section
        this.loadSection(section);
    }
    
    // Charger une section
    async loadSection(sectionName) {
        this.currentSection = sectionName;
        
        try {
            const contentArea = document.getElementById('adminContent');
            if (!contentArea) return;
            
            // Afficher un indicateur de chargement
            contentArea.innerHTML = this.getLoadingHTML();
            
            // Simuler le chargement
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Charger le contenu selon la section
            switch (sectionName) {
                case 'dashboard':
                    await this.loadDashboard();
                    break;
                case 'events':
                    await this.loadEventsSection();
                    break;
                case 'activities':
                    await this.loadActivitiesSection();
                    break;
                case 'gallery':
                    await this.loadGallerySection();
                    break;
                case 'settings':
                    await this.loadSettingsSection();
                    break;
                default:
                    contentArea.innerHTML = '<p>Section non implémentée</p>';
            }
            
            console.log('📄 Section chargée:', sectionName);
            
        } catch (error) {
            console.error('❌ Erreur lors du chargement de section:', error);
            this.showNotification('Erreur lors du chargement', 'error');
        }
    }
    
    // ========================================
    // CONTENU DES SECTIONS
    // ========================================
    
    // Charger le tableau de bord
    async loadDashboard() {
        const content = `
            <div class="alert alert-success">
                <i class="fas fa-check-circle"></i>
                <strong>✅ Connexion réussie !</strong> Bienvenue dans l'interface d'administration d'Anim'Média.
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-number">${ADMIN_CONFIG.demo.stats.adherents}</span>
                    <div class="stat-label">Adhérents Actifs</div>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${ADMIN_CONFIG.demo.stats.activites}</span>
                    <div class="stat-label">Activités Proposées</div>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${ADMIN_CONFIG.demo.stats.evenements}</span>
                    <div class="stat-label">Événements ce Mois</div>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${ADMIN_CONFIG.demo.stats.satisfaction}%</span>
                    <div class="stat-label">Taux de Satisfaction</div>
                </div>
            </div>

            ${this.getDashboardCardsHTML()}

            <div class="alert alert-info" style="margin-top: 2rem;">
                <i class="fas fa-info-circle"></i>
                <strong>ℹ️ Information :</strong> Cette interface d'administration est une démonstration fonctionnelle. 
                Elle inclut une authentification basique et une interface moderne adaptée aux besoins d'une association.
            </div>
        `;
        
        document.getElementById('adminContent').innerHTML = content;
        
        // Ajouter les événements aux boutons
        this.bindDashboardEvents();
    }
    
    // HTML des cartes du tableau de bord
    getDashboardCardsHTML() {
        return `
            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <h3><i class="fas fa-users"></i> Gestion des Adhérents</h3>
                    <p>Gérez les inscriptions, adhésions et informations des membres de l'association.</p>
                    <button class="btn btn-primary" data-action="manage-members">
                        <i class="fas fa-user-plus"></i>
                        Gérer les Adhérents
                    </button>
                </div>

                <div class="dashboard-card">
                    <h3><i class="fas fa-calendar"></i> Planification des Activités</h3>
                    <p>Organisez les ateliers, formations et événements. Gérez les créneaux et inscriptions.</p>
                    <button class="btn btn-warning" data-action="new-event">
                        <i class="fas fa-plus"></i>
                        Nouvel Événement
                    </button>
                </div>

                <div class="dashboard-card">
                    <h3><i class="fas fa-chart-bar"></i> Statistiques</h3>
                    <p>Consultez les rapports de fréquentation, les finances et l'évolution de l'association.</p>
                    <button class="btn btn-success" data-action="view-stats">
                        <i class="fas fa-chart-line"></i>
                        Voir les Rapports
                    </button>
                </div>

                <div class="dashboard-card">
                    <h3><i class="fas fa-images"></i> Galerie Photos</h3>
                    <p>Ajoutez, organisez et gérez les photos des événements et activités de l'association.</p>
                    <button class="btn" style="background: var(--admin-secondary); color: white;" data-action="manage-gallery">
                        <i class="fas fa-upload"></i>
                        Ajouter des Photos
                    </button>
                </div>

                <div class="dashboard-card">
                    <h3><i class="fas fa-envelope"></i> Communication</h3>
                    <p>Envoyez des newsletters, notifications et gérez la communication avec les adhérents.</p>
                    <button class="btn btn-primary" data-action="send-message">
                        <i class="fas fa-paper-plane"></i>
                        Envoyer un Message
                    </button>
                </div>

                <div class="dashboard-card">
                    <h3><i class="fas fa-cog"></i> Configuration</h3>
                    <p>Paramètres du site web, informations de l'association et gestion des accès.</p>
                    <button class="btn" style="background: var(--admin-gray); color: white;" data-action="settings">
                        <i class="fas fa-wrench"></i>
                        Paramètres Généraux
                    </button>
                </div>
            </div>
        `;
    }
    
    // Lier les événements du tableau de bord
    bindDashboardEvents() {
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleDashboardAction(action);
            });
        });
    }
    
    // Gérer les actions du tableau de bord
    handleDashboardAction(action) {
        const actions = {
            'manage-members': () => this.showNotification('Fonction "Gestion des adhérents" en développement', 'info'),
            'new-event': () => this.showNotification('Fonction "Nouvel événement" en développement', 'info'),
            'view-stats': () => this.showNotification('Fonction "Statistiques" en développement', 'info'),
            'manage-gallery': () => this.showNotification('Fonction "Galerie" en développement', 'info'),
            'send-message': () => this.showNotification('Fonction "Communication" en développement', 'info'),
            'settings': () => this.loadSection('settings')
        };
        
        if (actions[action]) {
            actions[action]();
        }
    }
    
    // Charger la section événements
    async loadEventsSection() {
        const content = `
            <h2><i class="fas fa-calendar-alt"></i> Gestion des Événements</h2>
            <p>Section en développement - Ici vous pourrez gérer tous les événements de l'association.</p>
        `;
        document.getElementById('adminContent').innerHTML = content;
    }
    
    // Charger la section activités
    async loadActivitiesSection() {
        const content = `
            <h2><i class="fas fa-users"></i> Gestion des Activités</h2>
            <p>Section en développement - Ici vous pourrez gérer toutes les activités proposées.</p>
        `;
        document.getElementById('adminContent').innerHTML = content;
    }
    
    // Charger la section galerie
    async loadGallerySection() {
        const content = `
            <h2><i class="fas fa-images"></i> Gestion de la Galerie</h2>
            <p>Section en développement - Ici vous pourrez uploader et organiser les photos.</p>
        `;
        document.getElementById('adminContent').innerHTML = content;
    }
    
    // Charger la section paramètres
    async loadSettingsSection() {
        const content = `
            <h2><i class="fas fa-cog"></i> Paramètres Généraux</h2>
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i>
                Configuration du site et de l'association
            </div>
            <p>Section en développement - Ici vous pourrez configurer les paramètres du site.</p>
        `;
        document.getElementById('adminContent').innerHTML = content;
    }
    
    // ========================================
    // UTILITAIRES ET HELPERS
    // ========================================
    
    // HTML de chargement
    getLoadingHTML() {
        return `
            <div style="text-align: center; padding: 3rem; color: var(--admin-gray);">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>Chargement...</p>
            </div>
        `;
    }
    
    // Vérifier une session existante
    checkExistingSession() {
        if (Security.Session.isSessionValid()) {
            const session = Security.Session.getCurrentSession();
            if (session) {
                this.currentUser = session;
                this.updateUserInfo();
                this.switchToMainInterface();
                this.loadDashboard();
                
                this.showNotification('Session restaurée', 'info');
                console.log('🔄 Session existante restaurée');
            }
        }
    }
    
    // Afficher une notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        const colors = {
            'success': '#27ae60',
            'error': '#e74c3c',
            'warning': '#f39c12',
            'info': '#3498db'
        };
        
        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        notification.innerHTML = `<i class="fas ${icons[type]}"></i> ${message}`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.style.transform = 'translateX(0)', 10);
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    // Gérer les raccourcis clavier
    handleKeyboardShortcuts(e) {
        // Ctrl+Alt+L : Logout
        if (e.ctrlKey && e.altKey && e.key === 'l') {
            e.preventDefault();
            this.logout();
        }
        
        // Échap : Fermer les modales (si implémentées)
        if (e.key === 'Escape') {
            const modal = document.querySelector('.modal-overlay:not(.hidden)');
            if (modal) {
                modal.classList.add('hidden');
            }
        }
    }
}

// ========================================
// INITIALISATION
// ========================================

// Créer l'instance globale de l'application
let adminApp;

document.addEventListener('DOMContentLoaded', () => {
    try {
        adminApp = new AdminApp();
        
        // Rendre accessible globalement pour le debug
        window.AdminApp = adminApp;
        window.AdminConfig = ADMIN_CONFIG;
        
        console.log('🚀 Interface d\'administration Anim\'Média prête');
        
    } catch (error) {
        console.error('❌ Erreur fatale lors de l\'initialisation:', error);
    }
});

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdminApp, ADMIN_CONFIG };
}