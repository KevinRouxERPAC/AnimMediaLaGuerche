/*!
 * ANIM'MÉDIA - ADMINISTRATION JAVASCRIPT
 * Interface d'administration simple et intuitive pour bénévoles
 */

// ============================================================================
// CONFIGURATION ET VARIABLES GLOBALES
// ============================================================================

const ADMIN_CONFIG = {
  version: '2.0.0',
  author: 'Anim\'Média La Guerche',
  loginTimeout: 30 * 60 * 1000, // 30 minutes
  autoSaveInterval: 5000, // 5 secondes
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  dateFormat: 'dd/MM/yyyy'
};

let currentUser = null;
let currentSection = 'dashboard';
let autoSaveTimer = null;
let sessionTimer = null;

// ============================================================================
// SYSTÈME D'AUTHENTIFICATION
// ============================================================================

class AdminAuth {
  constructor() {
    this.users = [
      { id: 1, username: 'admin', password: 'animmedia2024', role: 'admin', name: 'Administrateur' },
      { id: 2, username: 'benevole1', password: 'benevole123', role: 'editor', name: 'Bénévole 1' },
      { id: 3, username: 'benevole2', password: 'benevole456', role: 'editor', name: 'Bénévole 2' }
    ];
    
    this.checkSession();
  }
  
  login(username, password) {
    const user = this.users.find(u => u.username === username && u.password === password);
    
    if (user) {
      currentUser = { ...user };
      delete currentUser.password;
      
      localStorage.setItem('admin_session', JSON.stringify({
        user: currentUser,
        timestamp: Date.now(),
        expires: Date.now() + ADMIN_CONFIG.loginTimeout
      }));
      
      this.showMainInterface();
      this.startSessionTimer();
      adminNotifications.show('Connexion réussie', 'success');
      
      return true;
    }
    
    return false;
  }
  
  logout() {
    localStorage.removeItem('admin_session');
    currentUser = null;
    this.clearSessionTimer();
    this.showLoginScreen();
    adminNotifications.show('Déconnexion réussie', 'info');
  }
  
  checkSession() {
    const session = localStorage.getItem('admin_session');
    
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        
        if (Date.now() < sessionData.expires) {
          currentUser = sessionData.user;
          this.showMainInterface();
          this.startSessionTimer();
          return true;
        } else {
          localStorage.removeItem('admin_session');
        }
      } catch (e) {
        localStorage.removeItem('admin_session');
      }
    }
    
    this.showLoginScreen();
    return false;
  }
  
  showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('mainInterface').classList.add('hidden');
  }
  
  showMainInterface() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainInterface').classList.remove('hidden');
    
    // Mise à jour des informations utilisateur
    document.getElementById('currentUserName').textContent = currentUser.name;
    document.getElementById('currentUserRole').textContent = currentUser.role === 'admin' ? 'Administrateur' : 'Bénévole';
    
    // Chargement du tableau de bord
    adminNavigation.showSection('dashboard');
  }
  
  startSessionTimer() {
    this.clearSessionTimer();
    sessionTimer = setTimeout(() => {
      this.logout();
      adminNotifications.show('Session expirée, veuillez vous reconnecter', 'warning');
    }, ADMIN_CONFIG.loginTimeout);
  }
  
  clearSessionTimer() {
    if (sessionTimer) {
      clearTimeout(sessionTimer);
      sessionTimer = null;
    }
  }
  
  extendSession() {
    if (currentUser) {
      const session = JSON.parse(localStorage.getItem('admin_session'));
      session.expires = Date.now() + ADMIN_CONFIG.loginTimeout;
      localStorage.setItem('admin_session', JSON.stringify(session));
      this.startSessionTimer();
    }
  }
}

// ============================================================================
// SYSTÈME DE NAVIGATION
// ============================================================================

