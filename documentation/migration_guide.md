# 🚀 Guide de Migration : JSON → SQLite Sécurisé

## 📋 **Plan de Migration Simple pour Anim'Média**

### 🎯 **Quand migrer ?**

**Restez avec JSON SI :**
- ✅ Moins de 100 adhérents
- ✅ Moins de 50 événements/an
- ✅ Gestion manuelle acceptable
- ✅ Pas d'inscriptions en ligne simultanées

**Migrez vers SQLite QUAND :**
- 🔄 Plus de 100 adhérents actifs
- 🔄 Plus de 50 événements/an
- 🔄 Besoin d'inscriptions en ligne automatiques
- 🔄 Plusieurs personnes modifient les données
- 🔄 JSON devient lent à charger (>5 secondes)

---

## 🛠️ **Étapes de Migration Sécurisée**

### **Phase 1 : Préparation (1 jour)**

#### 1.1 Sauvegarde complète
```bash
# Créer un dossier de sauvegarde
mkdir migration_backup_$(date +%Y%m%d)

# Sauvegarder tout le projet
cp -r AnimMediaLaGuerche/ migration_backup_$(date +%Y%m%d)/

# Vérifier l'intégrité des fichiers JSON
python -m json.tool data/events.json > /dev/null
python -m json.tool data/members.json > /dev/null
python -m json.tool data/registrations.json > /dev/null
```

#### 1.2 Installation des dépendances
```bash
# Installer les outils de sécurité
cd AnimMediaLaGuerche
pip install -r requirements_db.txt

# Vérifier l'installation
python -c "import bcrypt; print('✅ bcrypt installé')"
python -c "import sqlite3; print('✅ SQLite disponible')"
```

#### 1.3 Test du schéma
```bash
# Créer une base de test
sqlite3 test.db < documentation/simple_secure_schema.sql

# Vérifier la structure
sqlite3 test.db ".tables"
sqlite3 test.db ".schema users"

# Nettoyer
rm test.db
```

### **Phase 2 : Migration des Données (2-4 heures)**

#### 2.1 Configuration initiale
```bash
# Lancer la configuration sécurisée
python scripts/security.py setup

# Saisir un mot de passe fort pour l'admin
# Exemple: AnimMedia2024!Secure
```

#### 2.2 Migration automatique
```bash
# Migrer depuis JSON vers SQLite
python scripts/security.py migrate

# Vérifier la migration
sqlite3 animmedia.db "SELECT COUNT(*) FROM users;"
sqlite3 animmedia.db "SELECT COUNT(*) FROM events;"
sqlite3 animmedia.db "SELECT COUNT(*) FROM registrations;"
```

#### 2.3 Vérification des données
```sql
-- Contrôles de cohérence dans SQLite
.open animmedia.db

-- Vérifier les utilisateurs
SELECT first_name, last_name, email, membership_type FROM users LIMIT 5;

-- Vérifier les événements
SELECT title, event_date, event_type, max_participants FROM events LIMIT 5;

-- Vérifier les inscriptions
SELECT e.title, u.first_name, u.last_name, r.status 
FROM registrations r
JOIN events e ON r.event_id = e.id
JOIN users u ON r.user_id = u.id
LIMIT 5;
```

### **Phase 3 : Tests et Validation (1 jour)**

#### 3.1 Tests de fonctionnement
```bash
# Test de sauvegarde
python scripts/security.py backup

# Test de sécurité
python scripts/security.py check

# Test de connexion admin
python scripts/security.py auth admin@animmedia.com
```

#### 3.2 Tests d'interface
```python
# Test d'intégration avec l'interface web existante
# Modifier assets/js/admin-events.js pour utiliser SQLite via API
```

#### 3.3 Validation des performances
```sql
-- Test de performance sur les requêtes fréquentes
.timer ON

-- Événements à venir
SELECT * FROM events_with_stats 
WHERE event_date >= date('now') 
ORDER BY event_date;

-- Membres actifs
SELECT * FROM active_members 
WHERE membership_expires > date('now')
ORDER BY last_registration DESC;

-- Rapport financier
SELECT * FROM monthly_revenue 
WHERE month >= strftime('%Y-%m', date('now', '-12 months'));
```

### **Phase 4 : Mise en Production (1/2 journée)**

#### 4.1 Basculement
```bash
# Renommer les anciens fichiers JSON (sauvegarde)
mv data/events.json data/events.json.backup
mv data/members.json data/members.json.backup
mv data/registrations.json data/registrations.json.backup

# La base SQLite devient la source de vérité
ls -la animmedia.db
```

