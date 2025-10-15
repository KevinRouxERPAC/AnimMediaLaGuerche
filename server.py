#!/usr/bin/env python3
"""
Serveur HTTP simple pour tester le site Anim'Média
Usage: python server.py
Le site sera accessible sur http://localhost:8000
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

PORT = 8000
DIRECTORY = Path(__file__).parent

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Ajouter les headers CORS pour permettre les requêtes fetch
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def start_server():
    """Démarre le serveur HTTP local"""
    try:
        with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
            print(f"🌐 Serveur démarré sur http://localhost:{PORT}")
            print(f"📁 Répertoire servi: {DIRECTORY}")
            print("💡 Appuyez sur Ctrl+C pour arrêter le serveur")
            
            # Ouvrir automatiquement le navigateur
            webbrowser.open(f"http://localhost:{PORT}")
            
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Serveur arrêté")
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Le port {PORT} est déjà utilisé. Essayez un autre port.")
        else:
            print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    start_server()