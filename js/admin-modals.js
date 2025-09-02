// ============================================================================
// Admin Modals - Anim'Média
// Gestion des modales et formulaires
// ============================================================================

// Extension de la classe AdminApp pour les modales
AdminApp.prototype.showAddModal = function(type) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    const titles = {
        events: 'Nouvel événement',
        activities: 'Nouvelle activité',
        gallery: 'Nouvelle image'
    };
    
    modalTitle.textContent = titles[type] || 'Nouveau';
    
    switch (type) {
        case 'events':
            this.renderEventModal(modalContent);
            break;
        case 'activities':
            this.renderActivityModal(modalContent);
            break;
        case 'gallery':
            this.renderGalleryModal(modalContent);
            break;
    }
    
    modal.classList.add('show');
    document.body.classList.add('modal-open');
};

AdminApp.prototype.closeModal = function() {
    const modal = document.getElementById('modal');
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
    
    // Reset form après fermeture
    setTimeout(() => {
        document.getElementById('modalContent').innerHTML = '';
    }, 300);
};

// ============================================================================
// EVENT MODAL
// ============================================================================
AdminApp.prototype.renderEventModal = function(container, event = null) {
    const isEdit = !!event;
    
    const html = `
        <form id="eventForm" class="modal-form">
            <div class="form-grid">
                <div class="form-group">
                    <label for="eventTitle">Titre de l'événement *</label>
                    <input type="text" id="eventTitle" name="title" value="${event?.title || ''}" required>
                </div>
                
                <div class="form-group">
                    <label for="eventDate">Date *</label>
                    <input type="date" id="eventDate" name="date" value="${event?.date || ''}" required>
                </div>
                
                <div class="form-group">
                    <label for="eventTime">Heure</label>
                    <input type="time" id="eventTime" name="time" value="${event?.time || ''}">
                </div>
                
                <div class="form-group full-width">
                    <label for="eventLocation">Lieu</label>
                    <input type="text" id="eventLocation" name="location" value="${event?.location || ''}" placeholder="Médiathèque Jean-Paul Roussillot">
                </div>
                
                <div class="form-group full-width">
                    <label for="eventDescription">Description</label>
                    <textarea id="eventDescription" name="description" rows="4" placeholder="Décrivez votre événement...">${event?.description || ''}</textarea>
                </div>
                
                <div class="form-group full-width">
                    <label for="eventImage">Image (URL)</label>
                    <div class="image-input-group">
                        <input type="url" id="eventImage" name="image" value="${event?.image || ''}" placeholder="https://...">
                        <button type="button" class="btn-preview" onclick="adminApp.previewEventImage()">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <div id="imagePreview" class="image-preview"></div>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="eventPublished" name="published" ${event?.published !== false ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Publier immédiatement
                    </label>
                </div>
            </div>
            
            <div class="modal-actions">
                <button type="button" class="btn-secondary" onclick="adminApp.closeModal()">
                    <i class="fas fa-times"></i> Annuler
                </button>
                <button type="submit" class="btn-primary">
                    <i class="fas fa-save"></i> ${isEdit ? 'Modifier' : 'Créer'}
                </button>
            </div>
        </form>
        
        <div class="form-help">
            <h4><i class="fas fa-lightbulb"></i> Conseils</h4>
            <ul>
                <li>Utilisez un titre accrocheur et descriptif</li>
                <li>Ajoutez une image pour rendre l'événement plus attractif</li>
                <li>Précisez le lieu même s'il est habituel</li>
                <li>Une description claire aide les participants</li>
            </ul>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Bind form submit
    document.getElementById('eventForm').addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveEvent(event?.id);
    });
    
    // Preview initial image if exists
    if (event?.image) {
        this.updateImagePreview(event.image);
    }
};

AdminApp.prototype.previewEventImage = function() {
    const imageUrl = document.getElementById('eventImage').value;
    this.updateImagePreview(imageUrl);
};

AdminApp.prototype.updateImagePreview = function(url) {
    const preview = document.getElementById('imagePreview');
    
    if (!url) {
        preview.innerHTML = '';
        return;
    }
    
    // Vérifier si l'URL est valide
    const img = new Image();
    img.onload = function() {
        preview.innerHTML = `<img src="${url}" alt="Aperçu">`;
    };
    img.onerror = function() {
        preview.innerHTML = '<div class="preview-error"><i class="fas fa-exclamation-triangle"></i> Image non trouvée</div>';
    };
    img.src = url;
};

// ============================================================================
// ACTIVITY MODAL
// ============================================================================
AdminApp.prototype.renderActivityModal = function(container, activity = null) {
    const isEdit = !!activity;
    
    const html = `
        <form id="activityForm" class="modal-form">
            <div class="form-grid">
                <div class="form-group">
                    <label for="activityTitle">Titre de l'activité *</label>
                    <input type="text" id="activityTitle" name="title" value="${activity?.title || ''}" required>
                </div>
                
                <div class="form-group">
                    <label for="activityIcon">Icône</label>
                    <div class="icon-input-group">
                        <input type="text" id="activityIcon" name="icon" value="${activity?.icon || 'fas fa-puzzle-piece'}" placeholder="fas fa-puzzle-piece">
                        <div class="icon-preview">
                            <i class="${activity?.icon || 'fas fa-puzzle-piece'}"></i>
                        </div>
                    </div>
                    <small>Utilisez les classes Font Awesome (ex: fas fa-desktop)</small>
                </div>
                
                <div class="form-group full-width">
                    <label for="activityItems">Éléments de l'activité</label>
                    <div id="itemsList" class="items-list">
                        ${(activity?.items || ['']).map((item, index) => `
                            <div class="item-input-group">
                                <input type="text" name="items[]" value="${item}" placeholder="Décrivez un élément...">
                                <button type="button" class="btn-remove-item" onclick="this.parentElement.remove()">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    <button type="button" class="btn-add-item" onclick="adminApp.addActivityItem()">
                        <i class="fas fa-plus"></i> Ajouter un élément
                    </button>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="activityPublished" name="published" ${activity?.published !== false ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Publier immédiatement
                    </label>
                </div>
            </div>
            
            <div class="modal-actions">
                <button type="button" class="btn-secondary" onclick="adminApp.closeModal()">
                    <i class="fas fa-times"></i> Annuler
                </button>
                <button type="submit" class="btn-primary">
                    <i class="fas fa-save"></i> ${isEdit ? 'Modifier' : 'Créer'}
                </button>
            </div>
        </form>
        
        <div class="form-help">
            <h4><i class="fas fa-lightbulb"></i> Conseils</h4>
            <ul>
                <li>Choisissez une icône représentative de l'activité</li>
                <li>Listez les différents aspects de votre activité</li>
                <li>Soyez précis et concis dans les descriptions</li>
                <li>Vous pouvez réorganiser les activités plus tard</li>
            </ul>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Bind form submit
    document.getElementById('activityForm').addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveActivity(activity?.id);
    });
    
    // Bind icon input change
    document.getElementById('activityIcon').addEventListener('input', (e) => {
        const iconPreview = document.querySelector('.icon-preview i');
        iconPreview.className = e.target.value || 'fas fa-puzzle-piece';
    });
};

AdminApp.prototype.addActivityItem = function() {
    const itemsList = document.getElementById('itemsList');
    const newItem = document.createElement('div');
    newItem.className = 'item-input-group';
    newItem.innerHTML = `
        <input type="text" name="items[]" placeholder="Décrivez un élément...">
        <button type="button" class="btn-remove-item" onclick="this.parentElement.remove()">
            <i class="fas fa-trash"></i>
        </button>
    `;
    itemsList.appendChild(newItem);
    newItem.querySelector('input').focus();
};

// ============================================================================
// GALLERY MODAL
// ============================================================================
AdminApp.prototype.renderGalleryModal = function(container, image = null) {
    const isEdit = !!image;
    
    const html = `
        <form id="galleryForm" class="modal-form">
            <div class="form-grid">
                <div class="form-group">
                    <label for="galleryTitle">Titre de l'image *</label>
                    <input type="text" id="galleryTitle" name="title" value="${image?.title || ''}" required>
                </div>
                
                <div class="form-group full-width">
                    <label for="galleryImage">URL de l'image *</label>
                    <div class="image-input-group">
                        <input type="url" id="galleryImage" name="image" value="${image?.image || ''}" required placeholder="https://...">
                        <button type="button" class="btn-preview" onclick="adminApp.previewGalleryImage()">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <div id="galleryImagePreview" class="image-preview"></div>
                </div>
                
                <div class="form-group full-width">
                    <label for="galleryAlt">Texte alternatif</label>
                    <input type="text" id="galleryAlt" name="alt" value="${image?.alt || ''}" placeholder="Description de l'image pour l'accessibilité">
                    <small>Important pour l'accessibilité et le référencement</small>
                </div>
            </div>
            
            <div class="modal-actions">
                <button type="button" class="btn-secondary" onclick="adminApp.closeModal()">
                    <i class="fas fa-times"></i> Annuler
                </button>
                <button type="submit" class="btn-primary">
                    <i class="fas fa-save"></i> ${isEdit ? 'Modifier' : 'Ajouter'}
                </button>
            </div>
        </form>
        
        <div class="form-help">
            <h4><i class="fas fa-lightbulb"></i> Conseils</h4>
            <ul>
                <li>Utilisez des images de bonne qualité (min. 800px de large)</li>
                <li>Optimisez vos images avant de les publier</li>
                <li>Le texte alternatif décrit l'image pour les malvoyants</li>
                <li>Privilégiez des formats web (JPEG, PNG, WebP)</li>
            </ul>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Bind form submit
    document.getElementById('galleryForm').addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveGalleryImage(image?.id);
    });
    
    // Preview initial image if exists
    if (image?.image) {
        this.updateGalleryImagePreview(image.image);
    }
};

