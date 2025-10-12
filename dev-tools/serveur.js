const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration du serveur
const PORT = 8000;
const HOST = 'localhost';

// Types MIME pour les fichiers
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'font/eot'
};

// Création du serveur
const server = http.createServer((req, res) => {
    // Nettoyage de l'URL
    let filePath = '.' + req.url;
    
    // Page par défaut
    if (filePath === './') {
        filePath = './index.html';
    }

    // Extensions et type MIME
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeType = mimeTypes[extname] || 'application/octet-stream';

    // Headers CORS pour éviter les problèmes
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Lecture du fichier
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Fichier non trouvé - 404
                fs.readFile('./offline.html', (err, data) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(data || '404 - Page non trouvée', 'utf-8');
                });
            } else {
                // Erreur serveur - 500
                res.writeHead(500);
                res.end('Erreur serveur: ' + error.code + ' ..\n');
            }
        } else {
            // Succès - 200
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content, 'utf-8');
        }
    });
});

// Démarrage du serveur
server.listen(PORT, HOST, () => {
    console.log('\n🚀 ===================================');
    console.log('   SERVEUR ANIM\'MEDIA DEMARRE !');
    console.log('=====================================');
    console.log(`📍 Adresse: http://${HOST}:${PORT}`);
    console.log(`📁 Répertoire: ${process.cwd()}`);
    console.log('🔐 Admin: http://localhost:8000/admin/');
    console.log('⏹️  Pour arrêter: Ctrl+C');
    console.log('=====================================\n');
    
    // Tenter d'ouvrir automatiquement le navigateur (Windows)
    const { exec } = require('child_process');
    exec(`start http://${HOST}:${PORT}`, (err) => {
        if (err) {
            console.log('💡 Ouvrez manuellement: http://localhost:8000');
        }
    });
});

// Gestion des erreurs
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`❌ Port ${PORT} déjà utilisé. Essayez un autre port.`);
    } else {
        console.log('❌ Erreur serveur:', err);
    }
});

// Arrêt propre
process.on('SIGINT', () => {
    console.log('\n👋 Arrêt du serveur Anim\'Media...');
    server.close(() => {
        console.log('✅ Serveur arrêté correctement.');
        process.exit(0);
    });
});