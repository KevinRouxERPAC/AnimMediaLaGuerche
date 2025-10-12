def hex_to_rgb(hex_color):
    """Convertit une couleur hexadécimale en RGB."""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_luminance(rgb):
    """Calcule la luminance relative d'une couleur RGB."""
    r, g, b = [x / 255.0 for x in rgb]
    
    # Conversion sRGB vers luminance linéaire
    def adjust(c):
        if c <= 0.03928:
            return c / 12.92
        else:
            return pow((c + 0.055) / 1.055, 2.4)
    
    r = adjust(r)
    g = adjust(g) 
    b = adjust(b)
    
    # Calcul de la luminance relative
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contrast_ratio(color1, color2):
    """Calcule le ratio de contraste entre deux couleurs."""
    lum1 = rgb_to_luminance(hex_to_rgb(color1))
    lum2 = rgb_to_luminance(hex_to_rgb(color2))
    
    # S'assurer que lum1 est la plus claire
    if lum1 < lum2:
        lum1, lum2 = lum2, lum1
    
    return (lum1 + 0.05) / (lum2 + 0.05)

def evaluate_contrast(ratio, level='AA'):
    """Évalue si un ratio de contraste respecte les standards WCAG."""
    if level == 'AA':
        normal_text = ratio >= 4.5
        large_text = ratio >= 3.0
    else:  # AAA
        normal_text = ratio >= 7.0
        large_text = ratio >= 4.5
    
    return {
        'ratio': round(ratio, 2),
        'normal_text': normal_text,
        'large_text': large_text,
        'level': level
    }

# Palette de couleurs du site
colors = {
    'primary': '#1E7A47',
    'primary_dark': '#1A7A37', 
    'secondary': '#FF7F50',
    'secondary_dark': '#C53E25',
    'dark': '#2F4F4F',
    'gray': '#5A6B7D',  # Nouvelle couleur avec meilleur contraste
    'light': '#F5F5DC',
    'white': '#ffffff'
}

print("=== ANALYSE DU CONTRASTE - ANIM'MÉDIA ===\n")

# Test des principales combinaisons
combinations = [
    ('Texte principal (dark sur blanc)', 'dark', 'white'),
    ('Liens primaires (primary sur blanc)', 'primary', 'white'),
    ('Bouton primaire (blanc sur primary)', 'white', 'primary'),
    ('Bouton primaire hover (blanc sur primary_dark)', 'white', 'primary_dark'),
    ('Bouton secondaire (blanc sur secondary_dark)', 'white', 'secondary_dark'),
    ('Texte gris (gray sur blanc)', 'gray', 'white'),
    ('Texte sur fond beige (dark sur light)', 'dark', 'light'),
    ('Links hover (primary_dark sur blanc)', 'primary_dark', 'white')
]

for name, color1, color2 in combinations:
    ratio = contrast_ratio(colors[color1], colors[color2])
    result = evaluate_contrast(ratio)
    
    status_aa = "✅" if result['normal_text'] else "❌"
    status_aaa = "✅" if evaluate_contrast(ratio, 'AAA')['normal_text'] else "❌"
    
    print(f"{name}")
    print(f"  Couleurs: {colors[color1]} sur {colors[color2]}")
    print(f"  Ratio: {result['ratio']}:1")
    print(f"  WCAG AA: {status_aa} | WCAG AAA: {status_aaa}")
    print()

# Points d'attention spécifiques
print("=== POINTS D'ATTENTION ===")
print()

# Vérifier le texte secondaire orange sur blanc
secondary_ratio = contrast_ratio(colors['secondary'], colors['white'])
print(f"⚠️  ATTENTION: Texte orange (secondary) sur blanc")
print(f"   Ratio: {round(secondary_ratio, 2)}:1")
if secondary_ratio < 4.5:
    print(f"   ❌ Ne respecte pas WCAG AA (besoin de 4.5:1 minimum)")
    print(f"   💡 Solution: Utiliser secondary_dark (#C53E25) à la place")
    print()

# Vérifier le texte gris sur fond beige
gray_beige_ratio = contrast_ratio(colors['gray'], colors['light'])
print(f"⚠️  Texte gris sur fond beige (sections alternées)")
print(f"   Ratio: {round(gray_beige_ratio, 2)}:1")
if gray_beige_ratio < 4.5:
    print(f"   ❌ Peut poser des problèmes de lisibilité")
print()

print("=== RECOMMANDATIONS ===")
print("✅ Les couleurs principales (primary, dark) ont un excellent contraste")
print("✅ Les boutons utilisent les variantes foncées pour un meilleur contraste") 
print("⚠️  Éviter d'utiliser la couleur 'secondary' (#FF7F50) pour du texte")
print("⚠️  Privilégier 'secondary_dark' (#C53E25) pour les éléments textuels")
print("✅ Le site respecte globalement les standards d'accessibilité WCAG AA")