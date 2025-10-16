/**
 * Service d'authentification sécurisé avec JWT
 * ============================================
 * 
 * Gestion complète de l'authentification pour l'interface admin
 * avec tokens JWT, refresh automatique et sécurité renforcée.
 */

class AuthService {
    constructor() {
        this.baseURL = '/api';
        this.accessToken = null;
        this.refreshToken = null;
        this.user = null;
        this.refreshTimer = null;
        
        this.init();
    }
    
    init() {
        // Récupération des tokens depuis le localStorage
        this.loadTokensFromStorage();
        
        // Configuration des intercepteurs pour les requêtes
        this.setupRequestInterceptors();
        
        // Démarrage du refresh automatique
        if (this.accessToken) {
            this.startTokenRefresh();
        }
        
        console.log('🔐 Service d\'authentification initialisé');
    }
    
    /**
     * Chargement des tokens depuis le localStorage
     */
    loadTokensFromStorage() {
        try {
            this.accessToken = localStorage.getItem('access_token');
            this.refreshToken = localStorage.getItem('refresh_token');
            
            const userData = localStorage.getItem('user_data');
            if (userData) {
                this.user = JSON.parse(userData);
            }
            
            // Vérification de l'expiration du token
            if (this.accessToken && this.isTokenExpired(this.accessToken)) {
                console.log('🔄 Token expiré, tentative de refresh...');
                this.refreshAccessToken();
            }
        } catch (error) {
            console.error('Erreur lors du chargement des tokens:', error);
            this.clearTokens();
        }
    }
    
    /**
     * Sauvegarde des tokens dans le localStorage
     */
    saveTokensToStorage() {
        if (this.accessToken) {
            localStorage.setItem('access_token', this.accessToken);
        }
        if (this.refreshToken) {
            localStorage.setItem('refresh_token', this.refreshToken);
        }
        if (this.user) {
            localStorage.setItem('user_data', JSON.stringify(this.user));
        }
    }
    
    /**
     * Suppression des tokens
     */
    clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;
        this.user = null;
        
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
    }
    
    /**
     * Vérification de l'expiration d'un token JWT
     */
    isTokenExpired(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp < currentTime;
        } catch (error) {
            return true;
        }
    }
    
    /**
     * Configuration des intercepteurs pour ajouter automatiquement le token
     */
    setupRequestInterceptors() {
        // Override du fetch pour ajouter automatiquement l'authorization header
        const originalFetch = window.fetch;
        
        window.fetch = async (url, options = {}) => {
            // Ajouter le token JWT si disponible et si c'est une requête API
            if (this.accessToken && url.startsWith('/api/')) {
                options.headers = {
                    ...options.headers,
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                };
            }
            
            const response = await originalFetch(url, options);
            
            // Gestion automatique des erreurs 401 (token expiré)
            if (response.status === 401 && url.startsWith('/api/') && url !== '/api/auth/login') {
                console.log('🔄 Token expiré, tentative de refresh...');
                const refreshed = await this.refreshAccessToken();
                
                if (refreshed) {
                    // Retry de la requête avec le nouveau token
                    options.headers['Authorization'] = `Bearer ${this.accessToken}`;
                    return originalFetch(url, options);
                } else {
                    // Redirection vers la page de connexion
                    this.logout();
                    window.location.reload();
                }
            }
            
            return response;
        };
    }
    
    /**
     * Connexion utilisateur
     */
    async login(username, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Sauvegarde des tokens et données utilisateur
                this.accessToken = data.access_token;
                this.refreshToken = data.refresh_token;
                this.user = data.user;
                
                this.saveTokensToStorage();
                this.startTokenRefresh();
                
                console.log('✅ Connexion réussie:', this.user.name);
                return { success: true, user: this.user };
            } else {
                console.error('❌ Erreur de connexion:', data.error);
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('❌ Erreur réseau lors de la connexion:', error);
            return { success: false, error: 'Erreur de connexion au serveur' };
        }
    }
    
    /**
     * Déconnexion utilisateur
     */
    async logout() {
        try {
            // Notification au serveur (révocation du token)
            if (this.accessToken) {
                await fetch('/api/auth/logout', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        } finally {
            // Nettoyage local
            this.clearTokens();
            console.log('👋 Déconnexion effectuée');
        }
    }
    
    /**
     * Refresh du token d'accès
     */
    async refreshAccessToken() {
        if (!this.refreshToken) {
            return false;
        }
        
        try {
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.refreshToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.accessToken = data.access_token;
                this.saveTokensToStorage();
                
                console.log('🔄 Token actualisé avec succès');
                return true;
            } else {
                console.error('❌ Erreur lors du refresh du token');
                this.clearTokens();
                return false;
            }
        } catch (error) {
            console.error('❌ Erreur réseau lors du refresh:', error);
            this.clearTokens();
            return false;
        }
    }
    
    /**
     * Démarrage du refresh automatique des tokens
     */
    startTokenRefresh() {
        if (!this.accessToken) return;
        
        try {
            const payload = JSON.parse(atob(this.accessToken.split('.')[1]));
            const expirationTime = payload.exp * 1000; // Conversion en millisecondes
            const currentTime = Date.now();
            const timeUntilRefresh = expirationTime - currentTime - (5 * 60 * 1000); // 5 minutes avant expiration
            
            if (timeUntilRefresh > 0) {
                this.refreshTimer = setTimeout(() => {
                    this.refreshAccessToken().then(success => {
                        if (success) {
                            this.startTokenRefresh(); // Programmer le prochain refresh
                        }
                    });
                }, timeUntilRefresh);
                
                console.log(`⏰ Prochain refresh programmé dans ${Math.round(timeUntilRefresh / 60000)} minutes`);
            } else {
                // Token déjà expiré, refresh immédiat
                this.refreshAccessToken();
            }
        } catch (error) {
            console.error('Erreur lors de la programmation du refresh:', error);
        }
    }
    
    /**
     * Vérification de l'état de connexion
     */
    isAuthenticated() {
        return !!(this.accessToken && this.user && !this.isTokenExpired(this.accessToken));
    }
    
    /**
     * Récupération des informations utilisateur
     */
    getUser() {
        return this.user;
    }
    
    /**
     * Vérification des permissions
     */
    hasRole(role) {
        return this.user && this.user.role === role;
    }
    
    /**
     * Requête API authentifiée
     */
    async apiRequest(endpoint, options = {}) {
        if (!this.isAuthenticated()) {
            throw new Error('Utilisateur non authentifié');
        }
        
        const url = endpoint.startsWith('/api/') ? endpoint : `/api/${endpoint}`;
        
        const response = await fetch(url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
            throw new Error(error.error || `Erreur HTTP ${response.status}`);
        }
        
        return response.json();
    }
}

// Export du service d'authentification
window.AuthService = AuthService;

// Création de l'instance globale
window.authService = new AuthService();

console.log('🔐 Service d\'authentification chargé');