// ========================================
// ANIM'MÉDIA - JAVASCRIPT SIMPLE
// Fonctionnalités essentielles et modernes
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 Anim\'Média - Site chargé avec succès !');
    
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