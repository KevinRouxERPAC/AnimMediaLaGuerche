/* ============================================
   LOGIQUE ADMINISTRATION
   Anim'Média La Guerche-sur-l'Aubois
   ============================================ */

// Configuration des utilisateurs pour la démo
const ADMIN_USERS = {
    'admin': {
        password: 'animmedia2024',
        role: 'administrateur',
        name: 'Administrateur Principal'
    }
};

// Classe de gestion de l'administration
class AdminInterface {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkSession();
        console.log('🔐 Interface d\'administration initialisée');
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
    }

    handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            this.showMessage('❌ Veuillez remplir tous les champs.', 'error');
            return;
        }

        if (ADMIN_USERS[username] && ADMIN_USERS[username].password === password) {
            const user = ADMIN_USERS[username];
            
            // Sauvegarder la session
            const session = {
                username: username,
                role: user.role,
                name: user.name,
                loginTime: new Date().toISOString()
            };

            sessionStorage.setItem('adminSession', JSON.stringify(session));
            this.currentUser = session;

            // Afficher le tableau de bord
            this.showDashboard();
            
            console.log('✅ Connexion réussie pour:', username);
            this.showMessage('✅ Connexion réussie ! Bienvenue dans l\'interface d\'administration.', 'success');
        } else {
            this.showMessage('❌ Identifiants incorrects. Utilisez : admin / animmedia2024', 'error');
            document.getElementById('password').value = '';
        }
    }

    showDashboard() {
        const loginScreen = document.getElementById('loginScreen');
        const dashboard = document.getElementById('dashboard');

        if (loginScreen && dashboard) {
            loginScreen.classList.add('hidden');
            dashboard.classList.remove('hidden');

            // Animation d'apparition
            dashboard.style.opacity = '0';
            setTimeout(() => {
                dashboard.style.transition = 'opacity 0.5s ease';
                dashboard.style.opacity = '1';
            }, 100);

            // Réinitialiser le formulaire
            document.getElementById('loginForm').reset();
        }
    }

    showLoginScreen() {
        const loginScreen = document.getElementById('loginScreen');
        const dashboard = document.getElementById('dashboard');

        if (loginScreen && dashboard) {
            dashboard.classList.add('hidden');
            loginScreen.classList.remove('hidden');

            // Réinitialiser le formulaire
            document.getElementById('loginForm').reset();
        }
    }

    checkSession() {
        const savedSession = sessionStorage.getItem('adminSession');
        if (savedSession) {
            try {
                this.currentUser = JSON.parse(savedSession);
                this.showDashboard();
                console.log('🔄 Session restaurée pour:', this.currentUser.username);
            } catch (e) {
                console.warn('⚠️ Session corrompue, nettoyage...');
                sessionStorage.removeItem('adminSession');
            }
        }
    }

    logout() {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            sessionStorage.removeItem('adminSession');
            this.currentUser = null;
            this.showLoginScreen();
            console.log('✅ Déconnexion réussie');
            this.showMessage('✅ Déconnexion réussie. À bientôt !', 'success');
        }
    }

    showMessage(message, type = 'info') {
        // Créer une notification toast
        const notification = document.createElement('div');
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
        `;

        // Couleurs selon le type
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            info: '#4ecdc4'
        };

        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;

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
        }, 3000);
    }
}

// Fonctions globales pour les boutons
function logout() {
    if (window.adminInterface) {
        window.adminInterface.logout();
    }
}

function showFeature(featureName) {
    const features = {
        'Vue d\'ensemble': 'ℹ️ Vue d\'ensemble des statistiques et activités principales',
        'Aide': '❓ Documentation et aide pour l\'utilisation de l\'interface',
        'Gestion des Adhérents': '👥 Module de gestion des adhérents en développement',
        'Planification des Activités': '📅 Module de planification des ateliers en développement',
        'Rapports et Statistiques': '📊 Module de rapports et analyses en développement',
        'Gestion de la Galerie': '🖼️ Module de gestion des photos en développement',
        'Envoi de Newsletter': '📧 Module de communication par email en développement',
        'Configuration du Site': '⚙️ Module de configuration générale en développement'
    };

    const message = features[featureName] || `Module "${featureName}" en développement`;
    
    if (window.adminInterface) {
        window.adminInterface.showMessage(message, 'info');
    }

    console.log(`🔧 Fonctionnalité demandée: ${featureName}`);
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    window.adminInterface = new AdminInterface();
});

// Gestion des erreurs globales
window.addEventListener('error', (e) => {
    console.error('❌ Erreur dans l\'interface admin:', e.error);
});

// Message de bienvenue en console
console.log(`
🎨 Interface d'Administration Anim'Média
========================================
✅ Système d'authentification : Actif
🔐 Identifiants de démonstration :
   • Utilisateur : admin
   • Mot de passe : animmedia2024
========================================
`);