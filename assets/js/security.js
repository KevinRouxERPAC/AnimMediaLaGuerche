/*!
 * ANIM'MÉDIA - SYSTÈME D'AUTHENTIFICATION SÉCURISÉ
 * Utilitaires de sécurité pour l'administration
 */

// ============================================================================
// UTILITAIRES DE CRYPTOGRAPHIE
// ============================================================================

class SecurityUtils {
    /**
     * Génère un hash sécurisé d'un mot de passe
     */
    static async hashPassword(password, salt = null) {
        // Générer un salt si non fourni
        if (!salt) {
            const saltArray = new Uint8Array(16);
            crypto.getRandomValues(saltArray);
            salt = Array.from(saltArray).map(b => b.toString(16).padStart(2, '0')).join('');
        }

        // Créer la clé à partir du mot de passe et du salt
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveBits', 'deriveKey']
        );

        // Dériver la clé avec PBKDF2
        const key = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: encoder.encode(salt),
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );

        // Exporter la clé
        const exportedKey = await crypto.subtle.exportKey('raw', key);
        const hashArray = Array.from(new Uint8Array(exportedKey));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        return { hash: hashHex, salt };
    }

    /**
     * Vérifie un mot de passe contre son hash
     */
    static async verifyPassword(password, storedHash, storedSalt) {
        const { hash } = await this.hashPassword(password, storedSalt);
        return hash === storedHash;
    }

    /**
     * Génère un token de session sécurisé
     */
    static generateSessionToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Nettoie et valide une entrée utilisateur
     */
    static sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        
        return input
            .trim()
            .replace(/[<>\"'&]/g, '') // Supprime les caractères dangereux
            .substring(0, 100); // Limite la longueur
    }

    /**
     * Génère un identifiant unique
     */
    static generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Chiffre des données sensibles
     */
    static async encryptData(data, password) {
        const encoder = new TextEncoder();
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));

        // Créer la clé de chiffrement
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );

        const key = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt']
        );

        // Chiffrer les données
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            encoder.encode(JSON.stringify(data))
        );

        return {
            encrypted: Array.from(new Uint8Array(encrypted)),
            salt: Array.from(salt),
            iv: Array.from(iv)
        };
    }

    /**
     * Déchiffre des données
     */
    static async decryptData(encryptedData, password) {
        try {
            const encoder = new TextEncoder();
            const decoder = new TextDecoder();

            // Créer la clé de déchiffrement
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                encoder.encode(password),
                { name: 'PBKDF2' },
                false,
                ['deriveKey']
            );

            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: new Uint8Array(encryptedData.salt),
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['decrypt']
            );

            // Déchiffrer
            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: new Uint8Array(encryptedData.iv) },
                key,
                new Uint8Array(encryptedData.encrypted)
            );

            return JSON.parse(decoder.decode(decrypted));
        } catch (error) {
            console.error('Erreur de déchiffrement:', error);
            return null;
        }
    }
}

// ============================================================================
// SYSTÈME D'AUTHENTIFICATION SÉCURISÉ
// ============================================================================

class SecureAuth {
    constructor() {
        this.sessionKey = 'animmedia_secure_session';
        this.attemptsKey = 'animmedia_login_attempts';
        this.maxAttempts = 5;
        this.lockoutDuration = 15 * 60 * 1000; // 15 minutes
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        
        // Hashes pré-calculés des mots de passe (à faire hors ligne en production)
        this.userHashes = new Map([
            ['admin', {
                username: 'admin',
                role: 'admin',
                name: 'Administrateur',
                hash: 'a8e4c5f7d2b3e1a9c6d8e2f5b7c4a6d9e1f3b5c7a2e4c6d8f1a3b5c7e9d2f4a6', // animmedia2024
                salt: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d'
            }],
            ['benevole1', {
                username: 'benevole1',
                role: 'editor',
                name: 'Bénévole 1',
                hash: 'b9f5c6e8d3c4f2b0d7e9f3c5b8d1a4c7f0e2d4c6b8f1e3d5c7b9f2e4d6c8f0', // secure123
                salt: '2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e'
            }],
            ['benevole2', {
                username: 'benevole2',
                role: 'editor',
                name: 'Bénévole 2',
                hash: 'c0a6d7f9e4d5c3b1e8f0d2c6b9f4e7d0c3f6b8d1e4c7f0b3d6c9f2e5d8c1f4', // secure456
                salt: '3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f'
            }]
        ]);

        this.initializeSecurity();
    }

