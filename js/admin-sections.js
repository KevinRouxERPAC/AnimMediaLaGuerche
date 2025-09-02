// ============================================================================
// Admin Sections - Anim'Média
// Gestion du rendu des différentes sections
// ============================================================================

// Extension de la classe AdminApp
AdminApp.prototype.renderSection = function(sectionName) {
    const mainContent = document.getElementById('mainContent');
    
    switch (sectionName) {
        case 'dashboard':
            this.renderDashboard(mainContent);
            break;
        case 'events':
            this.renderEvents(mainContent);
            break;
        case 'activities':
            this.renderActivities(mainContent);
            break;
        case 'gallery':
            this.renderGallery(mainContent);
            break;
        case 'settings':
            this.renderSettings(mainContent);
            break;
        case 'backup':
            this.renderBackup(mainContent);
            break;
        default:
            this.renderDashboard(mainContent);
    }
};

// ============================================================================
// DASHBOARD
// ============================================================================
AdminApp.prototype.renderDashboard = function(container) {
    const eventsCount = this.siteData.events?.length || 0;
    const activitiesCount = this.siteData.activities?.length || 0;
    const galleryCount = this.siteData.gallery?.length || 0;
    const lastEvent = this.siteData.events?.[0] || null;
    
    const html = `
        <div class="dashboard">
            <!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card" onclick="adminApp.loadSection('events')">
                    <div class="stat-icon events">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${eventsCount}</div>
                        <div class="stat-label">Événements</div>
                    </div>
                </div>
                
                <div class="stat-card" onclick="adminApp.loadSection('activities')">
                    <div class="stat-icon activities">
                        <i class="fas fa-puzzle-piece"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${activitiesCount}</div>
                        <div class="stat-label">Activités</div>
                    </div>
                </div>
                
                <div class="stat-card" onclick="adminApp.loadSection('gallery')">
                    <div class="stat-icon gallery">
                        <i class="fas fa-images"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${galleryCount}</div>
                        <div class="stat-label">Images</div>
                    </div>
                </div>
                
                <div class="stat-card" onclick="previewSite()">
                    <div class="stat-icon preview">
                        <i class="fas fa-eye"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">
                            <i class="fas fa-external-link-alt"></i>
                        </div>
                        <div class="stat-label">Voir le site</div>
                    </div>
                </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="quick-actions">
                <h3><i class="fas fa-rocket"></i> Actions rapides</h3>
                <div class="actions-grid">
                    <button class="action-btn" onclick="adminApp.showAddModal('events')">
                        <i class="fas fa-plus"></i>
                        Ajouter un événement
                    </button>
                    <button class="action-btn" onclick="adminApp.showAddModal('activities')">
                        <i class="fas fa-plus"></i>
                        Ajouter une activité
                    </button>
                    <button class="action-btn" onclick="adminApp.showAddModal('gallery')">
                        <i class="fas fa-plus"></i>
                        Ajouter une image
                    </button>
                    <button class="action-btn" onclick="adminApp.loadSection('backup')">
                        <i class="fas fa-download"></i>
                        Sauvegarder
                    </button>
                </div>
            </div>
            
            <!-- Recent Activity -->
            <div class="recent-activity">
                <h3><i class="fas fa-clock"></i> Activité récente</h3>
                <div class="activity-list">
                    ${this.renderRecentActivity()}
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
};

AdminApp.prototype.renderRecentActivity = function() {
    const activities = [];
    
    // Récupérer les événements récents
    if (this.siteData.events) {
        this.siteData.events.forEach(event => {
            activities.push({
                type: 'event',
                title: `Événement: ${event.title}`,
                date: event.createdAt || new Date().toISOString(),
                icon: 'fas fa-calendar-alt'
            });
        });
    }
    
    // Trier par date
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (activities.length === 0) {
        return '<div class="no-activity">Aucune activité récente</div>';
    }
    
    return activities.slice(0, 5).map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-date">${this.formatDate(activity.date)}</div>
            </div>
        </div>
    `).join('');
};

// ============================================================================
// EVENTS
// ============================================================================
AdminApp.prototype.renderEvents = function(container) {
    const events = this.siteData.events || [];
    
    const html = `
        <div class="events-section">
            <div class="section-header">
                <div class="section-info">
                    <p>Gérez les événements qui apparaîtront sur votre site public.</p>
                </div>
                <div class="section-actions">
                    <button class="btn-filter" onclick="adminApp.toggleEventFilters()">
                        <i class="fas fa-filter"></i> Filtrer
                    </button>
                </div>
            </div>
            
            <div class="events-grid">
                ${events.length > 0 ? events.map(event => this.renderEventCard(event)).join('') : this.renderEmptyState('events')}
            </div>
        </div>
    `;
    
    container.innerHTML = html;
};

