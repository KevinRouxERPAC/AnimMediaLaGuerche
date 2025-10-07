// ============================================================================
// ANIM'MÉDIA - SCRIPT PRINCIPAL
// Fonctionnalités modernes pour site d'association culturelle
// ============================================================================

// Configuration globale
const CONFIG = {
    // Données par défaut pour démonstration
    defaultData: {
        activities: [
            {
                id: 'scrapbooking',
                title: 'Atelier Scrapbooking',
                description: 'Créez vos albums photos personnalisés avec des techniques créatives et du matériel professionnel.',
                image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                category: 'Créatif',
                schedule: 'Mercredi 14h-16h',
                price: '15€/séance',
                level: 'Débutant'
            },
            {
                id: 'informatique',
                title: 'Formation Informatique',
                description: 'Apprenez les bases de l\'informatique : navigation internet, emails, traitement de texte.',
                image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                category: 'Numérique',
                schedule: 'Samedi 9h-11h',
                price: '20€/séance',
                level: 'Tous niveaux'
            },
            {
                id: 'photo-numerique',
                title: 'Photo Numérique',
                description: 'Maîtrisez votre appareil photo et apprenez les bases de la retouche d\'image.',
                image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                category: 'Numérique',
                schedule: 'Samedi 14h-17h',
                price: '25€/séance',
                level: 'Intermédiaire'
            },
            {
                id: 'creation-bijoux',
                title: 'Création de Bijoux',
                description: 'Réalisez vos propres bijoux avec différentes techniques : perles, fils, résine.',
                image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                category: 'Créatif',
                schedule: 'Mercredi 10h-12h',
                price: '18€/séance',
                level: 'Débutant'
            },
            {
                id: 'video-montage',
                title: 'Montage Vidéo',
                description: 'Créez vos propres films et montages avec des logiciels professionnels et gratuits.',
                image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                category: 'Numérique',
                schedule: 'Samedi 15h-18h',
                price: '30€/séance',
                level: 'Avancé'
            },
            {
                id: 'couture-creative',
                title: 'Couture Créative',
                description: 'Apprenez les techniques de couture moderne et créez des pièces uniques.',
                image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                category: 'Créatif',
                schedule: 'Mercredi 15h-18h',
                price: '22€/séance',
                level: 'Tous niveaux'
            }
        ],
        events: [
            {
                id: 'expo-automne',
                title: 'Exposition d\'Automne',
                description: 'Découvrez les créations de nos adhérents réalisées tout au long de l\'année.',
                date: '2025-10-15',
                time: '14:00',
                location: 'Médiathèque Jean-Paul Roussillot',
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                category: 'exposition'
            },
            {
                id: 'atelier-noel',
                title: 'Atelier Décorations de Noël',
                description: 'Créez vos décorations de Noël personnalisées dans une ambiance conviviale.',
                date: '2025-12-07',
                time: '15:00',
                location: 'Salle des associations',
                image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                category: 'atelier'
            },
            {
                id: 'formation-seniors',
                title: 'Formation Numérique Seniors',
                description: 'Session spéciale dédiée aux seniors pour découvrir les outils numériques du quotidien.',
                date: '2025-09-28',
                time: '10:00',
                location: 'Médiathèque Jean-Paul Roussillot',
                image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                category: 'formation'
            }
        ],
        gallery: [
            {
                id: 'img1',
                src: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                title: 'Atelier Scrapbooking',
                category: 'ateliers'
            },
            {
                id: 'img2',
                src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                title: 'Groupe de travail',
                category: 'ateliers'
            },
            {
                id: 'img3',
                src: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                title: 'Création de bijoux',
                category: 'creations'
            },
            {
                id: 'img4',
                src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                title: 'Exposition annuelle',
                category: 'evenements'
            },
            {
                id: 'img5',
                src: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                title: 'Atelier couture',
                category: 'ateliers'
            },
            {
                id: 'img6',
                src: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                title: 'Montage vidéo',
                category: 'ateliers'
            }
        ]
    },
    
    // Paramètres d'animation
    animation: {
        observerOptions: {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        },
        counterDuration: 2000,
        typingSpeed: 100
    },
    
    // Messages pour l'interface utilisateur
    messages: {
        loading: 'Chargement en cours...',
        error: 'Une erreur est survenue',
        success: 'Opération réussie',
        emailSent: 'Message envoyé avec succès !',
        emailError: 'Erreur lors de l\'envoi du message'
    }
};

