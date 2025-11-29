// cypress/e2e/refresh_sugerencias.cy.ts

import { EMAIL_VALID, PASSWORD_VALID } from '../support/credentials'

// Helper simple para loguear y llegar a /buzon
function loginAndGoToBuzon() {
  cy.visit('/login')

  cy.get('input[name="email"]').type(EMAIL_VALID)
  cy.get('input[name="password"]').type(PASSWORD_VALID)
  cy.get('button[type="submit"]').click()

  cy.url().should('include', '/buzon')
  cy.contains(/buzón de sugerencias/i)
}

describe('Buzón de Sugerencias - actualización de lista', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('vuelve a llamar a /api/sugerencias al presionar "Actualizar lista"', () => {
    // Espiamos TODAS las llamadas GET a /api/sugerencias
    cy.intercept('GET', '/api/sugerencias').as('getSugerencias')

    loginAndGoToBuzon()

    // Primera carga automática de sugerencias al entrar a /buzon
    cy.wait('@getSugerencias')

    // Ahora usamos el botón de refresco
    cy.contains('Actualizar lista').click()

    // Durante el refresco debería mostrarse "Actualizando..." en el botón
    cy.contains('Actualizando...').should('exist')

    // Esperamos la segunda llamada a /api/sugerencias
    cy.wait('@getSugerencias')

    // Al terminar, el botón vuelve a mostrar "Actualizar lista"
    cy.contains('Actualizar lista').should('exist')
  })

  it('muestra mensaje de error cuando /api/sugerencias responde 500 al refrescar', () => {
    // 1) Dejamos que la primera carga sea real (sin intercept especial)
    cy.intercept('GET', '/api/sugerencias').as('getSugerenciasInicial')

    loginAndGoToBuzon()

    cy.wait('@getSugerenciasInicial')

    // 2) Para el REFRESCO, simulamos un error 500
    cy.intercept('GET', '/api/sugerencias', {
      statusCode: 500,
      body: {}
    }).as('getSugerenciasError')

    cy.contains('Actualizar lista').click()

    cy.wait('@getSugerenciasError')

    // El componente setea sugerenciasError = "No se pudieron cargar las sugerencias."
    cy.contains('No se pudieron cargar las sugerencias.').should('exist')
  })

  // Futuro: probar comportamiento ante 401 (sesión vencida) usando intercept
  // y validando redirección a /login. Lo dejamos para una subfase más enfocada
  // en flujos de expiración de sesión.
})
