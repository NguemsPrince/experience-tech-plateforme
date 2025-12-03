// Dynamic imports to prevent chunk loading issues
import { loadJsPDF, loadXLSX } from './dynamicImports';

// Informations du centre
const COMPANY_INFO = {
  name: 'Expérience Tech',
  tagline: 'Inspirer - Oser - Innover',
  address: 'Avenue Mareshal Idriss Deby Itno, Abéché, Tchad',
  phone: '+235 60 29 05 10',
  email: 'Contact@experiencetech-tchad.com',
  website: 'https://experiencetech-tchad.com'
};

// Fonction pour charger le logo en base64
const loadLogoAsBase64 = () => {
  return new Promise((resolve) => {
    const img = new Image();
    
    // Essayer sans CORS d'abord (pour les fichiers locaux)
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        console.log('Logo chargé avec succès');
        resolve(dataURL);
      } catch (error) {
        console.warn('Erreur lors de la conversion du logo:', error);
        resolve(null);
      }
    };
    
    img.onerror = () => {
      // Si l'image ne charge pas, essayer avec CORS
      const imgWithCors = new Image();
      imgWithCors.crossOrigin = 'anonymous';
      
      imgWithCors.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = imgWithCors.width;
          canvas.height = imgWithCors.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(imgWithCors, 0, 0);
          const dataURL = canvas.toDataURL('image/png');
          console.log('Logo chargé avec succès (CORS)');
          resolve(dataURL);
        } catch (error) {
          console.warn('Erreur lors de la conversion du logo (CORS):', error);
          resolve(null);
        }
      };
      
      imgWithCors.onerror = () => {
        console.warn('Impossible de charger le logo, le PDF sera généré sans logo');
        resolve(null);
      };
      
      imgWithCors.src = '/images/logo.png';
    };
    
    // Essayer de charger le logo depuis le chemin public
    img.src = '/images/logo.png';
  });
};

