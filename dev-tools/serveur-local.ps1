# =======================================
#    SERVEUR LOCAL ANIM'MEDIA
# =======================================

Write-Host "Demarrage du serveur local Anim'Media..." -ForegroundColor Green
Write-Host "Repertoire: $PWD" -ForegroundColor Cyan
Write-Host ""

try {
    # Essayer Python 3
    Write-Host "Tentative avec Python 3..." -ForegroundColor Yellow
    python -m http.server 8000
} catch {
    try {
        # Essayer Python 2
        Write-Host "Tentative avec Python 2..." -ForegroundColor Yellow  
        python -m SimpleHTTPServer 8000
    } catch {
        Write-Host ""
        Write-Host "ERREUR: Python non trouve!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Solutions alternatives:" -ForegroundColor Yellow
        Write-Host "1. Installer Python: https://python.org" 
        Write-Host "2. Utiliser Live Server dans VS Code"
        Write-Host "3. Utiliser un autre serveur local"
        Write-Host ""
        Write-Host "Le site fonctionne en mode limite sans serveur." -ForegroundColor Cyan
        Write-Host "Certaines fonctionnalites PWA ne seront pas disponibles."
        Write-Host ""
        Read-Host "Appuyez sur Entree pour continuer"
    }
}