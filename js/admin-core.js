// ============================================================================
// Admin Core - Anim'Média
// Gestion centrale de l'application d'administration
// ============================================================================

class AdminApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.isLoggedIn = false;
        this.userData = null;
        this.siteData = this.loadSiteData();
        
        this.init();
    }
    
    // ========================================
    // Initialisation
    // ========================================
    init() {
        this.checkAuth();
        this.bindEvents();
        this.setupNotifications();
        console.log('🎨 Admin Anim\'Média initialisé');
    }
    
    // ========================================
    // Authentification
    // ========================================
    checkAuth() {
        const savedAuth = localStorage.getItem('admin_auth');
        if (savedAuth) {
            try {
                const authData = JSON.parse(savedAuth);
                if (authData.expires > Date.now()) {
                    this.login(authData.username, '', true);
                    return;
                }
            } catch (e) {
                localStorage.removeItem('admin_auth');
            }
        }
        this.showLoginScreen();
    }
    
    showLoginScreen() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('mainInterface').classList.add('hidden');
    }
    
    showMainInterface() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainInterface').classList.remove('hidden');
        this.updateCounts();
        this.loadSection('dashboard');
    }
    
    login(username, password, skipValidation = false) {
        if (!skipValidation) {
            // Validation simple (à améliorer en production)
            const validCredentials = [
                { username: 'admin', password: 'animmedia2025' },
                { username: 'administrateur', password: 'animmedia2025' },
                { username: 'gestionnaire', password: 'laguerche2025' }
            ];
            
            const isValid = validCredentials.some(cred => 
                cred.username === username && cred.password === password
            );
            
            if (!isValid) {
                this.showNotification('Identifiants incorrects', 'error');
                return false;
            }
            
            // Sauvegarder la session (24h)
            const authData = {
                username: username,
                expires: Date.now() + (24 * 60 * 60 * 1000)
            };
            localStorage.setItem('admin_auth', JSON.stringify(authData));
        }
        
        this.isLoggedIn = true;
        this.userData = { username: username };
        document.getElementById('userName').textContent = this.getDisplayName(username);
        
        this.showMainInterface();
        this.showNotification(`Bienvenue ${this.getDisplayName(username)} !`, 'success');
        
        return true;
    }
    
    logout() {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            localStorage.removeItem('admin_auth');
            this.isLoggedIn = false;
            this.userData = null;
            this.showLoginScreen();
            this.showNotification('Déconnexion réussie', 'info');
        }
    }
    
    getDisplayName(username) {
        const names = {
            'admin': 'Administrateur',
            'administrateur': 'Administrateur',
            'gestionnaire': 'Gestionnaire'
        };
        return names[username] || username;
    }
    
    // ========================================
    // Navigation
    // ========================================
    loadSection(sectionName) {
        if (!this.isLoggedIn) return;
        
        this.currentSection = sectionName;
        
        // Mettre à jour la navigation
        document.querySelectorAll('.menu-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Mettre à jour le titre
        this.updatePageTitle(sectionName);
        
        // Charger le contenu
        this.renderSection(sectionName);
        
        // Mettre à jour le bouton d'ajout
        this.updateAddButton(sectionName);
    }
    
    updatePageTitle(sectionName) {
        const titles = {
            dashboard: 'Tableau de bord',
            events: 'Gestion des événements',
            activities: 'Gestion des activités',
            gallery: 'Gestion de la galerie',
            settings: 'Paramètres',
            backup: 'Sauvegarde & Export'
        };
        
        document.getElementById('pageTitle').textContent = titles[sectionName] || sectionName;
    }
    
    updateAddButton(sectionName) {
        const addButton = document.getElementById('addButton');
        const showForSections = ['events', 'activities', 'gallery'];
        
        if (showForSections.includes(sectionName)) {
            addButton.style.display = 'flex';
            const buttonTexts = {
                events: 'Nouvel événement',
                activities: 'Nouvelle activité',
                gallery: 'Nouvelle image'
            };
            addButton.querySelector('span').textContent = buttonTexts[sectionName] || 'Ajouter';
        } else {
            addButton.style.display = 'none';
        }
    }
    
    // ========================================
    // Gestion des données
    // ========================================
    loadSiteData() {
        try {
            const savedData = localStorage.getItem('animMediaData');
            if (savedData) {
                return JSON.parse(savedData);
            }
        } catch (e) {
            console.error('Erreur chargement données:', e);
        }
        
        // Données par défaut si aucune sauvegarde
        return {
            events: [
                {
                    id: 'event1',
                    title: 'Atelier Scrapbooking',
                    date: '2025-09-15',
                    time: '14:00',
                    location: 'Médiathèque Jean-Paul Roussillot',
                    description: 'Venez créer vos albums photos personnalisés ! Matériel fourni.',
                    image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500',
                    published: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'event2',
                    title: 'Initiation Informatique',
                    date: '2025-09-20',
                    time: '10:00',
                    location: 'Médiathèque Jean-Paul Roussillot',
                    description: 'Découvrez les bases de l\'informatique dans une ambiance conviviale.',
                    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500',
                    published: true,
                    createdAt: new Date().toISOString()
                }
            ],
            activities: [
                {
                    id: 'activity1',
                    title: 'Ateliers numériques',
                    icon: 'fas fa-desktop',
                    items: [
                        'Initiation à l\'informatique',
                        'Café informatique',
                        'Accompagnement aux usages digitaux',
                        'Dépannage et conseils'
                    ],
                    published: true,
                    order: 1
                },
                {
                    id: 'activity2',
                    title: 'Loisirs créatifs',
                    icon: 'fas fa-paint-brush',
                    items: [
                        'Ateliers de dessin',
                        'Scrapbooking',
                        'Activités manuelles',
                        'Projets artistiques'
                    ],
                    published: true,
                    order: 2
                }
            ],
            gallery: [
                {
                    id: 'gallery1',
                    title: 'Atelier Numérique',
                    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500',
                    alt: 'Atelier numérique en cours',
                    order: 1
                },
                {
                    id: 'gallery2',
                    title: 'Atelier Créatif',
                    image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500',
                    alt: 'Activité créative',
                    order: 2
                }
            ],
            settings: {
                siteName: 'Anim\'Média',
                description: 'Association culturelle, numérique et d\'éducation populaire',
                email: 'contact@animmedia-laguerche.fr',
                phone: '06 99 47 15 25',
                address: 'Médiathèque Jean-Paul Roussillot\nLa Guerche-sur-l\'Aubois',
                lastBackup: null
            }
        };
    }
    
    saveSiteData() {
        try {
            localStorage.setItem('animMediaData', JSON.stringify(this.siteData));
            this.updatePublicSite();
            this.showNotification('Données sauvegardées avec succès', 'success');
            this.updateCounts();
        } catch (e) {
            console.error('Erreur sauvegarde:', e);
            this.showNotification('Erreur lors de la sauvegarde', 'error');
        }
    }
    
    updatePublicSite() {
        // Synchroniser avec le site public si possible
        if (window.parent !== window) {
            try {
                window.parent.postMessage({
                    type: 'UPDATE_SITE_DATA',
                    data: this.siteData
                }, '*');
            } catch (e) {
                console.log('Impossible de synchroniser avec le site public');
            }
        }
    }
    
    updateCounts() {
        document.getElementById('eventsBadge').textContent = this.siteData.events?.length || 0;
        document.getElementById('activitiesBadge').textContent = this.siteData.activities?.length || 0;
        document.getElementById('galleryBadge').textContent = this.siteData.gallery?.length || 0;
    }
    
    // ========================================
    // Utilitaires
    // ========================================
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    formatDate(date) {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    formatTime(time) {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        return `${hours}h${minutes}`;
    }
    
    // ========================================
    // Events
    // ========================================
    bindEvents() {
        // Formulaire de connexion
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            this.login(username, password);
        });
        
        // Navigation
        document.querySelectorAll('[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                this.loadSection(section);
            });
        });
        
        // Gestion du clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }
    
    // ========================================
    // Notifications
    // ========================================
    setupNotifications() {
        // Le conteneur existe déjà dans le HTML
    }
    
    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="${icons[type]}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-message">${message}</div>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Animation d'apparition
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Suppression automatique
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (container.contains(notification)) {
                    container.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
}

// ============================================================================
// Fonctions globales
// ============================================================================

// Variables globales
let adminApp;

// Initialisation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', function() {
    adminApp = new AdminApp();
});

// Fonctions utilitaires globales
function togglePassword() {
    const passwordField = document.getElementById('password');
    const toggleBtn = document.querySelector('.password-toggle i');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleBtn.className = 'fas fa-eye-slash';
    } else {
        passwordField.type = 'password';
        toggleBtn.className = 'fas fa-eye';
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

function logout() {
    if (adminApp) {
        adminApp.logout();
    }
}

function previewSite() {
    window.open('../index.html', '_blank');
}

function showAddModal() {
    if (adminApp && adminApp.currentSection) {
        adminApp.showAddModal(adminApp.currentSection);
    }
}

function closeModal() {
    if (adminApp) {
        adminApp.closeModal();
    }
}
