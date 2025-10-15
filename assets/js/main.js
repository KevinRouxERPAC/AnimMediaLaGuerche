// ========================================
// ANIM'MÉDIA - JAVASCRIPT SIMPLE
// Fonctionnalités essentielles et modernes
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 Anim\'Média - Site chargé avec succès !');
    
    // Écouter les messages du service worker
    navigator.serviceWorker?.addEventListener('message', event => {
        if (event.data?.type === 'NOTIFICATION_CLICK') {
            const { eventId, action, targetUrl } = event.data;
            console.log('📱 Message du SW - Navigation événement:', eventId, action);
            
            // Naviguer vers la section appropriée
            if (targetUrl.includes('#')) {
                const hash = targetUrl.split('#')[1];
                const target = document.getElementById(hash);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    
                    // Si c'est pour s'inscrire, pré-remplir le formulaire
                    if (action === 'register' && hash === 'contact') {
                        setTimeout(() => {
                            const subjectSelect = document.getElementById('subject');
                            const messageTextarea = document.getElementById('message');
                            
                            if (subjectSelect) {
                                subjectSelect.value = 'inscription';
                            }
                            
                            if (messageTextarea && eventId) {
                                messageTextarea.value = `Bonjour,\n\nJe souhaite m'inscrire à l'événement suite à votre notification.\n\nCordialement,`;
                                messageTextarea.focus();
                            }
                        }, 500);
                    }
                }
            }
        }
    });
    
    // ========================================
    // NAVIGATION ACTIVE ET SMOOTH SCROLL
    // ========================================
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Fonction pour mettre à jour le lien actif
    function updateActiveNav() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    
    // Écouter le scroll
    window.addEventListener('scroll', updateActiveNav);
    
    // Smooth scroll pour les liens
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ========================================
    // ANIMATIONS AU SCROLL
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observer les cartes et statistiques
    document.querySelectorAll('.card, .stat').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
    
    // ========================================
    // ANIMATION DES COMPTEURS
    // ========================================
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Formatage du nombre
            let displayValue = Math.floor(current);
            if (target >= 100) {
                displayValue = displayValue.toLocaleString();
            }
            
            // Ajouter le "+" si nécessaire
            if (element.textContent.includes('+')) {
                displayValue += '+';
            }
            
            element.textContent = displayValue;
        }, 16);
    }
    
    // Animer les compteurs quand ils deviennent visibles
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numberEl = entry.target.querySelector('.stat-number');
                if (numberEl && !numberEl.dataset.animated) {
                    const targetText = numberEl.textContent;
                    const target = parseInt(targetText.replace(/[^0-9]/g, ''));
                    
                    numberEl.dataset.animated = 'true';
                    animateCounter(numberEl, target, 1500);
                }
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.stat').forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // ========================================
    // HEADER SCROLL EFFECT
    // ========================================
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'var(--white)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--white)';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // ========================================
    // AMÉLIORATION DE L'EXPÉRIENCE UTILISATEUR
    // ========================================
    
    // Préchargement des liens au survol
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('mouseenter', function() {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Préparation pour une navigation plus fluide
                target.style.willChange = 'transform';
                setTimeout(() => {
                    target.style.willChange = 'auto';
                }, 300);
            }
        });
    });
    
    // Gestion des erreurs d'images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Image non trouvée:', this.src);
        });
    });
    
    // ========================================
    // ACCESSIBILITÉ
    // ========================================
    
    // Navigation au clavier améliorée
    document.addEventListener('keydown', function(e) {
        // Échap pour fermer les menus ou revenir en haut
        if (e.key === 'Escape') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    
    // Focus visible pour la navigation au clavier
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // ========================================
    // PERFORMANCE ET OPTIMISATION
    // ========================================
    
    // Lazy loading pour les futures images
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // ========================================
    // ANALYTICS ET SUIVI SIMPLE
    // ========================================
    
    // Suivi des clics sur les boutons importants
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            console.log('Action utilisateur:', action);
            
            // Ici vous pourriez ajouter Google Analytics ou autre
            // gtag('event', 'click', { 'event_category': 'button', 'event_label': action });
        });
    });
    
    // ========================================
    // UTILITAIRES
    // ========================================
    
    // Fonction pour afficher des notifications (pour usage futur)
    window.showNotification = function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: var(--primary);
            color: white;
            border-radius: 0.5rem;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    };
    
    // Fonction de debug pour le développement
    window.debugAnimMedia = function() {
        return {
            sections: sections.length,
            navLinks: navLinks.length,
            cards: document.querySelectorAll('.card').length,
            stats: document.querySelectorAll('.stat').length
        };
    };
    
    console.log('📊 Debug info:', window.debugAnimMedia());
    console.log('✅ Toutes les fonctionnalités JavaScript sont actives !');
});

// ========================================
// FONCTIONS GLOBALES UTILES
// ========================================

// Fonction pour aller en haut de page
window.scrollToTop = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// Fonction pour aller à une section spécifique
window.goToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};