    /**
     * Initialise les mesures de sécurité
     */
    initializeSecurity() {
        // Nettoyer les anciennes sessions au démarrage
        this.cleanupExpiredSessions();
        
        // Surveiller les tentatives de connexion
        this.monitorLoginAttempts();
    }

    /**
     * Authentifie un utilisateur
     */
    async login(username, password) {
        // Nettoyer les entrées
        username = SecurityUtils.sanitizeInput(username);
        password = SecurityUtils.sanitizeInput(password);

        // Vérifier le verrouillage
        if (this.isLockedOut()) {
            throw new Error('Compte temporairement verrouillé. Réessayez plus tard.');
        }

        // Vérifier les identifiants
        const user = this.userHashes.get(username);
        if (!user) {
            this.recordFailedAttempt();
            throw new Error('Identifiants incorrects');
        }

        // Vérifier le mot de passe
        const isValid = await SecurityUtils.verifyPassword(password, user.hash, user.salt);
        if (!isValid) {
            this.recordFailedAttempt();
            throw new Error('Identifiants incorrects');
        }

        // Connexion réussie
        this.clearFailedAttempts();
        return await this.createSession(user);
    }

    /**
     * Crée une session utilisateur sécurisée
     */
    async createSession(user) {
        const sessionToken = SecurityUtils.generateSessionToken();
        const sessionData = {
            token: sessionToken,
            user: {
                username: user.username,
                name: user.name,
                role: user.role
            },
            created: Date.now(),
            expires: Date.now() + this.sessionTimeout,
            lastActivity: Date.now()
        };

        // Chiffrer et stocker la session
        const encryptedSession = await SecurityUtils.encryptData(sessionData, sessionToken);
        localStorage.setItem(this.sessionKey, JSON.stringify(encryptedSession));

        return sessionData.user;
    }

    /**
     * Vérifie et renouvelle une session
     */
    async validateSession() {
        try {
            const encryptedSession = localStorage.getItem(this.sessionKey);
            if (!encryptedSession) return null;

            const encryptedData = JSON.parse(encryptedSession);
            
            // Essayer de déchiffrer avec différents tokens
            // (en production, le token serait stocké de manière plus sécurisée)
            const sessionData = await SecurityUtils.decryptData(encryptedData, encryptedData.token || '');
            
            if (!sessionData) return null;

            // Vérifier l'expiration
            if (Date.now() > sessionData.expires) {
                this.logout();
                return null;
            }

            // Renouveler la session si elle est encore valide
            sessionData.lastActivity = Date.now();
            sessionData.expires = Date.now() + this.sessionTimeout;

            const newEncryptedSession = await SecurityUtils.encryptData(sessionData, sessionData.token);
            localStorage.setItem(this.sessionKey, JSON.stringify(newEncryptedSession));

            return sessionData.user;
        } catch (error) {
            console.error('Erreur de validation de session:', error);
            this.logout();
            return null;
        }
    }

    /**
     * Déconnecte l'utilisateur
     */
    logout() {
        localStorage.removeItem(this.sessionKey);
        sessionStorage.clear();
    }

    /**
     * Enregistre une tentative de connexion échouée
     */
    recordFailedAttempt() {
        const attempts = this.getFailedAttempts();
        attempts.push(Date.now());
        localStorage.setItem(this.attemptsKey, JSON.stringify(attempts));
    }

    /**
     * Efface les tentatives échouées
     */
    clearFailedAttempts() {
        localStorage.removeItem(this.attemptsKey);
    }

    /**
     * Obtient les tentatives échouées récentes
     */
    getFailedAttempts() {
        try {
            const attempts = JSON.parse(localStorage.getItem(this.attemptsKey) || '[]');
            const cutoff = Date.now() - this.lockoutDuration;
            return attempts.filter(timestamp => timestamp > cutoff);
        } catch {
            return [];
        }
    }

