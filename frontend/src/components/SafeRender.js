import React from 'react';

const SafeRender = ({ children }) => {
  // Fonction pour vérifier et nettoyer les enfants
  const cleanChildren = (child) => {
    if (child === null || child === undefined) {
      return null;
    }
    
    // Si c'est un objet (mais pas un élément React), le convertir en chaîne ou retourner null
    if (typeof child === 'object' && !React.isValidElement(child)) {
      console.warn('Tentative de rendu d\'un objet directement:', child);
      
      // Si c'est un objet avec des clés comme {basic, intermediate, advanced}, retourner null
      if (child && typeof child === 'object' && 
          ('basic' in child || 'intermediate' in child || 'advanced' in child)) {
        console.error('Objet avec clés {basic, intermediate, advanced} détecté et bloqué:', child);
        return null;
      }
      
      // Pour d'autres objets, essayer de les convertir en chaîne JSON (pour le debug)
      try {
        return JSON.stringify(child);
      } catch (e) {
        return '[Objet non sérialisable]';
      }
    }
    
    return child;
  };

  // Si children est un tableau, nettoyer chaque élément
  if (Array.isArray(children)) {
    return children.map((child, index) => (
      <React.Fragment key={index}>
        {cleanChildren(child)}
      </React.Fragment>
    ));
  }

  return cleanChildren(children);
};

export default SafeRender;