class AdminNavigation {
  constructor() {
    this.sections = {
      dashboard: { title: 'Tableau de Bord', icon: 'fas fa-tachometer-alt' },
      events: { title: 'Événements', icon: 'fas fa-calendar-alt' },
      activities: { title: 'Activités', icon: 'fas fa-users' },
      gallery: { title: 'Galerie Photos', icon: 'fas fa-images' },
      settings: { title: 'Paramètres', icon: 'fas fa-cogs' }
    };
    
    this.initNavigation();
  }
  
  initNavigation() {
    // Gestion des clics sur les éléments de navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const section = e.currentTarget.getAttribute('data-section');
        if (section) {
          this.showSection(section);
        }
      });
    });
  }
  
  showSection(sectionName) {
    // Mise à jour de la navigation active
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    const activeItem = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
    }
    
    // Masquer toutes les sections
    document.querySelectorAll('[data-content]').forEach(section => {
      section.classList.add('hidden');
    });
    
    // Afficher la section demandée
    const targetSection = document.querySelector(`[data-content="${sectionName}"]`);
    if (targetSection) {
      targetSection.classList.remove('hidden');
      targetSection.classList.add('fade-in');
    }
    
    currentSection = sectionName;
    
    // Chargement des données de la section
    this.loadSectionData(sectionName);
    
    // Extension de session
    adminAuth.extendSession();
  }
  
  loadSectionData(sectionName) {
    switch (sectionName) {
      case 'dashboard':
        this.loadDashboard();
        break;
      case 'events':
        adminEvents.loadEvents();
        break;
      case 'activities':
        adminActivities.loadActivities();
        break;
      case 'gallery':
        adminGallery.loadGallery();
        break;
      case 'settings':
        adminSettings.loadSettings();
        break;
    }
  }
  
  loadDashboard() {
    // Statistiques du tableau de bord
    const stats = {
      events: adminEvents.getEventsCount(),
      activities: adminActivities.getActivitiesCount(),
      photos: adminGallery.getPhotosCount(),
      members: 45 // Exemple
    };
    
    // Mise à jour des cartes statistiques
    document.getElementById('statsEvents').textContent = stats.events;
    document.getElementById('statsActivities').textContent = stats.activities;
    document.getElementById('statsPhotos').textContent = stats.photos;
    document.getElementById('statsMembers').textContent = stats.members;
    
    // Chargement des événements récents
    this.loadRecentEvents();
    
    // Chargement des activités populaires
    this.loadPopularActivities();
  }
  
  loadRecentEvents() {
    const events = adminEvents.getRecentEvents(3);
    const container = document.getElementById('recentEventsList');
    
    if (!container) return;
    
    container.innerHTML = events.map(event => `
      <div class="recent-item">
        <div class="recent-item-date">
          <span class="date-day">${new Date(event.date).getDate()}</span>
          <span class="date-month">${new Date(event.date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
        </div>
        <div class="recent-item-content">
          <h4>${event.title}</h4>
          <p>${event.location}</p>
        </div>
      </div>
    `).join('');
  }
  
  loadPopularActivities() {
    const activities = adminActivities.getPopularActivities(3);
    const container = document.getElementById('popularActivitiesList');
    
    if (!container) return;
    
    container.innerHTML = activities.map(activity => `
      <div class="popular-item">
        <div class="popular-item-icon">
          <i class="${activity.icon}"></i>
        </div>
        <div class="popular-item-content">
          <h4>${activity.title}</h4>
          <p>${activity.participants} participants</p>
        </div>
      </div>
    `).join('');
  }
}

// ============================================================================
// GESTION DES ÉVÉNEMENTS
// ============================================================================

class AdminEvents {
  constructor() {
    this.events = this.loadEventsFromStorage();
    this.initEventHandlers();
  }
  
  loadEventsFromStorage() {
    const stored = localStorage.getItem('admin_events');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Données d'exemple
    return [
      {
        id: 1,
        title: 'Atelier Théâtre Enfants',
        description: 'Atelier créatif pour les 6-12 ans',
        date: '2024-02-15',
        time: '14:00',
        location: 'Salle Polyvalente',
        image: 'assets/images/events/theatre-enfants.jpg',
        status: 'published',
        createdAt: Date.now()
      },
      {
        id: 2,
        title: 'Soirée Jeux de Société',
        description: 'Soirée conviviale pour toute la famille',
        date: '2024-02-20',
        time: '19:30',
        location: 'Foyer Rural',
        image: 'assets/images/events/jeux-societe.jpg',
        status: 'published',
        createdAt: Date.now()
      }
    ];
  }
  
