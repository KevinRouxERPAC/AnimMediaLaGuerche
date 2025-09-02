// ============================================================================
// Admin Actions - Anim'Média
// Opérations CRUD et actions utilisateur
// ============================================================================

// ============================================================================
// EVENT ACTIONS
// ============================================================================
AdminApp.prototype.saveEvent = function(eventId = null) {
    const form = document.getElementById('eventForm');
    const formData = new FormData(form);
    
    // Validation
    if (!formData.get('title').trim()) {
        this.showNotification('Le titre est obligatoire', 'error');
        return;
    }
    
    if (!formData.get('date')) {
        this.showNotification('La date est obligatoire', 'error');
        return;
    }
    
    const eventData = {
        id: eventId || this.generateId(),
        title: formData.get('title').trim(),
        date: formData.get('date'),
        time: formData.get('time'),
        location: formData.get('location').trim(),
        description: formData.get('description').trim(),
        image: formData.get('image').trim(),
        published: formData.get('published') === 'on',
        createdAt: eventId ? this.siteData.events.find(e => e.id === eventId)?.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Validation de l'URL d'image
    if (eventData.image && !this.isValidUrl(eventData.image)) {
        this.showNotification('L\'URL de l\'image n\'est pas valide', 'error');
        return;
    }
    
    // Validation de la date
    const eventDate = new Date(eventData.date);
    if (eventDate < new Date().setHours(0, 0, 0, 0)) {
        if (!confirm('La date de l\'événement est dans le passé. Continuer ?')) {
            return;
        }
    }
    
    if (!this.siteData.events) {
        this.siteData.events = [];
    }
    
    if (eventId) {
        // Modification
        const index = this.siteData.events.findIndex(e => e.id === eventId);
        if (index !== -1) {
            this.siteData.events[index] = eventData;
            this.showNotification('Événement modifié avec succès', 'success');
        }
    } else {
        // Création
        this.siteData.events.unshift(eventData);
        this.showNotification('Événement créé avec succès', 'success');
    }
    
    this.saveSiteData();
    this.closeModal();
    
    if (this.currentSection === 'events') {
        this.renderSection('events');
    }
};

AdminApp.prototype.deleteEvent = function(eventId) {
    const event = this.siteData.events.find(e => e.id === eventId);
    if (!event) {
        this.showNotification('Événement non trouvé', 'error');
        return;
    }
    
    this.showConfirmModal(
        'Supprimer l\'événement',
        `Êtes-vous sûr de vouloir supprimer l'événement "${event.title}" ? Cette action est irréversible.`,
        () => {
            this.siteData.events = this.siteData.events.filter(e => e.id !== eventId);
            this.saveSiteData();
            this.showNotification('Événement supprimé', 'success');
            
            if (this.currentSection === 'events') {
                this.renderSection('events');
            }
        }
    );
};

AdminApp.prototype.toggleEventPublish = function(eventId) {
    const event = this.siteData.events.find(e => e.id === eventId);
    if (!event) {
        this.showNotification('Événement non trouvé', 'error');
        return;
    }
    
    event.published = !event.published;
    event.updatedAt = new Date().toISOString();
    
    this.saveSiteData();
    this.showNotification(
        event.published ? 'Événement publié' : 'Événement dépublié',
        'success'
    );
    
    if (this.currentSection === 'events') {
        this.renderSection('events');
    }
};

// ============================================================================
// ACTIVITY ACTIONS
// ============================================================================
AdminApp.prototype.saveActivity = function(activityId = null) {
    const form = document.getElementById('activityForm');
    const formData = new FormData(form);
    
    // Validation
    if (!formData.get('title').trim()) {
        this.showNotification('Le titre est obligatoire', 'error');
        return;
    }
    
    // Récupérer les éléments
    const items = Array.from(form.querySelectorAll('input[name="items[]"]'))
        .map(input => input.value.trim())
        .filter(item => item.length > 0);
    
    if (items.length === 0) {
        this.showNotification('Ajoutez au moins un élément à l\'activité', 'error');
        return;
    }
    
    const activityData = {
        id: activityId || this.generateId(),
        title: formData.get('title').trim(),
        icon: formData.get('icon').trim() || 'fas fa-puzzle-piece',
        items: items,
        published: formData.get('published') === 'on',
        order: activityId ? this.siteData.activities.find(a => a.id === activityId)?.order : this.getNextActivityOrder(),
        createdAt: activityId ? this.siteData.activities.find(a => a.id === activityId)?.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    if (!this.siteData.activities) {
        this.siteData.activities = [];
    }
    
    if (activityId) {
        // Modification
        const index = this.siteData.activities.findIndex(a => a.id === activityId);
        if (index !== -1) {
            this.siteData.activities[index] = activityData;
            this.showNotification('Activité modifiée avec succès', 'success');
        }
    } else {
        // Création
        this.siteData.activities.push(activityData);
        this.showNotification('Activité créée avec succès', 'success');
    }
    
    this.saveSiteData();
    this.closeModal();
    
    if (this.currentSection === 'activities') {
        this.renderSection('activities');
    }
};

AdminApp.prototype.deleteActivity = function(activityId) {
    const activity = this.siteData.activities.find(a => a.id === activityId);
    if (!activity) {
        this.showNotification('Activité non trouvée', 'error');
        return;
    }
    
    this.showConfirmModal(
        'Supprimer l\'activité',
        `Êtes-vous sûr de vouloir supprimer l'activité "${activity.title}" ? Cette action est irréversible.`,
        () => {
            this.siteData.activities = this.siteData.activities.filter(a => a.id !== activityId);
            this.saveSiteData();
            this.showNotification('Activité supprimée', 'success');
            
            if (this.currentSection === 'activities') {
                this.renderSection('activities');
            }
        }
    );
};

AdminApp.prototype.toggleActivityPublish = function(activityId) {
    const activity = this.siteData.activities.find(a => a.id === activityId);
    if (!activity) {
        this.showNotification('Activité non trouvée', 'error');
        return;
    }
    
    activity.published = !activity.published;
    activity.updatedAt = new Date().toISOString();
    
    this.saveSiteData();
    this.showNotification(
        activity.published ? 'Activité publiée' : 'Activité dépubliée',
        'success'
    );
    
    if (this.currentSection === 'activities') {
        this.renderSection('activities');
    }
};

AdminApp.prototype.getNextActivityOrder = function() {
    if (!this.siteData.activities || this.siteData.activities.length === 0) {
        return 1;
    }
    return Math.max(...this.siteData.activities.map(a => a.order || 0)) + 1;
};

// ============================================================================
// GALLERY ACTIONS
// ============================================================================
AdminApp.prototype.saveGalleryImage = function(imageId = null) {
    const form = document.getElementById('galleryForm');
    const formData = new FormData(form);
    
    // Validation
    if (!formData.get('title').trim()) {
        this.showNotification('Le titre est obligatoire', 'error');
        return;
    }
    
    if (!formData.get('image').trim()) {
        this.showNotification('L\'URL de l\'image est obligatoire', 'error');
        return;
    }
    
    if (!this.isValidUrl(formData.get('image').trim())) {
        this.showNotification('L\'URL de l\'image n\'est pas valide', 'error');
        return;
    }
    
    const imageData = {
        id: imageId || this.generateId(),
        title: formData.get('title').trim(),
        image: formData.get('image').trim(),
        alt: formData.get('alt').trim() || formData.get('title').trim(),
        order: imageId ? this.siteData.gallery.find(i => i.id === imageId)?.order : this.getNextGalleryOrder(),
        createdAt: imageId ? this.siteData.gallery.find(i => i.id === imageId)?.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    if (!this.siteData.gallery) {
        this.siteData.gallery = [];
    }
    
    if (imageId) {
        // Modification
        const index = this.siteData.gallery.findIndex(i => i.id === imageId);
        if (index !== -1) {
            this.siteData.gallery[index] = imageData;
            this.showNotification('Image modifiée avec succès', 'success');
        }
    } else {
        // Création
        this.siteData.gallery.push(imageData);
        this.showNotification('Image ajoutée avec succès', 'success');
    }
    
    this.saveSiteData();
    this.closeModal();
    
    if (this.currentSection === 'gallery') {
        this.renderSection('gallery');
    }
};

AdminApp.prototype.deleteGalleryImage = function(imageId) {
    const image = this.siteData.gallery.find(i => i.id === imageId);
    if (!image) {
        this.showNotification('Image non trouvée', 'error');
        return;
    }
    
    this.showConfirmModal(
        'Supprimer l\'image',
        `Êtes-vous sûr de vouloir supprimer l'image "${image.title}" ? Cette action est irréversible.`,
        () => {
            this.siteData.gallery = this.siteData.gallery.filter(i => i.id !== imageId);
            this.saveSiteData();
            this.showNotification('Image supprimée', 'success');
            
            if (this.currentSection === 'gallery') {
                this.renderSection('gallery');
            }
        }
    );
};

AdminApp.prototype.previewImage = function(imageId) {
    const image = this.siteData.gallery.find(i => i.id === imageId);
    if (!image) {
        this.showNotification('Image non trouvée', 'error');
        return;
    }
    
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    modalTitle.textContent = image.title;
    modalContent.innerHTML = `
        <div class="image-preview-modal">
            <img src="${image.image}" alt="${image.alt}" class="preview-image">
            <div class="preview-info">
                <p><strong>Titre:</strong> ${image.title}</p>
                ${image.alt ? `<p><strong>Alt:</strong> ${image.alt}</p>` : ''}
            </div>
            <div class="modal-actions">
                <button type="button" class="btn-secondary" onclick="adminApp.closeModal()">
                    <i class="fas fa-times"></i> Fermer
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
    document.body.classList.add('modal-open');
};

AdminApp.prototype.getNextGalleryOrder = function() {
    if (!this.siteData.gallery || this.siteData.gallery.length === 0) {
        return 1;
    }
    return Math.max(...this.siteData.gallery.map(i => i.order || 0)) + 1;
};

// ============================================================================
// SETTINGS ACTIONS
// ============================================================================
AdminApp.prototype.saveSettings = function() {
    const form = document.getElementById('settingsForm');
    const formData = new FormData(form);
    
    // Validation
    if (!formData.get('siteName').trim()) {
        this.showNotification('Le nom du site est obligatoire', 'error');
        return;
    }
    
    if (!this.siteData.settings) {
        this.siteData.settings = {};
    }
    
    this.siteData.settings = {
        ...this.siteData.settings,
        siteName: formData.get('siteName').trim(),
        description: formData.get('description').trim(),
        email: formData.get('email').trim(),
        phone: formData.get('phone').trim(),
        address: formData.get('address').trim(),
        updatedAt: new Date().toISOString()
    };
    
    this.saveSiteData();
    this.showNotification('Paramètres sauvegardés avec succès', 'success');
};

AdminApp.prototype.resetSettings = function() {
    this.showConfirmModal(
        'Réinitialiser les paramètres',
        'Êtes-vous sûr de vouloir réinitialiser tous les paramètres ? Cette action est irréversible.',
        () => {
            const defaultSettings = {
                siteName: 'Anim\'Média',
                description: 'Association culturelle, numérique et d\'éducation populaire',
                email: 'contact@animmedia-laguerche.fr',
                phone: '06 99 47 15 25',
                address: 'Médiathèque Jean-Paul Roussillot\nLa Guerche-sur-l\'Aubois',
                lastBackup: this.siteData.settings?.lastBackup
            };
            
            this.siteData.settings = defaultSettings;
            this.saveSiteData();
            this.showNotification('Paramètres réinitialisés', 'success');
            this.renderSection('settings');
        }
    );
};

// ============================================================================
// BACKUP ACTIONS
// ============================================================================
AdminApp.prototype.exportData = function() {
    try {
        const dataToExport = {
            ...this.siteData,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `animmedia-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        // Mettre à jour la date de dernière sauvegarde
        if (!this.siteData.settings) {
            this.siteData.settings = {};
        }
        this.siteData.settings.lastBackup = new Date().toISOString();
        this.saveSiteData();
        
        this.showNotification('Données exportées avec succès', 'success');
        
        if (this.currentSection === 'backup') {
            this.renderSection('backup');
        }
    } catch (error) {
        console.error('Erreur export:', error);
        this.showNotification('Erreur lors de l\'export', 'error');
    }
};

AdminApp.prototype.importData = function(fileInput) {
    const file = fileInput.files[0];
    if (!file) return;
    
    if (file.type !== 'application/json') {
        this.showNotification('Veuillez sélectionner un fichier JSON', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Validation basique
            if (!this.validateImportData(importedData)) {
                this.showNotification('Le fichier de sauvegarde n\'est pas valide', 'error');
                return;
            }
            
            this.showConfirmModal(
                'Importer les données',
                'Êtes-vous sûr de vouloir importer ces données ? Toutes les données actuelles seront remplacées.',
                () => {
                    this.siteData = importedData;
                    this.saveSiteData();
                    this.showNotification('Données importées avec succès', 'success');
                    this.updateCounts();
                    this.loadSection('dashboard');
                }
            );
        } catch (error) {
            console.error('Erreur import:', error);
            this.showNotification('Erreur lors de l\'import: fichier corrompu', 'error');
        }
    };
    
    reader.readAsText(file);
    fileInput.value = ''; // Reset input
};

AdminApp.prototype.validateImportData = function(data) {
    // Validation basique de la structure
    return data && 
           (Array.isArray(data.events) || data.events === undefined) &&
           (Array.isArray(data.activities) || data.activities === undefined) &&
           (Array.isArray(data.gallery) || data.gallery === undefined) &&
           (typeof data.settings === 'object' || data.settings === undefined);
};

AdminApp.prototype.resetAllData = function() {
    this.showConfirmModal(
        'Réinitialiser toutes les données',
        'ATTENTION: Cette action supprimera définitivement tous vos événements, activités, images et paramètres. Cette action est IRRÉVERSIBLE. Êtes-vous absolument certain ?',
        () => {
            localStorage.removeItem('animMediaData');
            this.siteData = this.loadSiteData(); // Recharger les données par défaut
            this.saveSiteData();
            this.showNotification('Toutes les données ont été réinitialisées', 'warning');
            this.updateCounts();
            this.loadSection('dashboard');
        }
    );
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
AdminApp.prototype.isValidUrl = function(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

AdminApp.prototype.showUploadModal = function() {
    // Placeholder pour future fonctionnalité d'upload multiple
    this.showNotification('Fonctionnalité à venir: Upload multiple d\'images', 'info');
};

AdminApp.prototype.toggleEventFilters = function() {
    // Placeholder pour future fonctionnalité de filtres
    this.showNotification('Fonctionnalité à venir: Filtres avancés', 'info');
};
