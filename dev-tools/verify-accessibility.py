#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
import os
import json

# Palette de couleurs
colors = {
    'light': {
        'primary': '#2E8B57',
        'primaryLight': '#3CB371',
        'primaryDark': '#228B22',
        'secondary': '#FF7F50',
        'secondaryLight': '#FFA07A',
        'accent': '#9370DB',
        'dark': '#2F4F4F',
        'gray': '#708090',
        'light': '#F5F5DC',
        'white': '#ffffff',
        'success': '#32CD32',
        'warning': '#DAA520',
        'error': '#DC143C'
    },
    'dark': {
        'primary': '#4CAF50',
        'primaryLight': '#66BB6A',
        'primaryDark': '#388E3C',
        'secondary': '#FF8A65',
        'secondaryLight': '#FFAB91',
        'accent': '#BA68C8',
        'dark': '#f0f0f0',
        'gray': '#b0b0b0',
        'light': '#2a2a2a',
        'white': '#1a1a1a',
        'success': '#4CAF50',
        'warning': '#FFB74D',
        'error': '#F06292'
    }
}

def hex_to_rgb(hex_color):
    """Convertit une couleur hex en RGB"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def get_luminance(hex_color):
    """Calcule la luminance relative d'une couleur"""
    r, g, b = hex_to_rgb(hex_color)
    
    # Normaliser les valeurs RGB
    rgb_normalized = []
    for c in [r, g, b]:
        c = c / 255.0
        if c <= 0.03928:
            c = c / 12.92
        else:
            c = ((c + 0.055) / 1.055) ** 2.4
        rgb_normalized.append(c)
    
    # Calculer la luminance
    return 0.2126 * rgb_normalized[0] + 0.7152 * rgb_normalized[1] + 0.0722 * rgb_normalized[2]

def get_contrast_ratio(color1, color2):
    """Calcule le ratio de contraste entre deux couleurs"""
    lum1 = get_luminance(color1)
    lum2 = get_luminance(color2)
    
    brightest = max(lum1, lum2)
    darkest = min(lum1, lum2)
    
    return (brightest + 0.05) / (darkest + 0.05)

def evaluate_contrast(ratio):
    """Évalue le niveau de conformité WCAG"""
    if ratio >= 7:
        return {'grade': 'AAA', 'pass': True, 'level': 'excellent'}
    elif ratio >= 4.5:
        return {'grade': 'AA', 'pass': True, 'level': 'good'}
    elif ratio >= 3:
        return {'grade': 'AA Large', 'pass': True, 'level': 'acceptable'}
    else:
        return {'grade': 'FAIL', 'pass': False, 'level': 'poor'}

# Tests de contraste
tests = [
    # Mode clair
    {'name': 'Texte principal', 'fg': colors['light']['dark'], 'bg': colors['light']['white'], 'mode': 'light'},
    {'name': 'Texte secondaire', 'fg': colors['light']['gray'], 'bg': colors['light']['white'], 'mode': 'light'},
    {'name': 'Bouton primaire', 'fg': colors['light']['white'], 'bg': colors['light']['primary'], 'mode': 'light'},
    {'name': 'Bouton secondaire', 'fg': colors['light']['white'], 'bg': '#E55B3C', 'mode': 'light'},  # Nouvelle couleur foncée
    {'name': 'Bouton accent', 'fg': colors['light']['white'], 'bg': colors['light']['accent'], 'mode': 'light'},
    {'name': 'Lien primaire', 'fg': colors['light']['primary'], 'bg': colors['light']['white'], 'mode': 'light'},
    
    # Mode sombre
    {'name': 'Texte principal sombre', 'fg': colors['dark']['dark'], 'bg': colors['dark']['white'], 'mode': 'dark'},
    {'name': 'Texte secondaire sombre', 'fg': colors['dark']['gray'], 'bg': colors['dark']['white'], 'mode': 'dark'},
    {'name': 'Bouton primaire sombre', 'fg': colors['dark']['white'], 'bg': colors['dark']['primary'], 'mode': 'dark'},
    {'name': 'Bouton secondaire sombre', 'fg': colors['dark']['white'], 'bg': colors['dark']['secondary'], 'mode': 'dark'},
]

def main():
    print('🎨 Analyse de Contraste - Anim\'Média La Guerche')
    print('================================================\n')
    
    total_tests = 0
    passed_tests = 0
    issues = []
    
    for test in tests:
        ratio = get_contrast_ratio(test['fg'], test['bg'])
        evaluation = evaluate_contrast(ratio)
        
        total_tests += 1
        if evaluation['pass']:
            passed_tests += 1
        else:
            issues.append(test)
        
        status = '✅' if evaluation['pass'] else '❌'
        mode_icon = '☀️' if test['mode'] == 'light' else '🌙'
        
        print(f"{status} {mode_icon} {test['name']}")
        print(f"   Avant-plan: {test['fg']} | Arrière-plan: {test['bg']}")
        print(f"   Ratio: {ratio:.2f}:1 | Grade: {evaluation['grade']}")
        print()
    
    print('📊 Résumé de l\'analyse')
    print('======================')
    conformity_percentage = round(passed_tests / total_tests * 100)
    print(f"Conformité: {passed_tests}/{total_tests} ({conformity_percentage}%)")
    
    if issues:
        print('\n⚠️ Problèmes identifiés:')
        for issue in issues:
            print(f"- {issue['name']} ({issue['mode']})")
    else:
        print('\n🎉 Excellent! Toutes les combinaisons respectent les standards d\'accessibilité.')
    
    # Vérification des fichiers pour styles inline
    print('\n🔍 Vérification des styles inline...')
    
    html_files = ['index.html', 'admin/index.html']
    
    for file_path in html_files:
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Rechercher les styles inline contenant "color"
            inline_styles = re.findall(r'style\s*=\s*["\'][^"\']*color[^"\']*["\']', content, re.IGNORECASE)
            
            if inline_styles:
                print(f"⚠️ Styles inline trouvés dans {os.path.basename(file_path)}:")
                for style in inline_styles:
                    print(f"  - {style}")
            else:
                print(f"✅ Aucun style inline de couleur dans {os.path.basename(file_path)}")
        else:
            print(f"⚠️ Fichier non trouvé: {file_path}")
    
    print('\n✨ Analyse terminée!')
    
    # Score global
    if conformity_percentage >= 95:
        print('🏆 Score: A+ (Exceptionnel)')
    elif conformity_percentage >= 85:
        print('🥇 Score: A (Excellent)')
    elif conformity_percentage >= 75:
        print('🥈 Score: B+ (Très Bon)')
    elif conformity_percentage >= 65:
        print('🥉 Score: B (Bon)')
    else:
        print('❌ Score: C (Améliorations nécessaires)')

if __name__ == '__main__':
    main()