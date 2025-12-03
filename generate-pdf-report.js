const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { marked } = require('marked');

// Configuration pour le rendu HTML
const htmlTemplate = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport Plateforme Expérience Tech</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
            padding: 40px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        h1 {
            color: #2563eb;
            font-size: 2.5em;
            margin-bottom: 20px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 10px;
        }
        
        h2 {
            color: #1e40af;
            font-size: 1.8em;
            margin: 30px 0 15px 0;
            border-left: 4px solid #2563eb;
            padding-left: 15px;
        }
        
        h3 {
            color: #374151;
            font-size: 1.4em;
            margin: 25px 0 10px 0;
        }
        
        h4 {
            color: #4b5563;
            font-size: 1.2em;
            margin: 20px 0 8px 0;
        }
        
        p {
            margin-bottom: 15px;
            text-align: justify;
        }
        
        ul, ol {
            margin: 15px 0;
            padding-left: 30px;
        }
        
        li {
            margin-bottom: 8px;
        }
        
        .highlight {
            background: #fef3c7;
            padding: 2px 4px;
            border-radius: 3px;
        }
        
        .success {
            color: #059669;
            font-weight: bold;
        }
        
        .warning {
            color: #d97706;
            font-weight: bold;
        }
        
        .error {
            color: #dc2626;
            font-weight: bold;
        }
        
        .info {
            color: #2563eb;
            font-weight: bold;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        th, td {
            border: 1px solid #d1d5db;
            padding: 12px;
            text-align: left;
        }
        
        th {
            background: #f3f4f6;
            font-weight: bold;
            color: #374151;
        }
        
        tr:nth-child(even) {
            background: #f9fafb;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 0.9em;
            opacity: 0.9;
        }
        
        .tech-stack {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .tech-category {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
        }
        
        .tech-category h4 {
            color: #1e40af;
            margin-bottom: 15px;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 5px;
        }
        
        .feature-list {
            background: #f0f9ff;
            border-left: 4px solid #0ea5e9;
            padding: 20px;
            margin: 20px 0;
        }
        
        .feature-list h3 {
            color: #0369a1;
            margin-bottom: 15px;
        }
        
        .feature-list ul {
            list-style: none;
            padding-left: 0;
        }
        
        .feature-list li {
            margin-bottom: 10px;
            padding-left: 25px;
            position: relative;
        }
        
        .feature-list li:before {
            content: "✅";
            position: absolute;
            left: 0;
            top: 0;
        }
        
        .code-block {
            background: #1f2937;
            color: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            margin: 20px 0;
            overflow-x: auto;
        }
        
        .code-block pre {
            margin: 0;
        }
        
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
        }
        
        .page-break {
            page-break-before: always;
        }
        
        @media print {
            body {
                padding: 20px;
            }
            
            .page-break {
                page-break-before: always;
            }
        }
        
        .emoji {
            font-size: 1.2em;
        }
        
        .highlight-box {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
        }
        
        .success-box {
            background: #d1fae5;
            border: 1px solid #10b981;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
        }
        
        .info-box {
            background: #dbeafe;
            border: 1px solid #3b82f6;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    {{CONTENT}}
</body>
</html>
`;

async function generatePDFReport() {
    try {
        console.log('🚀 Génération du rapport PDF en cours...');
        
        // Lire le fichier Markdown
        const markdownPath = path.join(__dirname, 'RAPPORT_PLATEFORME_EXPERIENCE_TECH.md');
        const markdownContent = fs.readFileSync(markdownPath, 'utf8');
        
        // Convertir Markdown en HTML
        const htmlContent = marked(markdownContent);
        
        // Remplacer le contenu dans le template
        const fullHtml = htmlTemplate.replace('{{CONTENT}}', htmlContent);
        
        // Lancer Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Charger le HTML
        await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
        
        // Générer le PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                right: '15mm',
                bottom: '20mm',
                left: '15mm'
            },
            displayHeaderFooter: true,
            headerTemplate: `
                <div style="font-size: 10px; text-align: center; width: 100%; color: #666;">
                    Rapport Plateforme Expérience Tech - <span class="date"></span>
                </div>
            `,
            footerTemplate: `
                <div style="font-size: 10px; text-align: center; width: 100%; color: #666;">
                    Page <span class="pageNumber"></span> sur <span class="totalPages"></span> - Expérience Tech
                </div>
            `
        });
        
        // Sauvegarder le PDF
        const outputPath = path.join(__dirname, 'RAPPORT_PLATEFORME_EXPERIENCE_TECH.pdf');
        fs.writeFileSync(outputPath, pdfBuffer);
        
        await browser.close();
        
        console.log('✅ Rapport PDF généré avec succès !');
        console.log(`📄 Fichier sauvegardé : ${outputPath}`);
        console.log(`📊 Taille du fichier : ${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB`);
        
        return outputPath;
        
    } catch (error) {
        console.error('❌ Erreur lors de la génération du PDF :', error);
        throw error;
    }
}

// Exécuter si appelé directement
if (require.main === module) {
    generatePDFReport()
        .then((path) => {
            console.log('🎉 Génération terminée !');
            console.log(`📁 Rapport disponible : ${path}`);
        })
        .catch((error) => {
            console.error('💥 Échec de la génération :', error);
            process.exit(1);
        });
}

module.exports = { generatePDFReport };