AdminApp.prototype.renderEventCard = function(event) {
    const isPublished = event.published !== false;
    const eventDate = new Date(event.date);
    const isUpcoming = eventDate > new Date();
    
    return `
        <div class="event-card ${!isPublished ? 'draft' : ''}">
            <div class="event-image">
                ${event.image ? `<img src="${event.image}" alt="${event.title}" onerror="this.src='https://via.placeholder.com/300x200?text=Image+non+disponible'">` : '<div class="no-image"><i class="fas fa-image"></i></div>'}
                <div class="event-status ${isUpcoming ? 'upcoming' : 'past'}">
                    ${isUpcoming ? 'À venir' : 'Passé'}
                </div>
                ${!isPublished ? '<div class="draft-badge">Brouillon</div>' : ''}
            </div>
            
            <div class="event-content">
                <h3 class="event-title">${event.title}</h3>
                <div class="event-meta">
                    <div class="event-date">
                        <i class="fas fa-calendar"></i>
                        ${this.formatDate(event.date)}
                    </div>
                    ${event.time ? `<div class="event-time">
                        <i class="fas fa-clock"></i>
                        ${this.formatTime(event.time)}
                    </div>` : ''}
                    ${event.location ? `<div class="event-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${event.location}
                    </div>` : ''}
                </div>
                <p class="event-description">${(event.description || '').substring(0, 100)}${event.description?.length > 100 ? '...' : ''}</p>
            </div>
            
            <div class="event-actions">
                <button class="btn-action edit" onclick="adminApp.editEvent('${event.id}')" title="Modifier">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action ${isPublished ? 'unpublish' : 'publish'}" onclick="adminApp.toggleEventPublish('${event.id}')" title="${isPublished ? 'Dépublier' : 'Publier'}">
                    <i class="fas fa-${isPublished ? 'eye-slash' : 'eye'}"></i>
                </button>
                <button class="btn-action delete" onclick="adminApp.deleteEvent('${event.id}')" title="Supprimer">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
};

// ============================================================================
// ACTIVITIES
// ============================================================================
AdminApp.prototype.renderActivities = function(container) {
    const activities = this.siteData.activities || [];
    
    const html = `
        <div class="activities-section">
            <div class="section-header">
                <div class="section-info">
                    <p>Organisez les activités proposées par votre association.</p>
                </div>
            </div>
            
            <div class="activities-grid">
                ${activities.length > 0 ? activities.map(activity => this.renderActivityCard(activity)).join('') : this.renderEmptyState('activities')}
            </div>
        </div>
    `;
    
    container.innerHTML = html;
};

AdminApp.prototype.renderActivityCard = function(activity) {
    const isPublished = activity.published !== false;
    
    return `
        <div class="activity-card ${!isPublished ? 'draft' : ''}">
            <div class="activity-header">
                <div class="activity-icon">
                    <i class="${activity.icon || 'fas fa-puzzle-piece'}"></i>
                </div>
                <h3 class="activity-title">${activity.title}</h3>
                ${!isPublished ? '<div class="draft-badge">Brouillon</div>' : ''}
            </div>
            
            <div class="activity-content">
                <ul class="activity-items">
                    ${(activity.items || []).map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="activity-actions">
                <button class="btn-action edit" onclick="adminApp.editActivity('${activity.id}')" title="Modifier">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action ${isPublished ? 'unpublish' : 'publish'}" onclick="adminApp.toggleActivityPublish('${activity.id}')" title="${isPublished ? 'Dépublier' : 'Publier'}">
                    <i class="fas fa-${isPublished ? 'eye-slash' : 'eye'}"></i>
                </button>
                <button class="btn-action delete" onclick="adminApp.deleteActivity('${activity.id}')" title="Supprimer">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
};

// ============================================================================
// GALLERY
// ============================================================================
AdminApp.prototype.renderGallery = function(container) {
    const gallery = this.siteData.gallery || [];
    
    const html = `
        <div class="gallery-section">
            <div class="section-header">
                <div class="section-info">
                    <p>Gérez les images de votre galerie photo.</p>
                </div>
                <div class="section-actions">
                    <button class="btn-upload" onclick="adminApp.showUploadModal()">
                        <i class="fas fa-upload"></i> Upload multiple
                    </button>
                </div>
            </div>
            
            <div class="gallery-grid">
                ${gallery.length > 0 ? gallery.map(image => this.renderGalleryCard(image)).join('') : this.renderEmptyState('gallery')}
            </div>
        </div>
    `;
    
    container.innerHTML = html;
};

AdminApp.prototype.renderGalleryCard = function(image) {
    return `
        <div class="gallery-card">
            <div class="gallery-image">
                <img src="${image.image}" alt="${image.title}" onerror="this.src='https://via.placeholder.com/300x200?text=Image+non+disponible'">
                <div class="gallery-overlay">
                    <button class="btn-overlay" onclick="adminApp.previewImage('${image.id}')" title="Aperçu">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-overlay" onclick="adminApp.editGalleryImage('${image.id}')" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-overlay delete" onclick="adminApp.deleteGalleryImage('${image.id}')" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="gallery-info">
                <h4 class="gallery-title">${image.title}</h4>
                ${image.alt ? `<p class="gallery-alt">${image.alt}</p>` : ''}
            </div>
        </div>
    `;
};

// ============================================================================
// SETTINGS
// ============================================================================
AdminApp.prototype.renderSettings = function(container) {
    const settings = this.siteData.settings || {};
    
    const html = `
        <div class="settings-section">
            <form id="settingsForm" class="settings-form">
                <div class="form-group">
                    <label for="siteName">Nom du site</label>
                    <input type="text" id="siteName" name="siteName" value="${settings.siteName || ''}" required>
                </div>
                
                <div class="form-group">
                    <label for="siteDescription">Description</label>
                    <textarea id="siteDescription" name="description" rows="3">${settings.description || ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label for="contactEmail">Email de contact</label>
                    <input type="email" id="contactEmail" name="email" value="${settings.email || ''}">
                </div>
                
                <div class="form-group">
                    <label for="contactPhone">Téléphone</label>
                    <input type="tel" id="contactPhone" name="phone" value="${settings.phone || ''}">
                </div>
                
                <div class="form-group">
                    <label for="contactAddress">Adresse</label>
                    <textarea id="contactAddress" name="address" rows="3">${settings.address || ''}</textarea>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-save"></i> Sauvegarder
                    </button>
                    <button type="button" class="btn-secondary" onclick="adminApp.resetSettings()">
                        <i class="fas fa-undo"></i> Réinitialiser
                    </button>
                </div>
            </form>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Bind form submit
    document.getElementById('settingsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveSettings();
    });
};

// ============================================================================
// BACKUP
// ============================================================================
AdminApp.prototype.renderBackup = function(container) {
    const lastBackup = this.siteData.settings?.lastBackup;
    
    const html = `
        <div class="backup-section">
            <div class="backup-info">
                <h3><i class="fas fa-info-circle"></i> Information</h3>
                <p>Sauvegardez régulièrement vos données pour éviter toute perte.</p>
                ${lastBackup ? `<p>Dernière sauvegarde : <strong>${this.formatDate(lastBackup)}</strong></p>` : '<p>Aucune sauvegarde effectuée</p>'}
            </div>
            
            <div class="backup-actions">
                <h3><i class="fas fa-tools"></i> Actions</h3>
                
                <div class="backup-card">
                    <div class="backup-card-content">
                        <h4><i class="fas fa-download"></i> Exporter les données</h4>
                        <p>Téléchargez toutes vos données au format JSON</p>
                        <button class="btn-primary" onclick="adminApp.exportData()">
                            <i class="fas fa-download"></i> Télécharger
                        </button>
                    </div>
                </div>
                
                <div class="backup-card">
                    <div class="backup-card-content">
                        <h4><i class="fas fa-upload"></i> Importer les données</h4>
                        <p>Restaurez vos données à partir d'un fichier de sauvegarde</p>
                        <input type="file" id="importFile" accept=".json" style="display: none;" onchange="adminApp.importData(this)">
                        <button class="btn-secondary" onclick="document.getElementById('importFile').click()">
                            <i class="fas fa-upload"></i> Choisir un fichier
                        </button>
                    </div>
                </div>
                
                <div class="backup-card danger">
                    <div class="backup-card-content">
                        <h4><i class="fas fa-trash"></i> Réinitialiser</h4>
                        <p>Supprimez toutes les données (irréversible)</p>
                        <button class="btn-danger" onclick="adminApp.resetAllData()">
                            <i class="fas fa-exclamation-triangle"></i> Réinitialiser
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
};

// ============================================================================
// EMPTY STATES
// ============================================================================
AdminApp.prototype.renderEmptyState = function(type) {
    const emptyStates = {
        events: {
            icon: 'fas fa-calendar-alt',
            title: 'Aucun événement',
            description: 'Commencez par créer votre premier événement',
            action: 'Créer un événement',
            onclick: 'adminApp.showAddModal("events")'
        },
        activities: {
            icon: 'fas fa-puzzle-piece',
            title: 'Aucune activité',
            description: 'Ajoutez les activités de votre association',
            action: 'Créer une activité',
            onclick: 'adminApp.showAddModal("activities")'
        },
        gallery: {
            icon: 'fas fa-images',
            title: 'Aucune image',
            description: 'Commencez à construire votre galerie',
            action: 'Ajouter une image',
            onclick: 'adminApp.showAddModal("gallery")'
        }
    };
    
    const state = emptyStates[type];
    if (!state) return '';
    
    return `
        <div class="empty-state">
            <div class="empty-icon">
                <i class="${state.icon}"></i>
            </div>
            <h3 class="empty-title">${state.title}</h3>
            <p class="empty-description">${state.description}</p>
            <button class="btn-primary empty-action" onclick="${state.onclick}">
                <i class="fas fa-plus"></i> ${state.action}
            </button>
        </div>
    `;
};
