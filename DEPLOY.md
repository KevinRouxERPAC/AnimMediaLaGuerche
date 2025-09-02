# Instructions pour GitHub Pages

Ce fichier explique comment déployer le site Anim'Média sur GitHub Pages.

## Étapes de déploiement

### ✅ 1. Code poussé sur GitHub
```bash
git add .
git commit -m "Initial commit - Site Anim'Média"
git push origin main
```

### ✅ 2. Workflow GitHub Actions corrigé
Le fichier `.github/workflows/deploy.yml` a été mis à jour avec les versions les plus récentes :
- actions/checkout@v4
- actions/configure-pages@v4  
- actions/upload-pages-artifact@v3
- actions/deploy-pages@v4

### 3. Activer GitHub Pages
1. Aller sur https://github.com/KevinRouxERPAC/AnimMediaLaGuerche
2. Cliquer sur "Settings" (Paramètres)
3. Descendre jusqu'à la section "Pages"
4. Dans "Source", sélectionner "**GitHub Actions**"
5. Le site sera disponible à l'adresse : https://kevinrouxerpac.github.io/AnimMediaLaGuerche

### 4. Configuration automatique
- Le fichier `.github/workflows/deploy.yml` configure le déploiement automatique
- À chaque push sur la branche `main`, le site sera automatiquement mis à jour
- Le déploiement prend généralement 2-5 minutes

### 4. URL finale
Votre site sera accessible à l'adresse :
**https://kevinrouxerpac.github.io/AnimMediaLaGuerche**

### 5. Mises à jour futures
Pour mettre à jour le site :
1. Modifier les fichiers localement
2. Faire un commit : `git add . && git commit -m "Description des modifications"`
3. Pousser : `git push origin main`
4. Attendre quelques minutes que GitHub Pages se mette à jour

## Vérifications
- ✅ Fichiers HTML, CSS, JS créés
- ✅ Configuration GitHub Actions ajoutée
- ✅ Fichier _config.yml créé
- ✅ Structure du projet optimisée

## Domaine personnalisé (optionnel)
Si vous voulez utiliser votre propre domaine (ex: animmedia-laguerche.fr) :
1. Acheter le domaine chez un registraire
2. Ajouter un fichier `CNAME` avec votre domaine
3. Configurer les DNS pour pointer vers GitHub Pages
