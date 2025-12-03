const fs = require('fs');
const path = require('path');

function generateHTMLReport() {
  try {
    console.log('🚀 Génération du rapport HTML en cours...');
    
    // Lire le contenu du fichier Markdown
    const markdownContent = fs.readFileSync(
      path.join(__dirname, 'RAPPORT_PLATEFORME_EXPERIENCE_TECH_DETAILLE.md'), 
      'utf8'
    );
    
    // Convertir le Markdown en HTML
    const htmlContent = convertMarkdownToHTML(markdownContent);
    
    // Créer le fichier HTML final
    const htmlPath = path.join(__dirname, 'RAPPORT_PLATEFORME_EXPERIENCE_TECH_DETAILLE.html');
    fs.writeFileSync(htmlPath, htmlContent);
    
    console.log('✅ Rapport HTML généré avec succès !');
    console.log(`📄 Fichier créé : ${htmlPath}`);
    console.log('💡 Vous pouvez ouvrir ce fichier dans votre navigateur et utiliser Ctrl+P pour imprimer en PDF');
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération du rapport :', error);
  }
}

function convertMarkdownToHTML(markdown) {
  // Conversion Markdown vers HTML simplifiée
  let html = markdown
    // Titres
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // Listes à puces
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    
    // Liste ordonnée
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    
    // Gras et italique
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    
    // Code inline
    .replace(/`(.*)`/gim, '<code>$1</code>')
    
    // Liens
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
    
    // Emojis et caractères spéciaux
    .replace(/✅/g, '✓')
    .replace(/❌/g, '✗')
    .replace(/🚀/g, '🚀')
    .replace(/📊/g, '📊')
    .replace(/📋/g, '📋')
    .replace(/🏢/g, '🏢')
    .replace(/🛠️/g, '🛠️')
    .replace(/🌟/g, '🌟')
    .replace(/🔐/g, '🔐')
    .replace(/📱/g, '📱')
    .replace(/🎨/g, '🎨')
    .replace(/🌍/g, '🌍')
    .replace(/📈/g, '📈')
    .replace(/🎯/g, '🎯')
    .replace(/📞/g, '📞')
    .replace(/💰/g, '💰')
    .replace(/🏆/g, '🏆')
    .replace(/🎉/g, '🎉');
  
  // Entourer les listes avec <ul> ou <ol>
  html = html.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');
  
  // Ajouter les balises HTML de base
  html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport Plateforme Expérience Tech</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 100%;
            margin: 0;
            padding: 20px;
            background: white;
        }
        
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            margin-bottom: 30px;
            font-size: 2.5em;
        }
        
        h2 {
            color: #34495e;
            border-bottom: 2px solid #3498db;
            padding-bottom: 8px;
            margin-top: 40px;
            margin-bottom: 20px;
            font-size: 1.8em;
        }
        
        h3 {
            color: #2c3e50;
            margin-top: 30px;
            margin-bottom: 15px;
            font-size: 1.4em;
        }
        
        ul, ol {
            margin: 15px 0;
            padding-left: 30px;
        }
        
        li {
            margin: 8px 0;
        }
        
        code {
            background-color: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
        
        strong {
            color: #2c3e50;
            font-weight: bold;
        }
        
        em {
            font-style: italic;
            color: #7f8c8d;
        }
        
        a {
            color: #3498db;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        .section-break {
            page-break-before: always;
        }
        
        .no-break {
            page-break-inside: avoid;
        }
        
        .highlight {
            background-color: #fff3cd;
            padding: 15px;
            border-left: 4px solid #ffc107;
            margin: 20px 0;
        }
        
        .stats-box {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 15px;
            margin: 15px 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        
        th {
            background-color: #3498db;
            color: white;
        }
        
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 0.9em;
            color: #666;
            text-align: center;
        }
        
        @media print {
            body {
                font-size: 12px;
            }
            
            h1 {
                font-size: 24px;
            }
            
            h2 {
                font-size: 18px;
            }
            
            h3 {
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    ${html}
    
    <div class="footer">
        <p><strong>Expérience Tech</strong> - Votre partenaire numérique de confiance</p>
        <p>Rapport généré le 25 Janvier 2025 - Tous droits réservés</p>
    </div>
</body>
</html>`;
  
  return html;
}

// Exécuter la génération
generateHTMLReport();
