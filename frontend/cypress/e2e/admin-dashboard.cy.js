describe('Admin Dashboard Tests', () => {
  beforeEach(() => {
    // Visiter la page de connexion
    cy.visit('/login');
    
    // Se connecter en tant qu'admin
    cy.get('input[name="email"]').type(Cypress.env('ADMIN_EMAIL'));
    cy.get('input[name="password"]').type(Cypress.env('ADMIN_PASSWORD'));
    cy.get('button[type="submit"]').click();
    
    // Attendre la redirection vers le dashboard admin
    cy.url().should('include', '/admin');
  });

  it('Should display admin dashboard with all sections', () => {
    // Vérifier que le dashboard s'affiche
    cy.get('[data-testid="admin-dashboard"]').should('be.visible');
    
    // Vérifier les statistiques
    cy.get('[data-testid="stats-cards"]').should('be.visible');
    cy.get('[data-testid="total-users"]').should('contain', '1,247');
    cy.get('[data-testid="total-revenue"]').should('contain', '45,678,900');
    
    // Vérifier la sidebar
    cy.get('[data-testid="admin-sidebar"]').should('be.visible');
    
    // Vérifier les onglets de navigation
    cy.get('[data-testid="nav-overview"]').should('be.visible');
    cy.get('[data-testid="nav-users"]').should('be.visible');
    cy.get('[data-testid="nav-projects"]').should('be.visible');
  });

  it('Should toggle dark mode', () => {
    // Tester le toggle du mode sombre
    cy.get('[data-testid="dark-mode-toggle"]').click();
    cy.get('body').should('have.class', 'dark');
    
    // Vérifier que les éléments s'adaptent au mode sombre
    cy.get('[data-testid="admin-dashboard"]').should('have.class', 'dark:bg-gray-900');
  });

  it('Should collapse and expand sidebar', () => {
    // Tester la collapse de la sidebar
    cy.get('[data-testid="sidebar-toggle"]').click();
    cy.get('[data-testid="admin-sidebar"]').should('have.class', 'w-16');
    
    // Tester l'expansion
    cy.get('[data-testid="sidebar-toggle"]').click();
    cy.get('[data-testid="admin-sidebar"]').should('have.class', 'w-64');
  });

  it('Should navigate between tabs', () => {
    // Tester la navigation vers les utilisateurs
    cy.get('[data-testid="nav-users"]').click();
    cy.get('[data-testid="users-management"]').should('be.visible');
    
    // Tester la navigation vers les projets
    cy.get('[data-testid="nav-projects"]').click();
    cy.get('[data-testid="projects-management"]').should('be.visible');
    
    // Retour à la vue d'ensemble
    cy.get('[data-testid="nav-overview"]').click();
    cy.get('[data-testid="overview-content"]').should('be.visible');
  });

  it('Should display notifications', () => {
    // Tester l'affichage des notifications
    cy.get('[data-testid="notifications-bell"]').click();
    cy.get('[data-testid="notifications-panel"]').should('be.visible');
    
    // Vérifier qu'il y a des notifications
    cy.get('[data-testid="notification-item"]').should('have.length.greaterThan', 0);
  });

  it('Should search functionality work', () => {
    // Tester la recherche globale
    cy.get('[data-testid="global-search"]').type('utilisateur');
    cy.get('[data-testid="search-results"]').should('be.visible');
  });
});
