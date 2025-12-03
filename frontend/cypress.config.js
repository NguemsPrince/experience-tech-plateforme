const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    setupNodeEvents(on, config) {
      // Configuration pour les tests
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });
    },
  },
  env: {
    API_URL: 'http://localhost:5000/api',
    ADMIN_EMAIL: 'admin@experiencetech-tchad.com',
    ADMIN_PASSWORD: 'admin123',
    TEST_USER_EMAIL: 'demo@test.com',
    TEST_USER_PASSWORD: 'demo123'
  }
});
