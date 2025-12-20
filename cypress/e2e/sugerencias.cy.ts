// cypress/e2e/sugerencias.cy.ts

import { EMAIL_VALID, PASSWORD_VALID } from '../support/credentials'

// Helper simple para loguear y llegar a /buzon
function loginAndGoToBuzon() {
  cy.visit('/login')

  cy.get('input[name="email"]').type(EMAIL_VALID)
  cy.get('input[name="password"]').type(PASSWORD_VALID)
  cy.get('button[type="submit"]').click()

  cy.url().should('include', '/buzon')
  cy.contains(/buzón de sugerencias/i)
  
  // Esperar a que la página se estabilice después del login
  // El componente BuzonPage carga el perfil y sugerencias asincrónicamente
  // Esperamos a que el formulario esté completamente listo
  cy.get('#titulo').should('be.visible')
  cy.get('#contenido').should('be.visible')
  // Pequeña pausa adicional para asegurar que todos los efectos terminaron
  cy.wait(500)
}

describe('Buzón de Sugerencias - flujo básico', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('permite crear una sugerencia válida y verla en el listado', () => {
    loginAndGoToBuzon()

    // Usamos Date.now() para evitar colisiones de títulos
    const titulo = `Sugerencia Cypress ${Date.now()}`
    const contenido = 'Contenido de prueba generado por Cypress.'

    // Tu formulario usa id, no name
    cy.get('#titulo').clear().type(titulo)
    cy.get('#contenido').clear().type(contenido)

    // Botón principal del formulario de sugerencias
    cy.get('button[type="submit"]').click()

    // El componente agrega la sugerencia creada al inicio de la lista
    // Esperamos a que el título aparezca en el DOM
    cy.contains(titulo, { timeout: 10000 }).should('exist')
  })

  it('no permite enviar sugerencia vacía y muestra mensaje de error', () => {
    loginAndGoToBuzon()

    // Aseguramos campos vacíos
    cy.get('#titulo').clear()
    cy.get('#contenido').clear()

    cy.get('button[type="submit"]').click()

    // El componente setea formError = "Título y contenido son obligatorios."
    cy.contains('Título y contenido son obligatorios.').should('exist')
  })

  // Futuro: pruebas de filtrado por socio / estados
  // it.skip('solo muestra sugerencias del socio autenticado', () => {
  //   // Requiere datos preparados con múltiples usuarios.
  // })
})
