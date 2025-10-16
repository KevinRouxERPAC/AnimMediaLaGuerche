# 📊 Guide des Données - Base de Données Anim'Média

## 🎯 **Vue d'ensemble**

Ce document détaille toutes les données qu'une base de données complète pourrait enregistrer pour l'association Anim'Média. Le schéma est conçu pour être évolutif et couvrir tous les besoins d'une association culturelle moderne.

---

## 📋 **MODULES DE DONNÉES**

### 👥 **1. GESTION DES UTILISATEURS ET MEMBRES**

#### **Users (Utilisateurs)**
- **Informations personnelles** : nom, prénom, email, téléphone, date de naissance
- **Adresse complète** : ligne 1, ligne 2, ville, code postal, pays
- **Adhésion** : numéro de membre, type d'adhésion, dates de début/fin, statut
- **Sécurité** : rôle, mot de passe hashé, vérification email
- **Préférences** : types d'activités préférées, paramètres de notification
- **Contact d'urgence** : nom et téléphone
- **Statistiques** : événements fréquentés, montant total payé, dernière connexion

#### **Membership Types (Types d'adhésion)**
- **Définition** : nom, description, prix, durée en jours
- **Avantages** : liste des bénéfices inclus (JSON)
- **Limites** : nombre max d'événements par mois
- **Remises** : pourcentage de réduction accordé
- **Statut** : actif/inactif

### 🎯 **2. GESTION DES ÉVÉNEMENTS**

#### **Events (Événements)**
- **Informations de base** : titre, slug, description courte/longue
- **Classification** : type, catégorie, niveau de difficulté
- **Programmation** : dates/heures de début/fin, durée
- **Lieu** : location, salle spécifique
- **Participants** : min/max, nombre actuel, liste d'attente
- **Finances** : prix public, prix membre, coût matériel
- **Staff** : instructeur, assistant
- **Médias** : image principale, galerie d'images
- **Publication** : statut, mise en avant, date de publication, deadline inscription
- **Métadonnées** : tags, prérequis, matériel à apporter, infos supplémentaires
- **Analytics** : vues, inscriptions, note moyenne, nombre d'évaluations

#### **Event Types (Types d'événements)**
- **Apparence** : nom, couleur, icône FontAwesome
- **Paramètres par défaut** : durée, prix standard
- **Organisation** : ordre d'affichage, statut actif

#### **Categories (Catégories)**
- **Hiérarchie** : catégories parent/enfant
- **Métadonnées** : nom, description, slug
- **Organisation** : ordre d'affichage

#### **Locations (Lieux)**
- **Adresse complète** : lignes d'adresse, ville, code postal
- **Géolocalisation** : latitude, longitude
- **Capacité** : nombre max de participants
- **Équipements** : salles disponibles, matériel (JSON)
- **Contact** : personne responsable, téléphone, email
- **Accessibilité** : parking, transport public, PMR

### 📝 **3. GESTION DES INSCRIPTIONS**

#### **Registrations (Inscriptions)**
- **Relations** : événement, utilisateur
- **Statut** : en attente, confirmé, annulé, absent, terminé
- **Type** : normale, liste d'attente, staff, invité
- **Paiement** : montant payé, statut, méthode, référence
- **Dates importantes** : inscription, confirmation, annulation
- **Informations** : notes, besoins spéciaux, contact d'urgence
- **Feedback** : présence, note, commentaire

#### **Waiting List (Liste d'attente)**
- **Position** : rang dans la liste
- **Statut** : en attente, proposé, confirmé, refusé, expiré
- **Délais** : ajouté le, proposé le, expire le

### 💰 **4. GESTION FINANCIÈRE**

#### **Payments (Paiements)**
- **Détails** : montant, devise, type de paiement, méthode
- **Statut** : en attente, terminé, échoué, remboursé
- **Références** : externe (banque), interne, numéro de reçu
- **Dates** : paiement, traitement, remboursement
- **Métadonnées** : description, notes

### 📧 **5. COMMUNICATION**

#### **Communications (Messages)**
- **Type** : newsletter, notification, rappel, annonce, bienvenue, demande d'avis
- **Contenu** : sujet, texte, HTML
- **Envoi** : expéditeur, statut, programmation
- **Ciblage** : type de cible, critères de sélection
- **Statistiques** : destinataires, ouvertures, clics, désabonnements
- **Métadonnées** : template utilisé, pièces jointes

#### **Communication Recipients (Destinataires)**
- **Tracking** : envoyé, livré, ouvert, cliqué
- **Métadonnées** : adresse email, navigateur, IP
- **Échecs** : raison de l'échec

### 🖼️ **6. GESTION DES MÉDIAS**

#### **Media (Médias)**
- **Fichier** : nom, chemin, taille, type MIME, hash
- **Classification** : type (image/vidéo/audio/document), catégorie
- **Métadonnées** : titre, description, texte alternatif, tags
- **Relations** : uploadeur, événement lié
- **Statut** : privé, public, archivé, mis en avant
- **Techniques** : dimensions, miniature
- **Utilisation** : téléchargements, vues

