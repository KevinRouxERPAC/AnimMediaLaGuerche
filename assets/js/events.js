/*!
 * ANIM'MÉDIA - GESTION DES ÉVÉNEMENTS
 * Système de gestion et affichage des événements
 * Version: 1.0.0
 */

class EventManager {
    constructor() {
        this.events = [];
        this.filteredEvents = [];
        this.currentFilter = 'all';
        this.displayedEventsCount = 6;
        this.eventsPerLoad = 3;
        
        this.init();
    }

    async init() {
        console.log('🎪 Gestionnaire d\'événements initialisé');
        
        await this.loadEvents();
        this.bindEvents();
        this.displayEvents();
        this.updateNavigation();
    }

    async loadEvents() {
        try {
            // Vérifier si on est en mode file:// (ouverture locale)
            if (window.location.protocol === 'file:') {
                console.log('🔄 Mode local détecté, chargement des données d\'exemple...');
                this.loadSampleEvents();
                return;
            }
            
            const response = await fetch('data/events.json');
            if (!response.ok) {
                throw new Error('Erreur de chargement des événements');
            }
            
            const data = await response.json();
            this.events = data.events || [];
            this.eventTypes = data.eventTypes || [];
            
            // Trier par date
            this.events.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
            
            // Filtrer les événements à venir
            const now = new Date();
            this.events = this.events.filter(event => {
                const eventDate = new Date(event.date + 'T' + event.time);
                return eventDate >= now;
            });
            
            this.filteredEvents = [...this.events];
            
            console.log(`✅ ${this.events.length} événements chargés`);
        } catch (error) {
            console.error('❌ Erreur lors du chargement des événements:', error);
            console.log('🔄 Tentative de chargement en mode local...');
            this.loadSampleEvents();
        }
    }