  saveEventsToStorage() {
    localStorage.setItem('admin_events', JSON.stringify(this.events));
  }
  
  initEventHandlers() {
    // Bouton d'ajout d'événement
    const addBtn = document.getElementById('addEventBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.showEventModal());
    }
    
    // Formulaire d'événement
    const form = document.getElementById('eventForm');
    if (form) {
      form.addEventListener('submit', (e) => this.saveEvent(e));
    }
  }
  
  loadEvents() {
    const container = document.getElementById('eventsTable');
    if (!container) return;
    
    const tbody = container.querySelector('tbody');
    tbody.innerHTML = this.events.map(event => `
      <tr>
        <td>
          <strong>${event.title}</strong><br>
          <small class="text-muted">${event.description}</small>
        </td>
        <td>${new Date(event.date).toLocaleDateString('fr-FR')}</td>
        <td>${event.time}</td>
        <td>${event.location}</td>
        <td>
          <span class="badge badge-${event.status === 'published' ? 'success' : 'warning'}">
            ${event.status === 'published' ? 'Publié' : 'Brouillon'}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="adminEvents.editEvent(${event.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-error" onclick="adminEvents.deleteEvent(${event.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }
  
  showEventModal(eventId = null) {
    const modal = document.getElementById('eventModal');
    const form = document.getElementById('eventForm');
    
    if (eventId) {
      const event = this.events.find(e => e.id === eventId);
      if (event) {
        form.eventId.value = event.id;
        form.eventTitle.value = event.title;
        form.eventDescription.value = event.description;
        form.eventDate.value = event.date;
        form.eventTime.value = event.time;
        form.eventLocation.value = event.location;
        form.eventStatus.value = event.status;
      }
    } else {
      form.reset();
      form.eventId.value = '';
    }
    
    modal.classList.remove('hidden');
  }
  
  saveEvent(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const eventData = {
      title: formData.get('eventTitle'),
      description: formData.get('eventDescription'),
      date: formData.get('eventDate'),
      time: formData.get('eventTime'),
      location: formData.get('eventLocation'),
      status: formData.get('eventStatus')
    };
    
    const eventId = formData.get('eventId');
    
    if (eventId) {
      // Modification d'un événement existant
      const index = this.events.findIndex(e => e.id == eventId);
      if (index !== -1) {
        this.events[index] = { ...this.events[index], ...eventData };
        adminNotifications.show('Événement modifié avec succès', 'success');
      }
    } else {
      // Création d'un nouvel événement
      const newEvent = {
        id: Date.now(),
        ...eventData,
        image: '',
        createdAt: Date.now()
      };
      
      this.events.unshift(newEvent);
      adminNotifications.show('Événement créé avec succès', 'success');
    }
    
    this.saveEventsToStorage();
    this.loadEvents();
    adminModals.close('eventModal');
  }
  
  editEvent(id) {
    this.showEventModal(id);
  }
  
  deleteEvent(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      this.events = this.events.filter(e => e.id !== id);
      this.saveEventsToStorage();
      this.loadEvents();
      adminNotifications.show('Événement supprimé', 'info');
    }
  }
  
  getEventsCount() {
    return this.events.length;
  }
  
  getRecentEvents(limit = 5) {
    return this.events
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, limit);
  }
}

// ============================================================================
// GESTION DES ACTIVITÉS
// ============================================================================

class AdminActivities {
  constructor() {
    this.activities = this.loadActivitiesFromStorage();
    this.initActivityHandlers();
  }
  
  loadActivitiesFromStorage() {
    const stored = localStorage.getItem('admin_activities');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Données d'exemple
    return [
      {
        id: 1,
        title: 'Théâtre',
        description: 'Cours de théâtre pour tous âges',
        category: 'Spectacle',
        age: '6-99 ans',
        schedule: 'Mercredi 14h-16h',
        instructor: 'Marie Dubois',
        participants: 15,
        maxParticipants: 20,
        price: '150€/trimestre',
        icon: 'fas fa-theater-masks',
        status: 'active',
        createdAt: Date.now()
      },
      {
        id: 2,
        title: 'Cuisine du Monde',
        description: 'Découverte des cuisines internationales',
        category: 'Loisirs',
        age: '16-99 ans',
        schedule: 'Samedi 10h-12h',
        instructor: 'Jean Martin',
        participants: 12,
        maxParticipants: 15,
        price: '200€/trimestre',
        icon: 'fas fa-utensils',
        status: 'active',
        createdAt: Date.now()
      }
    ];
  }
  
  saveActivitiesToStorage() {
    localStorage.setItem('admin_activities', JSON.stringify(this.activities));
  }
  
  initActivityHandlers() {
    const addBtn = document.getElementById('addActivityBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.showActivityModal());
    }
    
    const form = document.getElementById('activityForm');
    if (form) {
      form.addEventListener('submit', (e) => this.saveActivity(e));
    }
  }
  
  loadActivities() {
    const container = document.getElementById('activitiesGrid');
    if (!container) return;
    
    container.innerHTML = this.activities.map(activity => `
      <div class="admin-card">
        <div class="admin-card-header">
          <h3 class="admin-card-title">
            <i class="${activity.icon}"></i>
            ${activity.title}
          </h3>
          <div class="card-actions">
            <button class="btn btn-sm btn-outline" onclick="adminActivities.editActivity(${activity.id})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-error" onclick="adminActivities.deleteActivity(${activity.id})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="activity-details">
          <p><strong>Catégorie:</strong> ${activity.category}</p>
          <p><strong>Âge:</strong> ${activity.age}</p>
          <p><strong>Horaires:</strong> ${activity.schedule}</p>
          <p><strong>Animateur:</strong> ${activity.instructor}</p>
          <p><strong>Participants:</strong> ${activity.participants}/${activity.maxParticipants}</p>
          <p><strong>Prix:</strong> ${activity.price}</p>
          <div class="activity-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${(activity.participants / activity.maxParticipants) * 100}%"></div>
            </div>
            <span class="progress-text">${Math.round((activity.participants / activity.maxParticipants) * 100)}% complet</span>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  showActivityModal(activityId = null) {
    const modal = document.getElementById('activityModal');
    const form = document.getElementById('activityForm');
    
    if (activityId) {
      const activity = this.activities.find(a => a.id === activityId);
      if (activity) {
        // Remplir le formulaire avec les données existantes
        Object.keys(activity).forEach(key => {
          const field = form.elements[`activity${key.charAt(0).toUpperCase() + key.slice(1)}`];
          if (field) field.value = activity[key];
        });
        form.activityId.value = activity.id;
      }
    } else {
      form.reset();
      form.activityId.value = '';
    }
    
    modal.classList.remove('hidden');
  }
  
  saveActivity(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const activityData = {
      title: formData.get('activityTitle'),
      description: formData.get('activityDescription'),
      category: formData.get('activityCategory'),
      age: formData.get('activityAge'),
      schedule: formData.get('activitySchedule'),
      instructor: formData.get('activityInstructor'),
      participants: parseInt(formData.get('activityParticipants')) || 0,
      maxParticipants: parseInt(formData.get('activityMaxParticipants')) || 20,
      price: formData.get('activityPrice'),
      icon: formData.get('activityIcon') || 'fas fa-star',
      status: formData.get('activityStatus') || 'active'
    };
    
    const activityId = formData.get('activityId');
    
    if (activityId) {
      const index = this.activities.findIndex(a => a.id == activityId);
      if (index !== -1) {
        this.activities[index] = { ...this.activities[index], ...activityData };
        adminNotifications.show('Activité modifiée avec succès', 'success');
      }
    } else {
      const newActivity = {
        id: Date.now(),
        ...activityData,
        createdAt: Date.now()
      };
      
      this.activities.unshift(newActivity);
      adminNotifications.show('Activité créée avec succès', 'success');
    }
    
    this.saveActivitiesToStorage();
    this.loadActivities();
    adminModals.close('activityModal');
  }
  
  editActivity(id) {
    this.showActivityModal(id);
  }
  
  deleteActivity(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
      this.activities = this.activities.filter(a => a.id !== id);
      this.saveActivitiesToStorage();
      this.loadActivities();
      adminNotifications.show('Activité supprimée', 'info');
    }
  }
  
  getActivitiesCount() {
    return this.activities.length;
  }
  
  getPopularActivities(limit = 5) {
    return this.activities
      .sort((a, b) => b.participants - a.participants)
      .slice(0, limit);
  }
}

// ============================================================================
// GESTION DE LA GALERIE
// ============================================================================

class AdminGallery {
  constructor() {
    this.photos = this.loadPhotosFromStorage();
    this.initGalleryHandlers();
  }
  