AdminApp.prototype.previewGalleryImage = function() {
    const imageUrl = document.getElementById('galleryImage').value;
    this.updateGalleryImagePreview(imageUrl);
};

AdminApp.prototype.updateGalleryImagePreview = function(url) {
    const preview = document.getElementById('galleryImagePreview');
    
    if (!url) {
        preview.innerHTML = '';
        return;
    }
    
    const img = new Image();
    img.onload = function() {
        preview.innerHTML = `<img src="${url}" alt="Aperçu">`;
    };
    img.onerror = function() {
        preview.innerHTML = '<div class="preview-error"><i class="fas fa-exclamation-triangle"></i> Image non trouvée</div>';
    };
    img.src = url;
};

// ============================================================================
// EDIT MODALS
// ============================================================================
AdminApp.prototype.editEvent = function(eventId) {
    const event = this.siteData.events.find(e => e.id === eventId);
    if (!event) {
        this.showNotification('Événement non trouvé', 'error');
        return;
    }
    
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    modalTitle.textContent = 'Modifier l\'événement';
    this.renderEventModal(modalContent, event);
    
    modal.classList.add('show');
    document.body.classList.add('modal-open');
};

AdminApp.prototype.editActivity = function(activityId) {
    const activity = this.siteData.activities.find(a => a.id === activityId);
    if (!activity) {
        this.showNotification('Activité non trouvée', 'error');
        return;
    }
    
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    modalTitle.textContent = 'Modifier l\'activité';
    this.renderActivityModal(modalContent, activity);
    
    modal.classList.add('show');
    document.body.classList.add('modal-open');
};