    loadSampleEvents() {
        // Données d'exemple pour le mode local (file://)
        this.eventTypes = [
            { "id": "atelier", "name": "Atelier", "color": "#3B82F6", "icon": "fas fa-hands-helping" },
            { "id": "formation", "name": "Formation", "color": "#F59E0B", "icon": "fas fa-graduation-cap" },
            { "id": "exposition", "name": "Exposition", "color": "#8B5CF6", "icon": "fas fa-image" },
            { "id": "conference", "name": "Conférence", "color": "#10B981", "icon": "fas fa-microphone" },
            { "id": "sortie", "name": "Sortie", "color": "#EF4444", "icon": "fas fa-map-marked-alt" }
        ];

        this.events = [
            {
                "id": "evt_001",
                "title": "Atelier Scrapbooking Débutant",
                "type": "atelier",
                "description": "Découvrez l'art du scrapbooking ! Créez vos premiers albums photos personnalisés avec des techniques simples et créatives.",
                "date": "2025-10-22",
                "time": "14:00",
                "duration": 120,
                "location": "Médiathèque de La Guerche-sur-l'Aubois",
                "address": "Maison des Associations, 18150 La Guerche-sur-l'Aubois",
                "instructor": "Marie Dubois",
                "maxParticipants": 8,
                "currentParticipants": 3,
                "price": 15,
                "materials": "Fournis",
                "level": "Débutant",
                "image": "assets/images/events/scrapbooking-001.jpg",
                "tags": ["créatif", "scrapbooking", "débutant"],
                "status": "open",
                "createdAt": "2025-10-01T10:00:00Z",
                "updatedAt": "2025-10-15T14:30:00Z"
            },
            {
                "id": "evt_002",
                "title": "Formation Informatique : Tablette Android",
                "type": "formation",
                "description": "Apprenez à utiliser votre tablette Android : applications essentielles, navigation internet, photos et vidéos.",
                "date": "2025-10-25",
                "time": "10:00",
                "duration": 180,
                "location": "Médiathèque de La Guerche-sur-l'Aubois",
                "address": "Maison des Associations, 18150 La Guerche-sur-l'Aubois",
                "instructor": "Jean-Pierre Martin",
                "maxParticipants": 6,
                "currentParticipants": 4,
                "price": 20,
                "materials": "Apportez votre tablette",
                "level": "Tous niveaux",
                "image": "assets/images/events/formation-tablette.jpg",
                "tags": ["numérique", "tablette", "android"],
                "status": "open",
                "createdAt": "2025-10-05T09:00:00Z",
                "updatedAt": "2025-10-15T11:00:00Z"
            },
            {
                "id": "evt_003",
                "title": "Exposition Photos : La Guerche à travers l'objectif",
                "type": "exposition",
                "description": "Découvrez une collection unique de photographies historiques de La Guerche-sur-l'Aubois et ses environs.",
                "date": "2025-11-05",
                "time": "18:00",
                "duration": 120,
                "location": "Médiathèque de La Guerche-sur-l'Aubois",
                "address": "Maison des Associations, 18150 La Guerche-sur-l'Aubois",
                "instructor": "Association Photos du Cher",
                "maxParticipants": 50,
                "currentParticipants": 12,
                "price": 0,
                "materials": "Aucun",
                "level": "Tout public",
                "image": "assets/images/events/expo-photos.jpg",
                "tags": ["exposition", "histoire", "photographie"],
                "status": "open",
                "createdAt": "2025-09-20T16:00:00Z",
                "updatedAt": "2025-10-10T13:45:00Z"
            },
            {
                "id": "evt_004",
                "title": "Atelier Cuisine : Biscuits de Noël",
                "type": "atelier",
                "description": "Préparez les fêtes en apprenant à faire de délicieux biscuits de Noël traditionnels et modernes.",
                "date": "2025-12-10",
                "time": "14:30",
                "duration": 150,
                "location": "Médiathèque de La Guerche-sur-l'Aubois",
                "address": "Maison des Associations, 18150 La Guerche-sur-l'Aubois",
                "instructor": "Sophie Lemoine",
                "maxParticipants": 10,
                "currentParticipants": 0,
                "price": 12,
                "materials": "Ingrédients fournis",
                "level": "Tous niveaux",
                "image": "assets/images/events/cuisine-noel.jpg",
                "tags": ["cuisine", "noël", "traditionnel"],
                "status": "open",
                "createdAt": "2025-10-15T12:00:00Z",
                "updatedAt": "2025-10-15T12:00:00Z"
            },
            {
                "id": "evt_005",
                "title": "Conférence : L'Histoire de La Guerche",
                "type": "conference",
                "description": "Plongez dans l'histoire fascinante de notre commune avec l'historien local Pierre Moreau.",
                "date": "2025-11-18",
                "time": "16:00",
                "duration": 90,
                "location": "Médiathèque de La Guerche-sur-l'Aubois",
                "address": "Maison des Associations, 18150 La Guerche-sur-l'Aubois",
                "instructor": "Pierre Moreau, Historien",
                "maxParticipants": 40,
                "currentParticipants": 8,
                "price": 5,
                "materials": "Aucun",
                "level": "Tout public",
                "image": "assets/images/events/conference-histoire.jpg",
                "tags": ["histoire", "conférence", "patrimoine"],
                "status": "open",
                "createdAt": "2025-10-08T14:20:00Z",
                "updatedAt": "2025-10-15T10:15:00Z"
            }
        ];

        // Filtrer les événements à venir
        const now = new Date();
        this.events = this.events.filter(event => {
            const eventDate = new Date(event.date + 'T' + event.time);
            return eventDate >= now;
        });

        // Trier par date
        this.events.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
        this.filteredEvents = [...this.events];
        
        console.log(`✅ ${this.events.length} événements d'exemple chargés (mode local)`);
    }