  loadPhotosFromStorage() {
    const stored = localStorage.getItem('admin_gallery');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Photos d'exemple
    return [
      {
        id: 1,
        title: 'Atelier Théâtre 2024',
        description: 'Les enfants en pleine représentation',
        src: 'assets/images/gallery/theatre-1.jpg',
        category: 'Théâtre',
        date: '2024-01-15',
        createdAt: Date.now()
      },
      {
        id: 2,
        title: 'Cuisine du Monde',
        description: 'Préparation d\'un plat italien',
        src: 'assets/images/gallery/cuisine-1.jpg',
        category: 'Cuisine',
        date: '2024-01-20',
        createdAt: Date.now()
      }
    ];
  }
  
  savePhotosToStorage() {
    localStorage.setItem('admin_gallery', JSON.stringify(this.photos));
  }
  
  initGalleryHandlers() {
    const uploadBtn = document.getElementById('uploadPhotoBtn');
    if (uploadBtn) {
      uploadBtn.addEventListener('click', () => this.showUploadModal());
    }
    
    const form = document.getElementById('photoForm');
    if (form) {
      form.addEventListener('submit', (e) => this.savePhoto(e));
    }
    
    // Drag & Drop pour l'upload
    this.initDragDrop();
  }
  
  initDragDrop() {
    const dropZone = document.getElementById('photoDropZone');
    if (!dropZone) return;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, () => {
        dropZone.classList.add('drag-over');
      });
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, () => {
        dropZone.classList.remove('drag-over');
      });
    });
    
    dropZone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      this.handleFiles(files);
    });
  }
  
  loadGallery() {
    const container = document.getElementById('galleryGrid');
    if (!container) return;
    
    container.innerHTML = this.photos.map(photo => `
      <div class="gallery-item">
        <div class="gallery-image">
          <img src="${photo.src}" alt="${photo.title}" loading="lazy">
          <div class="gallery-overlay">
            <div class="gallery-actions">
              <button class="btn btn-sm btn-primary" onclick="adminGallery.viewPhoto(${photo.id})">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn btn-sm btn-outline" onclick="adminGallery.editPhoto(${photo.id})">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-error" onclick="adminGallery.deletePhoto(${photo.id})">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="gallery-info">
          <h4>${photo.title}</h4>
          <p>${photo.description}</p>
          <small class="text-muted">
            ${photo.category} • ${new Date(photo.date).toLocaleDateString('fr-FR')}
          </small>
        </div>
      </div>
    `).join('');
  }
  
  showUploadModal() {
    const modal = document.getElementById('photoModal');
    const form = document.getElementById('photoForm');
    form.reset();
    modal.classList.remove('hidden');
  }
  
  handleFiles(files) {
    Array.from(files).forEach(file => {
      if (this.validateFile(file)) {
        this.previewFile(file);
      }
    });
  }
  
  validateFile(file) {
    if (!ADMIN_CONFIG.allowedImageTypes.includes(file.type)) {
      adminNotifications.show('Type de fichier non supporté', 'error');
      return false;
    }
    
    if (file.size > ADMIN_CONFIG.maxFileSize) {
      adminNotifications.show('Fichier trop volumineux (max 5MB)', 'error');
      return false;
    }
    
    return true;
  }
  
  previewFile(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const preview = document.getElementById('photoPreview');
      if (preview) {
        preview.innerHTML = `<img src="${e.target.result}" alt="Aperçu" style="max-width: 100%; border-radius: 0.5rem;">`;
      }
    };
    
    reader.readAsDataURL(file);
  }
  
  savePhoto(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const photoData = {
      title: formData.get('photoTitle'),
      description: formData.get('photoDescription'),
      category: formData.get('photoCategory'),
      date: formData.get('photoDate') || new Date().toISOString().split('T')[0]
    };
    
    const fileInput = form.querySelector('input[type="file"]');
    const file = fileInput.files[0];
    
    if (file) {
      // Simulation de l'upload (en réalité, il faudrait envoyer vers un serveur)
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto = {
          id: Date.now(),
          ...photoData,
          src: e.target.result, // En production, ce serait l'URL retournée par le serveur
          createdAt: Date.now()
        };
        
        this.photos.unshift(newPhoto);
        this.savePhotosToStorage();
        this.loadGallery();
        adminModals.close('photoModal');
        adminNotifications.show('Photo ajoutée avec succès', 'success');
      };
      reader.readAsDataURL(file);
    }
  }
  
  viewPhoto(id) {
    const photo = this.photos.find(p => p.id === id);
    if (photo) {
      // Ouvrir une lightbox ou modal de visualisation
      console.log('Voir photo:', photo);
    }
  }
  
  editPhoto(id) {
    console.log('Éditer photo:', id);
  }
  
  deletePhoto(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) {
      this.photos = this.photos.filter(p => p.id !== id);
      this.savePhotosToStorage();
      this.loadGallery();
      adminNotifications.show('Photo supprimée', 'info');
    }
  }
  
  getPhotosCount() {
    return this.photos.length;
  }
}

