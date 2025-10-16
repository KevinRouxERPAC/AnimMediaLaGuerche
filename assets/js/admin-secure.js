/* ============================================
   INTERFACE ADMINISTRATION SÉCURISÉE
   Anim'Média La Guerche-sur-l'Aubois
   
   Nouvelle version avec API REST et JWT
   ============================================ */

class SecureAdminInterface {
    constructor() {
        this.currentUser = null;
        this.eventsData = [];
        this.registrationsData = [];
        this.membersData = [];
        this.statsData = {};
        
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.checkAuthenticationStatus();
        console.log('🔐 Interface d\'administration sécurisée initialisée');
    }

    bindEvents() {
        // Formulaire de connexion
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Touches de raccourci
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentUser) {
                this.logout();
            }
        });

        // Boutons de déconnexion
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('logout-btn')) {
                this.logout();
            }
        });
    }

    /**
     * Vérification du statut d'authentification au chargement
     */
    async checkAuthenticationStatus() {
        if (window.authService && window.authService.isAuthenticated()) {
            this.currentUser = window.authService.getUser();
            this.showAdminInterface();
            await this.loadDashboardData();
        } else {
            this.showLoginScreen();
        }
    }

    /**
     * Gestion de la connexion avec l'API sécurisée
     */
    async handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            this.showMessage('❌ Veuillez remplir tous les champs.', 'error');
            return;
        }

        // Affichage du loader pendant la connexion
        this.showLoginLoader(true);

        try {
            const result = await window.authService.login(username, password);
            
            if (result.success) {
                this.currentUser = result.user;
                console.log('✅ Connexion réussie pour:', result.user.name);
                
                // Affichage du tableau de bord
                this.showAdminInterface();
                await this.loadDashboardData();
                
                this.showMessage('✅ Connexion réussie ! Bienvenue dans l\'interface d\'administration.', 'success');
            } else {
                this.showMessage(`❌ ${result.error}`, 'error');
                document.getElementById('password').value = '';
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            this.showMessage('❌ Erreur de connexion au serveur.', 'error');
        } finally {
            this.showLoginLoader(false);
        }
    }

    /**
     * Affichage du loader de connexion
     */
    showLoginLoader(show) {
        const submitBtn = document.querySelector('#loginForm button[type="submit"]');
        if (submitBtn) {
            if (show) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Se connecter';
            }
        }
    }

    /**
     * Affichage de l'écran de connexion
     */
    showLoginScreen() {
        const loginScreen = document.getElementById('loginScreen');
        const adminDashboard = document.getElementById('adminDashboard');

        if (loginScreen && adminDashboard) {
            adminDashboard.style.display = 'none';
            loginScreen.style.display = 'flex';
            
            // Réinitialiser le formulaire
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.reset();
            }
        }
    }

    /**
     * Affichage de l'interface d'administration
     */
    showAdminInterface() {
        const loginScreen = document.getElementById('loginScreen');
        const adminDashboard = document.getElementById('adminDashboard');

        if (loginScreen && adminDashboard) {
            loginScreen.style.display = 'none';
            adminDashboard.style.display = 'block';
            
            // Animation d'apparition
            adminDashboard.style.opacity = '0';
            setTimeout(() => {
                adminDashboard.style.transition = 'opacity 0.5s ease';
                adminDashboard.style.opacity = '1';
            }, 100);
            
            this.updateUserInfo();
        }
    }

    /**
     * Mise à jour des informations utilisateur dans l'interface
     */
    updateUserInfo() {
        const userNameDisplay = document.querySelector('.user-name');
        const userRoleDisplay = document.querySelector('.user-role');
        
        if (userNameDisplay && this.currentUser) {
            userNameDisplay.textContent = this.currentUser.name;
        }
        
        if (userRoleDisplay && this.currentUser) {
            userRoleDisplay.textContent = this.currentUser.role;
        }
    }

    /**
     * Chargement des données du tableau de bord via l'API sécurisée
     */
    async loadDashboardData() {
        try {
            // Chargement des statistiques (endpoint sécurisé)
            const statsResponse = await window.authService.apiRequest('/api/stats/dashboard');
            this.statsData = statsResponse.stats;

            // Chargement des événements (endpoint public)
            const eventsResponse = await fetch('/api/events');
            const eventsData = await eventsResponse.json();
            this.eventsData = eventsData.events || [];

            // Chargement des inscriptions (admin uniquement)
            const registrationsResponse = await window.authService.apiRequest('/api/registrations');
            this.registrationsData = registrationsResponse.registrations || [];

            // Chargement des membres (admin uniquement)
            const membersResponse = await window.authService.apiRequest('/api/members');
            this.membersData = membersResponse.members || [];

            // Mise à jour de l'affichage
            this.updateStatisticsDisplay();
            
            console.log('📊 Données du tableau de bord chargées avec succès');
            
        } catch (error) {
            console.error('❌ Erreur lors du chargement des données:', error);
            this.showMessage('❌ Erreur lors du chargement des données du tableau de bord.', 'error');
        }
    }

    /**
     * Mise à jour de l'affichage des statistiques
     */
    updateStatisticsDisplay() {
        if (!this.statsData) return;

        // Mise à jour des cartes de statistiques
        this.updateStatCard('.stat-events', this.statsData.totalEvents || 0);
        this.updateStatCard('.stat-registrations', this.statsData.totalRegistrations || 0);
        this.updateStatCard('.stat-members', this.statsData.totalMembers || 0);
        this.updateStatCard('.stat-revenue', `${this.statsData.totalRevenue || 0}€`);

        // Graphique des types d'événements
        if (this.statsData.eventTypes) {
            this.updateEventTypesChart(this.statsData.eventTypes);
        }

        // Inscriptions récentes
        if (this.statsData.recentRegistrationsList) {
            this.updateRecentRegistrations(this.statsData.recentRegistrationsList);
        }
        
        console.log('📊 Statistiques mises à jour:', this.statsData);
    }

    /**
     * Mise à jour d'une carte de statistique
     */
    updateStatCard(selector, value) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = value;
            
            // Animation de mise à jour
            element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        }
    }

    /**
     * Mise à jour du graphique des types d'événements
     */
    updateEventTypesChart(eventTypes) {
        const chartContainer = document.querySelector('.event-types-chart');
        if (!chartContainer || !eventTypes) return;

        let html = '<h3><i class="fas fa-chart-pie"></i> Événements par Type</h3>';
        const totalEvents = Object.values(eventTypes).reduce((sum, count) => sum + count, 0);
        
        if (totalEvents === 0) {
            html += '<p class="no-data"><i class="fas fa-info-circle"></i> Aucun événement enregistré</p>';
        } else {
            const colors = ['#3B82F6', '#F59E0B', '#8B5CF6', '#10B981', '#EF4444', '#6366F1'];
            let colorIndex = 0;
            
            Object.entries(eventTypes).forEach(([type, count]) => {
                const percentage = Math.round((count / totalEvents) * 100);
                const color = colors[colorIndex % colors.length];
                colorIndex++;
                
                html += `
                    <div class="chart-item">
                        <span class="chart-label">
                            <span class="chart-color" style="background-color: ${color}"></span>
                            ${type}
                        </span>
                        <span class="chart-bar">
                            <span class="chart-fill" style="width: ${percentage}%; background-color: ${color}"></span>
                        </span>
                        <span class="chart-value">${count} (${percentage}%)</span>
                    </div>
                `;
            });
        }

        chartContainer.innerHTML = html;
    }

    /**
     * Mise à jour de la liste des inscriptions récentes
     */
    updateRecentRegistrations(recentRegistrations) {
        const container = document.querySelector('.recent-registrations');
        if (!container) return;

        let html = '<h3><i class="fas fa-clock"></i> Inscriptions Récentes (7 derniers jours)</h3>';
        
        if (!recentRegistrations || recentRegistrations.length === 0) {
            html += '<p class="no-data"><i class="fas fa-info-circle"></i> Aucune inscription récente</p>';
        } else {
            html += '<ul class="registrations-list">';
            recentRegistrations.forEach(reg => {
                const date = new Date(reg.registrationDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                html += `
                    <li class="registration-item">
                        <div class="registration-info">
                            <strong class="member-name">${reg.memberName}</strong>
                            <span class="event-title">${reg.eventTitle}</span>
                        </div>
                        <span class="registration-date">${date}</span>
                    </li>
                `;
            });
            html += '</ul>';
        }

        container.innerHTML = html;
    }

    /**
     * Gestion des événements (CRUD)
     */
    async createEvent(eventData) {
        try {
            const response = await window.authService.apiRequest('/api/events', {
                method: 'POST',
                body: JSON.stringify(eventData)
            });

            console.log('✅ Événement créé:', response.event);
            this.showMessage('✅ Événement créé avec succès !', 'success');
            
            // Rechargement des données
            await this.loadDashboardData();
            
            return response.event;
        } catch (error) {
            console.error('❌ Erreur lors de la création de l\'événement:', error);
            this.showMessage(`❌ Erreur lors de la création : ${error.message}`, 'error');
            throw error;
        }
    }

    async updateEvent(eventId, eventData) {
        try {
            const response = await window.authService.apiRequest(`/api/events/${eventId}`, {
                method: 'PUT',
                body: JSON.stringify(eventData)
            });

            console.log('✅ Événement mis à jour:', response.event);
            this.showMessage('✅ Événement mis à jour avec succès !', 'success');
            
            // Rechargement des données
            await this.loadDashboardData();
            
            return response.event;
        } catch (error) {
            console.error('❌ Erreur lors de la mise à jour de l\'événement:', error);
            this.showMessage(`❌ Erreur lors de la mise à jour : ${error.message}`, 'error');
            throw error;
        }
    }

    async deleteEvent(eventId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
            return;
        }

        try {
            await window.authService.apiRequest(`/api/events/${eventId}`, {
                method: 'DELETE'
            });

            console.log('✅ Événement supprimé:', eventId);
            this.showMessage('✅ Événement supprimé avec succès !', 'success');
            
            // Rechargement des données
            await this.loadDashboardData();
            
        } catch (error) {
            console.error('❌ Erreur lors de la suppression de l\'événement:', error);
            this.showMessage(`❌ Erreur lors de la suppression : ${error.message}`, 'error');
            throw error;
        }
    }

    /**
     * Déconnexion sécurisée
     */
    async logout() {
        if (!confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            return;
        }

        try {
            await window.authService.logout();
            this.currentUser = null;

            // Retour à l'écran de connexion
            this.showLoginScreen();

            console.log('👋 Déconnexion effectuée');
            this.showMessage('👋 Vous avez été déconnecté avec succès.', 'info');
            
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            // Forcer la déconnexion locale même en cas d'erreur
            this.showLoginScreen();
        }
    }

    /**
     * Affichage des messages/notifications
     */
    showMessage(message, type = 'info') {
        // Créer une notification toast moderne
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-triangle', 
            info: 'fas fa-info-circle'
        };

        notification.innerHTML = `
            <i class="${icons[type] || icons.info}"></i>
            <span>${message}</span>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 500;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            min-width: 300px;
            backdrop-filter: blur(10px);
        `;

        // Couleurs selon le type
        const colors = {
            success: 'linear-gradient(135deg, #27ae60, #2ecc71)',
            error: 'linear-gradient(135deg, #e74c3c, #c0392b)',
            info: 'linear-gradient(135deg, #3498db, #2980b9)'
        };

        notification.style.background = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Animation d'apparition
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Suppression automatique
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Fonctions globales pour les boutons (compatibilité)
window.logout = function() {
    if (window.secureAdminInterface) {
        window.secureAdminInterface.logout();
    }
};

window.showFeature = function(featureName) {
    const features = {
        'Vue d\'ensemble': 'ℹ️ Tableau de bord avec statistiques en temps réel',
        'Gestion des Événements': '🎭 Créer, modifier et supprimer des événements',
        'Gestion des Inscriptions': '📝 Voir et gérer toutes les inscriptions',
        'Gestion des Adhérents': '👥 Gérer la base de données des membres',
        'Statistiques': '📊 Rapports et analyses détaillés',
        'Paramètres': '⚙️ Configuration du système',
        'Aide': '❓ Documentation et support'
    };

    const message = features[featureName] || `Module "${featureName}" disponible`;
    
    if (window.secureAdminInterface) {
        window.secureAdminInterface.showMessage(message, 'info');
    }

    console.log(`🔧 Fonctionnalité sélectionnée: ${featureName}`);
};

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Attendre que le service d'authentification soit disponible
    const initAdmin = () => {
        if (window.authService) {
            window.secureAdminInterface = new SecureAdminInterface();
        } else {
            setTimeout(initAdmin, 100);
        }
    };
    
    initAdmin();
});

console.log('🔐 Interface d\'administration sécurisée chargée');