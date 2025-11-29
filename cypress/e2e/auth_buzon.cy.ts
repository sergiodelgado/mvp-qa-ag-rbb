// cypress/e2e/auth_buzon.cy.ts

// V1: credenciales de prueba hardcodeadas.
// Más adelante se pueden mover a cypress.env.json o variables de entorno.
const EMAIL_VALID = 'test@example.com'
const PASSWORD_VALID = 'Test1234!'

describe('Auth y acceso al Buzón de Sugerencias', () => {
  beforeEach(() => {
    // Limpiamos sesión antes de cada test para evitar efectos raros
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('login exitoso redirige a /buzon', () => {
    cy.visit('/login')

    // SUPUESTO: inputs con name="email" y name="password"
    cy.get('input[name="email"]').type(EMAIL_VALID)
    cy.get('input[name="password"]').type(PASSWORD_VALID)

    // SUPUESTO: botón de envío con type="submit"
    cy.get('button[type="submit"]').click()

    // Debe llegar a /buzon
    cy.url().should('include', '/buzon')

    // SUPUESTO: hay algún texto que contenga "Buzón"
    cy.contains(/buzón/i)
  })

  it('login inválido mantiene al usuario en /login y muestra error', () => {
    cy.visit('/login')

    cy.get('input[name="email"]').type(EMAIL_VALID)
    cy.get('input[name="password"]').type('ClaveIncorrecta123!')

    cy.get('button[type="submit"]').click()

    // Sigue en /login
    cy.url().should('include', '/login')

    // SUPUESTO: el mensaje de error contiene la palabra "credenciales"
    // Ajusta este texto según tu implementación real
    cy.contains(/credenciales/i)
  })

  it('no permite acceder a /buzon sin sesión (redirige a /login)', () => {
    // Sin sesión, directo a /buzon
    cy.visit('/buzon')

    // Debería redirigir a /login
    cy.url().should('include', '/login')
  })
})
