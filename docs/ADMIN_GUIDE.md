# 👥 Guide d'Administration - Anim'Média La Guerche

Ce guide explique comment utiliser l'interface d'administration du site web pour gérer le contenu de l'association.

## 📋 Table des Matières

1. [Accès à l'Administration](#accès-à-ladministration)
2. [Interface Principale](#interface-principale)
3. [Gestion des Événements](#gestion-des-événements)
4. [Gestion des Activités](#gestion-des-activités)
5. [Gestion de la Galerie](#gestion-de-la-galerie)
6. [Paramètres](#paramètres)
7. [Bonnes Pratiques](#bonnes-pratiques)
8. [Dépannage](#dépannage)

## 🔐 Accès à l'Administration

### URL d'Accès
```
https://votre-site.com/admin/
```

### Identifiants par Défaut

#### Administrateur Principal
- **Nom d'utilisateur :** `admin`
- **Mot de passe :** `animmedia2024`
- **Rôle :** Administrateur (accès complet)

#### Bénévoles
- **Nom d'utilisateur :** `benevole1`
- **Mot de passe :** `benevole123`
- **Rôle :** Éditeur

- **Nom d'utilisateur :** `benevole2`
- **Mot de passe :** `benevole456`
- **Rôle :** Éditeur

> ⚠️ **Important :** Changez ces mots de passe dès la première connexion !

### Première Connexion

1. **Ouvrir l'interface d'administration**
2. **Saisir les identifiants**
3. **Cliquer sur "Se connecter"**
4. **Vous êtes redirigé vers le tableau de bord**

## 🏠 Interface Principale

### Navigation

L'interface est divisée en plusieurs sections :

- **📊 Tableau de Bord :** Vue d'ensemble et statistiques
- **📅 Événements :** Gestion des événements de l'association
- **👥 Activités :** Gestion des activités proposées
- **🖼️ Galerie Photos :** Upload et organisation des images
- **⚙️ Paramètres :** Configuration générale du site

### Tableau de Bord

Le tableau de bord affiche :
- **Statistiques rapides :** Nombre d'événements, activités, photos
- **Événements récents :** Les 3 prochains événements
- **Activités populaires :** Les activités avec le plus de participants

## 📅 Gestion des Événements

### Voir les Événements

1. **Cliquer sur "Événements"** dans le menu
2. **Consulter la liste** de tous les événements
3. **Utiliser les actions** (Modifier/Supprimer) sur chaque ligne

### Ajouter un Nouvel Événement

1. **Cliquer sur "Ajouter un événement"**
2. **Remplir le formulaire :**
   - **Titre :** Nom de l'événement
   - **Description :** Description détaillée
   - **Date :** Date de l'événement (format : JJ/MM/AAAA)
   - **Heure :** Heure de début (format : HH:MM)
   - **Lieu :** Lieu de l'événement
   - **Statut :** Publié ou Brouillon

3. **Cliquer sur "Enregistrer"**

#### Exemple d'Événement
```
Titre: Atelier Cuisine du Monde
Description: Découverte des saveurs italiennes avec préparation de pâtes fraîches
Date: 15/03/2024
Heure: 14:00
Lieu: Cuisine de la Maison des Associations
Statut: Publié
```

### Modifier un Événement

1. **Cliquer sur l'icône crayon** à côté de l'événement
2. **Modifier les informations** dans le formulaire
3. **Cliquer sur "Enregistrer"**

### Supprimer un Événement

1. **Cliquer sur l'icône poubelle** à côté de l'événement
2. **Confirmer la suppression** dans la boîte de dialogue
3. L'événement est supprimé définitivement

> ⚠️ **Attention :** La suppression est définitive et ne peut pas être annulée !

## 👥 Gestion des Activités

### Vue d'Ensemble

Les activités sont affichées sous forme de cartes avec :
- **Titre et description**
- **Informations pratiques :** âge, horaires, prix
- **Nombre de participants**
- **Barre de progression** du remplissage

### Ajouter une Nouvelle Activité

1. **Cliquer sur "Ajouter une activité"**
2. **Remplir le formulaire :**
   - **Titre :** Nom de l'activité
   - **Description :** Description détaillée
   - **Catégorie :** Type d'activité (Spectacle, Loisirs, Sport, etc.)
   - **Âge :** Tranche d'âge concernée
   - **Horaires :** Créneaux horaires
   - **Animateur :** Nom de l'animateur/responsable
   - **Participants actuels :** Nombre d'inscrits
   - **Participants maximum :** Capacité maximale
   - **Prix :** Tarif de l'activité
   - **Icône :** Icône représentative (voir liste ci-dessous)
   - **Statut :** Active ou Inactive

#### Icônes Disponibles
```
🎭 Théâtre: fas fa-theater-masks
🍳 Cuisine: fas fa-utensils
🎨 Arts Plastiques: fas fa-palette
📚 Lecture: fas fa-book
🎵 Musique: fas fa-music
💃 Danse: fas fa-music
🏃 Sport: fas fa-running
🧘 Bien-être: fas fa-leaf
👥 Social: fas fa-users
🌟 Autre: fas fa-star
```

#### Exemple d'Activité
```
Titre: Atelier Poterie
Description: Initiation à la poterie et création d'objets en céramique
Catégorie: Arts
Âge: 12-99 ans
Horaires: Jeudi 18h-20h
Animateur: Marie Dubois
Participants actuels: 8
Participants maximum: 12
Prix: 180€/trimestre
Icône: fas fa-palette
Statut: Active
```

### Modifier une Activité

1. **Cliquer sur "Modifier"** sur la carte de l'activité
2. **Ajuster les informations** nécessaires
3. **Enregistrer** les modifications

## 🖼️ Gestion de la Galerie

### Vue d'Ensemble

La galerie affiche toutes les photos sous forme de grille avec :
- **Aperçu de l'image**
- **Titre et description**
- **Catégorie et date**
- **Actions** (Voir, Modifier, Supprimer)

### Ajouter des Photos

#### Méthode 1 : Bouton d'Upload
1. **Cliquer sur "Ajouter une photo"**
2. **Cliquer sur "Choisir un fichier"**
3. **Sélectionner l'image** (max 5MB, formats : JPG, PNG, GIF, WebP)
4. **Remplir les informations :**
   - **Titre :** Titre descriptif
   - **Description :** Description de la photo
   - **Catégorie :** Classement (Théâtre, Cuisine, Sport, etc.)
   - **Date :** Date de prise de vue

#### Méthode 2 : Glisser-Déposer
1. **Ouvrir la fenêtre d'ajout**
2. **Glisser l'image** directement dans la zone de dépôt
3. **Remplir les informations**
4. **Enregistrer**

### Organiser les Photos

#### Catégories Recommandées
- **Théâtre :** Spectacles et ateliers théâtre
- **Cuisine :** Ateliers culinaires
- **Arts :** Activités artistiques et créatives
- **Sport :** Activités sportives
- **Événements :** Événements spéciaux de l'association
- **Sorties :** Sorties et excursions
- **Général :** Photos diverses

#### Bonnes Pratiques
- **Noms descriptifs :** "Atelier theatre enfants mars 2024"
- **Descriptions détaillées :** Contexte, participants, lieu
- **Tri par date :** Facilite la recherche
- **Qualité des images :** Privilégier les bonnes résolutions

## ⚙️ Paramètres

### Informations Générales

Dans l'onglet Paramètres, vous pouvez modifier :

#### Informations de l'Association
- **Nom :** Nom officiel de l'association
- **Description :** Présentation courte
- **Email :** Adresse email de contact
- **Téléphone :** Numéro de téléphone
- **Adresse :** Adresse postale

#### Réseaux Sociaux
- **Facebook :** URL de la page Facebook
- **Instagram :** URL du compte Instagram
- **Twitter :** URL du compte Twitter

#### Notifications
- **Notifications email :** Activer/désactiver
- **Notifications navigateur :** Autoriser les notifications push
- **Newsletter :** Gestion des abonnements

### Sauvegarder les Paramètres

1. **Modifier les informations** nécessaires
2. **Cliquer sur "Sauvegarder"**
3. **Confirmation** affichée en haut de l'écran

## ✅ Bonnes Pratiques

### Gestion du Contenu

#### Événements
- **Planifier à l'avance :** Créer les événements dès que possible
- **Informations complètes :** Date, heure, lieu, description détaillée
- **Statut approprié :** Utiliser "Brouillon" pour les événements en préparation
- **Mise à jour régulière :** Modifier si changements d'horaire ou lieu

#### Activités
- **Informations à jour :** Vérifier régulièrement le nombre de participants
- **Descriptions attractives :** Donner envie de participer
- **Tarifs clairs :** Indiquer tous les coûts (inscription, matériel, etc.)
- **Contact animateur :** Faciliter la prise de contact

#### Photos
- **Qualité professionnelle :** Éviter les photos floues ou mal cadrées
- **Respect de la vie privée :** Autorisation pour les photos de personnes
- **Organisation logique :** Utiliser les catégories efficacement
- **Suppression régulière :** Nettoyer les anciennes photos

### Sécurité

#### Mots de Passe
- **Changement régulier :** Tous les 3-6 mois
- **Mots de passe forts :** Minimum 12 caractères, lettres, chiffres, symboles
- **Pas de partage :** Chaque bénévole a son propre compte
- **Déconnexion :** Toujours se déconnecter après utilisation

#### Sauvegarde
- **Fréquence :** Exporter les données mensuellement
- **Stockage :** Sauvegarder sur plusieurs supports
- **Test de restauration :** Vérifier que les sauvegardes fonctionnent

### Organisation

#### Planning Editorial
```
📅 Suggestions de planning :
├── Lundi : Vérification/mise à jour événements semaine
├── Mercredi : Ajout nouvelles photos activités
├── Vendredi : Planification événements semaine suivante
└── Mensuel : Révision complète des activités
```

#### Répartition des Tâches
- **Administrateur :** Gestion globale, paramètres, utilisateurs
- **Bénévole référent événements :** Création/modification événements
- **Bénévole référent activités :** Mise à jour activités et participants
- **Bénévole référent communication :** Gestion galerie photos

## 🚨 Dépannage

### Problèmes de Connexion

#### "Identifiants incorrects"
- **Vérifier :** Nom d'utilisateur et mot de passe exacts
- **Caps Lock :** Vérifier que la majuscule n'est pas activée
- **Copier-coller :** Éviter, taper manuellement

#### "Session expirée"
- **Reconnexion :** Se reconnecter normalement
- **Durée :** Sessions valides 30 minutes d'inactivité
- **Extension automatique :** Toute action prolonge la session

### Problèmes d'Enregistrement

#### "Erreur lors de la sauvegarde"
- **Champs obligatoires :** Vérifier que tous les champs requis sont remplis
- **Format de date :** Utiliser le format JJ/MM/AAAA
- **Taille des images :** Maximum 5MB par photo

#### "Modifications non sauvegardées"
- **Auto-sauvegarde :** Le système sauvegarde automatiquement les brouillons
- **Sauvegarde manuelle :** Toujours cliquer "Enregistrer" pour finaliser

### Problèmes d'Affichage

#### Interface déformée
- **Cache navigateur :** Ctrl+F5 pour forcer le rechargement
- **Navigateur :** Utiliser Chrome, Firefox, Safari ou Edge récents
- **JavaScript :** Vérifier que JavaScript est activé

#### Photos ne s'affichent pas
- **Format :** Vérifier JPG, PNG, GIF ou WebP uniquement
- **Taille :** Maximum 5MB
- **Connexion :** Vérifier la connexion Internet

## 📞 Support et Contact

### Ressources d'Aide

#### Documentation
- **Guide d'utilisation :** Ce document
- **Guide de déploiement :** `docs/DEPLOYMENT.md`
- **FAQ :** Questions fréquentes disponibles dans l'interface

#### Assistance Technique
- **Email association :** contact@animmedia-laguerche.fr
- **Référent technique :** [Nom du responsable technique]
- **Documentation en ligne :** Consultable dans l'interface admin

### Formation

#### Sessions de Formation
- **Formation initiale :** Pour les nouveaux bénévoles
- **Sessions de mise à jour :** Lors d'évolutions de l'interface
- **Support individuel :** Sur demande

#### Auto-formation
- **Interface intuitive :** Exploration libre encouragée
- **Mode test :** Utiliser le statut "Brouillon" pour tester
- **Aide contextuelle :** Bulles d'aide dans l'interface

---

## 📋 Checklist Utilisateur

### Première Utilisation
- [ ] Connexion réussie avec les identifiants fournis
- [ ] Changement du mot de passe par défaut
- [ ] Tour complet de l'interface
- [ ] Test création d'un événement en brouillon
- [ ] Test ajout d'une photo
- [ ] Lecture complète de ce guide

### Utilisation Quotidienne
- [ ] Vérification des événements à venir
- [ ] Mise à jour des nombres de participants
- [ ] Ajout des nouvelles photos d'activités
- [ ] Réponse aux demandes de renseignements
- [ ] Déconnexion sécurisée

### Maintenance Mensuelle
- [ ] Révision complète des informations
- [ ] Suppression des événements passés obsolètes
- [ ] Mise à jour des activités et tarifs
- [ ] Organisation de la galerie photos
- [ ] Sauvegarde des données
- [ ] Vérification des paramètres généraux

---

> 💡 **Conseil :** N'hésitez pas à explorer l'interface et à tester les fonctionnalités. L'interface est conçue pour être intuitive et sûre !

> 🆘 **Aide :** En cas de problème, utilisez les notifications de l'interface qui vous guideront vers la solution.