// Export PDF avec en-tête stylisé
export const exportToPDF = async (data, columns, filename, title) => {
  try {
    console.log('Début export PDF:', { data, columns, filename, title });
    
    const jsPDFClass = await loadJsPDF();
    
    // Check if jsPDF loaded successfully
    if (!jsPDFClass) {
      throw new Error('jsPDF n\'a pas pu être chargé. Veuillez réessayer ou utiliser l\'export Excel.');
    }
    
    // Verify that jsPDFClass is a constructor function
    if (typeof jsPDFClass !== 'function') {
      console.error('jsPDF is not a constructor:', typeof jsPDFClass, jsPDFClass);
      throw new Error('jsPDF n\'a pas pu être initialisé correctement. Veuillez réessayer ou utiliser l\'export Excel.');
    }
    
    const doc = new jsPDFClass();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const headerHeight = 60;
    const footerHeight = 20; // Hauteur fixe pour le pied de page
    const footerY = pageHeight - footerHeight; // Position fixe du pied de page
    
    // Charger le logo
    const logoData = await loadLogoAsBase64();
    
    // Fonction pour ajouter l'en-tête
    const addHeader = (isFirstPage = false) => {
      // Fond de l'en-tête (bleu clair)
      doc.setFillColor(59, 130, 246); // Bleu #3b82f6
      doc.rect(0, 0, pageWidth, headerHeight, 'F');
      
      // Logo (si disponible)
      if (logoData) {
        try {
          const logoSize = isFirstPage ? 25 : 20;
          const logoX = margin;
          const logoY = margin + 5;
          doc.addImage(logoData, 'PNG', logoX, logoY, logoSize, logoSize);
        } catch (error) {
          console.warn('Erreur lors de l\'ajout du logo:', error);
        }
      }
      
      // Nom de l'entreprise
      doc.setTextColor(255, 255, 255); // Blanc
      doc.setFontSize(isFirstPage ? 18 : 16);
      doc.setFont(undefined, 'bold');
      const companyX = logoData ? margin + 30 : margin;
      doc.text(COMPANY_INFO.name, companyX, margin + 12);
      
      // Tagline
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.text(COMPANY_INFO.tagline, companyX, margin + 20);
      
      // Informations de contact (droite)
      doc.setFontSize(7);
      const contactX = pageWidth - margin - 50;
      doc.text(`Tél: ${COMPANY_INFO.phone}`, contactX, margin + 8);
      doc.text(`Email: ${COMPANY_INFO.email}`, contactX, margin + 14);
      doc.text(COMPANY_INFO.website, contactX, margin + 20);
      
      // Ligne de séparation
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(margin, headerHeight, pageWidth - margin, headerHeight);
      
      return headerHeight + margin + 5;
    };
    
    // Fonction pour ajouter le pied de page (toujours en bas de page)
    const addFooter = (pageNumber) => {
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.setFont(undefined, 'normal');
      
      // Ligne de séparation
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
      
      // Adresse à gauche
      doc.text(COMPANY_INFO.address, margin, footerY);
      
      // Numéro de page à droite
      const pageText = `Page ${pageNumber}`;
      const pageTextWidth = doc.getTextWidth(pageText);
      doc.text(pageText, pageWidth - margin - pageTextWidth, footerY);
    };
    
    // Préparer les données du tableau
    const tableData = data.map(item => 
      columns.map(col => {
        if (col.key.includes('.')) {
          const keys = col.key.split('.');
          let value = item;
          for (const key of keys) {
            value = value?.[key];
          }
          return value || '';
        }
        return item[col.key] || '';
      })
    );
    
    const headers = columns.map(col => col.label);
    
    // Calculer les dimensions avec un meilleur espacement
    const baseRowHeight = 6; // Hauteur de base pour une ligne de texte (réduite)
    const lineHeight = 4.5; // Hauteur entre les lignes pour le word wrap (optimisée)
    const titleHeight = 25; // Espace pour le titre et la date
    // Zone de contenu disponible (entre l'en-tête et le pied de page)
    const contentStartY = headerHeight + margin + 5;
    const contentEndY = footerY - 10; // Marge avant le pied de page
    const availableHeight = contentEndY - contentStartY - titleHeight;
    
    let currentPage = 1;
    let yPosition = addHeader(true); // Première page avec en-tête complet
    
    // Titre du rapport
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(title, margin, yPosition);
    yPosition += 8;
    
    // Date d'export
    const exportDate = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Exporté le: ${exportDate}`, margin, yPosition);
    yPosition += 10;
    
    // Ligne de séparation avant le tableau
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;
    
    // En-têtes du tableau
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    
    // Calculer la largeur optimale des colonnes avec une stratégie améliorée
    const tableWidth = pageWidth - (2 * margin);
    const numColumns = headers.length;
    const padding = 5; // Espacement entre colonnes (augmenté)
    const cellPadding = 3; // Padding interne des cellules
    
    // Largeurs minimales suggérées selon le type de colonne (basé sur les labels)
    const getSuggestedMinWidth = (headerLabel) => {
      const label = headerLabel.toLowerCase();
      if (label.includes('date') || label.includes('vues') || label.includes('likes') || label.includes('commentaires')) {
        return 25; // Colonnes courtes
      }
      if (label.includes('statut') || label.includes('catégorie') || label.includes('auteur')) {
        return 35; // Colonnes moyennes
      }
      if (label.includes('titre')) {
        return 40; // Colonnes importantes
      }
      if (label.includes('contenu') || label.includes('description')) {
        return 50; // Colonnes longues
      }
      return 30; // Par défaut
    };
    
    // Calculer les largeurs optimales avec une meilleure stratégie
    const columnWidths = [];
    const totalAvailableWidth = tableWidth - (padding * (numColumns - 1));
    
    headers.forEach((header, colIndex) => {
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      const headerWidth = doc.getTextWidth(header);
      
      // Calculer la largeur moyenne et maximale des données
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      const cellWidths = [];
      tableData.forEach(row => {
        const cellText = String(row[colIndex] || '');
        cellWidths.push(doc.getTextWidth(cellText));
      });
      
      const maxDataWidth = cellWidths.length > 0 ? Math.max(...cellWidths) : 0;
      const avgDataWidth = cellWidths.length > 0 
        ? cellWidths.reduce((sum, w) => sum + w, 0) / cellWidths.length 
        : 0;
      
      // Utiliser une combinaison de max (70%) et avg (30%) pour éviter les extrêmes
      const suggestedWidth = Math.max(headerWidth, maxDataWidth * 0.7 + avgDataWidth * 0.3);
      const minWidth = getSuggestedMinWidth(header);
      
      // Largeur proposée avec padding
      const proposedWidth = Math.max(minWidth, suggestedWidth + cellPadding * 2);
      
      // Limiter la largeur maximale à 35% de la table (sauf pour les colonnes très importantes)
      const maxAllowedWidth = header.toLowerCase().includes('contenu') || header.toLowerCase().includes('description')
        ? totalAvailableWidth * 0.45
        : totalAvailableWidth * 0.35;
      
      columnWidths.push(Math.min(proposedWidth, maxAllowedWidth));
    });
    
    // Normaliser les largeurs pour qu'elles s'ajustent parfaitement
    let totalWidth = columnWidths.reduce((sum, w) => sum + w, 0);
    const availableWidth = totalAvailableWidth;
    
    let normalizedWidths;
    if (totalWidth <= availableWidth) {
      // Si on a assez d'espace, redistribuer l'espace supplémentaire proportionnellement
      const extraSpace = availableWidth - totalWidth;
      const weights = columnWidths.map(w => w / totalWidth);
      normalizedWidths = columnWidths.map((w, i) => w + (extraSpace * weights[i]));
    } else {
      // Réduire proportionnellement mais en respectant les largeurs minimales
      const scaleFactor = availableWidth / totalWidth;
      normalizedWidths = columnWidths.map(w => w * scaleFactor);
      
      // Vérifier que toutes les colonnes respectent leur largeur minimale
      const minWidths = headers.map(h => getSuggestedMinWidth(h));
      const totalMinWidth = minWidths.reduce((sum, w) => sum + w, 0);
      
      if (totalMinWidth > availableWidth) {
        // Si les largeurs minimales dépassent l'espace disponible, utiliser un mode plus compact
        normalizedWidths = minWidths.map((minW, i) => 
          (minW / totalMinWidth) * availableWidth
        );
      } else {
        // S'assurer que chaque colonne respecte au minimum sa largeur minimale suggérée
        let remainingSpace = availableWidth - totalMinWidth;
        normalizedWidths = normalizedWidths.map((w, i) => {
          const minW = minWidths[i];
          if (w < minW) {
            const extra = minW - w;
            remainingSpace -= extra;
            return minW;
          }
          return w;
        });
        
        // Redistribuer l'espace restant proportionnellement
        if (remainingSpace > 0) {
          const adjustedTotal = normalizedWidths.reduce((sum, w) => sum + w, 0);
          const adjustment = remainingSpace / adjustedTotal;
          normalizedWidths = normalizedWidths.map(w => w + (w * adjustment));
        }
      }
    }
    
    // S'assurer que la somme est exactement égale à la largeur disponible
    const finalTotal = normalizedWidths.reduce((sum, w) => sum + w, 0);
    if (Math.abs(finalTotal - availableWidth) > 0.01) {
      const adjustment = (availableWidth - finalTotal) / numColumns;
      normalizedWidths = normalizedWidths.map(w => w + adjustment);
    }
    
    // Fonction pour calculer le nombre de lignes nécessaires avec word wrap
    const calculateTextLines = (text, maxWidth, fontSize = 8) => {
      const textStr = String(text || '');
      // Sauvegarder la taille de police actuelle
      const currentFontSize = doc.getFontSize();
      doc.setFontSize(fontSize);
      
      const availableWidth = maxWidth - cellPadding * 2;
      
      // Si le texte est vide ou null
      if (!textStr || textStr.trim() === '') {
        doc.setFontSize(currentFontSize);
        return 1; // Au moins une ligne même si vide
      }
      
      // Améliorer le word wrap pour éviter la division excessive
      // Diviser le texte en mots et mots composés
      const words = textStr.split(/(\s+)/).filter(w => w.trim().length > 0);
      const lines = [];
      let currentLine = '';
      
      words.forEach((word, index) => {
        const trimmedWord = word.trim();
        if (!trimmedWord) return; // Ignorer les espaces multiples
        
        const testLine = currentLine ? `${currentLine} ${trimmedWord}` : trimmedWord;
        const testWidth = doc.getTextWidth(testLine);
        
        if (testWidth <= availableWidth) {
          currentLine = testLine;
        } else {
          // Si la ligne actuelle n'est pas vide, la sauvegarder
          if (currentLine) {
            lines.push(currentLine);
          }
          
          // Vérifier si le mot seul est plus large que la largeur disponible
          const wordWidth = doc.getTextWidth(trimmedWord);
          
          // Si le mot est vraiment trop long (plus de 150% de la largeur), le diviser
          // Sinon, le garder sur une nouvelle ligne
          if (wordWidth > availableWidth * 1.5) {
            // Dernier recours : diviser en syllabes/segments intelligents
            // Utiliser des tirets ou espaces comme points de division préférés
            if (trimmedWord.includes('-')) {
              const segments = trimmedWord.split('-');
              segments.forEach((segment, segIdx) => {
                const segmentWithDash = segIdx > 0 ? `-${segment}` : segment;
                const testSegLine = currentLine ? `${currentLine} ${segmentWithDash}` : segmentWithDash;
                const testSegWidth = doc.getTextWidth(testSegLine);
                
                if (testSegWidth <= availableWidth) {
                  currentLine = testSegLine;
                } else {
                  if (currentLine) {
                    lines.push(currentLine);
                  }
                  currentLine = segmentWithDash;
                }
              });
            } else {
              // Division par caractères seulement si vraiment nécessaire
              let charLine = '';
              for (let i = 0; i < trimmedWord.length; i++) {
                const testCharLine = charLine + trimmedWord[i];
                const charLineWidth = doc.getTextWidth(testCharLine);
                
                if (charLineWidth <= availableWidth) {
                  charLine = testCharLine;
                } else {
                  if (charLine) {
                    lines.push(charLine);
                  }
                  charLine = trimmedWord[i];
                }
              }
              currentLine = charLine;
            }
          } else {
            // Le mot tient sur une ligne, le placer tel quel
            currentLine = trimmedWord;
          }
        }
        
        // Si c'est le dernier mot, ajouter la ligne actuelle
        if (index === words.length - 1 && currentLine) {
          lines.push(currentLine);
        }
      });
      
      // Si aucune ligne n'a été créée, créer au moins une ligne avec le texte complet
      if (lines.length === 0) {
        lines.push(textStr);
      }
      
        doc.setFontSize(currentFontSize); // Restaurer
      return lines.length;
    };
    
    // Fonction pour obtenir le texte divisé en lignes avec word wrap
    const getTextLines = (text, maxWidth, fontSize = 8) => {
      const textStr = String(text || '');
      // Sauvegarder la taille de police actuelle
      const currentFontSize = doc.getFontSize();
      doc.setFontSize(fontSize);
      
      const availableWidth = maxWidth - cellPadding * 2;
      
      // Si le texte est vide ou null
      if (!textStr || textStr.trim() === '') {
        doc.setFontSize(currentFontSize);
        return [''];
      }
      
      // Utiliser le même algorithme amélioré que calculateTextLines
      const words = textStr.split(/(\s+)/).filter(w => w.trim().length > 0);
      const lines = [];
      let currentLine = '';
      
      words.forEach((word, index) => {
        const trimmedWord = word.trim();
        if (!trimmedWord) return;
        
        const testLine = currentLine ? `${currentLine} ${trimmedWord}` : trimmedWord;
        const testWidth = doc.getTextWidth(testLine);
        
        if (testWidth <= availableWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) {
            lines.push(currentLine);
          }
          
          const wordWidth = doc.getTextWidth(trimmedWord);
          
          if (wordWidth > availableWidth * 1.5) {
            if (trimmedWord.includes('-')) {
              const segments = trimmedWord.split('-');
              segments.forEach((segment, segIdx) => {
                const segmentWithDash = segIdx > 0 ? `-${segment}` : segment;
                const testSegLine = currentLine ? `${currentLine} ${segmentWithDash}` : segmentWithDash;
                const testSegWidth = doc.getTextWidth(testSegLine);
                
                if (testSegWidth <= availableWidth) {
                  currentLine = testSegLine;
                } else {
                  if (currentLine) {
                    lines.push(currentLine);
                  }
                  currentLine = segmentWithDash;
                }
              });
            } else {
              let charLine = '';
              for (let i = 0; i < trimmedWord.length; i++) {
                const testCharLine = charLine + trimmedWord[i];
                const charLineWidth = doc.getTextWidth(testCharLine);
                
                if (charLineWidth <= availableWidth) {
                  charLine = testCharLine;
                } else {
                  if (charLine) {
                    lines.push(charLine);
                  }
                  charLine = trimmedWord[i];
                }
              }
              currentLine = charLine;
            }
          } else {
            currentLine = trimmedWord;
          }
        }
        
        if (index === words.length - 1 && currentLine) {
          lines.push(currentLine);
        }
      });
      
      if (lines.length === 0) {
        lines.push(textStr);
      }
      
      doc.setFontSize(currentFontSize); // Restaurer
      return lines;
    };
    
    // Fonction pour dessiner les en-têtes
    const drawHeaders = () => {
      // Calculer la hauteur nécessaire pour les en-têtes (avec word wrap)
      let maxHeaderLines = 1;
      headers.forEach((header, index) => {
        const colWidth = normalizedWidths[index];
        const headerLines = calculateTextLines(header, colWidth, 9);
        if (headerLines > maxHeaderLines) {
          maxHeaderLines = headerLines;
        }
      });
      
      const headerRowHeight = 6 + (maxHeaderLines - 1) * lineHeight;
      
      // Fond gris pour les en-têtes
      doc.setFillColor(243, 244, 246);
      doc.rect(margin, yPosition - 5, tableWidth, headerRowHeight, 'F');
      
      // Bordures pour les en-têtes
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      let xPos = margin;
      headers.forEach((header, index) => {
        const colWidth = normalizedWidths[index];
        const headerLines = getTextLines(header, colWidth, 9);
        let lineY = yPosition;
        
        // Dessiner la bordure verticale de la colonne
        if (index > 0) {
          doc.line(xPos, yPosition - 5, xPos, yPosition - 5 + headerRowHeight);
        }
        
        headerLines.forEach((line, lineIndex) => {
          doc.text(line, xPos + cellPadding, lineY, {
            maxWidth: colWidth - cellPadding * 2
          });
          lineY += lineHeight;
        });
        
        xPos += colWidth + padding;
      });
      
      // Bordure droite finale
      doc.line(xPos - padding, yPosition - 5, xPos - padding, yPosition - 5 + headerRowHeight);
      
      return headerRowHeight;
    };
    
    const tableHeaderHeight = drawHeaders();
    yPosition += tableHeaderHeight + 2;
    
    // Données du tableau
    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);
    
    tableData.forEach((row, rowIndex) => {
      // Calculer la hauteur nécessaire pour cette ligne (en fonction du contenu le plus haut)
      let maxCellLines = 1;
      row.forEach((cell, cellIndex) => {
        const colWidth = normalizedWidths[cellIndex];
        const cellLines = calculateTextLines(cell, colWidth, 8);
        if (cellLines > maxCellLines) {
          maxCellLines = cellLines;
        }
      });
      
      // Hauteur dynamique de la ligne basée sur le contenu
      const dynamicRowHeight = baseRowHeight + (maxCellLines - 1) * lineHeight;
      
      // Vérifier si on doit ajouter une nouvelle page (avant d'atteindre le pied de page)
      if (yPosition + dynamicRowHeight > contentEndY) {
        // Ajouter le pied de page avant de changer de page
        addFooter(currentPage);
        doc.addPage();
        currentPage++;
        yPosition = addHeader(false); // En-tête simplifié pour les autres pages
        
        // Réafficher les en-têtes du tableau
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        const newTableHeaderHeight = drawHeaders();
        yPosition += newTableHeaderHeight + 2;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(8);
      }
      
      // Alternance de couleurs pour les lignes
      if (rowIndex % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(margin, yPosition - 5, tableWidth, dynamicRowHeight, 'F');
      }
      
      // Bordures pour les lignes
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.2);
      
      let xPos = margin;
      row.forEach((cell, cellIndex) => {
        const colWidth = normalizedWidths[cellIndex];
        const cellLines = getTextLines(cell, colWidth, 8);
        let lineY = yPosition;
        
        // Dessiner la bordure verticale de la colonne
        if (cellIndex > 0) {
          doc.line(xPos, yPosition - 5, xPos, yPosition - 5 + dynamicRowHeight);
        }
        
        doc.setTextColor(0, 0, 0);
        
        // Afficher chaque ligne du texte avec word wrap
        cellLines.forEach((line, lineIndex) => {
          doc.text(line, xPos + cellPadding, lineY, {
            maxWidth: colWidth - cellPadding * 2
          });
          lineY += lineHeight;
        });
        
        xPos += colWidth + padding;
      });
      
      // Bordure droite finale
      doc.line(xPos - padding, yPosition - 5, xPos - padding, yPosition - 5 + dynamicRowHeight);
      
      // Bordure horizontale en bas de la ligne
      doc.line(margin, yPosition - 5 + dynamicRowHeight, xPos - padding, yPosition - 5 + dynamicRowHeight);
      yPosition += dynamicRowHeight;
    });
    
    // Toujours ajouter le pied de page sur la dernière page
    // IMPORTANT: Le pied de page doit être à une position fixe en bas, même si le contenu est court
    // On utilise footerY qui est calculé comme pageHeight - footerHeight
    // Cela garantit que le pied de page est toujours à la même position en bas de page
    addFooter(currentPage);
    
    // Sauvegarder le fichier
    // Utiliser le nom de fichier fourni directement (il contient déjà l'extension .pdf)
    const fileName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    console.log('Sauvegarde du fichier:', fileName);
    // doc.save() télécharge automatiquement le fichier dans le dossier Téléchargements par défaut
    doc.save(fileName);
    
    console.log('Export PDF terminé avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'export PDF:', error);
    // Lancer l'erreur pour que le composant puisse la gérer avec toast
    throw error;
  }
};

// Export Excel
export const exportToExcel = async (data, columns, filename, title) => {
  try {
    console.log('Début export Excel:', { data, columns, filename, title });
    
    // Préparer les données
    const worksheetData = [
      [title],
      [`Exporté le: ${new Date().toLocaleDateString('fr-FR')}`],
      [], // Ligne vide
      columns.map(col => col.label), // En-têtes
      ...data.map(item => 
        columns.map(col => {
          if (col.key.includes('.')) {
            const keys = col.key.split('.');
            let value = item;
            for (const key of keys) {
              value = value?.[key];
            }
            return value || '';
          }
          return item[col.key] || '';
        })
      )
    ];
    
    console.log('Données de la feuille:', worksheetData);
    
    // Load XLSX dynamically
    const XLSXModule = await loadXLSX();
    
    if (!XLSXModule) {
      throw new Error('XLSX n\'a pas pu être chargé. Veuillez réessayer.');
    }
    
    // XLSX peut être exporté de différentes manières, gérer tous les cas
    const XLSX = XLSXModule.default || XLSXModule;
    
    if (!XLSX || !XLSX.utils) {
      console.error('XLSX module structure:', XLSXModule);
      throw new Error('Structure du module XLSX invalide. Veuillez réessayer.');
    }
    
    // Créer le workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Définir la largeur des colonnes de manière optimale
    const colWidths = columns.map((col, index) => {
      // Calculer la largeur optimale basée sur l'en-tête et les données
      let maxLength = col.label.length;
      data.forEach(item => {
        let value = '';
        if (col.key.includes('.')) {
          const keys = col.key.split('.');
          value = item;
          for (const key of keys) {
            value = value?.[key];
          }
        } else {
          value = item[col.key];
        }
        const valueLength = String(value || '').length;
        if (valueLength > maxLength) {
          maxLength = valueLength;
        }
      });
      // Largeur minimale de 10, maximale de 50, avec un padding
      return { wch: Math.min(Math.max(maxLength + 2, 10), 50) };
    });
    worksheet['!cols'] = colWidths;
    
    // Ajouter la feuille au workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Données');
    
    // Nom du fichier avec date
    const fileName = `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Essayer différentes méthodes de génération du fichier
    let excelBuffer;
    try {
      // Méthode 1: Utiliser write avec type 'array'
      excelBuffer = XLSX.write(workbook, { 
        type: 'array', 
        bookType: 'xlsx' 
      });
    } catch (error) {
      console.warn('Méthode array échouée, essai avec buffer:', error);
      try {
        // Méthode 2: Utiliser write avec type 'buffer'
        excelBuffer = XLSX.write(workbook, { 
          type: 'buffer', 
          bookType: 'xlsx' 
        });
      } catch (error2) {
        console.warn('Méthode buffer échouée, essai avec binary:', error2);
        // Méthode 3: Utiliser write avec type 'binary'
        const binaryString = XLSX.write(workbook, { 
          type: 'binary', 
          bookType: 'xlsx' 
        });
        // Convertir binary string en array
        const len = binaryString.length;
        excelBuffer = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          excelBuffer[i] = binaryString.charCodeAt(i) & 0xFF;
        }
      }
    }
    
    if (!excelBuffer) {
      throw new Error('Impossible de générer le fichier Excel.');
    }
    
    // Créer un blob à partir du buffer
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    // Vérifier que le blob est valide
    if (blob.size === 0) {
      throw new Error('Le fichier Excel généré est vide.');
    }
    
    // Créer un lien de téléchargement
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    link.style.display = 'none'; // Cacher le lien
    
    // Ajouter le lien au DOM
    document.body.appendChild(link);
    
    // Déclencher le téléchargement
    try {
      link.click();
      console.log('Téléchargement Excel déclenché:', fileName, 'Taille:', blob.size, 'bytes');
    } catch (clickError) {
      console.error('Erreur lors du clic sur le lien:', clickError);
      // Essayer une méthode alternative
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // Pour Internet Explorer
        window.navigator.msSaveOrOpenBlob(blob, fileName);
      } else {
        throw new Error('Impossible de déclencher le téléchargement. Votre navigateur peut bloquer les téléchargements automatiques.');
      }
    }
    
    // Nettoyer après le téléchargement
    setTimeout(() => {
      try {
        if (link.parentNode) {
          document.body.removeChild(link);
        }
        window.URL.revokeObjectURL(downloadUrl);
      } catch (cleanupError) {
        console.warn('Erreur lors du nettoyage:', cleanupError);
      }
    }, 200);
    
    console.log('Export Excel terminé avec succès:', fileName);
  } catch (error) {
    console.error('Erreur lors de l\'export Excel:', error);
    // Lancer l'erreur pour que le composant puisse la gérer avec toast
    throw error;
  }
};

