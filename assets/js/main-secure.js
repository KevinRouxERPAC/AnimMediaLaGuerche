// ========================================
// ANIM'MÉDIA - JAVASCRIPT SÉCURISÉ
// Fonctionnalités avec API REST sécurisée
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 Anim\'Média - Site sécurisé chargé avec succès !');
    
    // ========================================
    // CHARGEMENT DES ÉVÉNEMENTS VIA API
    // ========================================
    let allEvents = [];
    let filteredEvents = [];
    
    async function loadEvents() {
        try {
            const response = await fetch('/api/events');
            const data = await response.json();
            
            if (data.success) {
                allEvents = data.events;
                filteredEvents = [...allEvents];
                
                displayEvents(filteredEvents);
                updateEventStats();
                
                console.log('📅 Événements chargés:', allEvents.length);
            } else {
                console.error('Erreur lors du chargement des événements:', data.error);
                showFallbackEvents();
            }
        } catch (error) {
            console.error('Erreur réseau lors du chargement des événements:', error);
            showFallbackEvents();
        }
    }

    // Affichage de secours avec des données locales (si l'API ne répond pas)
    function showFallbackEvents() {
        console.log('📅 Mode fallback activé - chargement depuis les fichiers locaux');
        // Tentative de chargement depuis les fichiers JSON locaux
        fetch('data/events.json')
            .then(response => response.json())
            .then(data => {
                allEvents = data.events || [];
                filteredEvents = [...allEvents];
                displayEvents(filteredEvents);
                updateEventStats();
            })
            .catch(error => {
                console.error('Impossible de charger les événements:', error);
                displayNoEvents();
            });
    }

    function displayNoEvents() {
        const eventsContainer = document.getElementById('events-container');
        if (eventsContainer) {
            eventsContainer.innerHTML = `
                <div class="no-events">
                    <i class="fas fa-calendar-times"></i>
                    <h3>Aucun événement disponible</h3>
                    <p>Les événements seront bientôt disponibles. Revenez plus tard !</p>
                </div>
            `;
        }
    }

    // ========================================
    // AFFICHAGE DES ÉVÉNEMENTS
    // ========================================
    function displayEvents(events) {
        const eventsContainer = document.getElementById('events-container');
        if (!eventsContainer) return;

        if (events.length === 0) {
            eventsContainer.innerHTML = `
                <div class="no-events">
                    <i class="fas fa-filter"></i>
                    <h3>Aucun événement trouvé</h3>
                    <p>Essayez de modifier vos filtres.</p>
                </div>
            `;
            return;
        }

        const eventsHTML = events.map(event => createEventCard(event)).join('');
        eventsContainer.innerHTML = eventsHTML;

        // Réactiver les animations après le rendu
        setTimeout(() => {
            document.querySelectorAll('.event-card').forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
                card.classList.add('fade-in-up');
            });
        }, 50);
    }

    function createEventCard(event) {
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        const formattedTime = event.time;
        const availableSpots = event.maxParticipants - (event.currentParticipants || 0);
        const isAvailable = availableSpots > 0;
        
        const statusBadge = isAvailable 
            ? `<span class="status-badge available">${availableSpots} place${availableSpots > 1 ? 's' : ''} disponible${availableSpots > 1 ? 's' : ''}</span>`
            : `<span class="status-badge full">Complet</span>`;

        return `
            <article class="event-card" data-type="${event.type}" data-event-id="${event.id}">
                <div class="event-image">
                    <img src="${event.image || 'assets/images/events/default.jpg'}" 
                         alt="${event.title}" 
                         loading="lazy"
                         onerror="this.src='assets/images/events/default.jpg'">
                    <div class="event-type-badge">${event.type}</div>
                </div>
                
                <div class="event-content">
                    <div class="event-header">
                        <h3 class="event-title">${event.title}</h3>
                        ${statusBadge}
                    </div>
                    
                    <div class="event-meta">
                        <div class="meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>${formattedDate}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${formattedTime} (${event.duration}min)</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-user"></i>
                            <span>${event.instructor}</span>
                        </div>
                    </div>
                    
                    <p class="event-description">${event.description}</p>
                    
                    <div class="event-details">
                        <div class="price-info">
                            <span class="price">${event.price}€</span>
                            ${event.level ? `<span class="level">${event.level}</span>` : ''}
                        </div>
                        
                        <div class="event-actions">
                            <button class="btn btn-primary btn-sm" 
                                    onclick="showEventDetails('${event.id}')"
                                    aria-label="Voir les détails de ${event.title}">
                                <i class="fas fa-info-circle"></i>
                                Détails
                            </button>
                            ${isAvailable ? 
                                `<button class="btn btn-secondary btn-sm" 
                                         onclick="registerToEvent('${event.id}')"
                                         aria-label="S'inscrire à ${event.title}">
                                    <i class="fas fa-user-plus"></i>
                                    S'inscrire
                                </button>` :
                                `<button class="btn btn-disabled btn-sm" disabled>
                                    <i class="fas fa-ban"></i>
                                    Complet
                                </button>`
                            }
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    // ========================================
    // FILTRAGE DES ÉVÉNEMENTS
    // ========================================
    function setupEventFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Mise à jour des boutons actifs
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterType = btn.dataset.filter;
                
                // Filtrage des événements
                if (filterType === 'tous') {
                    filteredEvents = [...allEvents];
                } else {
                    filteredEvents = allEvents.filter(event => event.type === filterType);
                }
                
                // Affichage avec animation
                displayEvents(filteredEvents);
                
                console.log(`🔍 Filtre appliqué: ${filterType} (${filteredEvents.length} résultats)`);
            });
        });
    }

    // ========================================
    // INSCRIPTION AUX ÉVÉNEMENTS
    // ========================================
    window.registerToEvent = function(eventId) {
        const event = allEvents.find(e => e.id === eventId);
        if (!event) {
            showNotification('Événement non trouvé', 'error');
            return;
        }

        // Vérifier la disponibilité
        const availableSpots = event.maxParticipants - (event.currentParticipants || 0);
        if (availableSpots <= 0) {
            showNotification('Cet événement est complet', 'error');
            return;
        }

        // Pré-remplir le formulaire de contact et naviguer
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            // Navigation fluide
            contactSection.scrollIntoView({ behavior: 'smooth' });
            
            setTimeout(() => {
                // Pré-remplir les champs
                const subjectSelect = document.getElementById('subject');
                const messageTextarea = document.getElementById('message');
                
                if (subjectSelect) {
                    subjectSelect.value = 'inscription';
                }
                
                if (messageTextarea) {
                    const eventDate = new Date(event.date).toLocaleDateString('fr-FR');
                    messageTextarea.value = `Bonjour,\n\nJe souhaite m'inscrire à l'événement suivant :\n\n📅 ${event.title}\n🗓️ ${eventDate} à ${event.time}\n📍 ${event.location}\n\nCordialement,`;
                    messageTextarea.focus();
                }
                
                showNotification(`Formulaire pré-rempli pour "${event.title}"`, 'info');
            }, 800);
        }
    };

    // ========================================
    // DÉTAILS DES ÉVÉNEMENTS
    // ========================================
    window.showEventDetails = function(eventId) {
        const event = allEvents.find(e => e.id === eventId);
        if (!event) {
            showNotification('Événement non trouvé', 'error');
            return;
        }

        const modal = createEventModal(event);
        document.body.appendChild(modal);
        
        // Animation d'ouverture
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    };

    function createEventModal(event) {
        const modal = document.createElement('div');
        modal.className = 'event-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="closeEventModal(this)"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${event.title}</h2>
                    <button class="modal-close" onclick="closeEventModal(this)" aria-label="Fermer">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal-body">
                    <div class="event-modal-image">
                        <img src="${event.image || 'assets/images/events/default.jpg'}" 
                             alt="${event.title}"
                             onerror="this.src='assets/images/events/default.jpg'">
                    </div>
                    
                    <div class="event-modal-info">
                        <div class="info-grid">
                            <div class="info-item">
                                <i class="fas fa-calendar"></i>
                                <strong>Date :</strong> ${new Date(event.date).toLocaleDateString('fr-FR')}
                            </div>
                            <div class="info-item">
                                <i class="fas fa-clock"></i>
                                <strong>Horaire :</strong> ${event.time} (${event.duration} minutes)
                            </div>
                            <div class="info-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <strong>Lieu :</strong> ${event.location}
                            </div>
                            <div class="info-item">
                                <i class="fas fa-map"></i>
                                <strong>Adresse :</strong> ${event.address}
                            </div>
                            <div class="info-item">
                                <i class="fas fa-user"></i>
                                <strong>Animateur :</strong> ${event.instructor}
                            </div>
                            <div class="info-item">
                                <i class="fas fa-users"></i>
                                <strong>Participants :</strong> ${event.currentParticipants || 0}/${event.maxParticipants}
                            </div>
                            <div class="info-item">
                                <i class="fas fa-euro-sign"></i>
                                <strong>Tarif :</strong> ${event.price}€
                            </div>
                            ${event.level ? `
                                <div class="info-item">
                                    <i class="fas fa-signal"></i>
                                    <strong>Niveau :</strong> ${event.level}
                                </div>
                            ` : ''}
                            ${event.materials ? `
                                <div class="info-item">
                                    <i class="fas fa-tools"></i>
                                    <strong>Matériel :</strong> ${event.materials}
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="event-description-full">
                            <h3><i class="fas fa-info-circle"></i> Description</h3>
                            <p>${event.description}</p>
                        </div>
                        
                        ${event.tags && event.tags.length > 0 ? `
                            <div class="event-tags">
                                <h3><i class="fas fa-tags"></i> Tags</h3>
                                <div class="tags-list">
                                    ${event.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="modal-footer">
                    ${(event.maxParticipants - (event.currentParticipants || 0)) > 0 ? 
                        `<button class="btn btn-primary" onclick="registerToEvent('${event.id}'); closeEventModal(this);">
                            <i class="fas fa-user-plus"></i>
                            S'inscrire maintenant
                        </button>` :
                        `<button class="btn btn-disabled" disabled>
                            <i class="fas fa-ban"></i>
                            Événement complet
                        </button>`
                    }
                    <button class="btn btn-outline" onclick="closeEventModal(this)">
                        <i class="fas fa-times"></i>
                        Fermer
                    </button>
                </div>
            </div>
        `;

        return modal;
    }

    window.closeEventModal = function(element) {
        const modal = element.closest('.event-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
            }, 300);
        }
    };

    // ========================================
    // FORMULAIRE DE CONTACT SÉCURISÉ
    // ========================================
    function setupSecureContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name')?.trim(),
                email: formData.get('email')?.trim(),
                phone: formData.get('phone')?.trim(),
                subject: formData.get('subject'),
                message: formData.get('message')?.trim()
            };

            // Validation côté client
            if (!validateContactForm(data)) {
                return;
            }

            // Si c'est une inscription, créer une inscription via l'API
            if (data.subject === 'inscription') {
                await handleRegistration(data);
            } else {
                // Pour les autres demandes, afficher un message de confirmation
                showContactConfirmation(data);
            }
        });
    }

    function validateContactForm(data) {
        let isValid = true;
        
        // Supprimer les anciens messages d'erreur
        document.querySelectorAll('.error-message').forEach(el => el.remove());

        // Validation du nom
        if (!data.name || data.name.length < 2) {
            showFieldError('name', 'Le nom doit contenir au moins 2 caractères');
            isValid = false;
        }

        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            showFieldError('email', 'Veuillez saisir une adresse email valide');
            isValid = false;
        }

        // Validation du message
        if (!data.message || data.message.length < 10) {
            showFieldError('message', 'Le message doit contenir au moins 10 caractères');
            isValid = false;
        }

        return isValid;
    }

    function showFieldError(fieldName, message) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (!field) return;

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        
        field.parentNode.appendChild(errorDiv);
        field.classList.add('error');
        
        // Supprimer l'erreur quand l'utilisateur commence à taper
        field.addEventListener('input', function() {
            this.classList.remove('error');
            const error = this.parentNode.querySelector('.error-message');
            if (error) error.remove();
        }, { once: true });
    }

    async function handleRegistration(contactData) {
        // Extraire l'ID d'événement du message (si présent)
        const eventIdMatch = contactData.message.match(/événement[^:]*:\s*([^\n]*)/i);
        
        if (!eventIdMatch) {
            showNotification('Impossible d\'identifier l\'événement. Veuillez réessayer.', 'error');
            return;
        }

        const eventTitle = eventIdMatch[1].trim();
        const event = allEvents.find(e => e.title.toLowerCase().includes(eventTitle.toLowerCase()));
        
        if (!event) {
            showNotification('Événement non trouvé. Votre demande a été enregistrée.', 'info');
            showContactConfirmation(contactData);
            return;
        }

        try {
            const registrationData = {
                eventId: event.id,
                memberName: contactData.name,
                memberEmail: contactData.email,
                memberPhone: contactData.phone || '',
                notes: contactData.message
            };

            const response = await fetch('/api/registrations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registrationData)
            });

            const result = await response.json();

            if (result.success) {
                showNotification('✅ Inscription confirmée ! Vous recevrez bientôt une confirmation.', 'success');
                document.getElementById('contact-form').reset();
                
                // Recharger les événements pour mettre à jour les compteurs
                await loadEvents();
            } else {
                throw new Error(result.error || 'Erreur lors de l\'inscription');
            }

        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            showNotification(`❌ ${error.message}`, 'error');
        }
    }

    function showContactConfirmation(data) {
        showNotification('✅ Votre message a été envoyé ! Nous vous répondrons rapidement.', 'success');
        document.getElementById('contact-form').reset();
        
        console.log('📧 Demande de contact:', {
            name: data.name,
            email: data.email,
            subject: data.subject,
            timestamp: new Date().toISOString()
        });
    }

    // ========================================
    // STATISTIQUES ET MISE À JOUR
    // ========================================
    function updateEventStats() {
        // Mise à jour des compteurs dans la section héro
        const totalEventsEl = document.querySelector('.stat-events .stat-number');
        const totalParticipantsEl = document.querySelector('.stat-participants .stat-number');
        
        if (totalEventsEl) {
            const total = allEvents.length;
            animateCounter(totalEventsEl, total);
        }

        if (totalParticipantsEl) {
            const totalParticipants = allEvents.reduce((sum, event) => sum + (event.currentParticipants || 0), 0);
            animateCounter(totalParticipantsEl, totalParticipants);
        }
    }

    function animateCounter(element, target, duration = 1000) {
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
    }

    // ========================================
    // SYSTÈME DE NOTIFICATIONS
    // ========================================
    function showNotification(message, type = 'info') {
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
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
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
            min-width: 350px;
            backdrop-filter: blur(10px);
        `;

        const colors = {
            success: 'linear-gradient(135deg, #27ae60, #2ecc71)',
            error: 'linear-gradient(135deg, #e74c3c, #c0392b)',
            info: 'linear-gradient(135deg, #3498db, #2980b9)'
        };

        notification.style.background = colors[type] || colors.info;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Exposer la fonction globalement
    window.showNotification = showNotification;

    // ========================================
    // NAVIGATION ET ANIMATIONS
    // ========================================
    
    // Navigation fluide
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // Smooth scroll pour les liens d'ancrage
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ========================================
    // INITIALISATION
    // ========================================
    
    // Chargement initial des données
    loadEvents();
    
    // Configuration des fonctionnalités
    setupEventFilters();
    setupSecureContactForm();
    
    // Affichage d'une notification de bienvenue
    setTimeout(() => {
        showNotification('Bienvenue sur le site d\'Anim\'Média ! 🎨', 'info');
    }, 2000);
    
    console.log('✅ Application sécurisée initialisée avec succès !');
});

// ========================================
// UTILITAIRES GLOBAUX
// ========================================

window.scrollToTop = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

window.goToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};