### ⭐ **7. ÉVALUATIONS ET FEEDBACK**

#### **Reviews (Évaluations)**
- **Notes** : globale, contenu, instructeur, organisation, lieu (1-5)
- **Commentaires** : avis, suggestions, recommandation
- **Statut** : en attente, approuvé, rejeté, anonyme, mis en avant
- **Modération** : révisé par, date de révision

### 📚 **8. RESSOURCES ET DOCUMENTS**

#### **Resources (Ressources)**
- **Type** : document, lien, vidéo, tutoriel
- **Contenu** : fichier, URL externe, texte
- **Classification** : catégorie, tags, niveau de difficulté
- **Accès** : niveau d'accès (public/membres/participants/instructeurs)
- **Statistiques** : téléchargements, vues

### ⚙️ **9. CONFIGURATION ET SYSTÈME**

#### **Settings (Paramètres)**
- **Configuration** : clé/valeur, type de données
- **Organisation** : catégorie, description
- **Visibilité** : public ou privé

#### **Activity Logs (Journaux d'activité)**
- **Action** : utilisateur, action, entité concernée
- **Détails** : description, changements (JSON)
- **Métadonnées** : IP, navigateur, niveau, catégorie

#### **Sessions (Sessions)**
- **Sécurité** : ID de session, utilisateur, IP, navigateur
- **Données** : payload, dernière activité

---

## 📊 **STATISTIQUES ET RAPPORTS POSSIBLES**

### 📈 **Tableau de Bord**
- Adhérents actifs/total
- Événements du mois
- Revenus mensuels/annuels
- Taux de satisfaction moyen
- Événements les plus populaires
- Instructeurs les mieux notés

### 💰 **Finances**
- Chiffre d'affaires par mois/année
- Revenus par type d'événement
- Revenus par type d'adhésion
- Créances en cours
- Remboursements effectués

### 👥 **Adhérents**
- Évolution du nombre d'adhérents
- Répartition par âge/ville
- Préférences d'activités
- Taux de renouvellement
- Adhérents les plus actifs

### 🎯 **Événements**
- Taux de remplissage
- Événements annulés/reportés
- Durée moyenne des événements
- Saisonnalité des inscriptions
- Analyse géographique des participants

### 📧 **Communication**
- Taux d'ouverture des newsletters
- Taux de clic
- Désabonnements
- Campagnes les plus efficaces

---

## 🔒 **SÉCURITÉ ET CONFORMITÉ**

### **RGPD**
- Consentement explicite pour les données
- Droit à l'oubli (suppression des données)
- Portabilité des données
- Historique des consentements

### **Sécurité**
- Mots de passe hashés (bcrypt/argon2)
- Sessions sécurisées
- Logs d'audit complets
- Sauvegarde automatique
- Chiffrement des données sensibles

### **Accès**
- Rôles utilisateurs (membre, instructeur, admin, super admin)
- Permissions granulaires
- Authentification à deux facteurs (2FA)
- Limitation des tentatives de connexion

---

## 📋 **AVANTAGES DE CETTE STRUCTURE**

### ✅ **Fonctionnalités Avancées**
- Gestion complète des adhérents
- Inscriptions en ligne automatisées
- Paiements sécurisés
- Communication ciblée
- Statistiques détaillées
- Galerie de médias
- Système d'évaluation
- Gestion des ressources

### ✅ **Évolutivité**
- Structure modulaire
- Ajout facile de nouvelles fonctionnalités
- Support de plusieurs lieux
- Hiérarchie de catégories
- Gestion multi-instructeurs

### ✅ **Performance**
- Index optimisés
- Requêtes efficaces
- Cache possible
- Pagination native

### ✅ **Administration**
- Audit complet des actions
- Sauvegarde/restauration
- Configuration flexible
- Monitoring intégré

---

## 🚀 **MIGRATION DEPUIS LE SYSTÈME JSON**

### **Étape 1** : Import des données existantes
- Événements depuis `events.json`
- Membres depuis `members.json` 
- Inscriptions depuis `registrations.json`

### **Étape 2** : Configuration initiale
- Types d'adhésion
- Types d'événements
- Lieux
- Paramètres système

### **Étape 3** : Formation et déploiement
- Formation des administrateurs
- Tests en environnement de production
- Migration progressive

---

## 💡 **RECOMMANDATION POUR ANIM'MÉDIA**

**Pour une association de taille moyenne comme Anim'Média :**

- **Phase 1** : Commencer avec le système JSON étendu (actuel)
- **Phase 2** : Migrer vers SQLite si >200 adhérents actifs
- **Phase 3** : Évoluer vers MySQL/PostgreSQL si >1000 adhérents

Cette approche progressive permet d'évoluer selon les besoins réels sans sur-investir techniquement.