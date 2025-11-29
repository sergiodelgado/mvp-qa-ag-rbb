// cypress.config.ts
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      // Aquí más adelante puedes enganchar reportes, screenshots, etc.
      return config
    }
  }
})
