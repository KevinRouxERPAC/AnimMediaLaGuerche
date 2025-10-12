#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Couleurs de la palette
const colors = {
    light: {
        primary: '#2E8B57',
        primaryLight: '#3CB371',
        primaryDark: '#228B22',
        secondary: '#FF7F50',
        secondaryLight: '#FFA07A',
        accent: '#9370DB',
        dark: '#2F4F4F',
        gray: '#708090',
        light: '#F5F5DC',
        white: '#ffffff',
        success: '#32CD32',
        warning: '#DAA520',
        error: '#DC143C'
    },
    dark: {
        primary: '#4CAF50',
        primaryLight: '#66BB6A',
        primaryDark: '#388E3C',
        secondary: '#FF8A65',
        secondaryLight: '#FFAB91',
        accent: '#BA68C8',
        dark: '#f0f0f0',
        gray: '#b0b0b0',
        light: '#2a2a2a',
        white: '#1a1a1a',
        success: '#4CAF50',
        warning: '#FFB74D',
        error: '#F06292'
    }
};

// Fonction pour calculer la luminance
function getLuminance(hex) {
    const rgb = hexToRgb(hex);
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function getContrastRatio(color1, color2) {
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

function evaluateContrast(ratio) {
    if (ratio >= 7) return { grade: 'AAA', pass: true, level: 'excellent' };
    if (ratio >= 4.5) return { grade: 'AA', pass: true, level: 'good' };
    if (ratio >= 3) return { grade: 'AA Large', pass: true, level: 'acceptable' };
    return { grade: 'FAIL', pass: false, level: 'poor' };
}

// Tests de contraste
const tests = [
    // Mode clair
    { name: 'Texte principal', fg: colors.light.dark, bg: colors.light.white, mode: 'light' },
    { name: 'Texte secondaire', fg: colors.light.gray, bg: colors.light.white, mode: 'light' },
    { name: 'Bouton primaire', fg: colors.light.white, bg: colors.light.primary, mode: 'light' },
    { name: 'Bouton secondaire', fg: colors.light.white, bg: colors.light.secondary, mode: 'light' },
    { name: 'Bouton accent', fg: colors.light.white, bg: colors.light.accent, mode: 'light' },
    { name: 'Lien primaire', fg: colors.light.primary, bg: colors.light.white, mode: 'light' },
    
    // Mode sombre
    { name: 'Texte principal sombre', fg: colors.dark.dark, bg: colors.dark.white, mode: 'dark' },
    { name: 'Texte secondaire sombre', fg: colors.dark.gray, bg: colors.dark.white, mode: 'dark' },
    { name: 'Bouton primaire sombre', fg: colors.dark.white, bg: colors.dark.primary, mode: 'dark' },
    { name: 'Bouton secondaire sombre', fg: colors.dark.white, bg: colors.dark.secondary, mode: 'dark' },
];

console.log('🎨 Analyse de Contraste - Anim\'Média La Guerche');
console.log('================================================\n');

let totalTests = 0;
let passedTests = 0;
let issues = [];

tests.forEach(test => {
    const ratio = getContrastRatio(test.fg, test.bg);
    const evaluation = evaluateContrast(ratio);
    
    totalTests++;
    if (evaluation.pass) passedTests++;
    else issues.push(test);
    
    const status = evaluation.pass ? '✅' : '❌';
    const mode = test.mode === 'light' ? '☀️' : '🌙';
    
    console.log(`${status} ${mode} ${test.name}`);
    console.log(`   Avant-plan: ${test.fg} | Arrière-plan: ${test.bg}`);
    console.log(`   Ratio: ${ratio.toFixed(2)}:1 | Grade: ${evaluation.grade}`);
    console.log('');
});

console.log('📊 Résumé de l\'analyse');
console.log('======================');
console.log(`Conformité: ${passedTests}/${totalTests} (${Math.round(passedTests/totalTests*100)}%)`);

if (issues.length > 0) {
    console.log('\n⚠️ Problèmes identifiés:');
    issues.forEach(issue => {
        console.log(`- ${issue.name} (${issue.mode})`);
    });
} else {
    console.log('\n🎉 Excellent! Toutes les combinaisons respectent les standards d\'accessibilité.');
}

// Vérification des fichiers pour styles inline
console.log('\n🔍 Vérification des styles inline...');

const htmlFiles = [
    path.join(process.cwd(), 'index.html'),
    path.join(process.cwd(), 'admin', 'index.html')
];

htmlFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        const inlineStyles = content.match(/style\s*=\s*["'][^"']*color[^"']*["']/gi);
        
        if (inlineStyles) {
            console.log(`⚠️ Styles inline trouvés dans ${path.basename(file)}:`);
            inlineStyles.forEach(style => console.log(`  - ${style}`));
        } else {
            console.log(`✅ Aucun style inline de couleur dans ${path.basename(file)}`);
        }
    }
});

console.log('\n✨ Analyse terminée!');