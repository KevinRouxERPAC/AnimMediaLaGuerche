// ============================================================================
// ANIM'MÉDIA - ANIMATIONS AVANCÉES
// Animations et effets visuels pour une expérience utilisateur riche
// ============================================================================

// Animations avancées et effets parallax
class AnimationManager {
    constructor() {
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.scrollElements = new Map();
        this.tickers = new Set();
        
        this.init();
    }
    
    init() {
        if (this.isReducedMotion) {
            console.log('🎭 Animations réduites activées (préférence utilisateur)');
            return;
        }
        
        this.setupParallaxEffects();
        this.setupHoverEffects();
        this.setupTextAnimations();
        this.setupBackgroundAnimations();
        this.setupCursorEffects();
        
        console.log('🎭 Gestionnaire d\'animations initialisé');
    }
    
    // ========================================
    // EFFETS PARALLAX
    // ========================================
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.hero-background img, .parallax-element');
        
        if (parallaxElements.length === 0) return;
        
        const handleParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const speed = element.dataset.speed || 0.5;
                
                if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                    element.style.transform = `translateY(${scrolled * speed}px)`;
                }
            });
        };
        
        // Optimisation avec requestAnimationFrame
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    // ========================================
    // EFFETS DE SURVOL AVANCÉS
    // ========================================
    setupHoverEffects() {
        // Effet de tilt sur les cartes
        const tiltCards = document.querySelectorAll('.activity-card, .about-card, .contact-card');
        
        tiltCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.enableTilt(card));
            card.addEventListener('mouseleave', () => this.disableTilt(card));
        });
        
        // Effet de révélation progressive
        this.setupRevealEffects();
        
        // Animations des boutons
        this.setupButtonAnimations();
    }
    
    enableTilt(element) {
        if (this.isReducedMotion) return;
        
        const handleMouseMove = (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -10;
            const rotateY = (x - centerX) / centerX * 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        };
        
        element.addEventListener('mousemove', handleMouseMove);
        element._tiltHandler = handleMouseMove;
    }
    
    disableTilt(element) {
        if (element._tiltHandler) {
            element.removeEventListener('mousemove', element._tiltHandler);
        }
        
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        element.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            element.style.transition = '';
        }, 300);
    }
    
    setupRevealEffects() {
        const revealElements = document.querySelectorAll('.section-title, .section-subtitle');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateTextReveal(entry.target);
                }
            });
        }, { threshold: 0.7 });
        
        revealElements.forEach(element => observer.observe(element));
    }
    
    animateTextReveal(element) {
        if (this.isReducedMotion) return;
        
        const text = element.textContent;
        const words = text.split(' ');
        
        element.innerHTML = words.map((word, index) => 
            `<span class="word-reveal" style="animation-delay: ${index * 0.1}s">${word}</span>`
        ).join(' ');
        
        // Ajouter les styles CSS si pas déjà présents
        if (!document.querySelector('#text-reveal-styles')) {
            const style = document.createElement('style');
            style.id = 'text-reveal-styles';
            style.textContent = `
                .word-reveal {
                    display: inline-block;
                    opacity: 0;
                    transform: translateY(20px);
                    animation: wordReveal 0.6s ease forwards;
                }
                
                @keyframes wordReveal {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    setupButtonAnimations() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            // Effet d'ondulation au clic
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
        
        // Ajouter l'animation CSS pour l'ondulation
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // ========================================
    // ANIMATIONS DE TEXTE
    // ========================================
    setupTextAnimations() {
        // Animation de frappe pour les titres
        const typingElements = document.querySelectorAll('[data-typing]');
        
        typingElements.forEach(element => {
            this.typeWriter(element, element.dataset.typing || element.textContent);
        });
        
        // Compteurs animés
        this.setupAnimatedCounters();
    }
    
    typeWriter(element, text, speed = 100) {
        if (this.isReducedMotion) return;
        
        element.textContent = '';
        let i = 0;
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                element.classList.add('typing-complete');
            }
        }, speed);
    }
    
    setupAnimatedCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        
        counters.forEach(counter => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.counter);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }
    
    // ========================================
    // ANIMATIONS DE FOND
    // ========================================
    setupBackgroundAnimations() {
        this.createFloatingParticles();
        this.setupGradientAnimation();
    }
    
    createFloatingParticles() {
        if (this.isReducedMotion) return;
        
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
        `;
        
        // Créer les particules
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 6 + 2}px;
                height: ${Math.random() * 6 + 2}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s infinite linear;
            `;
            
            particlesContainer.appendChild(particle);
        }
        
        hero.appendChild(particlesContainer);
        
        // Animation CSS pour les particules
        if (!document.querySelector('#particles-animation')) {
            const style = document.createElement('style');
            style.id = 'particles-animation';
            style.textContent = `
                @keyframes float {
                    0% {
                        transform: translateY(100vh) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-10vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    setupGradientAnimation() {
        if (this.isReducedMotion) return;
        
        const gradientElements = document.querySelectorAll('.hero-overlay, .card-icon');
        
        gradientElements.forEach(element => {
            element.style.backgroundSize = '200% 200%';
            element.style.animation = 'gradientShift 8s ease-in-out infinite';
        });
        
        if (!document.querySelector('#gradient-animation')) {
            const style = document.createElement('style');
            style.id = 'gradient-animation';
            style.textContent = `
                @keyframes gradientShift {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // ========================================
    // EFFETS DE CURSEUR
    // ========================================
    setupCursorEffects() {
        if (this.isReducedMotion || 'ontouchstart' in window) return;
        
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(255, 107, 107, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            backdrop-filter: blur(2px);
            border: 2px solid rgba(255, 107, 107, 0.5);
        `;
        
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });
        
        // Effet sur les éléments interactifs
        const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .filter-btn');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.background = 'rgba(78, 205, 196, 0.3)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.background = 'rgba(255, 107, 107, 0.3)';
            });
        });
    }
    
    // ========================================
    // UTILITAIRES D'ANIMATION
    // ========================================
    
    // Easing functions pour des animations plus naturelles
    static easing = {
        easeOutCubic: t => 1 - Math.pow(1 - t, 3),
        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
        easeOutElastic: t => {
            const c4 = (2 * Math.PI) / 3;
            return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
        }
    };
    
    // Animation personnalisée avec easing
    animate(element, properties, duration = 300, easing = 'easeOutCubic') {
        if (this.isReducedMotion) {
            // Application directe des propriétés finales si animations réduites
            Object.assign(element.style, properties);
            return Promise.resolve();
        }
        
        return new Promise(resolve => {
            const startTime = performance.now();
            const startValues = {};
            
            // Capturer les valeurs initiales
            Object.keys(properties).forEach(prop => {
                const computedStyle = getComputedStyle(element);
                startValues[prop] = parseFloat(computedStyle[prop]) || 0;
            });
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = AnimationManager.easing[easing](progress);
                
                Object.keys(properties).forEach(prop => {
                    const start = startValues[prop];
                    const end = parseFloat(properties[prop]);
                    const current = start + (end - start) * easedProgress;
                    
                    element.style[prop] = current + (prop.includes('translate') || prop.includes('rotate') ? 'deg' : 'px');
                });
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
    
    // Nettoyage des animations
    cleanup() {
        this.tickers.forEach(ticker => clearInterval(ticker));
        this.tickers.clear();
        this.scrollElements.clear();
    }
}

// Initialisation du gestionnaire d'animations
const animationManager = new AnimationManager();

// Exposition globale
window.AnimationManager = animationManager;

// Nettoyage lors du déchargement
window.addEventListener('beforeunload', () => {
    animationManager.cleanup();
});

console.log('🎭 Gestionnaire d\'animations avancées chargé');

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationManager;
}