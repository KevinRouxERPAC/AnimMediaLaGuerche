/**
 * SCRIPT MODERNE ANIM'MÉDIA - VERSION 2025
 * Fichier JavaScript principal pour le site public moderne
 */

// Configuration et constantes
const CONFIG = {
    animations: {
        duration: 300,
        easing: 'ease-out'
    },
    breakpoints: {
        mobile: 768,
        tablet: 1024
    },
    api: {
        baseUrl: 'https://api.animmedia-laguerche.fr',
        timeout: 5000
    }
};

// Utilitaires
const Utils = {
    // Debounce function pour optimiser les performances
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Animation des compteurs
    animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    },

    // Intersection Observer helper
    observeElements(selector, callback, options = {}) {
        const defaultOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(callback, { ...defaultOptions, ...options });
        
        document.querySelectorAll(selector).forEach(el => {
            observer.observe(el);
        });
        
        return observer;
    },

    // Smooth scroll vers un élément
    smoothScrollTo(target, offset = 80) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return;

        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },

    // Format de date français
    formatDate(date) {
        return new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(new Date(date));
    },

    // Validation d'email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
};

// Gestionnaire de navigation
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupActiveLink();
    }

    setupScrollEffect() {
        const handleScroll = Utils.throttle(() => {
            if (window.scrollY > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        }, 16);

        window.addEventListener('scroll', handleScroll);
    }

    setupMobileMenu() {
        this.navToggle?.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.navToggle.classList.toggle('active');
        });

        // Fermer le menu en cliquant sur un lien
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
            });
        });

        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
            }
        });
    }

    setupSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                Utils.smoothScrollTo(targetId);
            });
        });
    }

    setupActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${entry.target.id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };

        Utils.observeElements('section[id]', observerCallback, { threshold: 0.3 });
    }
}

