# 🔧 Guide de Développement Local

## Problèmes Courants et Solutions

### 1. **Erreur CORS avec manifest.json**
**Problème :** `Access to internal resource at 'file:///.../manifest.json' from origin 'null' has been blocked by CORS policy`

**Solution :** Le manifest PWA ne fonctionne qu'en HTTPS. Pour tester localement :

#### Option A : Serveur HTTP Local
```bash
# Avec Python
python -m http.server 8000

# Avec Node.js (si installé)
npx serve .

# Avec PHP
php -S localhost:8000
```

#### Option B : Extension VS Code
- Installer "Live Server" dans VS Code
- Clic droit sur `index.html` → "Open with Live Server"

### 2. **Erreur RangeError: Maximum call stack size exceeded**
**Cause :** Récursion infinie dans les fonctions JavaScript

**Fix appliqué :** Modification de `advanced-features.js` pour éviter la redéfinition récursive des fonctions.

### 3. **Test en Local vs Production**

#### Fonctionnalités disponibles en local (file://)
- ✅ HTML, CSS, JavaScript de base
- ✅ Interface d'administration
- ✅ Galerie et lightbox
- ✅ Navigation et responsive design
- ❌ PWA (manifest.json)
- ❌ Service Workers

#### Fonctionnalités complètes en production (HTTPS)
- ✅ Toutes les fonctionnalités locales
- ✅ PWA installable
- ✅ Manifest.json
- ✅ Service Workers (si implémentés)

## 🚀 Workflow de Développement Recommandé

### 1. Développement Local
```bash
# Cloner le projet
git clone https://github.com/KevinRouxERPAC/AnimMediaLaGuerche.git
cd AnimMediaLaGuerche

# Lancer un serveur local
python -m http.server 8000

# Ouvrir dans le navigateur
# http://localhost:8000
```

### 2. Test des Modifications
```bash
# Ajouter les modifications
git add .

# Committer
git commit -m "Description des modifications"

# Pousser vers GitHub
git push origin main
```

### 3. Vérification en Production
- Attendre le déploiement automatique (1-2 minutes)
- Tester sur : https://kevinrouxerpac.github.io/AnimMediaLaGuerche/
- Vérifier toutes les fonctionnalités PWA

## 🛠️ Outils de Debug

### Console JavaScript
Ouvrir les outils de développement (F12) et vérifier :
- Onglet **Console** : Messages d'erreur JavaScript
- Onglet **Network** : Chargement des ressources
- Onglet **Application** : Manifest PWA, localStorage

### Tests Automatiques
```bash
# Ouvrir le fichier de test
open test-site.html
# ou
http://localhost:8000/test-site.html
```

### Checklist Manuelle
Suivre la checklist dans `CHECKLIST-VERIFICATION.md`

## 📱 Test PWA

### En Local (Limité)
- Interface d'administration : ✅
- Galerie interactive : ✅
- Design responsive : ✅
- Manifest PWA : ❌ (CORS)

### En Production (Complet)
- Toutes les fonctionnalités : ✅
- Installation mobile : ✅
- Installation desktop : ✅

## 🐛 Résolution des Erreurs

### RangeError: Maximum call stack size exceeded
```javascript
// ❌ INCORRECT (cause récursion)
const original = myFunction;
function myFunction() {
    original(); // Appel récursif infini
}

// ✅ CORRECT (évite récursion)
function extendMyFunction() {
    if (typeof myFunction === 'function') {
        const original = myFunction;
        window.myFunction = function() {
            original();
            // Ajouts
        };
    }
}
```

### CORS Policy Error
```html
<!-- ❌ INCORRECT (ne fonctionne qu'en HTTPS) -->
<link rel="manifest" href="manifest.json">

<!-- ✅ CORRECT (conditionnel) -->
<script>
    if (location.protocol === 'https:') {
        document.write('<link rel="manifest" href="manifest.json">');
    }
</script>
```

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifier la console JavaScript (F12)
2. Tester en local avec serveur HTTP
3. Comparer avec la version en production
4. Consulter les logs GitHub Actions

---

**🎯 Rappel :** Le site fonctionne parfaitement en production. Les erreurs locales sont dues aux limitations de sécurité des navigateurs en mode `file://`.