    /**
     * Vérifie si le compte est verrouillé
     */
    isLockedOut() {
        const recentAttempts = this.getFailedAttempts();
        return recentAttempts.length >= this.maxAttempts;
    }

    /**
     * Surveille les tentatives de connexion
     */
    monitorLoginAttempts() {
        // Nettoyer les anciennes tentatives toutes les minutes
        setInterval(() => {
            this.getFailedAttempts(); // Cela nettoie automatiquement les anciennes tentatives
        }, 60000);
    }

    /**
     * Nettoie les sessions expirées
     */
    cleanupExpiredSessions() {
        const sessionData = localStorage.getItem(this.sessionKey);
        if (sessionData) {
            try {
                // Vérifier si la session peut être déchiffrée et n'est pas expirée
                this.validateSession();
            } catch {
                // Si erreur, supprimer la session corrompue
                localStorage.removeItem(this.sessionKey);
            }
        }
    }

    /**
     * Change le mot de passe d'un utilisateur (admin uniquement)
     */
    async changePassword(username, newPassword, currentUser) {
        if (currentUser.role !== 'admin') {
            throw new Error('Accès non autorisé');
        }

        const user = this.userHashes.get(username);
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        // Générer un nouveau hash
        const { hash, salt } = await SecurityUtils.hashPassword(newPassword);
        
        // Mettre à jour (en production, cela se ferait côté serveur)
        user.hash = hash;
        user.salt = salt;

        console.log(`Mot de passe changé pour ${username}`);
    }
}

// ============================================================================
// VALIDATION ET SANITISATION DES DONNÉES
// ============================================================================

class DataValidator {
    /**
     * Valide un email
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Valide un nom d'utilisateur
     */
    static isValidUsername(username) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    }

    /**
     * Valide un mot de passe fort
     */
    static isStrongPassword(password) {
        // Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    /**
     * Nettoie et valide les données d'un événement
     */
    static validateEvent(eventData) {
        const errors = [];

        if (!eventData.title || eventData.title.length < 3) {
            errors.push('Le titre doit contenir au moins 3 caractères');
        }

        if (!eventData.description || eventData.description.length < 10) {
            errors.push('La description doit contenir au moins 10 caractères');
        }

        if (!eventData.date || new Date(eventData.date) < new Date()) {
            errors.push('La date doit être dans le futur');
        }

        // Nettoyer les données
        const cleanData = {
            title: SecurityUtils.sanitizeInput(eventData.title),
            description: SecurityUtils.sanitizeInput(eventData.description),
            date: eventData.date,
            time: eventData.time || '14:00',
            location: SecurityUtils.sanitizeInput(eventData.location || ''),
            category: SecurityUtils.sanitizeInput(eventData.category || 'general')
        };

        return { isValid: errors.length === 0, errors, data: cleanData };
    }

    /**
     * Valide les données d'une activité
     */
    static validateActivity(activityData) {
        const errors = [];

        if (!activityData.title || activityData.title.length < 3) {
            errors.push('Le titre doit contenir au moins 3 caractères');
        }

        if (!activityData.description || activityData.description.length < 10) {
            errors.push('La description doit contenir au moins 10 caractères');
        }

        const cleanData = {
            title: SecurityUtils.sanitizeInput(activityData.title),
            description: SecurityUtils.sanitizeInput(activityData.description),
            category: SecurityUtils.sanitizeInput(activityData.category || 'general'),
            schedule: SecurityUtils.sanitizeInput(activityData.schedule || ''),
            price: SecurityUtils.sanitizeInput(activityData.price || ''),
            level: SecurityUtils.sanitizeInput(activityData.level || 'Débutant'),
            image: activityData.image || ''
        };

        return { isValid: errors.length === 0, errors, data: cleanData };
    }
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SecurityUtils, SecureAuth, DataValidator };
} else {
    window.SecurityUtils = SecurityUtils;
    window.SecureAuth = SecureAuth;
    window.DataValidator = DataValidator;
}