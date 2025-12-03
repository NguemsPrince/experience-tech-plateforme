// Dynamic imports to prevent chunk loading issues
import { loadJsPDF, loadHtml2Canvas } from './dynamicImports';

export const generateCertificate = async (userData) => {
  const {
    studentName,
    courseName,
    completionDate,
    instructorName,
    certificateId,
    duration,
    score
  } = userData;

  // Créer un conteneur temporaire pour le certificat
  const container = document.createElement('div');
  container.style.width = '1200px';
  container.style.height = '850px';
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.background = 'white';
  container.style.fontFamily = 'Georgia, serif';
  container.style.padding = '60px';
  container.style.boxSizing = 'border-box';

  // Design du certificat
  container.innerHTML = `
    <div style="width: 100%; height: 100%; border: 20px solid #3b82f6; border-radius: 20px; padding: 40px; position: relative; background: linear-gradient(135deg, #667eea05 0%, #764ba205 100%);">
      <!-- Header décoratif -->
      <div style="text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 30px; margin-bottom: 40px;">
        <div style="font-size: 48px; font-weight: bold; color: #1e40af; margin-bottom: 10px;">
          CERTIFICAT D'ACCOMPLISSEMENT
        </div>
        <div style="font-size: 18px; color: #6b7280; letter-spacing: 2px;">
          EXPÉRIENCE TECH
        </div>
      </div>

      <!-- Corps du certificat -->
      <div style="text-align: center; padding: 40px 0;">
        <div style="font-size: 20px; color: #4b5563; margin-bottom: 30px;">
          Nous certifions par la présente que
        </div>

        <div style="font-size: 48px; font-weight: bold; color: #1e3a8a; margin: 30px 0; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; display: inline-block; min-width: 500px;">
          ${studentName}
        </div>

        <div style="font-size: 20px; color: #4b5563; margin: 30px 0;">
          a complété avec succès la formation
        </div>

        <div style="font-size: 36px; font-weight: bold; color: #3b82f6; margin: 30px 0;">
          ${courseName}
        </div>

        <div style="display: flex; justify-content: center; gap: 60px; margin: 40px 0; font-size: 16px; color: #6b7280;">
          <div>
            <div style="font-weight: bold; color: #1e40af;">Durée</div>
            <div>${duration || 'N/A'}</div>
          </div>
          <div>
            <div style="font-weight: bold; color: #1e40af;">Score</div>
            <div>${score || 'N/A'}%</div>
          </div>
          <div>
            <div style="font-weight: bold; color: #1e40af;">Date</div>
            <div>${new Date(completionDate).toLocaleDateString('fr-FR')}</div>
          </div>
        </div>
      </div>

      <!-- Footer avec signatures -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 60px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
        <div style="text-align: center;">
          <div style="width: 200px; height: 60px; display: flex; align-items: center; justify-content: center; font-size: 32px; font-style: italic; color: #3b82f6;">
            ET
          </div>
          <div style="border-top: 2px solid #1e40af; padding-top: 10px; margin-top: 10px;">
            <div style="font-weight: bold; color: #1e40af;">Directeur Général</div>
            <div style="font-size: 14px; color: #6b7280;">Expérience Tech</div>
          </div>
        </div>

        <div style="text-align: center;">
          <div style="width: 120px; height: 120px; border: 3px solid #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; background: white;">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="35" fill="none" stroke="#3b82f6" stroke-width="2"/>
              <text x="40" y="50" text-anchor="middle" fill="#3b82f6" font-size="32" font-weight="bold">✓</text>
            </svg>
          </div>
          <div style="font-size: 10px; color: #9ca3af;">
            ID: ${certificateId}
          </div>
        </div>

        <div style="text-align: center;">
          <div style="width: 200px; height: 60px; display: flex; align-items: center; justify-content: center; font-family: 'Brush Script MT', cursive; font-size: 24px; color: #1e40af;">
            ${instructorName || 'Formation en ligne'}
          </div>
          <div style="border-top: 2px solid #1e40af; padding-top: 10px; margin-top: 10px;">
            <div style="font-weight: bold; color: #1e40af;">Instructeur</div>
            <div style="font-size: 14px; color: #6b7280;">${courseName}</div>
          </div>
        </div>
      </div>

      <!-- QR Code pour vérification -->
      <div style="position: absolute; bottom: 20px; left: 20px; text-align: center; font-size: 10px; color: #9ca3af;">
        <div style="width: 80px; height: 80px; border: 2px solid #e5e7eb; display: flex; align-items: center; justify-content: center; margin-bottom: 5px; background: white;">
          <!-- QR Code serait généré ici -->
          <div style="font-size: 8px;">QR Code</div>
        </div>
        Vérifier ce certificat
      </div>

      <!-- Sceau de sécurité -->
      <div style="position: absolute; top: 20px; right: 20px; width: 100px; height: 100px; border: 3px solid #3b82f6; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; transform: rotate(15deg);">
        <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">✓</div>
        <div style="font-size: 10px; font-weight: bold; color: #1e40af;">CERTIFIÉ</div>
        <div style="font-size: 8px; color: #6b7280;">${new Date(completionDate).getFullYear()}</div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    // Load dependencies dynamically
    const [jsPDFClass, html2canvasClass] = await Promise.all([
      loadJsPDF(),
      loadHtml2Canvas()
    ]);

    // Convertir en canvas
    const canvas = await html2canvasClass(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Créer le PDF
    const pdf = new jsPDFClass({
      orientation: 'landscape',
      unit: 'px',
      format: [1200, 850]
    });

    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, 1200, 850);

    // Nettoyer
    document.body.removeChild(container);

    return pdf;
  } catch (error) {
    console.error('Erreur lors de la génération du certificat:', error);
    document.body.removeChild(container);
    throw error;
  }
};

export const downloadCertificate = async (userData) => {
  try {
    const pdf = await generateCertificate(userData);
    const filename = `certificat_${userData.studentName.replace(/\s+/g, '_')}_${userData.certificateId}.pdf`;
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    return false;
  }
};

export const generateCertificateId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 7);
  return `ET-${timestamp}-${randomStr}`.toUpperCase();
};

