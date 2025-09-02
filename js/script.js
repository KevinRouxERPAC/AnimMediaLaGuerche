// Données des activités et événements - Configuration centralisée
const siteData = {
    activities: [
        {
            id: 1,
            icon: "fas fa-desktop",
            title: "Ateliers numériques",
            items: [
                "Initiation à l'informatique",
                "Café informatique",
                "Accompagnement aux usages digitaux",
                "Dépannage et conseils"
            ]
        },
        {
            id: 2,
            icon: "fas fa-paint-brush",
            title: "Loisirs créatifs",
            items: [
                "Ateliers de dessin",
                "Scrapbooking",
                "Activités manuelles",
                "Projets artistiques"
            ]
        },
        {
            id: 3,
            icon: "fas fa-book-open",
            title: "Animations culturelles",
            items: [
                "Expositions thématiques",
                "Rencontres d'auteurs",
                "Ateliers généalogie",
                "Grainothèque participative"
            ]
        },
        {
            id: 4,
            icon: "fas fa-gamepad",
            title: "Temps conviviaux",
            items: [
                "Jeux de société",
                "Forums associatifs",
                "Moments d'échange",
                "Animations intergénérationnelles"
            ]
        }
    ],
    events: [
        {
            id: 1,
            day: "10",
            month: "SEP",
            title: "Café Informatique",
            description: "Session d'aide et d'accompagnement pour vos questions numériques. Venez avec vos appareils !",
            location: "Médiathèque Jean-Paul Roussillot",
            time: "14h00 - 16h00"
        },
        {
            id: 2,
            day: "18",
            month: "SEP",
            title: "Atelier Scrapbooking",
            description: "Créez votre album photo personnalisé. Matériel fourni, tous niveaux bienvenus.",
            location: "Médiathèque Jean-Paul Roussillot",
            time: "15h00 - 17h00"
        },
        {
            id: 3,
            day: "25",
            month: "SEP",
            title: "Rencontre d'auteur",
            description: "Venez échanger avec un auteur local autour de son dernier ouvrage.",
            location: "Médiathèque Jean-Paul Roussillot",
            time: "18h30 - 20h00"
        }
    ]
};

// Variables globales
let isAdminMode = false;
let adminPassword = "animmedia2025"; // À changer pour plus de sécurité

// Fonction pour sauvegarder les données dans le localStorage
function saveData() {
    localStorage.setItem('animMediaData', JSON.stringify(siteData));
}

// Fonction pour charger les données depuis le localStorage
function loadData() {
    const savedData = localStorage.getItem('animMediaData');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        siteData.activities = parsedData.activities || siteData.activities;
        siteData.events = parsedData.events || siteData.events;
    }
}

// Générer les activités dynamiquement
function renderActivities() {
    const activitiesGrid = document.querySelector('.activities-grid');
    if (!activitiesGrid) return;

    activitiesGrid.innerHTML = siteData.activities.map(activity => `
        <div class="activity-card" data-id="${activity.id}">
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <h3>${activity.title}</h3>
                <ul>
                    ${activity.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
                ${isAdminMode ? `
                    <div class="admin-controls">
                        <button onclick="editActivity(${activity.id})" class="btn-edit">
                            <i class="fas fa-edit"></i> Modifier
                        </button>
                        <button onclick="deleteActivity(${activity.id})" class="btn-delete">
                            <i class="fas fa-trash"></i> Supprimer
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');

    if (isAdminMode) {
        activitiesGrid.innerHTML += `
            <div class="activity-card add-new" onclick="addActivity()">
                <div class="activity-icon">
                    <i class="fas fa-plus"></i>
                </div>
                <div class="activity-content">
                    <h3>Ajouter une activité</h3>
                </div>
            </div>
        `;
    }
}

// Générer les événements dynamiquement
function renderEvents() {
    const eventsGrid = document.querySelector('.events-grid');
    if (!eventsGrid) return;

    eventsGrid.innerHTML = siteData.events.map(event => `
        <div class="event-card" data-id="${event.id}">
            <div class="event-date">
                <span class="day">${event.day}</span>
                <span class="month">${event.month}</span>
            </div>
            <div class="event-content">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <div class="event-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${event.location}</span>
                </div>
                ${event.time ? `
                    <div class="event-time">
                        <i class="fas fa-clock"></i>
                        <span>${event.time}</span>
                    </div>
                ` : ''}
                ${isAdminMode ? `
                    <div class="admin-controls">
                        <button onclick="editEvent(${event.id})" class="btn-edit">
                            <i class="fas fa-edit"></i> Modifier
                        </button>
                        <button onclick="deleteEvent(${event.id})" class="btn-delete">
                            <i class="fas fa-trash"></i> Supprimer
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');

    if (isAdminMode) {
        eventsGrid.innerHTML += `
            <div class="event-card add-new" onclick="addEvent()">
                <div class="event-date">
                    <span class="day">+</span>
                    <span class="month">NEW</span>
                </div>
                <div class="event-content">
                    <h3>Ajouter un événement</h3>
                </div>
            </div>
        `;
    }
}

// Mode administration
function toggleAdminMode() {
    if (!isAdminMode) {
        const password = prompt("Mot de passe administrateur :");
        if (password !== adminPassword) {
            alert("Mot de passe incorrect !");
            return;
        }
    }
    
    isAdminMode = !isAdminMode;
    updateAdminUI();
    renderActivities();
    renderEvents();
}

function updateAdminUI() {
    const adminPanel = document.getElementById('admin-panel');
    const adminToggle = document.getElementById('admin-toggle');
    
    if (isAdminMode) {
        if (adminPanel) adminPanel.style.display = 'block';
        if (adminToggle) {
            adminToggle.innerHTML = '<i class="fas fa-lock"></i> Quitter l\'admin';
            adminToggle.classList.add('admin-active');
        }
        document.body.classList.add('admin-mode');
    } else {
        if (adminPanel) adminPanel.style.display = 'none';
        if (adminToggle) {
            adminToggle.innerHTML = '<i class="fas fa-unlock"></i> Mode admin';
            adminToggle.classList.remove('admin-active');
        }
        document.body.classList.remove('admin-mode');
    }
}

// Fonctions CRUD pour les activités
function addActivity() {
    const title = prompt("Titre de l'activité :");
    if (!title) return;
    
    const icon = prompt("Classe d'icône Font Awesome (ex: fas fa-desktop) :");
    if (!icon) return;
    
    const itemsStr = prompt("Éléments de l'activité (séparés par des virgules) :");
    if (!itemsStr) return;
    
    const items = itemsStr.split(',').map(item => item.trim());
    
    const newActivity = {
        id: Date.now(),
        icon: icon,
        title: title,
        items: items
    };
    
    siteData.activities.push(newActivity);
    saveData();
    renderActivities();
}

function editActivity(id) {
    const activity = siteData.activities.find(a => a.id === id);
    if (!activity) return;
    
    const newTitle = prompt("Titre de l'activité :", activity.title);
    if (newTitle === null) return;
    
    const newIcon = prompt("Classe d'icône Font Awesome :", activity.icon);
    if (newIcon === null) return;
    
    const newItemsStr = prompt("Éléments de l'activité (séparés par des virgules) :", activity.items.join(', '));
    if (newItemsStr === null) return;
    
    activity.title = newTitle;
    activity.icon = newIcon;
    activity.items = newItemsStr.split(',').map(item => item.trim());
    
    saveData();
    renderActivities();
}

function deleteActivity(id) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) return;
    
    siteData.activities = siteData.activities.filter(a => a.id !== id);
    saveData();
    renderActivities();
}

