/*!
 * ANIM'MÉDIA - GESTION ADMIN DES ÉVÉNEMENTS
 * Interface d'administration pour la gestion des événements
 * Version: 1.0.0
 */

class AdminEventManager {
    constructor() {
        this.events = [];
        this.eventTypes = [];
        this.currentEditingEvent = null;
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        
        this.init();
    }

    async init() {
        console.log('🛠️ Gestionnaire admin des événements initialisé');
        
        await this.loadEvents();
        this.bindEvents();
        this.populateEventsTable();
        this.generateCalendar();
        
        // Définir la date minimum à aujourd'hui
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('eventDate').setAttribute('min', today);
    }

    async loadEvents() {
        try {
            const response = await fetch('../data/events.json');
            if (!response.ok) {
                throw new Error('Erreur de chargement');
            }
            
            const data = await response.json();
            this.events = data.events || [];
            this.eventTypes = data.eventTypes || [];
            
            console.log(`✅ ${this.events.length} événements chargés pour l'admin`);
        } catch (error) {
            console.error('❌ Erreur lors du chargement:', error);
            this.showNotification('Erreur de chargement des événements', 'error');
        }
    }

    bindEvents() {
        // Formulaire d'événement
        const eventForm = document.getElementById('eventForm');
        if (eventForm) {
            eventForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleEventSubmit();
            });
        }

        // Recherche et filtres
        const searchInput = document.getElementById('eventSearch');
        const filterSelect = document.getElementById('filterType');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterEvents());
        }
        
        if (filterSelect) {
            filterSelect.addEventListener('change', () => this.filterEvents());
        }

        // Navigation calendrier
        const prevMonth = document.getElementById('prevMonth');
        const nextMonth = document.getElementById('nextMonth');
        
        if (prevMonth) {
            prevMonth.addEventListener('click', () => this.changeMonth(-1));
        }
        
        if (nextMonth) {
            nextMonth.addEventListener('click', () => this.changeMonth(1));
        }
    }

    populateEventsTable() {
        const tbody = document.getElementById('eventsTableBody');
        if (!tbody) return;

        if (this.events.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="no-events">
                        <i class="fas fa-calendar-times"></i>
                        <p>Aucun événement créé</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.events
            .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))
            .map(event => this.createEventRow(event))
            .join('');
    }

    createEventRow(event) {
        const eventDate = new Date(event.date + 'T' + event.time);
        const eventType = this.getEventType(event.type);
        const now = new Date();
        const isPast = eventDate < now;
        const participantsPercentage = (event.currentParticipants / event.maxParticipants) * 100;
        const status = isPast ? 'Terminé' : 
                      event.currentParticipants >= event.maxParticipants ? 'Complet' : 'Ouvert';
        
        const statusClass = isPast ? 'status-past' : 
                           event.currentParticipants >= event.maxParticipants ? 'status-full' : 'status-open';

        return `
            <tr class="event-row ${isPast ? 'past-event' : ''}">
                <td>
                    <div class="event-info">
                        <strong>${event.title}</strong>
                        <div class="event-time">
                            ${eventDate.toLocaleDateString('fr-FR')} à ${event.time}
                        </div>
                    </div>
                </td>
                <td>
                    <span class="type-badge" style="background-color: ${eventType.color}20; color: ${eventType.color};">
                        <i class="${eventType.icon}"></i>
                        ${eventType.name}
                    </span>
                </td>
                <td>
                    <div class="date-display">
                        ${eventDate.toLocaleDateString('fr-FR', { 
                            weekday: 'short', 
                            day: 'numeric', 
                            month: 'short' 
                        })}
                        <div class="time-display">${event.time} (${event.duration}min)</div>
                    </div>
                </td>
                <td>
                    <div class="participants-display">
                        <span class="participants-count">${event.currentParticipants}/${event.maxParticipants}</span>
                        <div class="participants-bar-small">
                            <div class="participants-fill-small" style="width: ${participantsPercentage}%"></div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="status-badge ${statusClass}">${status}</span>
                </td>
                <td class="actions-cell">
                    <div class="action-buttons">
                        <button class="btn-action btn-edit" onclick="adminEventManager.editEvent('${event.id}')" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-duplicate" onclick="adminEventManager.duplicateEvent('${event.id}')" title="Dupliquer">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn-action btn-delete" onclick="adminEventManager.confirmDeleteEvent('${event.id}')" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
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

    filterEvents() {
        const searchTerm = document.getElementById('eventSearch').value.toLowerCase();
        const filterType = document.getElementById('filterType').value;

        let filteredEvents = this.events;

        if (searchTerm) {
            filteredEvents = filteredEvents.filter(event => 
                event.title.toLowerCase().includes(searchTerm) ||
                event.description.toLowerCase().includes(searchTerm) ||
                event.instructor.toLowerCase().includes(searchTerm)
            );
        }

        if (filterType) {
            filteredEvents = filteredEvents.filter(event => event.type === filterType);
        }

        // Mettre à jour l'affichage
        const tbody = document.getElementById('eventsTableBody');
        if (tbody) {
            if (filteredEvents.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" class="no-events">
                            <i class="fas fa-search"></i>
                            <p>Aucun événement trouvé</p>
                        </td>
                    </tr>
                `;
            } else {
                tbody.innerHTML = filteredEvents
                    .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))
                    .map(event => this.createEventRow(event))
                    .join('');
            }
        }
    }

    handleEventSubmit() {
        const formData = new FormData(document.getElementById('eventForm'));
        const eventData = Object.fromEntries(formData.entries());

        // Validation
        if (!this.validateEventData(eventData)) {
            return;
        }

        // Créer l'objet événement
        const event = {
            id: this.currentEditingEvent ? this.currentEditingEvent.id : this.generateEventId(),
            title: eventData.title,
            type: eventData.type,
            description: eventData.description,
            date: eventData.date,
            time: eventData.time,
            duration: parseInt(eventData.duration),
            location: eventData.location || 'Médiathèque de La Guerche-sur-l\'Aubois',
            address: 'Maison des Associations, 18150 La Guerche-sur-l\'Aubois',
            instructor: eventData.instructor,
            maxParticipants: parseInt(eventData.maxParticipants),
            currentParticipants: this.currentEditingEvent ? this.currentEditingEvent.currentParticipants : 0,
            price: parseFloat(eventData.price) || 0,
            materials: eventData.materials || 'Aucun',
            level: eventData.level || 'Tout public',
            image: eventData.image || this.getDefaultEventImage(eventData.type),
            tags: this.generateTags(eventData),
            status: 'open',
            createdAt: this.currentEditingEvent ? this.currentEditingEvent.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Ajouter ou mettre à jour
        if (this.currentEditingEvent) {
            const index = this.events.findIndex(e => e.id === this.currentEditingEvent.id);
            this.events[index] = event;
            this.showNotification('Événement modifié avec succès !', 'success');
        } else {
            this.events.push(event);
            this.showNotification('Événement créé avec succès !', 'success');
        }

        // Sauvegarder et actualiser
        this.saveEvents();
        this.populateEventsTable();
        this.generateCalendar();
        this.resetEventForm();
        
        // Retourner à la liste
        this.switchTab('events-list');
    }

    validateEventData(data) {
        const required = ['title', 'type', 'description', 'date', 'time', 'duration', 'instructor', 'maxParticipants'];
        
        for (const field of required) {
            if (!data[field] || data[field].toString().trim() === '') {
                this.showNotification(`Le champ "${this.getFieldLabel(field)}" est requis`, 'error');
                return false;
            }
        }

        // Validation de la date
        const eventDate = new Date(data.date + 'T' + data.time);
        const now = new Date();
        
        if (eventDate <= now) {
            this.showNotification('La date de l\'événement doit être dans le futur', 'error');
            return false;
        }

        return true;
    }

    getFieldLabel(field) {
        const labels = {
            title: 'Titre',
            type: 'Type',
            description: 'Description',
            date: 'Date',
            time: 'Heure',
            duration: 'Durée',
            instructor: 'Animateur',
            maxParticipants: 'Nombre de places'
        };
        return labels[field] || field;
    }

    generateEventId() {
        return 'evt_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    generateTags(eventData) {
        const tags = [eventData.type];
        
        // Ajouter des tags basés sur le titre et la description
        const text = (eventData.title + ' ' + eventData.description).toLowerCase();
        
        const keywords = {
            'débutant': 'débutant',
            'avancé': 'avancé',
            'numérique': 'numérique',
            'créatif': 'créatif',
            'cuisine': 'cuisine',
            'photo': 'photographie',
            'histoire': 'histoire',
            'noël': 'noël'
        };

        Object.entries(keywords).forEach(([keyword, tag]) => {
            if (text.includes(keyword) && !tags.includes(tag)) {
                tags.push(tag);
            }
        });

        return tags;
    }

    getDefaultEventImage(type) {
        const defaultImages = {
            atelier: 'assets/images/events/default-atelier.jpg',
            formation: 'assets/images/events/default-formation.jpg',
            exposition: 'assets/images/events/default-exposition.jpg',
            conference: 'assets/images/events/default-conference.jpg',
            sortie: 'assets/images/events/default-sortie.jpg'
        };
        return defaultImages[type] || 'assets/images/events/default-event.jpg';
    }

    editEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        this.currentEditingEvent = event;
        
        // Remplir le formulaire
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventType').value = event.type;
        document.getElementById('eventDescription').value = event.description;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventTime').value = event.time;
        document.getElementById('eventDuration').value = event.duration;
        document.getElementById('eventLocation').value = event.location;
        document.getElementById('eventInstructor').value = event.instructor;
        document.getElementById('eventMaxParticipants').value = event.maxParticipants;
        document.getElementById('eventPrice').value = event.price;
        document.getElementById('eventLevel').value = event.level;
        document.getElementById('eventMaterials').value = event.materials;
        document.getElementById('eventImage').value = event.image;

        // Changer le texte du bouton
        document.getElementById('submitBtnText').textContent = 'Modifier l\'Événement';
        
        // Aller à l'onglet formulaire
        this.switchTab('add-event');
    }

    duplicateEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        // Remplir le formulaire avec les données de l'événement (sauf la date)
        document.getElementById('eventTitle').value = event.title + ' (Copie)';
        document.getElementById('eventType').value = event.type;
        document.getElementById('eventDescription').value = event.description;
        document.getElementById('eventTime').value = event.time;
        document.getElementById('eventDuration').value = event.duration;
        document.getElementById('eventLocation').value = event.location;
        document.getElementById('eventInstructor').value = event.instructor;
        document.getElementById('eventMaxParticipants').value = event.maxParticipants;
        document.getElementById('eventPrice').value = event.price;
        document.getElementById('eventLevel').value = event.level;
        document.getElementById('eventMaterials').value = event.materials;
        document.getElementById('eventImage').value = event.image;

        // Réinitialiser pour création
        this.currentEditingEvent = null;
        document.getElementById('submitBtnText').textContent = 'Créer l\'Événement';
        
        // Aller à l'onglet formulaire
        this.switchTab('add-event');
        
        this.showNotification('Événement dupliqué, modifiez les détails et sauvegardez', 'info');
    }

    confirmDeleteEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        if (confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${event.title}" ?\n\nCette action est irréversible.`)) {
            this.deleteEvent(eventId);
        }
    }

    deleteEvent(eventId) {
        const index = this.events.findIndex(e => e.id === eventId);
        if (index === -1) return;

        const event = this.events[index];
        this.events.splice(index, 1);
        
        this.saveEvents();
        this.populateEventsTable();
        this.generateCalendar();
        
        this.showNotification(`Événement "${event.title}" supprimé`, 'success');
    }

    resetEventForm() {
        document.getElementById('eventForm').reset();
        this.currentEditingEvent = null;
        document.getElementById('submitBtnText').textContent = 'Créer l\'Événement';
        
        // Remettre les valeurs par défaut
        document.getElementById('eventLocation').value = 'Médiathèque de La Guerche-sur-l\'Aubois';
        document.getElementById('eventLevel').value = 'Tout public';
    }

    // Simulation de sauvegarde (en production, ceci ferait un appel API)
    saveEvents() {
        const data = {
            events: this.events,
            eventTypes: this.eventTypes,
            metadata: {
                version: '1.0.0',
                lastUpdate: new Date().toISOString(),
                totalEvents: this.events.length,
                upcomingEvents: this.events.filter(e => new Date(e.date + 'T' + e.time) > new Date()).length
            }
        };

        // En production, remplacer par un appel API
        localStorage.setItem('animMedia_events', JSON.stringify(data));
        console.log('💾 Événements sauvegardés (localStorage)');
    }

    // Navigation entre onglets
    switchTab(tabId) {
        // Masquer tous les contenus
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Désactiver tous les boutons d'onglets
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Activer l'onglet sélectionné
        document.getElementById(tabId).classList.add('active');
        document.querySelector(`[onclick="switchTab('${tabId}')"]`).classList.add('active');

        // Actions spéciales selon l'onglet
        if (tabId === 'add-event') {
            // Focus sur le premier champ
            setTimeout(() => {
                document.getElementById('eventTitle').focus();
            }, 100);
        } else if (tabId === 'calendar-view') {
            // Rafraîchir le calendrier
            this.generateCalendar();
        }
    }

    // Génération du calendrier
    generateCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        const calendarTitle = document.getElementById('calendarTitle');
        
        if (!calendarGrid || !calendarTitle) return;

        // Mettre à jour le titre
        const monthNames = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];
        calendarTitle.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;

        // Créer la grille du calendrier
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        let calendarHTML = '<div class="calendar-weekdays">';
        const weekdays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        weekdays.forEach(day => {
            calendarHTML += `<div class="weekday">${day}</div>`;
        });
        calendarHTML += '</div><div class="calendar-days">';

        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const isCurrentMonth = currentDate.getMonth() === this.currentMonth;
            const isToday = currentDate.toDateString() === new Date().toDateString();
            const dateStr = currentDate.toISOString().split('T')[0];
            
            // Trouver les événements de ce jour
            const dayEvents = this.events.filter(event => event.date === dateStr);
            
            let dayClass = 'calendar-day';
            if (!isCurrentMonth) dayClass += ' other-month';
            if (isToday) dayClass += ' today';
            if (dayEvents.length > 0) dayClass += ' has-events';

            calendarHTML += `
                <div class="${dayClass}">
                    <div class="day-number">${currentDate.getDate()}</div>
                    ${dayEvents.length > 0 ? `
                        <div class="day-events">
                            ${dayEvents.slice(0, 2).map(event => `
                                <div class="day-event" style="background-color: ${this.getEventType(event.type).color}">
                                    ${event.title}
                                </div>
                            `).join('')}
                            ${dayEvents.length > 2 ? `<div class="day-event-more">+${dayEvents.length - 2} autre${dayEvents.length - 2 > 1 ? 's' : ''}</div>` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        calendarHTML += '</div>';
        calendarGrid.innerHTML = calendarHTML;
    }

    changeMonth(direction) {
        this.currentMonth += direction;
        
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        
        this.generateCalendar();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `admin-notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}-circle"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
    }
}

// Fonctions globales pour les événements onclick
function showEventManager() {
    const modal = document.getElementById('eventManagerModal');
    if (modal) {
        modal.classList.remove('hidden');
        // Focus management
        setTimeout(() => {
            const firstInput = modal.querySelector('input, button');
            if (firstInput) firstInput.focus();
        }, 100);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

function switchTab(tabId) {
    if (window.adminEventManager) {
        window.adminEventManager.switchTab(tabId);
    }
}

function resetEventForm() {
    if (window.adminEventManager) {
        window.adminEventManager.resetEventForm();
    }
}

// Initialisation
let adminEventManager;

document.addEventListener('DOMContentLoaded', () => {
    // Attendre que l'utilisateur soit connecté
    const checkAndInit = () => {
        const dashboard = document.getElementById('dashboard');
        if (dashboard && !dashboard.classList.contains('hidden')) {
            adminEventManager = new AdminEventManager();
            window.adminEventManager = adminEventManager;
        } else {
            setTimeout(checkAndInit, 500);
        }
    };
    
    checkAndInit();
});