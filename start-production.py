#!/usr/bin/env python3
"""
Script de démarrage pour Anim'Média en production
Gère l'installation des dépendances et le démarrage sécurisé
"""

import os
import sys
import subprocess
import secrets
from pathlib import Path

def print_banner():
    print("""
🎨 ========================================
   ANIM'MÉDIA - DÉMARRAGE PRODUCTION
   Application Web Sécurisée
========================================
    """)

def check_python_version():
    """Vérifier la version de Python"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ requis. Version actuelle:", sys.version)
        sys.exit(1)
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} détecté")

def install_dependencies():
    """Installer les dépendances"""
    print("\n📦 Installation des dépendances...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], 
                      check=True, capture_output=True)
        print("✅ Dépendances installées avec succès")
    except subprocess.CalledProcessError as e:
        print("❌ Erreur lors de l'installation des dépendances:")
        print(e.stderr.decode())
        sys.exit(1)

def setup_environment():
    """Configuration de l'environnement"""
    env_file = Path(".env")
    
    if not env_file.exists():
        print("\n🔧 Création du fichier .env...")
        
        # Générer des clés sécurisées
        secret_key = secrets.token_hex(32)
        jwt_secret = secrets.token_hex(32)
        
        env_content = f"""# Configuration Anim'Média - Génération automatique
# Date: {datetime.now().isoformat()}

# SÉCURITÉ - Clés générées automatiquement
SECRET_KEY={secret_key}
JWT_SECRET_KEY={jwt_secret}

# CONFIGURATION SERVEUR
FLASK_ENV=production
FLASK_DEBUG=False
HOST=0.0.0.0
PORT=8000

# ADMIN - CHANGEZ LE MOT DE PASSE !
ADMIN_USERNAME=admin
ADMIN_PASSWORD=animmedia2024

# SÉCURITÉ AVANCÉE
SESSION_COOKIE_SECURE=True
SESSION_COOKIE_HTTPONLY=True
JWT_ACCESS_TOKEN_EXPIRES=3600
JWT_REFRESH_TOKEN_EXPIRES=2592000

# LOGS
LOG_LEVEL=INFO
"""
        
        with open(env_file, 'w') as f:
            f.write(env_content)
        
        print("✅ Fichier .env créé avec des clés sécurisées")
        print("⚠️  IMPORTANT: Changez le mot de passe admin dans .env")
    else:
        print("✅ Fichier .env existant détecté")

def create_directories():
    """Créer les dossiers nécessaires"""
    directories = ["data", "logs", "backups"]
    
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
    
    print("✅ Dossiers système créés")

def check_data_files():
    """Vérifier et initialiser les fichiers de données"""
    data_dir = Path("data")
    
    # Fichier events.json
    events_file = data_dir / "events.json"
    if not events_file.exists():
        events_data = {"events": []}
        with open(events_file, 'w', encoding='utf-8') as f:
            import json
            json.dump(events_data, f, ensure_ascii=False, indent=2)
        print("✅ Fichier events.json initialisé")
    
    # Fichier members.json  
    members_file = data_dir / "members.json"
    if not members_file.exists():
        members_data = {"members": []}
        with open(members_file, 'w', encoding='utf-8') as f:
            import json
            json.dump(members_data, f, ensure_ascii=False, indent=2)
        print("✅ Fichier members.json initialisé")
    
    # Fichier registrations.json
    registrations_file = data_dir / "registrations.json"
    if not registrations_file.exists():
        registrations_data = {"registrations": []}
        with open(registrations_file, 'w', encoding='utf-8') as f:
            import json
            json.dump(registrations_data, f, ensure_ascii=False, indent=2)
        print("✅ Fichier registrations.json initialisé")

def start_application():
    """Démarrer l'application"""
    print("\n🚀 Démarrage de l'application...")
    print("🌐 Application disponible sur: http://localhost:8000")
    print("🔐 Interface admin sur: http://localhost:8000/admin/")
    print("📊 API documentation: http://localhost:8000/api/")
    print("\n💡 Appuyez sur Ctrl+C pour arrêter")
    
    try:
        # Essayer d'utiliser Gunicorn pour la production
        subprocess.run([
            "gunicorn", 
            "--bind", "0.0.0.0:8000",
            "--workers", "4",
            "--timeout", "120",
            "--access-logfile", "logs/access.log",
            "--error-logfile", "logs/error.log",
            "app:app"
        ])
    except FileNotFoundError:
        # Fallback vers le serveur Flask intégré
        print("ℹ️  Gunicorn non disponible, utilisation du serveur Flask")
        os.system("python app.py")

def main():
    """Fonction principale"""
    try:
        print_banner()
        check_python_version()
        install_dependencies()
        setup_environment()
        create_directories()
        check_data_files()
        start_application()
        
    except KeyboardInterrupt:
        print("\n\n👋 Arrêt de l'application demandé")
        print("✅ Application arrêtée proprement")
    except Exception as e:
        print(f"\n❌ Erreur inattendue: {e}")
        sys.exit(1)

if __name__ == "__main__":
    from datetime import datetime
    main()