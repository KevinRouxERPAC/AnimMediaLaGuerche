/*!
 * ANIM'MÉDIA - MODULE DE SÉCURITÉ
 * Fonctions de sécurité pour l'interface d'administration
 * Version: 1.0.0
 */

// ========================================
// CONFIGURATION DE SÉCURITÉ
// ========================================

const SECURITY_CONFIG = {
    // Durée de session en millisecondes (30 minutes)
    sessionTimeout: 30 * 60 * 1000,
    
    // Nombre maximum de tentatives de connexion
    maxLoginAttempts: 3,
    
    // Durée de blocage après échec (5 minutes)
    lockoutDuration: 5 * 60 * 1000,
    
    // Clés de stockage local
    storageKeys: {
        session: 'adminSession',
        attempts: 'loginAttempts',
        lockout: 'lockoutUntil'
    }
};

// ========================================
// GESTION DES TENTATIVES DE CONNEXION
// ========================================

const SecurityManager = {
    
    // Vérifier si l'utilisateur est bloqué
    isLockedOut() {
        const lockoutUntil = localStorage.getItem(SECURITY_CONFIG.storageKeys.lockout);
        if (!lockoutUntil) return false;
        
        const now = Date.now();
        const lockoutTime = parseInt(lockoutUntil);
        
        if (now > lockoutTime) {
            // Le blocage a expiré, nettoyer
            localStorage.removeItem(SECURITY_CONFIG.storageKeys.lockout);
            localStorage.removeItem(SECURITY_CONFIG.storageKeys.attempts);
            return false;
        }
        
        return true;
    },
    
    // Obtenir le temps restant de blocage
    getLockoutTimeRemaining() {
        const lockoutUntil = localStorage.getItem(SECURITY_CONFIG.storageKeys.lockout);
        if (!lockoutUntil) return 0;
        
        const now = Date.now();
        const lockoutTime = parseInt(lockoutUntil);
        
        return Math.max(0, lockoutTime - now);
    },
    
    // Enregistrer une tentative de connexion échouée
    recordFailedAttempt() {
        let attempts = parseInt(localStorage.getItem(SECURITY_CONFIG.storageKeys.attempts) || '0');
        attempts++;
        
        localStorage.setItem(SECURITY_CONFIG.storageKeys.attempts, attempts.toString());
        
        if (attempts >= SECURITY_CONFIG.maxLoginAttempts) {
            // Bloquer l'utilisateur
            const lockoutUntil = Date.now() + SECURITY_CONFIG.lockoutDuration;
            localStorage.setItem(SECURITY_CONFIG.storageKeys.lockout, lockoutUntil.toString());
            
            console.warn('🔒 Utilisateur bloqué pour', SECURITY_CONFIG.lockoutDuration / 60000, 'minutes');
            return true; // Utilisateur bloqué
        }
        
        console.warn('⚠️ Tentative de connexion échouée. Reste', SECURITY_CONFIG.maxLoginAttempts - attempts, 'tentative(s)');
        return false;
    },
    
    // Réinitialiser les tentatives après une connexion réussie
    resetAttempts() {
        localStorage.removeItem(SECURITY_CONFIG.storageKeys.attempts);
        localStorage.removeItem(SECURITY_CONFIG.storageKeys.lockout);
    },
    
    // Obtenir le nombre de tentatives restantes
    getRemainingAttempts() {
        const attempts = parseInt(localStorage.getItem(SECURITY_CONFIG.storageKeys.attempts) || '0');
        return Math.max(0, SECURITY_CONFIG.maxLoginAttempts - attempts);
    }
};

// ========================================
// GESTION DE SESSION
// ========================================

const SessionManager = {
    
    // Timer d'inactivité
    inactivityTimer: null,
    
    // Dernière activité enregistrée
    lastActivity: Date.now(),
    
    // Créer une nouvelle session
    createSession(user) {
        const sessionData = {
            username: user.username,
            role: user.role,
            loginTime: Date.now(),
            lastActivity: Date.now()
        };
        
        sessionStorage.setItem(SECURITY_CONFIG.storageKeys.session, JSON.stringify(sessionData));
        this.startInactivityTimer();
        
        console.log('✅ Session créée pour:', user.username);
        return sessionData;
    },
    
    // Récupérer la session courante
    getCurrentSession() {
        try {
            const sessionData = sessionStorage.getItem(SECURITY_CONFIG.storageKeys.session);
            if (!sessionData) return null;
            
            return JSON.parse(sessionData);
        } catch (e) {
            console.error('❌ Erreur lors de la lecture de session:', e);
            this.destroySession();
            return null;
        }
    },
    
    // Vérifier la validité de la session
    isSessionValid() {
        const session = this.getCurrentSession();
        if (!session) return false;
        
        const now = Date.now();
        const sessionAge = now - session.loginTime;
        
        // Vérifier l'âge de la session
        if (sessionAge > SECURITY_CONFIG.sessionTimeout) {
            console.warn('⏰ Session expirée');
            this.destroySession();
            return false;
        }
        
        return true;
    },
    
    // Mettre à jour l'activité de la session
    updateActivity() {
        const session = this.getCurrentSession();
        if (!session) return;
        
        session.lastActivity = Date.now();
        this.lastActivity = Date.now();
        
        sessionStorage.setItem(SECURITY_CONFIG.storageKeys.session, JSON.stringify(session));
        this.resetInactivityTimer();
    },
    
    // Détruire la session
    destroySession() {
        sessionStorage.removeItem(SECURITY_CONFIG.storageKeys.session);
        this.stopInactivityTimer();
        
        console.log('🚪 Session détruite');
    },
    
    // Démarrer le timer d'inactivité
    startInactivityTimer() {
        this.resetInactivityTimer();
    },
    
    // Réinitialiser le timer d'inactivité
    resetInactivityTimer() {
        this.stopInactivityTimer();
        
        this.inactivityTimer = setTimeout(() => {
            if (this.getCurrentSession()) {
                console.warn('💤 Session expirée par inactivité');
                this.destroySession();
                
                // Déclencher l'événement de déconnexion
                window.dispatchEvent(new CustomEvent('sessionExpired', {
                    detail: { reason: 'inactivity' }
                }));
            }
        }, SECURITY_CONFIG.sessionTimeout);
    },
    
    // Arrêter le timer d'inactivité
    stopInactivityTimer() {
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
            this.inactivityTimer = null;
        }
    }
};