// ============================================================================
// SYSTÈME DE PARAMÈTRES
// ============================================================================

class AdminSettings {
  constructor() {
    this.settings = this.loadSettingsFromStorage();
    this.initSettingsHandlers();
  }
  
  loadSettingsFromStorage() {
    const stored = localStorage.getItem('admin_settings');
    if (stored) {
      return JSON.parse(stored);
    }
    
    return {
      site: {
        name: 'Anim\'Média La Guerche',
        description: 'Association culturelle et de loisirs',
        email: 'contact@animmedia-laguerche.fr',
        phone: '02 48 80 XX XX',
        address: 'La Guerche-sur-l\'Aubois, 18150'
      },
      social: {
        facebook: 'https://facebook.com/animmedia',
        instagram: '',
        twitter: ''
      },
      notifications: {
        email: true,
        browser: true,
        newsletter: true
      }
    };
  }
  
  saveSettingsToStorage() {
    localStorage.setItem('admin_settings', JSON.stringify(this.settings));
  }
  
  initSettingsHandlers() {
    const form = document.getElementById('settingsForm');
    if (form) {
      form.addEventListener('submit', (e) => this.saveSettings(e));
    }
  }
  
  loadSettings() {
    const form = document.getElementById('settingsForm');
    if (!form) return;
    
    // Remplir le formulaire avec les paramètres actuels
    Object.keys(this.settings).forEach(section => {
      Object.keys(this.settings[section]).forEach(key => {
        const fieldName = `${section}_${key}`;
        const field = form.elements[fieldName];
        if (field) {
          if (field.type === 'checkbox') {
            field.checked = this.settings[section][key];
          } else {
            field.value = this.settings[section][key];
          }
        }
      });
    });
  }
  