// Colonnes pour les utilisateurs
export const userColumns = [
  { key: 'firstName', label: 'Prénom' },
  { key: 'lastName', label: 'Nom' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Rôle' },
  { key: 'status', label: 'Statut' },
  { key: 'phone', label: 'Téléphone' },
  { key: 'address', label: 'Adresse' },
  { key: 'lastLogin', label: 'Dernière connexion' },
  { key: 'joinDate', label: 'Date d\'inscription' },
  { key: 'projects', label: 'Projets' },
  { key: 'totalSpent', label: 'Total dépensé (FCFA)' }
];

// Colonnes pour le contenu
export const contentColumns = [
  { key: 'title', label: 'Titre' },
  { key: 'content', label: 'Contenu' },
  { key: 'category', label: 'Catégorie' },
  { key: 'status', label: 'Statut' },
  { key: 'author', label: 'Auteur' },
  { key: 'publishDate', label: 'Date de publication' },
  { key: 'views', label: 'Vues' },
  { key: 'likes', label: 'Likes' },
  { key: 'comments', label: 'Commentaires' },
  { key: 'tags', label: 'Tags' },
  { key: 'featured', label: 'En vedette' }
];

// Colonnes pour les formations
export const trainingColumns = [
  { key: 'title', label: 'Titre' },
  { key: 'description', label: 'Description' },
  { key: 'instructor', label: 'Instructeur' },
  { key: 'duration', label: 'Durée' },
  { key: 'level', label: 'Niveau' },
  { key: 'category', label: 'Catégorie' },
  { key: 'price', label: 'Prix (FCFA)' },
  { key: 'maxStudents', label: 'Max étudiants' },
  { key: 'currentStudents', label: 'Étudiants actuels' },
  { key: 'startDate', label: 'Date de début' },
  { key: 'endDate', label: 'Date de fin' },
  { key: 'status', label: 'Statut' },
  { key: 'rating', label: 'Note' },
  { key: 'tags', label: 'Tags' }
];
