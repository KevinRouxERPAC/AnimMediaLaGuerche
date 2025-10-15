@echo off
echo.
echo ========================================
echo   ANIM'MEDIA - SERVEUR LOCAL DE TEST
echo ========================================
echo.
echo Demarrage du serveur HTTP local...
echo Le site sera accessible sur http://localhost:8000
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

REM Vérifier si Python est disponible
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: Python n'est pas installe ou accessible.
    echo Veuillez installer Python depuis https://python.org
    pause
    exit /b 1
)

REM Démarrer le serveur
python server.py

pause