// Détection du support des fonctionnalités modernes
window.browserSupport = {
    intersectionObserver: 'IntersectionObserver' in window,
    smoothScroll: 'scrollBehavior' in document.documentElement.style,
    customProperties: CSS.supports('color', 'var(--primary)'),
    grid: CSS.supports('display', 'grid')
};

console.log('🌐 Support navigateur:', window.browserSupport);

// ========================================
// VALIDATION DU FORMULAIRE DE CONTACT
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    // Configuration des messages d'erreur
    const errorMessages = {
        name: {
            required: 'Le nom est obligatoire',
            minLength: 'Le nom doit contenir au moins 2 caractères',
            pattern: 'Le nom ne peut contenir que des lettres et espaces'
        },
        email: {
            required: 'L\'email est obligatoire',
            pattern: 'Veuillez saisir une adresse email valide'
        },
        message: {
            required: 'Le message est obligatoire',
            minLength: 'Le message doit contenir au moins 10 caractères',
            maxLength: 'Le message ne peut pas dépasser 1000 caractères'
        }
    };

    // Expressions régulières
    const patterns = {
        name: /^[a-zA-ZàáâäçéèêëíìîïñóòôöúùûüýÿÀÁÂÄÇÉÈÊËÍÌÎÏÑÓÒÔÖÚÙÛÜÝŸ\s\-']+$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    };

    // Fonction pour créer un message d'erreur
    function createErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 0.9em;
            margin-top: 0.25rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        `;
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        return errorDiv;
    }

    // Fonction pour créer un message de succès
    function createSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            color: #27ae60;
            font-size: 0.9em;
            margin-top: 0.25rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        `;
        successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        return successDiv;
    }

    // Fonction pour valider un champ
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const fieldGroup = field.closest('.form-group');
        
        // Supprimer les anciens messages
        const existingMessages = fieldGroup.querySelectorAll('.error-message, .success-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Réinitialiser les styles
        field.style.borderColor = '';
        field.style.backgroundColor = '';
        
        let isValid = true;
        let errorMessage = '';

        // Validation selon le type de champ
        switch (fieldName) {
            case 'name':
                if (!value) {
                    errorMessage = errorMessages.name.required;
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = errorMessages.name.minLength;
                    isValid = false;
                } else if (!patterns.name.test(value)) {
                    errorMessage = errorMessages.name.pattern;
                    isValid = false;
                }
                break;

            case 'email':
                if (!value) {
                    errorMessage = errorMessages.email.required;
                    isValid = false;
                } else if (!patterns.email.test(value)) {
                    errorMessage = errorMessages.email.pattern;
                    isValid = false;
                }
                break;

            case 'message':
                if (!value) {
                    errorMessage = errorMessages.message.required;
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = errorMessages.message.minLength;
                    isValid = false;
                } else if (value.length > 1000) {
                    errorMessage = errorMessages.message.maxLength;
                    isValid = false;
                }
                break;
        }

        // Afficher le message d'erreur ou de succès
        if (!isValid) {
            field.style.borderColor = '#e74c3c';
            field.style.backgroundColor = '#fdf2f2';
            fieldGroup.appendChild(createErrorMessage(errorMessage));
        } else if (value) {
            field.style.borderColor = '#27ae60';
            field.style.backgroundColor = '#f7fdf7';
            if (fieldName !== 'subject') { // Pas de message de succès pour le select
                fieldGroup.appendChild(createSuccessMessage('✓'));
            }
        }

        return isValid;
    }

    // Fonction pour afficher une notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
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
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        notification.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
        
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Animation de sortie
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // Validation en temps réel
    const fields = contactForm.querySelectorAll('input[required], textarea[required]');
    fields.forEach(field => {
        // Validation pendant la saisie
        field.addEventListener('input', function() {
            if (this.value.trim()) {
                validateField(this);
            }
        });

        // Validation à la perte de focus
        field.addEventListener('blur', function() {
            validateField(this);
        });
    });

    // Soumission du formulaire
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Valider tous les champs
        let isFormValid = true;
        fields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            showNotification('Veuillez corriger les erreurs dans le formulaire', 'error');
            return;
        }

        // Simulation d'envoi (en attente d'un backend)
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Animation du bouton
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitButton.style.opacity = '0.7';

        // Simuler l'envoi
        setTimeout(() => {
            // Réinitialiser le formulaire
            contactForm.reset();
            
            // Supprimer tous les messages
            const allMessages = contactForm.querySelectorAll('.error-message, .success-message');
            allMessages.forEach(msg => msg.remove());
            
            // Réinitialiser les styles des champs
            fields.forEach(field => {
                field.style.borderColor = '';
                field.style.backgroundColor = '';
            });

            // Réinitialiser le bouton
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
            submitButton.style.opacity = '';

            // Afficher le message de succès
            showNotification('Message envoyé avec succès ! Nous vous recontacterons bientôt.', 'success');
            
            console.log('📧 Formulaire de contact soumis avec succès');
            
        }, 2000); // Simulation de 2 secondes
    });

    console.log('✅ Validation du formulaire de contact activée');
});