    bindEvents() {
        // Filtres d'événements
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.currentTarget.dataset.filter;
                this.setFilter(filter);
            });
        });

        // Bouton "Voir plus"
        const loadMoreBtn = document.getElementById('loadMoreEvents');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreEvents();
            });
        }

        // Délégation d'événements pour les boutons d'inscription
        const eventsGrid = document.getElementById('eventsGrid');
        if (eventsGrid) {
            eventsGrid.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-register')) {
                    const eventId = e.target.dataset.eventId;
                    this.handleRegistration(eventId);
                }
                
                if (e.target.classList.contains('btn-info')) {
                    const eventId = e.target.dataset.eventId;
                    this.showEventDetails(eventId);
                }
            });
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Mettre à jour l'apparence des boutons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        // Filtrer les événements
        if (filter === 'all') {
            this.filteredEvents = [...this.events];
        } else {
            this.filteredEvents = this.events.filter(event => event.type === filter);
        }

        // Réinitialiser l'affichage
        this.displayedEventsCount = Math.min(this.eventsPerLoad, this.filteredEvents.length);
        this.displayEvents();
    }

    displayEvents() {
        const eventsGrid = document.getElementById('eventsGrid');
        if (!eventsGrid) {
            console.warn('⚠️ Section événements non trouvée (eventsGrid)');
            return;
        }

        const eventsToShow = this.filteredEvents.slice(0, this.displayedEventsCount);
        
        if (eventsToShow.length === 0) {
            eventsGrid.innerHTML = `
                <div class="loading-events">
                    <i class="fas fa-calendar-times"></i>
                    <p>Aucun événement trouvé pour ce filtre.</p>
                </div>
            `;
            this.updateLoadMoreButton();
            return;
        }

        eventsGrid.innerHTML = eventsToShow.map((event, index) => 
            this.createEventCard(event, index)
        ).join('');

        // Animer l'apparition des cartes
        this.animateCards();
        this.updateLoadMoreButton();
    }

    createEventCard(event, index) {
        const eventDate = new Date(event.date);
        const eventType = this.getEventType(event.type);
        
        const day = eventDate.getDate().toString().padStart(2, '0');
        const month = eventDate.toLocaleDateString('fr-FR', { month: 'short' });
        
        const participantsPercentage = (event.currentParticipants / event.maxParticipants) * 100;
        const isFull = event.currentParticipants >= event.maxParticipants;
        
        const priceDisplay = event.price === 0 ? 'Gratuit' : `${event.price}€`;
        const priceClass = event.price === 0 ? 'free' : '';

        return `
            <div class="event-card ${isFull ? 'full' : ''}" data-event-id="${event.id}" data-filter-delay="${(index % 3) + 1}">
                <div class="event-image">
                    <img src="${event.image}" alt="${event.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMzQjgyRjY7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRjU5RTBCO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48Y2lyY2xlIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjMwIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC4yIi8+PGkgY2xhc3M9ImZhcyBmYS1jYWxlbmRhciIgc3R5bGU9ImZvbnQtc2l6ZToyMHB4O2NvbG9yOndoaXRlOyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iNTAlIiB5PSI1NSUiPkV2w6luZW1lbnQ8L2k+PC9zdmc+'">
                    
                    <div class="event-type-badge" style="color: ${eventType.color}">
                        <i class="${eventType.icon}"></i>
                        ${eventType.name}
                    </div>
                    
                    <div class="event-date">
                        <div class="event-date-day">${day}</div>
                        <div class="event-date-month">${month}</div>
                    </div>
                </div>
                
                <div class="event-content">
                    <h3 class="event-title">${event.title}</h3>
                    <p class="event-description">${event.description}</p>
                    
                    <div class="event-details">
                        <div class="event-detail">
                            <i class="fas fa-clock"></i>
                            <span>${event.time} - ${this.calculateEndTime(event.time, event.duration)}</span>
                        </div>
                        <div class="event-detail">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location}</span>
                        </div>
                        <div class="event-detail">
                            <i class="fas fa-user-tie"></i>
                            <span>${event.instructor}</span>
                        </div>
                        <div class="event-detail">
                            <i class="fas fa-signal"></i>
                            <span>Niveau: ${event.level}</span>
                        </div>
                    </div>
                    
                    <div class="event-footer">
                        <div class="event-price ${priceClass}">${priceDisplay}</div>
                        <div class="event-participants">
                            <span>${event.currentParticipants}/${event.maxParticipants}</span>
                            <div class="participants-bar">
                                <div class="participants-fill" style="width: ${participantsPercentage}%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="event-actions">
                        <button class="btn-event btn-register" data-event-id="${event.id}" ${isFull ? 'disabled' : ''}>
                            <i class="fas fa-user-plus"></i>
                            ${isFull ? 'Complet' : 'S\'inscrire'}
                        </button>
                        <button class="btn-event btn-info" data-event-id="${event.id}">
                            <i class="fas fa-info-circle"></i>
                            Détails
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getEventType(typeId) {
        return this.eventTypes.find(type => type.id === typeId) || {
            id: typeId,
            name: typeId,
            color: '#3B82F6',
            icon: 'fas fa-calendar'
        };
    }

    calculateEndTime(startTime, duration) {
        const [hours, minutes] = startTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + duration;
        const endHours = Math.floor(totalMinutes / 60);
        const endMinutes = totalMinutes % 60;
        
        return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    }

    animateCards() {
        const cards = document.querySelectorAll('.event-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    loadMoreEvents() {
        this.displayedEventsCount += this.eventsPerLoad;
        this.displayEvents();
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMoreEvents');
        if (loadMoreBtn) {
            if (this.displayedEventsCount >= this.filteredEvents.length) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'inline-flex';
                const remaining = this.filteredEvents.length - this.displayedEventsCount;
                loadMoreBtn.innerHTML = `
                    <i class="fas fa-plus"></i>
                    Voir ${Math.min(remaining, this.eventsPerLoad)} événement${Math.min(remaining, this.eventsPerLoad) > 1 ? 's' : ''} de plus
                `;
            }
        }
    }

    updateNavigation() {
        // Mettre à jour le lien navigation si besoin
        const navLink = document.querySelector('a[href="#evenements"]');
        if (navLink && this.events.length > 0) {
            navLink.innerHTML = `
                <i class="fas fa-calendar-alt"></i>
                Événements <span class="nav-badge">${this.events.length}</span>
            `;
        }
    }

    handleRegistration(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        // Pré-remplir le formulaire de contact
        const subjectSelect = document.getElementById('subject');
        const messageTextarea = document.getElementById('message');

        if (subjectSelect) {
            subjectSelect.value = 'inscription';
        }

        if (messageTextarea) {
            messageTextarea.value = `Bonjour,\n\nJe souhaite m'inscrire à l'événement "${event.title}" du ${new Date(event.date).toLocaleDateString('fr-FR')} à ${event.time}.\n\nCordialement,`;
        }

        // Scroll vers le formulaire
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        
        // Notification
        this.showNotification(`Formulaire pré-rempli pour "${event.title}"`, 'success');
    }

    showEventDetails(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        // Créer une modal avec les détails complets
        this.createEventModal(event);
    }

    createEventModal(event) {
        const modal = document.createElement('div');
        modal.className = 'event-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${event.title}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <img src="${event.image}" alt="${event.title}" class="modal-image">
                        <div class="modal-details">
                            <p><strong>Description:</strong> ${event.description}</p>
                            <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString('fr-FR')}</p>
                            <p><strong>Horaire:</strong> ${event.time} - ${this.calculateEndTime(event.time, event.duration)}</p>
                            <p><strong>Lieu:</strong> ${event.location}</p>
                            <p><strong>Adresse:</strong> ${event.address}</p>
                            <p><strong>Animateur:</strong> ${event.instructor}</p>
                            <p><strong>Niveau:</strong> ${event.level}</p>
                            <p><strong>Matériel:</strong> ${event.materials}</p>
                            <p><strong>Prix:</strong> ${event.price === 0 ? 'Gratuit' : event.price + '€'}</p>
                            <p><strong>Places:</strong> ${event.currentParticipants}/${event.maxParticipants}</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" onclick="eventManager.handleRegistration('${event.id}'); this.closest('.event-modal').remove();">
                            S'inscrire
                        </button>
                        <button class="btn btn-secondary" onclick="this.closest('.event-modal').remove();">
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Gérer la fermeture
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                modal.remove();
            }
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showError(message) {
        const eventsGrid = document.getElementById('eventsGrid');
        if (eventsGrid) {
            eventsGrid.innerHTML = `
                <div class="loading-events">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="eventManager.loadEvents().then(() => eventManager.displayEvents())">
                        Réessayer
                    </button>
                </div>
            `;
        }
    }
}

// Initialiser le gestionnaire d'événements
let eventManager;

// Attendre que le DOM soit chargé
console.log('📝 Script events.js chargé, état du DOM:', document.readyState);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🚀 DOM chargé, initialisation du gestionnaire d\'événements');
        eventManager = new EventManager();
    });
} else {
    console.log('🚀 DOM déjà chargé, initialisation du gestionnaire d\'événements');
    eventManager = new EventManager();
}