// ========================================
// VALIDATION ET SANITISATION
// ========================================

const InputValidator = {
    
    // Nettoyer une chaîne de caractères
    sanitizeString(str) {
        if (typeof str !== 'string') return '';
        
        return str
            .trim()
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Supprimer les scripts
            .replace(/javascript:/gi, '') // Supprimer javascript:
            .replace(/on\w+\s*=/gi, '') // Supprimer les handlers d'événements
            .slice(0, 1000); // Limiter la longueur
    },
    
    // Valider un nom d'utilisateur
    validateUsername(username) {
        const cleaned = this.sanitizeString(username);
        
        if (!cleaned || cleaned.length < 3) {
            return { valid: false, message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères' };
        }
        
        if (cleaned.length > 50) {
            return { valid: false, message: 'Le nom d\'utilisateur ne peut pas dépasser 50 caractères' };
        }
        
        if (!/^[a-zA-Z0-9_-]+$/.test(cleaned)) {
            return { valid: false, message: 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores' };
        }
        
        return { valid: true, value: cleaned };
    },
    
    // Valider un mot de passe
    validatePassword(password) {
        if (!password || password.length < 6) {
            return { valid: false, message: 'Le mot de passe doit contenir au moins 6 caractères' };
        }
        
        if (password.length > 128) {
            return { valid: false, message: 'Le mot de passe ne peut pas dépasser 128 caractères' };
        }
        
        return { valid: true, value: password };
    }
};

// ========================================
// SURVEILLANCE DE LA SÉCURITÉ
// ========================================

const SecurityMonitor = {
    
    // Démarrer la surveillance
    startMonitoring() {
        // Écouter l'activité de l'utilisateur
        this.addActivityListeners();
        
        // Surveiller les tentatives de manipulation
        this.addTamperDetection();
        
        // Vérifier périodiquement la session
        this.startSessionCheck();
        
        console.log('🛡️ Surveillance de sécurité active');
    },
    
    // Ajouter les écouteurs d'activité
    addActivityListeners() {
        const events = ['click', 'keypress', 'mousemove', 'scroll'];
        
        events.forEach(event => {
            document.addEventListener(event, () => {
                SessionManager.updateActivity();
            }, { passive: true });
        });
    },
    
    // Détecter les tentatives de manipulation
    addTamperDetection() {
        // Détecter l'ouverture des outils de développement (approximatif)
        let devtools = false;
        
        setInterval(() => {
            const threshold = 160;
            
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                
                if (!devtools) {
                    devtools = true;
                    console.warn('🔍 Outils de développement détectés');
                }
            } else {
                devtools = false;
            }
        }, 500);
        
        // Détecter les tentatives de modification du DOM sensible
        if (window.MutationObserver) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.target.classList && 
                        mutation.target.classList.contains('admin-sensitive')) {
                        
                        console.warn('⚠️ Tentative de modification détectée');
                    }
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true
            });
        }
    },
    
    // Vérification périodique de la session
    startSessionCheck() {
        setInterval(() => {
            if (!SessionManager.isSessionValid()) {
                window.dispatchEvent(new CustomEvent('sessionExpired', {
                    detail: { reason: 'timeout' }
                }));
            }
        }, 60000); // Vérifier chaque minute
    }
};

// ========================================
// UTILITAIRES DE SÉCURITÉ
// ========================================

const SecurityUtils = {
    
    // Générer un token CSRF simple
    generateCSRFToken() {
        return btoa(Math.random().toString(36).substr(2, 9) + Date.now().toString(36));
    },
    
    // Hasher une chaîne (simple, pour la démo)
    simpleHash(str) {
        let hash = 0;
        if (str.length === 0) return hash;
        
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convertir en 32bit
        }
        
        return Math.abs(hash).toString(36);
    },
    
    // Formater le temps restant
    formatTimeRemaining(milliseconds) {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        
        if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        }
        return `${seconds}s`;
    },
    
    // Vérifier si le navigateur supporte les fonctionnalités nécessaires
    checkBrowserSecurity() {
        const required = [
            'sessionStorage',
            'localStorage',
            'JSON',
            'addEventListener'
        ];
        
        const missing = required.filter(feature => !(feature in window));
        
        if (missing.length > 0) {
            console.error('❌ Fonctionnalités manquantes:', missing);
            return false;
        }
        
        return true;
    }
};

// ========================================
// INITIALISATION ET EXPORT
// ========================================

// Vérifier la compatibilité du navigateur
if (!SecurityUtils.checkBrowserSecurity()) {
    console.error('❌ Navigateur non compatible avec les fonctionnalités de sécurité');
}

// Exporter les modules pour utilisation globale
window.Security = {
    Manager: SecurityManager,
    Session: SessionManager,
    Validator: InputValidator,
    Monitor: SecurityMonitor,
    Utils: SecurityUtils,
    Config: SECURITY_CONFIG
};

// Démarrer automatiquement la surveillance
document.addEventListener('DOMContentLoaded', () => {
    SecurityMonitor.startMonitoring();
});

console.log('🛡️ Module de sécurité Anim\'Média chargé');