// Fonctions CRUD pour les événements
function addEvent() {
    const title = prompt("Titre de l'événement :");
    if (!title) return;
    
    const day = prompt("Jour (ex: 15) :");
    if (!day) return;
    
    const month = prompt("Mois (ex: SEP) :");
    if (!month) return;
    
    const description = prompt("Description de l'événement :");
    if (!description) return;
    
    const location = prompt("Lieu de l'événement :");
    if (!location) return;
    
    const time = prompt("Horaire (optionnel, ex: 14h00 - 16h00) :");
    
    const newEvent = {
        id: Date.now(),
        day: day,
        month: month.toUpperCase(),
        title: title,
        description: description,
        location: location,
        time: time || ""
    };
    
    siteData.events.push(newEvent);
    saveData();
    renderEvents();
}

function editEvent(id) {
    const event = siteData.events.find(e => e.id === id);
    if (!event) return;
    
    const newTitle = prompt("Titre de l'événement :", event.title);
    if (newTitle === null) return;
    
    const newDay = prompt("Jour :", event.day);
    if (newDay === null) return;
    
    const newMonth = prompt("Mois :", event.month);
    if (newMonth === null) return;
    
    const newDescription = prompt("Description :", event.description);
    if (newDescription === null) return;
    
    const newLocation = prompt("Lieu :", event.location);
    if (newLocation === null) return;
    
    const newTime = prompt("Horaire :", event.time);
    if (newTime === null) return;
    
    event.title = newTitle;
    event.day = newDay;
    event.month = newMonth.toUpperCase();
    event.description = newDescription;
    event.location = newLocation;
    event.time = newTime;
    
    saveData();
    renderEvents();
}

function deleteEvent(id) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) return;
    
    siteData.events = siteData.events.filter(e => e.id !== id);
    saveData();
    renderEvents();
}

// Fonctions d'export/import
function exportData() {
    const dataStr = JSON.stringify(siteData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'animmedia-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                if (importedData.activities && importedData.events) {
                    siteData.activities = importedData.activities;
                    siteData.events = importedData.events;
                    saveData();
                    renderActivities();
                    renderEvents();
                    alert('Données importées avec succès !');
                } else {
                    alert('Format de fichier invalide !');
                }
            } catch (error) {
                alert('Erreur lors de l\'importation : ' + error.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    renderActivities();
    renderEvents();
    
    // Le reste du code JavaScript existant...
    initializeExistingFeatures();
});

function initializeExistingFeatures() {
    // Navigation mobile
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fermer le menu mobile quand on clique sur un lien
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Animation du hamburger menu
        mobileMenu.addEventListener('click', () => {
            const bars = mobileMenu.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                if (mobileMenu.classList.contains('active')) {
                    if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) bar.style.opacity = '0';
                    if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                }
            });
        });
    }

    // Smooth scrolling pour la navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animation des éléments au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer les éléments à animer
    const animateElements = document.querySelectorAll('.point, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Formulaire de contact
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const nom = formData.get('nom');
            const email = formData.get('email');
            const message = formData.get('message');
            
            if (!nom || !email || !message) {
                alert('Veuillez remplir tous les champs');
                return;
            }
            
            if (!validateEmail(email)) {
                alert('Veuillez entrer une adresse email valide');
                return;
            }
            
            alert('Merci pour votre message ! Nous vous recontacterons bientôt.');
            this.reset();
        });
    }

    // Validation email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Galerie lightbox simple
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
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

    // Navbar transparente/opaque selon le scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        }
    });

    console.log('Site Anim\'Média chargé avec succès !');
}