#### 4.2 Configuration automatique
```bash
# Configurer la sauvegarde quotidienne (crontab Linux/macOS)
echo "0 2 * * * cd /path/to/AnimMediaLaGuerche && python scripts/security.py backup" | crontab -

# Ou sur Windows (Planificateur de tâches)
# Créer une tâche qui exécute quotidiennement à 2h du matin
```

#### 4.3 Formation utilisateurs
```markdown
# Formation rapide pour les administrateurs

## Nouvelles fonctionnalités disponibles :
- ✅ Inscriptions en temps réel sans conflit
- ✅ Statistiques automatiques
- ✅ Recherche avancée
- ✅ Audit de sécurité complet
- ✅ Sauvegardes automatiques

## Changements d'interface :
- Identique côté public
- Interface admin enrichie avec rapports
- Gestion des utilisateurs améliorée
```

---

## 🔒 **Checklist de Sécurité Post-Migration**

### **Sécurité des Données**
- [ ] Mot de passe admin complexe défini
- [ ] Base de données chiffrée si nécessaire
- [ ] Sauvegardes automatiques configurées
- [ ] Accès restreint au fichier .db
- [ ] Logs de sécurité activés

### **Intégrité des Données**
- [ ] Contraintes de validation activées
- [ ] Triggers de cohérence fonctionnels
- [ ] Index de performance créés
- [ ] Données migrées vérifiées

### **Monitoring**
- [ ] Vérification quotidienne des sauvegardes
- [ ] Monitoring des tentatives de connexion
- [ ] Alerte en cas d'erreur de base
- [ ] Rapport mensuel de sécurité

---

## 📊 **Comparaison Avant/Après Migration**

| Aspect | JSON (Avant) | SQLite (Après) |
|--------|--------------|----------------|
| **Performance** | Lent si >100 événements | Rapide même avec 10,000+ |
| **Concurrence** | Conflicts possibles | Gestion automatique |
| **Sécurité** | Basique | Chiffrement + audit |
| **Recherche** | Limitée | SQL complet |
| **Statistiques** | Manuelles | Automatiques |
| **Sauvegarde** | Manuelle | Automatique |
| **Intégrité** | Validation JS | Contraintes BDD |
| **Évolutivité** | Limitée | Très forte |

---

## 🆘 **Plan de Retour en Arrière**

Si des problèmes surviennent après migration :

### **Retour immédiat (< 1 heure)**
```bash
# Restaurer les fichiers JSON
mv data/events.json.backup data/events.json
mv data/members.json.backup data/members.json
mv data/registrations.json.backup data/registrations.json

# Désactiver l'interface SQLite
# Remettre en service l'interface JSON
```

### **Export de sécurité depuis SQLite**
```python
# Script d'urgence pour récupérer les données
import sqlite3
import json

def sqlite_to_json_emergency():
    conn = sqlite3.connect('animmedia.db')
    
    # Export des événements
    events = []
    for row in conn.execute('SELECT * FROM events'):
        # Convertir en format JSON original
        events.append({...})
    
    with open('data/events_recovered.json', 'w') as f:
        json.dump({'events': events}, f, indent=2)
    
    print("✅ Données récupérées en JSON")
```

---

## 📝 **Maintenance Post-Migration**

### **Quotidien (Automatique)**
- Sauvegarde automatique
- Monitoring des erreurs
- Nettoyage des logs anciens

### **Hebdomadaire**
```bash
# Vérification manuelle
python scripts/security.py check

# Optimisation base
sqlite3 animmedia.db "VACUUM; ANALYZE;"
```

### **Mensuel**
- Rapport de sécurité complet
- Test de restauration sauvegarde
- Mise à jour dépendances sécurité

### **Annuel**
- Audit sécurité complet
- Révision des mots de passe
- Archivage données anciennes

---

## 🎯 **Résultat Final**

Après migration réussie, Anim'Média bénéficiera de :

### **🚀 Performance**
- Chargement instantané même avec 1000+ événements
- Recherche rapide et flexible
- Interface réactive

### **🔒 Sécurité**
- Données chiffrées et protégées
- Audit complet des actions
- Sauvegardes automatiques fiables

### **📊 Fonctionnalités**
- Statistiques en temps réel
- Rapports automatiques
- Gestion multi-utilisateurs

### **🛠️ Maintenance**
- Outils d'administration avancés
- Monitoring automatique
- Évolutivité garantie

La migration de 6 tables simples mais sécurisées offre tous les avantages d'une vraie base de données sans la complexité ! 🎉