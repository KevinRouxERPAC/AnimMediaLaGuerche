#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import shutil
import sys
from pathlib import Path

def show_preview():
    """Affiche un aperçu des fichiers qui seraient supprimés"""
    print("\n🔍 APERÇU - Fichiers qui seraient supprimés :\n")
    
    # Fichiers et dossiers pour production web
    production_items = {
        'folders': ['dev-tools', 'docs', '.github'],
        'files': ['README.md', 'demarrer.bat', '.gitignore']
    }
    
    # Fichiers et dossiers pour distribution
    distribution_items = {
        'folders': ['dev-tools', '.github'], 
        'files': ['demarrer.bat']
    }
    
    print("📁 NETTOYAGE PRODUCTION WEB supprimerait :")
    for folder in production_items['folders']:
        if os.path.exists(folder):
            file_count = sum(1 for _ in Path(folder).rglob('*') if _.is_file())
            print(f"   🗑️  {folder}/ ({file_count} fichiers)")
    
    for file in production_items['files']:
        if os.path.exists(file):
            try:
                size = os.path.getsize(file)
                if size < 1024:
                    size_str = f"{size} B"
                else:
                    size_str = f"{size//1024} KB"
                print(f"   🗑️  {file} ({size_str})")
            except:
                print(f"   🗑️  {file}")
    
    print("\n📁 NETTOYAGE DISTRIBUTION supprimerait :")
    for folder in distribution_items['folders']:
        if os.path.exists(folder):
            file_count = sum(1 for _ in Path(folder).rglob('*') if _.is_file())
            print(f"   🗑️  {folder}/ ({file_count} fichiers)")
    
    for file in distribution_items['files']:
        if os.path.exists(file):
            print(f"   🗑️  {file}")
    
    print("\n💾 Fichiers TOUJOURS conservés (essentiels au site) :")
    essential = ['index.html', 'offline.html', 'manifest.json', 'sw.js', 
                 'robots.txt', 'sitemap.xml', 'admin/', 'assets/']
    for item in essential:
        print(f"   ✅ {item}")

def main():
    print("\n" + "="*70)
    print("🧹 APERÇU DE NETTOYAGE - Anim'Média La Guerche")
    print("="*70)
    print(f"📂 Répertoire de travail : {os.getcwd()}")
    
    show_preview()
    
    print(f"\n📊 Analyse terminée !")
    print("💡 Pour effectuer le nettoyage, utilisez les scripts complets.")

if __name__ == "__main__":
    main()