// Configuration avancée pour le site
const siteConfig = {
    // Configuration générale
    siteName: "Anim'Média",
    version: "2.0.0",
    lastUpdate: "2025-09-02",
    
    // Configuration admin
    admin: {
        password: "animmedia2025",
        sessionTimeout: 30 * 60 * 1000, // 30 minutes
        maxBackups: 5
    },
    
    // Configuration galerie
    gallery: {
        enableDynamicGallery: true,
        maxImages: 12,
        supportedFormats: ['jpg', 'jpeg', 'png', 'webp']
    },
    
    // Configuration événements
    events: {
        autoDeletePastEvents: false,
        maxEvents: 10,
        defaultLocation: "Médiathèque Jean-Paul Roussillot"
    }
};

// Amélioration de la gestion de la galerie
function initializeGalleryManagement() {
    if (!isAdminMode) return;
    
    const gallerySection = document.querySelector('#galerie .container');
    if (!gallerySection) return;
    
    // Ajouter bouton de gestion galerie
    const galleryControls = document.createElement('div');
    galleryControls.className = 'gallery-admin-controls';
    galleryControls.innerHTML = `
        <h3><i class="fas fa-images"></i> Gestion Galerie</h3>
        <div class="gallery-buttons">
            <button onclick="addGalleryImage()" class="btn-admin">
                <i class="fas fa-plus"></i> Ajouter Image
            </button>
            <button onclick="editGalleryMode()" class="btn-admin">
                <i class="fas fa-edit"></i> Mode Édition
            </button>
        </div>
    `;
    
    gallerySection.insertBefore(galleryControls, gallerySection.querySelector('h2').nextSibling);
}

// Fonction pour ajouter des images à la galerie
function addGalleryImage() {
    const imageUrl = prompt("URL de l'image :");
    if (!imageUrl) return;
    
    const imageTitle = prompt("Titre de l'image :");
    if (!imageTitle) return;
    
    const galleryGrid = document.querySelector('.gallery-grid');
    const newGalleryItem = document.createElement('div');
    newGalleryItem.className = 'gallery-item';
    newGalleryItem.innerHTML = `
        <img src="${imageUrl}" alt="${imageTitle}" loading="lazy">
        <div class="gallery-overlay">
            <h4>${imageTitle}</h4>
        </div>
        ${isAdminMode ? `
            <div class="gallery-item-controls">
                <button onclick="removeGalleryImage(this)" class="btn-delete-small">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        ` : ''}
    `;
    
    galleryGrid.appendChild(newGalleryItem);
    
    // Réattacher les événements lightbox
    attachLightboxEvents();
}

// Fonction pour supprimer une image de galerie
function removeGalleryImage(button) {
    if (!confirm("Supprimer cette image ?")) return;
    button.closest('.gallery-item').remove();
}

// Fonction pour réattacher les événements lightbox
function attachLightboxEvents() {
    document.querySelectorAll('.gallery-item').forEach(item => {
        // Supprimer les anciens événements
        item.replaceWith(item.cloneNode(true));
    });
    
    // Réattacher les nouveaux événements
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('.gallery-item-controls')) return;
            
            const img = item.querySelector('img');
            if (!img) return;
            
            const lightbox = document.createElement('div');
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                cursor: pointer;
            `;
            
            const lightboxImg = document.createElement('img');
            lightboxImg.src = img.src;
            lightboxImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
            `;
            
            lightbox.appendChild(lightboxImg);
            document.body.appendChild(lightbox);
            
            lightbox.addEventListener('click', () => {
                document.body.removeChild(lightbox);
            });
        });
    });
}

// Amélioration de la sauvegarde avec horodatage
function saveDataWithTimestamp() {
    const timestamp = new Date().toISOString();
    const dataToSave = {
        ...siteData,
        lastModified: timestamp,
        version: siteConfig.version
    };
    localStorage.setItem('animMediaData', JSON.stringify(dataToSave));
    
    // Notification de sauvegarde
    showNotification("Données sauvegardées", "success");
}

// Fonction de notification
function showNotification(message, type = "info") {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Mode édition avancé
function enableAdvancedEditMode() {
    if (!isAdminMode) return;
    
    // Ajouter indicateurs visuels
    document.body.classList.add('advanced-edit-mode');
    
    // Ajouter conseils contextuels
    const helpTooltip = document.createElement('div');
    helpTooltip.id = 'admin-tooltip';
    helpTooltip.className = 'admin-tooltip';
    helpTooltip.innerHTML = `
        <h4>💡 Conseils d'édition</h4>
        <ul>
            <li>Double-cliquez pour édition rapide</li>
            <li>Ctrl+S pour sauvegarder</li>
            <li>Échap pour annuler</li>
        </ul>
    `;
    document.body.appendChild(helpTooltip);
}

// Sauvegarde automatique
let autoSaveInterval;
function enableAutoSave() {
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    
    autoSaveInterval = setInterval(() => {
        if (isAdminMode) {
            saveDataWithTimestamp();
        }
    }, 5 * 60 * 1000); // Toutes les 5 minutes
}

// Étendre les fonctions existantes
const originalToggleAdminMode = toggleAdminMode;
function toggleAdminMode() {
    originalToggleAdminMode();
    
    if (isAdminMode) {
        initializeGalleryManagement();
        enableAdvancedEditMode();
        enableAutoSave();
    } else {
        if (autoSaveInterval) clearInterval(autoSaveInterval);
        document.body.classList.remove('advanced-edit-mode');
        const tooltip = document.getElementById('admin-tooltip');
        if (tooltip) tooltip.remove();
    }
}

// Remplacer la fonction saveData existante
const originalSaveData = saveData;
function saveData() {
    saveDataWithTimestamp();
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', function() {
    console.log(`Site ${siteConfig.siteName} v${siteConfig.version} initialisé`);
    
    // Attacher les événements lightbox initiaux
    setTimeout(attachLightboxEvents, 1000);
});
