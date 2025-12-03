const fs = require('fs');
const path = require('path');

// Mapping des noms aux fichiers photos
const photoMapping = {
  'HAMZA BRAHIM AHMAT': 'Hassan.jpeg',
  'AZOULEUNNE OUAZOUA BONHEUR': 'Bonheur.jpeg',
  'ALLARAMADJI BASILE': 'Basile.jpg',
  'ISSA MAHAMAT NOUR': 'Alfred.jpg',
  'KOUMOUKOYE BAKOL ALEXIS': 'Alexis.jpg',
  'NDOUBAHIDI NEKO ASSUR': 'Assure.jpg',
  'NDISSELTA VIVIANE': 'Viviane.png',
  'KOKÉ BÉCHIR': 'Bechir.jpeg',
  'DENEMADJI CHANTAL': 'Viviane.png', // Utilise Viviane comme placeholder
  'ARNAUD APS': 'Hassan.jpeg', // Utilise Hassan comme placeholder
  'KERTEMA BACHIR': 'Bechir.jpeg'
};

// Lire le fichier About.js
const aboutPath = '/Users/nguemsprince/Desktop/Projet/frontend/src/pages/About.js';
let content = fs.readFileSync(aboutPath, 'utf8');

// Fonction pour mettre à jour un profil
function updateProfile(name, photoFile) {
  const pattern = new RegExp(
    `(<h4 className="text-lg font-bold text-gray-900 mb-2">${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</h4>.*?<div className="w-20 h-20 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">\\s*<UserGroupIcon className="w-10 h-10 text-primary-600" />\\s*</div>)`,
    's'
  );
  
  const replacement = `<div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden border-2 border-primary-200 shadow-lg">
                    <img 
                      src="/images/team/${photoFile}" 
                      alt="${name} - Photo de profil"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center" style={{display: 'none'}}>
                      <UserGroupIcon className="w-10 h-10 text-primary-600" />
                    </div>
                  </div>`;
  
  content = content.replace(pattern, replacement);
}

// Mettre à jour tous les profils
Object.entries(photoMapping).forEach(([name, photoFile]) => {
  updateProfile(name, photoFile);
});

// Écrire le fichier mis à jour
fs.writeFileSync(aboutPath, content);

console.log('✅ Tous les profils de l\'équipe ont été mis à jour avec leurs photos !');
console.log('📸 Photos utilisées :');
Object.entries(photoMapping).forEach(([name, photoFile]) => {
  console.log(`   ${name} → ${photoFile}`);
});
