@echo off
chcp 65001 >nul
cls
echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                  🧹 NETTOYAGE POUR PRODUCTION                    ║
echo ║                     Anim'Média La Guerche                       ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

echo 📂 Répertoire de travail : %CD%
echo.

echo Fichiers et dossiers non essentiels détectés :
echo.

REM Vérifier quels fichiers/dossiers existent
set found_items=0

if exist "dev-tools" (
    echo   🗑️  dev-tools\ (outils de développement)
    set /a found_items+=1
)

if exist "docs" (
    echo   🗑️  docs\ (documentation)
    set /a found_items+=1
)

if exist ".github" (
    echo   🗑️  .github\ (workflows CI/CD)
    set /a found_items+=1
)

if exist "README.md" (
    echo   🗑️  README.md (documentation projet)
    set /a found_items+=1
)

if exist "demarrer.bat" (
    echo   🗑️  demarrer.bat (script démarrage développement)
    set /a found_items+=1
)

if exist ".gitignore" (
    echo   🗑️  .gitignore (configuration Git)
    set /a found_items+=1
)

if exist "cleanup-preview.py" (
    echo   🗑️  cleanup-preview.py (script temporaire)
    set /a found_items+=1
)

echo.

if %found_items%==0 (
    echo ✅ Aucun fichier non essentiel trouvé.
    echo 🎉 Le site est déjà prêt pour la production !
    goto end
)

echo 💾 Fichiers essentiels qui seront CONSERVÉS :
echo   ✅ index.html
echo   ✅ offline.html
echo   ✅ manifest.json
echo   ✅ sw.js
echo   ✅ robots.txt
echo   ✅ sitemap.xml
echo   ✅ admin\
echo   ✅ assets\
echo.

echo Que souhaitez-vous faire ?
echo.
echo 1. 🌐 NETTOYER pour production (supprimer tous les fichiers non essentiels)
echo 2. ❌ Annuler
echo.

set /p choice="Votre choix (1-2) : "

if "%choice%"=="1" goto cleanup
if "%choice%"=="2" goto cancel
goto invalid

:cleanup
echo.
echo ⚠️  ATTENTION : Cette action supprimera définitivement les fichiers non essentiels
echo.
set /p confirm="Êtes-vous sûr ? (oui/non) : "
if not "%confirm%"=="oui" goto cancel

echo.
echo 🧹 Suppression des fichiers non essentiels...
echo.

if exist "dev-tools" (
    echo   🗑️  Suppression : dev-tools\
    rd /s /q "dev-tools"
)

if exist "docs" (
    echo   🗑️  Suppression : docs\
    rd /s /q "docs"
)

if exist ".github" (
    echo   🗑️  Suppression : .github\
    rd /s /q ".github"
)

if exist "README.md" (
    echo   🗑️  Suppression : README.md
    del "README.md"
)

if exist "demarrer.bat" (
    echo   🗑️  Suppression : demarrer.bat
    del "demarrer.bat"
)

if exist ".gitignore" (
    echo   🗑️  Suppression : .gitignore
    del ".gitignore"
)

if exist "cleanup-preview.py" (
    echo   🗑️  Suppression : cleanup-preview.py
    del "cleanup-preview.py"
)

echo.
echo ✅ Nettoyage terminé !
echo.
echo 🎉 Site prêt pour la production !
echo 📁 Seuls les fichiers essentiels au fonctionnement ont été conservés.
echo 📊 Espace disque économisé et site optimisé.
goto end

:invalid
echo.
echo ❌ Choix invalide. Veuillez sélectionner 1 ou 2.
pause
goto start

:cancel
echo.
echo ❌ Opération annulée.
goto end

:end
echo.
echo 🌐 Votre site Anim'Média est maintenant optimisé pour la production !
echo 🚀 Vous pouvez l'uploader sur votre hébergeur web.
echo.
pause