// Gestionnaire des animations
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupCounterAnimations();
        this.setupHoverEffects();
    }

    setupScrollAnimations() {
        // Animations au scroll
        const animateOnScroll = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        };

        // Ajouter les classes d'animation
        const elementsToAnimate = [
            '.section-header',
            '.about-story',
            '.value-card',
            '.activity-card',
            '.event-card',
            '.gallery-item',
            '.contact-card'
        ];

        elementsToAnimate.forEach(selector => {
            Utils.observeElements(selector, animateOnScroll);
        });
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        let animated = false;

        const animateCounters = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    counters.forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-count'));
                        Utils.animateCounter(counter, target);
                    });
                }
            });
        };

        if (counters.length > 0) {
            Utils.observeElements('.hero-stats', animateCounters);
        }
    }

    setupHoverEffects() {
        // Effets de parallaxe léger sur les cartes
        const cards = document.querySelectorAll('.activity-card, .value-card, .contact-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

// Gestionnaire du formulaire de contact
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.setupValidation();
    }

    setupValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Validation spécifique par type de champ
        switch (field.type) {
            case 'email':
                if (!Utils.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Veuillez entrer une adresse email valide';
                }
                break;
            case 'text':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Ce champ doit contenir au moins 2 caractères';
                }
                break;
            default:
                if (field.hasAttribute('required') && !value) {
                    isValid = false;
                    errorMessage = 'Ce champ est obligatoire';
                }
        }

        this.showFieldError(field, isValid ? null : errorMessage);
        return isValid;
    }

    showFieldError(field, message) {
        // Supprimer l'ancien message d'erreur
        this.clearError(field);
        
        if (message) {
            field.classList.add('error');
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            field.parentNode.appendChild(errorElement);
        } else {
            field.classList.remove('error');
        }
    }

    clearError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Validation du formulaire
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showMessage('Veuillez corriger les erreurs avant d\'envoyer le formulaire.', 'error');
            return;
        }

        // Simulation d'envoi (remplacer par l'API réelle)
        this.showLoading(true);
        
        try {
            await this.simulateSubmission();
            this.showMessage('Votre message a été envoyé avec succès ! Nous vous recontacterons bientôt.', 'success');
            this.form.reset();
        } catch (error) {
            this.showMessage('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    simulateSubmission() {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 1500);
        });
    }

    showLoading(show) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (show) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer le message';
        }
    }

    showMessage(message, type) {
        // Créer l'élément de notification
        const notification = document.createElement('div');
        notification.className = `form-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button type="button" class="close-notification">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Ajouter la notification
        this.form.appendChild(notification);

        // Fermer la notification
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.remove();
        });

        // Supprimer automatiquement après 5 secondes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Gestionnaire du bouton "Retour en haut"
class BackToTop {
    constructor() {
        this.button = document.getElementById('backToTop');
        this.init();
    }

    init() {
        if (!this.button) return;
        
        this.setupScrollListener();
        this.setupClickHandler();
    }

    setupScrollListener() {
        const handleScroll = Utils.throttle(() => {
            if (window.pageYOffset > 300) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        }, 100);

        window.addEventListener('scroll', handleScroll);
    }

    setupClickHandler() {
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Gestionnaire des données dynamiques
class DataManager {
    constructor() {
        this.init();
    }

    init() {
        this.loadActivities();
        this.loadEvents();
        this.loadGallery();
    }

    async loadActivities() {
        // Simulation de chargement d'activités depuis une API
        const activitiesContainer = document.getElementById('activitiesContent');
        if (!activitiesContainer) return;

        // Pour l'instant, le contenu est statique dans le HTML
        // Ici on pourrait faire un appel API pour charger les activités dynamiquement
    }

    async loadEvents() {
        // Simulation de chargement d'événements depuis une API
        const eventsContainer = document.getElementById('eventsContent');
        if (!eventsContainer) return;

        // Pour l'instant, le contenu est statique dans le HTML
        // Ici on pourrait faire un appel API pour charger les événements dynamiquement
    }

    async loadGallery() {
        // Simulation de chargement de la galerie depuis une API
        const galleryContainer = document.getElementById('galleryContent');
        if (!galleryContainer) return;

        // Pour l'instant, le contenu est statique dans le HTML
        // Ici on pourrait faire un appel API pour charger les images dynamiquement
    }
}

// Gestionnaire des performances
class PerformanceManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupPreloading();
    }

    setupLazyLoading() {
        // Lazy loading des images avec Intersection Observer
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback pour les navigateurs sans support
            images.forEach(img => {
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
            });
        }
    }

    setupImageOptimization() {
        // Optimisation des images selon la densité d'écran
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            if (window.devicePixelRatio > 1.5) {
                // Écran haute densité : utiliser des images de meilleure qualité si disponibles
                const highDpiSrc = img.dataset.srcHighDpi;
                if (highDpiSrc) {
                    img.src = highDpiSrc;
                }
            }
        });
    }

    setupPreloading() {
        // Précharger les ressources critiques
        const criticalResources = [
            'css/style-new.css',
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;600;700&display=swap'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'font';
            if (link.as === 'font') {
                link.crossOrigin = 'anonymous';
            }
            document.head.appendChild(link);
        });
    }
}

// Gestionnaire des erreurs
class ErrorManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupGlobalErrorHandler();
        this.setupImageErrorHandler();
    }

    setupGlobalErrorHandler() {
        window.addEventListener('error', (e) => {
            console.error('Erreur JavaScript:', e.error);
            // Ici on pourrait envoyer les erreurs à un service de monitoring
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promise rejetée:', e.reason);
            // Ici on pourrait envoyer les erreurs à un service de monitoring
        });
    }

    setupImageErrorHandler() {
        // Gérer les erreurs de chargement d'images
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                // Remplacer par une image de fallback
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
                e.target.alt = 'Image non disponible';
            }
        }, true);
    }
}

// Gestionnaire PWA
class PWAManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupServiceWorker();
        this.setupInstallPrompt();
    }

    async setupServiceWorker() {
        if ('serviceWorker' in navigator && location.protocol === 'https:') {
            try {
                await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker enregistré avec succès');
            } catch (error) {
                console.log('Erreur lors de l\'enregistrement du Service Worker:', error);
            }
        }
    }

    setupInstallPrompt() {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Afficher un bouton d'installation personnalisé
            this.showInstallButton(deferredPrompt);
        });
    }

    showInstallButton(deferredPrompt) {
        // Créer et afficher un bouton d'installation
        const installButton = document.createElement('button');
        installButton.className = 'install-app-btn';
        installButton.innerHTML = '<i class="fas fa-download"></i> Installer l\'app';
        installButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 1000;
            background: var(--primary-600);
            color: white;
            border: none;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

        installButton.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                
                if (outcome === 'accepted') {
                    installButton.remove();
                }
                
                deferredPrompt = null;
            }
        });

        document.body.appendChild(installButton);

        // Masquer le bouton après 10 secondes
        setTimeout(() => {
            if (installButton.parentNode) {
                installButton.remove();
            }
        }, 10000);
    }
}

// Initialisation de l'application
class App {
    constructor() {
        this.init();
    }

    init() {
        // Attendre que le DOM soit chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeModules());
        } else {
            this.initializeModules();
        }
    }

    initializeModules() {
        try {
            // Initialiser tous les modules
            new Navigation();
            new AnimationManager();
            new ContactForm();
            new BackToTop();
            new DataManager();
            new PerformanceManager();
            new ErrorManager();
            new PWAManager();

            console.log('Application Anim\'Média initialisée avec succès');
        } catch (error) {
            console.error('Erreur lors de l\'initialisation:', error);
        }
    }
}

// Lancer l'application
new App();

// Styles CSS pour les éléments créés dynamiquement
const dynamicStyles = `
<style>
.field-error {
    color: var(--error);
    font-size: var(--text-sm);
    margin-top: var(--space-1);
}

.form-notification {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-4);
    border-radius: var(--radius);
    margin-top: var(--space-4);
    font-weight: 500;
}

.form-notification.success {
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
}

.form-notification.error {
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fca5a5;
}

.close-notification {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    margin-left: auto;
    padding: var(--space-1);
}

.animate-in {
    animation: slideInUp 0.6s ease-out forwards;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

input.error,
select.error,
textarea.error {
    border-color: var(--error) !important;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}
</style>
`;

// Injecter les styles dynamiques
document.head.insertAdjacentHTML('beforeend', dynamicStyles);
