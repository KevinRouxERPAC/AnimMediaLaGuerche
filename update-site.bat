@echo off
echo.
echo ======================================
echo    Mise a jour du site Anim'Media
echo ======================================
echo.

REM Vérifier s'il y a des modifications
git status --porcelain > nul
if %ERRORLEVEL% == 0 (
    echo Verification des modifications...
    git status
    echo.
    
    REM Demander confirmation
    set /p confirm="Voulez-vous pousser ces modifications vers GitHub Pages ? (o/n): "
    if /i "%confirm%" == "o" (
        echo.
        echo Ajout des fichiers...
        git add .
        
        echo Entrez un message de commit (ou appuyez sur Entree pour un message par defaut):
        set /p message=""
        if "%message%" == "" set message="Mise a jour du site"
        
        echo Commit en cours...
        git commit -m "%message%"
        
        echo Envoi vers GitHub...
        git push origin main
        
        echo.
        echo ======================================
        echo Site mis a jour avec succes !
        echo URL: https://kevinrouxerpac.github.io/AnimMediaLaGuerche
        echo ======================================
    ) else (
        echo Operation annulee.
    )
) else (
    echo Aucune modification detectee.
)

echo.
pause
