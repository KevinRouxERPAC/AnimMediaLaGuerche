/*!
 * ANIM'MÉDIA - ADMINISTRATION AVANCÉE
 * Gestion complète du site et de l'association
 * Version: 2.0.0
 */

class AdminEnhanced {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 Administration avancée initialisée');
        this.bindEvents();
        this.updateStats();
    }

    bindEvents() {
        // Gestionnaire de fichiers pour la galerie
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }

        // Sélecteurs de couleurs
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', (e) => this.changeThemeColor(e.target.dataset.color));
        });

        // Upload zone drag & drop
        const uploadZones = document.querySelectorAll('.upload-zone');
        uploadZones.forEach(zone => {
            zone.addEventListener('dragover', this.handleDragOver);
            zone.addEventListener('drop', this.handleDrop);
        });
    }

    // === GESTION DES STATISTIQUES ===
    updateStats() {
        // Simule la récupération des statistiques en temps réel
        const stats = {
            adherents: Math.floor(Math.random() * 50) + 130,
            evenements: Math.floor(Math.random() * 10) + 20,
            revenus: Math.floor(Math.random() * 1000) + 2000,
            satisfaction: (Math.random() * 0.5 + 4.5).toFixed(1)
        };

        // Mettre à jour les statistiques si elles existent
        this.animateStatNumbers();
    }

    animateStatNumbers() {
        document.querySelectorAll('.stat-number').forEach(element => {
            const finalValue = element.textContent;
            let currentValue = 0;
            const increment = finalValue / 20;
            const isPercentage = finalValue.includes('%');
            const isEuro = finalValue.includes('€');
            const isRating = finalValue.includes('/');

            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= parseFloat(finalValue)) {
                    clearInterval(timer);
                    element.textContent = finalValue;
                } else {
                    let displayValue = Math.floor(currentValue);
                    if (isEuro) {
                        element.textContent = displayValue.toLocaleString() + '€';
                    } else if (isPercentage) {
                        element.textContent = displayValue + '%';
                    } else if (isRating) {
                        element.textContent = (currentValue).toFixed(1) + '/5';
                    } else {
                        element.textContent = displayValue;
                    }
                }
            }, 50);
        });
    }

    // === GESTION DES MÉDIAS ===
    handleFileUpload(event) {
        const files = event.target.files;
        for (let file of files) {
            if (file.type.startsWith('image/')) {
                this.addMediaItem(file);
            }
        }
    }

    addMediaItem(file) {
        const mediaGrid = document.querySelector('.media-grid');
        const mediaItem = document.createElement('div');
        mediaItem.className = 'media-item';
        
        const reader = new FileReader();
        reader.onload = (e) => {
            mediaItem.innerHTML = `
                <div class="media-thumbnail">
                    <img src="${e.target.result}" alt="${file.name}">
                </div>
                <div class="media-info">
                    <div class="media-name">${file.name}</div>
                    <div class="media-size">${this.formatFileSize(file.size)}</div>
                </div>
                <div class="media-actions">
                    <button class="btn-icon" title="Modifier" onclick="adminEnhanced.editMedia(this)">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" title="Supprimer" onclick="adminEnhanced.deleteMedia(this)">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            mediaGrid.appendChild(mediaItem);
        };
        reader.readAsDataURL(file);

        this.showNotification(`Image "${file.name}" ajoutée avec succès`, 'success');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    editMedia(button) {
        const mediaItem = button.closest('.media-item');
        const mediaName = mediaItem.querySelector('.media-name').textContent;
        
        const newName = prompt('Nouveau nom pour l\'image:', mediaName);
        if (newName && newName !== mediaName) {
            mediaItem.querySelector('.media-name').textContent = newName;
            this.showNotification('Image renommée avec succès', 'success');
        }
    }

    deleteMedia(button) {
        const mediaItem = button.closest('.media-item');
        const mediaName = mediaItem.querySelector('.media-name').textContent;
        
        if (confirm(`Êtes-vous sûr de vouloir supprimer "${mediaName}" ?`)) {
            mediaItem.remove();
            this.showNotification('Image supprimée', 'success');
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        for (let file of files) {
            if (file.type.startsWith('image/')) {
                adminEnhanced.addMediaItem(file);
            }
        }
    }

    // === GESTION DE L'APPARENCE ===
    changeThemeColor(color) {
        // Mettre à jour la couleur principale du site
        document.documentElement.style.setProperty('--primary', color);
        
        // Mettre à jour les sélecteurs visuels
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-color="${color}"]`).classList.add('active');

        // Sauvegarder dans localStorage
        localStorage.setItem('adminThemeColor', color);
        
        this.showNotification('Couleur du thème mise à jour', 'success');
    }

    // === GESTION DE LA COMMUNICATION ===
    sendNewsletter(formData) {
        // Simuler l'envoi de newsletter
        const recipients = document.querySelector('[name="recipients"]').selectedOptions[0].text;
        
        this.showNotification(`Newsletter envoyée à ${recipients}`, 'success');
        
        // Ajouter à l'historique des campagnes
        this.addCampaignToHistory({
            subject: formData.get('subject'),
            recipients: recipients,
            date: new Date().toLocaleDateString('fr-FR')
        });
    }

    addCampaignToHistory(campaign) {
        const campaignsList = document.querySelector('.campaigns-list');
        const campaignItem = document.createElement('div');
        campaignItem.className = 'campaign-item';
        campaignItem.innerHTML = `
            <div class="campaign-info">
                <strong>${campaign.subject}</strong>
                <p>Envoyée le ${campaign.date} - ${campaign.recipients}</p>
            </div>
            <div class="campaign-stats">
                <span class="stat">📧 En cours...</span>
            </div>
        `;
        campaignsList.prepend(campaignItem);
    }

    // === GESTION DES SAUVEGARDES ===
    createBackup() {
        const backupData = {
            events: JSON.parse(localStorage.getItem('animMedia_events') || '{"events":[],"eventTypes":[]}'),
            settings: {
                themeColor: localStorage.getItem('adminThemeColor'),
                notifications: true,
                autoBackup: true
            },
            metadata: {
                version: '2.0.0',
                created: new Date().toISOString(),
                type: 'full_backup'
            }
        };

        const blob = new Blob([JSON.stringify(backupData, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `animmedia-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Sauvegarde téléchargée avec succès', 'success');
    }

    exportEvents() {
        const events = JSON.parse(localStorage.getItem('animMedia_events') || '{"events":[]}').events;
        
        let csv = 'Titre,Type,Date,Heure,Lieu,Animateur,Participants,Prix\n';
        events.forEach(event => {
            csv += `"${event.title}","${event.type}","${event.date}","${event.time}","${event.location}","${event.instructor}","${event.currentParticipants}/${event.maxParticipants}","${event.price}€"\n`;
        });

        const blob = new Blob([csv], {type: 'text/csv'});
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `evenements-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Export des événements téléchargé', 'success');
    }

    // === UTILITAIRES ===
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `admin-notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}-circle"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
    }
}

// === FONCTIONS GLOBALES POUR LES ÉVÉNEMENTS ONCLICK ===

function showStatsManager() {
    const modal = document.getElementById('statsModal');
    if (modal) {
        modal.classList.remove('hidden');
        // Animer les statistiques à l'ouverture
        setTimeout(() => adminEnhanced.animateStatNumbers(), 300);
    }
}

function showMediaManager() {
    const modal = document.getElementById('mediaModal');
    if (modal) modal.classList.remove('hidden');
}

function showCommunicationManager() {
    const modal = document.getElementById('communicationModal');
    if (modal) modal.classList.remove('hidden');
}

function showSiteConfig() {
    const modal = document.getElementById('siteConfigModal');
    if (modal) {
        modal.classList.remove('hidden');
        // Restaurer la couleur sauvegardée
        const savedColor = localStorage.getItem('adminThemeColor');
        if (savedColor) {
            document.querySelector(`[data-color="${savedColor}"]`)?.classList.add('active');
        }
    }
}

function showBackupManager() {
    const modal = document.getElementById('backupModal');
    if (modal) modal.classList.remove('hidden');
}

function switchCommTab(tabId) {
    // Masquer tous les contenus
    document.querySelectorAll('.comm-content').forEach(content => {
        content.classList.remove('active');
    });

    // Désactiver tous les boutons d'onglets
    document.querySelectorAll('.communication-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Activer l'onglet sélectionné
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`[onclick="switchCommTab('${tabId}')"]`).classList.add('active');
}

// Gestionnaires d'événements pour les formulaires
document.addEventListener('DOMContentLoaded', () => {
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            adminEnhanced.sendNewsletter(formData);
        });
    }

    // Backup buttons
    document.addEventListener('click', (e) => {
        if (e.target.textContent.includes('Télécharger Sauvegarde Complète')) {
            adminEnhanced.createBackup();
        } else if (e.target.textContent.includes('Exporter les Événements')) {
            adminEnhanced.exportEvents();
        }
    });

    // Configuration form
    const configForm = document.querySelector('.config-form');
    if (configForm) {
        configForm.addEventListener('submit', (e) => {
            e.preventDefault();
            adminEnhanced.showNotification('Configuration sauvegardée', 'success');
        });
    }
});

// Initialisation
let adminEnhanced;

document.addEventListener('DOMContentLoaded', () => {
    const checkAndInit = () => {
        const dashboard = document.getElementById('dashboard');
        if (dashboard && !dashboard.classList.contains('hidden')) {
            adminEnhanced = new AdminEnhanced();
        } else {
            setTimeout(checkAndInit, 500);
        }
    };
    
    checkAndInit();
});