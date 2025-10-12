@echo off
title Controle Serveur Anim'Media

:menu
cls
echo =======================================
echo    CONTROLE SERVEUR ANIM'MEDIA
echo =======================================
echo.
echo  Status: SERVEUR ACTIF sur port 8000
echo  Site  : http://localhost:8000
echo  Admin : http://localhost:8000/admin/
echo.
echo =======================================
echo.
echo  [1] Ouvrir le site principal
echo  [2] Ouvrir l'interface admin  
echo  [3] Redemarrer le serveur
echo  [4] Arreter le serveur
echo  [5] Afficher les logs
echo  [6] Quitter
echo.
set /p choix="Votre choix (1-6): "

if "%choix%"=="1" start http://localhost:8000 & goto menu
if "%choix%"=="2" start http://localhost:8000/admin/ & goto menu
if "%choix%"=="3" goto restart
if "%choix%"=="4" goto stop
if "%choix%"=="5" goto logs
if "%choix%"=="6" goto end

echo Choix invalide !
pause
goto menu

:restart
echo Redemarrage du serveur...
taskkill /f /im python.exe 2>nul
timeout /t 2 /nobreak > nul
start /min python -m http.server 8000
echo Serveur redémarre...
timeout /t 3 /nobreak > nul
goto menu

:stop
echo Arret du serveur...
taskkill /f /im python.exe 2>nul
echo Serveur arrete !
pause
exit

:logs
echo.
echo === LOGS SERVEUR (Ctrl+C pour arreter) ===
echo.
python -m http.server 8000
goto menu

:end
echo Au revoir !