  saveSettings(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Mise à jour des paramètres
    Object.keys(this.settings).forEach(section => {
      Object.keys(this.settings[section]).forEach(key => {
        const fieldName = `${section}_${key}`;
        const field = form.elements[fieldName];
        if (field) {
          if (field.type === 'checkbox') {
            this.settings[section][key] = field.checked;
          } else {
            this.settings[section][key] = field.value;
          }
        }
      });
    });
    
    this.saveSettingsToStorage();
    adminNotifications.show('Paramètres sauvegardés', 'success');
  }
}

// ============================================================================
// SYSTÈME DE NOTIFICATIONS
// ============================================================================

class AdminNotifications {
  constructor() {
    this.container = document.getElementById('notificationContainer');
    this.notifications = [];
  }
  
  show(message, type = 'info', duration = 5000) {
    const notification = {
      id: Date.now(),
      message,
      type,
      duration
    };
    
    this.notifications.push(notification);
    this.render(notification);
    
    // Auto-suppression
    setTimeout(() => {
      this.remove(notification.id);
    }, duration);
  }
  
  render(notification) {
    if (!this.container) return;
    
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-triangle',
      warning: 'fas fa-exclamation-circle',
      info: 'fas fa-info-circle'
    };
    
    const element = document.createElement('div');
    element.className = `notification notification-${notification.type}`;
    element.dataset.id = notification.id;
    element.innerHTML = `
      <i class="${icons[notification.type]}"></i>
      <span>${notification.message}</span>
    `;
    
