@echo off
title Anim'Media - Demarrage du Site
echo =======================================
echo    ANIM'MEDIA LA GUERCHE-SUR-L'AUBOIS
echo =======================================
echo.
echo Demarrage du serveur local...
echo Site disponible sur: http://localhost:8000
echo Interface admin sur: http://localhost:8000/admin/
echo.
echo Pour arreter: Ctrl+C
echo =======================================
echo.

cd /d "%~dp0"
python -m http.server 8000

pause