AdminApp.prototype.editGalleryImage = function(imageId) {
    const image = this.siteData.gallery.find(i => i.id === imageId);
    if (!image) {
        this.showNotification('Image non trouvée', 'error');
        return;
    }
    
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    modalTitle.textContent = 'Modifier l\'image';
    this.renderGalleryModal(modalContent, image);
    
    modal.classList.add('show');
    document.body.classList.add('modal-open');
};

// ============================================================================
// CONFIRMATION MODAL
// ============================================================================
AdminApp.prototype.showConfirmModal = function(title, message, onConfirm) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    modalTitle.textContent = title;
    modalContent.innerHTML = `
        <div class="confirm-modal">
            <div class="confirm-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="confirm-message">
                <p>${message}</p>
            </div>
            <div class="confirm-actions">
                <button type="button" class="btn-secondary" onclick="adminApp.closeModal()">
                    <i class="fas fa-times"></i> Annuler
                </button>
                <button type="button" class="btn-danger" onclick="adminApp.confirmAction()">
                    <i class="fas fa-check"></i> Confirmer
                </button>
            </div>
        </div>
    `;
    
    this.pendingConfirmAction = onConfirm;
    modal.classList.add('show');
    document.body.classList.add('modal-open');
};

AdminApp.prototype.confirmAction = function() {
    if (this.pendingConfirmAction) {
        this.pendingConfirmAction();
        this.pendingConfirmAction = null;
    }
    this.closeModal();
};