    element.addEventListener('click', () => {
      this.remove(notification.id);
    });
    
    this.container.appendChild(element);
  }
  
  remove(id) {
    const element = this.container.querySelector(`[data-id="${id}"]`);
    if (element) {
      element.style.animation = 'notificationSlideOut 0.3s ease-in forwards';
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }, 300);
    }
    
    this.notifications = this.notifications.filter(n => n.id !== id);
  }
}

// ============================================================================
// GESTION DES MODALES
// ============================================================================

class AdminModals {
  constructor() {
    this.initModalHandlers();
  }
  
  initModalHandlers() {
    // Fermeture par clic sur l'overlay
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        const modalId = e.target.id;
        this.close(modalId);
      }
    });
    
    // Fermeture par bouton close
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) {
          this.close(modal.id);
        }
      });
    });
    
    // Fermeture par échap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal-overlay:not(.hidden)');
        if (openModal) {
          this.close(openModal.id);
        }
      }
    });
  }
  
  open(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }
  
  close(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }
}

// ============================================================================
// SYSTÈME D'AUTO-SAUVEGARDE
// ============================================================================

class AdminAutoSave {
  constructor() {
    this.setupAutoSave();
  }
  
  setupAutoSave() {
    // Auto-sauvegarde des formulaires en cours
    document.addEventListener('input', (e) => {
      if (e.target.form && e.target.form.classList.contains('auto-save')) {
        this.saveFormState(e.target.form);
      }
    });
    
    // Restauration au chargement
    document.addEventListener('DOMContentLoaded', () => {
      this.restoreFormStates();
    });
  }
  
  saveFormState(form) {
    const formId = form.id;
    if (!formId) return;
    
    const formData = new FormData(form);
    const state = {};
    
    for (let [key, value] of formData.entries()) {
      state[key] = value;
    }
    
    localStorage.setItem(`autosave_${formId}`, JSON.stringify(state));
  }
  
  restoreFormStates() {
    document.querySelectorAll('form.auto-save').forEach(form => {
      const formId = form.id;
      const saved = localStorage.getItem(`autosave_${formId}`);
      
      if (saved) {
        try {
          const state = JSON.parse(saved);
          Object.keys(state).forEach(key => {
            const field = form.elements[key];
            if (field) {
              field.value = state[key];
            }
          });
        } catch (e) {
          console.error('Erreur lors de la restauration:', e);
        }
      }
    });
  }
  
  clearFormState(formId) {
    localStorage.removeItem(`autosave_${formId}`);
  }
}

// ============================================================================
// INITIALISATION GLOBALE
// ============================================================================

