@echo off
echo =======================================
echo    SERVEUR LOCAL ANIM'MEDIA
echo =======================================
echo.

cd /d "%~dp0"

echo Recherche du meilleur serveur disponible...
echo.

REM Essayer Node.js d'abord (le plus fiable)
echo [1/3] Test Node.js...
node serveur.js 2>nul
if not errorlevel 1 goto :end

echo [2/3] Test Python 3...
python -m http.server 8000 2>nul
if not errorlevel 1 goto :end

echo [3/3] Test Python 2...
python -m SimpleHTTPServer 8000 2>nul
if not errorlevel 1 goto :end

echo.
echo ❌ Aucun serveur trouve !
echo.
echo 💡 Solutions:
echo 1. Installez Node.js: https://nodejs.org
echo 2. Installez Python: https://python.org  
echo 3. Utilisez VS Code avec Live Server
echo 4. Ouvrez index.html directement (mode limite)
echo.
echo 📌 Le site fonctionne sans serveur mais avec limitations PWA.
echo.
echo Ouverture du site en mode local...
start index.html
echo.
pause

:end
echo.
echo Serveur arrete.