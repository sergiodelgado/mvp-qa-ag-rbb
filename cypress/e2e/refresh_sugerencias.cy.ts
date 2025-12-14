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
    // Espiamos TODAS las llamadas GET a /api/sugerencias (incluye posibles querystrings)
    cy.intercept('GET', '**/api/sugerencias*').as('getSugerencias')

    loginAndGoToBuzon()

    // Primera carga automática de sugerencias al entrar a /buzon
    cy.wait('@getSugerencias')

    // Click en refresco
    cy.contains('button', 'Actualizar lista').click()

    // Si el estado "Actualizando..." aparece, bien; si no, no debe romper (en CI puede ser demasiado rápido)
    cy.get('body').then(($body) => {
      if ($body.text().includes('Actualizando...')) {
        cy.contains('button', 'Actualizando...').should('exist')
      }
    })

    // Esperamos la segunda llamada a /api/sugerencias (la señal real del refresh)
    cy.wait('@getSugerencias', { timeout: 10000 })

    // Al terminar, el botón vuelve a mostrar "Actualizar lista" (estado estable)
    cy.contains('button', 'Actualizar lista').should('exist')
  })

  it('muestra mensaje de error cuando /api/sugerencias responde 500 al refrescar', () => {
    cy.intercept('GET', '**/api/sugerencias*').as('getSugerenciasInicial')

    loginAndGoToBuzon()
    cy.wait('@getSugerenciasInicial')

    // Guardamos cuántos items hay antes del error
    cy.get('ul li').then(($itemsAntes) => {
      const cantidadAntes = $itemsAntes.length

      // Para el REFRESCO, simulamos un error 500
      cy.intercept('GET', '**/api/sugerencias*', {
        statusCode: 500,
        body: {}
      }).as('getSugerenciasError')

      cy.contains('button', 'Actualizar lista').click()
      cy.wait('@getSugerenciasError')

      // Mensaje de error esperado
      cy.contains('No se pudieron cargar las sugerencias.').should('exist')

      // La lista NO debería vaciarse por el error
      cy.get('ul li').should('have.length', cantidadAntes)
    })
  })

  it('redirige a /login si /api/sugerencias responde 401 al refrescar', () => {
    cy.intercept('GET', '**/api/sugerencias*').as('getSugerenciasInicial')

    loginAndGoToBuzon()
    cy.wait('@getSugerenciasInicial')

    // Para el refresco, respondemos 401
    cy.intercept('GET', '**/api/sugerencias*', {
      statusCode: 401,
      body: { message: 'No hay sesión activa.' }
    }).as('getSugerencias401')

    cy.contains('button', 'Actualizar lista').click()
    cy.wait('@getSugerencias401')

    cy.url().should('include', '/login')
  })

  it('muestra "Cargando sugerencias..." mientras se cargan las sugerencias iniciales', () => {
    // Simulamos latencia en la primera carga
    cy.intercept('GET', '**/api/sugerencias*', (req) => {
      req.on('response', (res) => {
        res.setDelay(1000)
      })
    }).as('getSugerenciasLentas')

    loginAndGoToBuzon()

    // Mientras no llega la respuesta, debe verse el texto de carga
    cy.contains('Cargando sugerencias...').should('exist')

    cy.wait('@getSugerenciasLentas')

    // Luego debería desaparecer
    cy.contains('Cargando sugerencias...').should('not.exist')
  })
})