// Variables globales pour les modules
let adminAuth;
let adminNavigation;
let adminEvents;
let adminActivities;
let adminGallery;
let adminSettings;
let adminNotifications;
let adminModals;
let adminAutoSave;

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  // Initialisation des modules
  adminAuth = new AdminAuth();
  adminNavigation = new AdminNavigation();
  adminEvents = new AdminEvents();
  adminActivities = new AdminActivities();
  adminGallery = new AdminGallery();
  adminSettings = new AdminSettings();
  adminNotifications = new AdminNotifications();
  adminModals = new AdminModals();
  adminAutoSave = new AdminAutoSave();
  
  // Gestion du formulaire de connexion
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const username = loginForm.username.value;
      const password = loginForm.password.value;
      
      if (adminAuth.login(username, password)) {
        loginForm.reset();
      } else {
        adminNotifications.show('Identifiants incorrects', 'error');
        
        // Animation d'erreur
        const container = document.querySelector('.login-container');
        container.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
          container.style.animation = '';
        }, 500);
      }
    });
  }
  
  // Gestion du bouton de déconnexion
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      adminAuth.logout();
    });
  }
  
  // Gestion du toggle de mot de passe
  const passwordToggle = document.getElementById('passwordToggle');
  if (passwordToggle) {
    passwordToggle.addEventListener('click', () => {
      const passwordField = document.getElementById('password');
      const icon = passwordToggle.querySelector('i');
      
      if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.className = 'fas fa-eye-slash';
      } else {
        passwordField.type = 'password';
        icon.className = 'fas fa-eye';
      }
    });
  }
  
  console.log('Interface d\'administration initialisée');
});

// Animation de shake pour les erreurs de connexion
const shakeKeyframes = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;

// Ajout des styles d'animation
if (!document.querySelector('#admin-animations')) {
  const style = document.createElement('style');
  style.id = 'admin-animations';
  style.textContent = shakeKeyframes + `
    @keyframes notificationSlideOut {
      to {
        opacity: 0;
        transform: translateX(100%);
      }
    }
    
    .drag-over {
      border-color: var(--admin-primary) !important;
      background-color: rgba(78, 205, 196, 0.1) !important;
    }
    
    .progress-bar {
      width: 100%;
      height: 8px;
      background: var(--admin-border);
      border-radius: 4px;
      overflow: hidden;
      margin: var(--admin-space-sm) 0;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--admin-primary), var(--admin-secondary));
      transition: width 0.3s ease;
    }
    
    .progress-text {
      font-size: 0.75rem;
      color: var(--admin-text-light);
    }
    
    .badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      border-radius: 0.25rem;
    }
    
    .badge-success {
      background: var(--admin-success);
      color: white;
    }
    
    .badge-warning {
      background: var(--admin-warning);
      color: white;
    }
    
    .gallery-item {
      background: var(--admin-card);
      border-radius: 0.75rem;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s ease;
    }
    
    .gallery-item:hover {
      transform: translateY(-2px);
    }
    
    .gallery-image {
      position: relative;
      aspect-ratio: 16/9;
      overflow: hidden;
    }
    
    .gallery-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .gallery-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    
    .gallery-item:hover .gallery-overlay {
      opacity: 1;
    }
    
    .gallery-actions {
      display: flex;
      gap: var(--admin-space-sm);
    }
    
    .gallery-info {
      padding: var(--admin-space-lg);
    }
    
    .gallery-info h4 {
      margin: 0 0 var(--admin-space-sm);
      font-size: 1rem;
      font-weight: 600;
    }
    
    .gallery-info p {
      margin: 0 0 var(--admin-space-sm);
      color: var(--admin-text-light);
      font-size: 0.875rem;
    }
    
    .text-muted {
      color: var(--admin-text-light) !important;
    }
  `;
  document.head.appendChild(style);
}

// Export pour utilisation externe si nécessaire
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AdminAuth,
    AdminNavigation,
    AdminEvents,
    AdminActivities,
    AdminGallery,
    AdminSettings,
    AdminNotifications,
    AdminModals,
    AdminAutoSave
  };
}