// Classe principale de l'application
class AnimMediaApp {
    constructor() {
        this.data = this.loadData();
        this.observers = new Map();
        this.lightboxIndex = 0;
        this.lightboxImages = [];
        
        // Initialisation au chargement du DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    // ========================================
    // INITIALISATION
    // ========================================
    init() {
        console.log('🎨 Anim\'Média - Initialisation...');
        
        // Masquer l'écran de chargement
        this.hideLoadingScreen();
        
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupAnimations();
        this.loadContent();
        this.setupEventListeners();
        this.setupLightbox();
        this.initCounterAnimations();
        
        console.log('✅ Application initialisée avec succès');
    }
    
    // ========================================
    // GESTION DE L'ÉCRAN DE CHARGEMENT
    // ========================================
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            // Attendre un petit délai pour que l'utilisateur voie l'écran
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                // Supprimer complètement après l'animation
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }, 1000);
        }
    }
    
    // ========================================
    // GESTION DES DONNÉES
    // ========================================
    loadData() {
        try {
            const saved = localStorage.getItem('animmedia_data');
            if (saved) {
                const data = JSON.parse(saved);
                // Fusionner avec les données par défaut pour les nouvelles propriétés
                return {
                    ...CONFIG.defaultData,
                    ...data
                };
            }
        } catch (error) {
            console.warn('Erreur lors du chargement des données:', error);
        }
        
        // Sauvegarder les données par défaut
        this.saveData(CONFIG.defaultData);
        return CONFIG.defaultData;
    }
    
    saveData(data = this.data) {
        try {
            localStorage.setItem('animmedia_data', JSON.stringify(data));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        }
    }
    
    // ========================================
    // NAVIGATION
    // ========================================
    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Menu mobile
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
        
        // Navigation fluide et active
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // Fermer le menu mobile
                    if (navMenu) navMenu.classList.remove('active');
                    if (navToggle) navToggle.classList.remove('active');
                    
                    // Scroll fluide vers la section
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Mettre à jour l'état actif
                    this.updateActiveNavLink(link);
                }
            });
        });
        
        // Effet de scroll sur la navbar
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                
                this.updateActiveNavOnScroll();
            });
        }
    }
    
    updateActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }
    
    updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.id;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // ========================================
    // EFFETS DE SCROLL ET ANIMATIONS
    // ========================================
    setupScrollEffects() {
        // Intersection Observer pour les animations au scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, CONFIG.animation.observerOptions);
        
        // Observer les éléments à animer
        const animatedElements = document.querySelectorAll([
            '.about-card',
            '.activity-card', 
            '.event-item',
            '.gallery-item',
            '.contact-card'
        ].join(','));
        
        animatedElements.forEach(element => {
            element.classList.add('animate-ready');
            observer.observe(element);
        });
        
        this.observers.set('scroll', observer);
    }
    
    setupAnimations() {
        // Ajouter les styles CSS pour les animations
        if (!document.querySelector('#scroll-animations')) {
            const style = document.createElement('style');
            style.id = 'scroll-animations';
            style.textContent = `
                .animate-ready {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.6s ease-out;
                }
                
                .animate-in {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .animate-ready:nth-child(2) { transition-delay: 0.1s; }
                .animate-ready:nth-child(3) { transition-delay: 0.2s; }
                .animate-ready:nth-child(4) { transition-delay: 0.3s; }
            `;
            document.head.appendChild(style);
        }
    }
    
    initCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.dataset.count);
            const duration = CONFIG.animation.counterDuration;
            const step = target / (duration / 16); // 60fps
            
            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current);
            }, 16);
        };
        
        // Observer pour déclencher les compteurs
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        counters.forEach(counter => counterObserver.observe(counter));
    }
    
    // ========================================
    // CHARGEMENT DU CONTENU
    // ========================================
    loadContent() {
        this.renderActivities();
        this.renderEvents();
        this.renderGallery();
    }
    
    renderActivities() {
        const container = document.getElementById('activitiesList');
        if (!container || !this.data.activities) return;
        
        container.innerHTML = this.data.activities.map(activity => `
            <div class="activity-card animate-ready" data-category="${activity.category}">
                <div class="activity-image" style="background-image: url('${activity.image}')">
                    <span class="activity-category">${activity.category}</span>
                </div>
                <div class="activity-content">
                    <h3 class="activity-title">${activity.title}</h3>
                    <p class="activity-description">${activity.description}</p>
                    <div class="activity-meta">
                        <span><i class="fas fa-clock"></i> ${activity.schedule}</span>
                        <span><i class="fas fa-signal"></i> ${activity.level}</span>
                    </div>
                    <div class="activity-actions">
                        <span class="activity-price">${activity.price}</span>
                        <a href="#contact" class="btn btn-primary btn-sm">
                            <i class="fas fa-user-plus"></i>
                            S'inscrire
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    renderEvents() {
        const container = document.getElementById('eventsList');
        if (!container || !this.data.events) return;
        
        // Trier les événements par date
        const sortedEvents = this.data.events
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5); // Limiter à 5 événements
        
        container.innerHTML = sortedEvents.map(event => {
            const eventDate = new Date(event.date);
            const day = eventDate.getDate();
            const month = eventDate.toLocaleDateString('fr', { month: 'short' });
            
            return `
                <div class="event-item animate-ready">
                    <div class="event-date-badge">
                        <span class="event-day">${day}</span>
                        <span class="event-month">${month}</span>
                    </div>
                    <div class="event-content">
                        <h3 class="event-title">${event.title}</h3>
                        <div class="event-meta">
                            <span><i class="fas fa-clock"></i> ${event.time}</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                        </div>
                        <p class="event-description">${event.description}</p>
                        <a href="#contact" class="btn btn-outline btn-sm">
                            <i class="fas fa-info-circle"></i>
                            Plus d'infos
                        </a>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    renderGallery() {
        const container = document.getElementById('galleryGrid');
        if (!container || !this.data.gallery) return;
        
        this.lightboxImages = this.data.gallery;
        
        container.innerHTML = this.data.gallery.map((image, index) => `
            <div class="gallery-item animate-ready" data-category="${image.category}" data-index="${index}">
                <img src="${image.src}" alt="${image.title}" loading="lazy">
                <div class="gallery-overlay">
                    <i class="fas fa-search-plus"></i>
                </div>
            </div>
        `).join('');
        
        this.setupGalleryFilters();
    }
    
    // ========================================
    // GALERIE ET LIGHTBOX
    // ========================================
    setupGalleryFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                
                // Mettre à jour les boutons actifs
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filtrer les éléments
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = 'block';
                        item.classList.add('animate-in');
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('animate-in');
                    }
                });
            });
        });
    }
    
    setupLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxClose = document.getElementById('lightboxClose');
        const lightboxPrev = document.getElementById('lightboxPrev');
        const lightboxNext = document.getElementById('lightboxNext');
        
        // Ouvrir la lightbox au clic sur une image
        document.addEventListener('click', (e) => {
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem) {
                const index = parseInt(galleryItem.dataset.index);
                this.openLightbox(index);
            }
        });
        
        // Fermer la lightbox
        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => this.closeLightbox());
        }
        
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    this.closeLightbox();
                }
            });
        }
        
        // Navigation dans la lightbox
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', () => this.prevLightboxImage());
        }
        
        if (lightboxNext) {
            lightboxNext.addEventListener('click', () => this.nextLightboxImage());
        }
        
        // Navigation au clavier
        document.addEventListener('keydown', (e) => {
            if (lightbox && lightbox.classList.contains('active')) {
                switch (e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.prevLightboxImage();
                        break;
                    case 'ArrowRight':
                        this.nextLightboxImage();
                        break;
                }
            }
        });
    }
    
    openLightbox(index) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightboxImage');
        
        if (lightbox && lightboxImage && this.lightboxImages[index]) {
            this.lightboxIndex = index;
            const image = this.lightboxImages[index];
            
            lightboxImage.src = image.src;
            lightboxImage.alt = image.title;
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    prevLightboxImage() {
        this.lightboxIndex = (this.lightboxIndex - 1 + this.lightboxImages.length) % this.lightboxImages.length;
        this.updateLightboxImage();
    }
    
    nextLightboxImage() {
        this.lightboxIndex = (this.lightboxIndex + 1) % this.lightboxImages.length;
        this.updateLightboxImage();
    }
    
    updateLightboxImage() {
        const lightboxImage = document.getElementById('lightboxImage');
        if (lightboxImage && this.lightboxImages[this.lightboxIndex]) {
            const image = this.lightboxImages[this.lightboxIndex];
            lightboxImage.src = image.src;
            lightboxImage.alt = image.title;
        }
    }
    
    // ========================================
    // ÉVÉNEMENTS ET FORMULAIRES
    // ========================================
    setupEventListeners() {
        // Formulaire de contact
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        }
        
        // Bouton admin
        const adminBtn = document.getElementById('adminBtn');
        if (adminBtn) {
            adminBtn.addEventListener('click', () => this.showAdminLogin());
        }
        
        // Liens internes
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
    
    handleContactForm(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulation d'envoi (en production, envoyer vers un service)
        console.log('📧 Formulaire de contact:', data);
        
        // Feedback utilisateur
        this.showNotification(CONFIG.messages.emailSent, 'success');
        form.reset();
        
        // En production, remplacer par un vrai service d'email
        // this.sendEmail(data);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Styles inline pour la notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#4CAF50' : '#2196F3',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: '10000',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Suppression automatique
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    showAdminLogin() {
        // Redirection sécurisée vers l'interface d'admin
        const userConfirm = confirm('Accéder à l\'interface d\'administration ?\n\nVous serez redirigé vers l\'écran de connexion sécurisé.');
        if (userConfirm) {
            window.location.href = 'admin/index.html';
        }
    }
    
    // ========================================
    // API PUBLIQUE
    // ========================================
    
    // Méthodes exposées pour l'administration
    addActivity(activity) {
        this.data.activities.push({
            id: `activity_${Date.now()}`,
            ...activity
        });
        this.saveData();
        this.renderActivities();
    }
    
    addEvent(event) {
        this.data.events.push({
            id: `event_${Date.now()}`,
            ...event
        });
        this.saveData();
        this.renderEvents();
    }
    
    addGalleryImage(image) {
        this.data.gallery.push({
            id: `img_${Date.now()}`,
            ...image
        });
        this.saveData();
        this.renderGallery();
    }
    
    // Méthode pour rafraîchir le contenu
    refresh() {
        this.data = this.loadData();
        this.loadContent();
    }
}

// Initialisation globale
const app = new AnimMediaApp();

// Exposition globale pour le debug et l'administration
window.AnimMediaApp = app;

// Message de bienvenue dans la console
console.log(`
🎨 Anim'Média La Guerche-sur-l'Aubois
✨ Site web moderne pour association culturelle
🚀 Application initialisée avec succès !

Développé avec ❤️ pour la communauté guerchoise
`);

// Export pour les modules (si utilisé)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimMediaApp;
}