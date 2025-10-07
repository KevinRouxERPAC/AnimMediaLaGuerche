# 🚀 Serveur Local Simple - Anim'Média
# Script PowerShell pour démarrer un serveur HTTP local

Write-Host "🎨 Anim'Média - Démarrage du serveur local..." -ForegroundColor Green
Write-Host ""

# Vérifier si Python est installé
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python détecté: $pythonVersion" -ForegroundColor Green
    
    # Démarrer le serveur Python
    Write-Host "🌐 Démarrage du serveur sur http://localhost:8000" -ForegroundColor Cyan
    Write-Host "📱 Interface disponible sur: http://localhost:8000/index.html" -ForegroundColor Yellow
    Write-Host "👨‍💼 Administration sur: http://localhost:8000/admin/index.html" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "⚠️  Appuyez sur Ctrl+C pour arrêter le serveur" -ForegroundColor Red
    Write-Host ""
    
    # Ouvrir le navigateur automatiquement
    Start-Process "http://localhost:8000"
    
    # Démarrer le serveur HTTP Python
    python -m http.server 8000
    
} catch {
    Write-Host "❌ Python non trouvé. Tentative avec Node.js..." -ForegroundColor Yellow
    
    try {
        $nodeVersion = node --version 2>&1
        Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
        
        # Vérifier si http-server est installé
        try {
            $httpServerVersion = npx http-server --version 2>&1
            Write-Host "✅ http-server disponible" -ForegroundColor Green
        } catch {
            Write-Host "📦 Installation de http-server..." -ForegroundColor Yellow
            npm install -g http-server
        }
        
        Write-Host "🌐 Démarrage du serveur sur http://localhost:8080" -ForegroundColor Cyan
        Write-Host "📱 Interface disponible sur: http://localhost:8080/index.html" -ForegroundColor Yellow
        Write-Host "👨‍💼 Administration sur: http://localhost:8080/admin/index.html" -ForegroundColor Magenta
        Write-Host ""
        Write-Host "⚠️  Appuyez sur Ctrl+C pour arrêter le serveur" -ForegroundColor Red
        Write-Host ""
        
        # Ouvrir le navigateur automatiquement
        Start-Process "http://localhost:8080"
        
        # Démarrer http-server
        npx http-server -p 8080 -c-1
        
    } catch {
        Write-Host ""
        Write-Host "❌ Aucun serveur HTTP trouvé!" -ForegroundColor Red
        Write-Host ""
        Write-Host "📋 Solutions:" -ForegroundColor Yellow
        Write-Host "1. Installer Python: https://www.python.org/downloads/" -ForegroundColor White
        Write-Host "2. Installer Node.js: https://nodejs.org/" -ForegroundColor White
        Write-Host "3. Utiliser l'extension Live Server de VS Code" -ForegroundColor White
        Write-Host ""
        Write-Host "⚡ Solution rapide avec VS Code:" -ForegroundColor Cyan
        Write-Host "   - Installer l'extension 'Live Server'" -ForegroundColor White
        Write-Host "   - Clic droit sur index.html > 'Open with Live Server'" -ForegroundColor White
        Write-Host ""
        
        # Essayer d'ouvrir avec l'application par défaut
        Write-Host "🔄 Tentative d'ouverture directe..." -ForegroundColor Yellow
        Start-Process "index.html"
        
        Read-Host "Appuyez sur Entrée pour quitter"
    }
}