describe('Home Feed UI', () => {
  beforeEach(() => {
    cy.visit('/')
    // Disable scroll animations for testing to ensure elements are visible
    cy.get('main').invoke('addClass', 'noAnimations')
  })

  it('renderiza título y secciones principales', () => {
    // Secciones - scroll into view to ensure visibility
    cy.contains('Pulso del gremio').scrollIntoView().should('be.visible')
    cy.contains('Opinión del Ecosistema').scrollIntoView().should('be.visible')
    cy.contains('Indicadores clave').scrollIntoView().should('be.visible')
  })

  it('Ventana de Opinión: flujo completo con envío exitoso (MOCK)', () => {
    // 0. Interceptamos el POST para que devuelva éxito (201)
    cy.intercept('POST', '/api/sugerencias', {
      statusCode: 201,
      body: { id: 'mock-id', titulo: 'Test', contenido: 'Test' }
    }).as('postSugerencia')

    // 1. Estado inicial: botón Opinar visible
    cy.contains('button', 'Opinar').scrollIntoView().should('be.visible').click()

    // 2. Estado expandido: textarea visible
    cy.get('textarea').should('be.visible')
    
    // 3. Escribir texto válido
    cy.get('textarea').type('Historia de usuario: deseo enviar sugerencias anónimas para mejorar el producto.')
    cy.contains('button', 'Continuar').should('not.be.disabled').click()

    // 4. Estado Review
    cy.contains('Antes de enviar').scrollIntoView().should('be.visible')
    cy.contains('deseo enviar sugerencias anónimas').should('be.visible')

    // 5. Enviar -> Esperar Mock
    cy.contains('button', 'Enviar').click()
    cy.wait('@postSugerencia')

    // 6. Estado Final -> Mensaje de éxito
    cy.contains('Recibido').scrollIntoView().should('be.visible')
    cy.contains('Gracias por tu aporte').scrollIntoView().should('be.visible')

    // 7. Reset -> Escribir otra
    cy.contains('button', 'Escribir otra').click()
    cy.get('textarea').should('have.value', '')
  })

  it('Ventana de Opinión: manejo de error 400 (Validación)', () => {
    cy.intercept('POST', '/api/sugerencias', {
      statusCode: 400,
      body: { message: 'El contenido es demasiado largo.' }
    }).as('postError400')

    cy.contains('button', 'Opinar').click()
    cy.get('textarea').type('Texto de prueba para forzar error 400.')
    cy.contains('button', 'Continuar').click()
    cy.contains('button', 'Enviar').click()
    cy.wait('@postError400')

    cy.contains('El contenido es demasiado largo.').should('be.visible')
    // El botón debe seguir diciendo "Enviar" (no "Enviando")
    cy.contains('button', 'Enviar').should('be.visible')
  })

  it('Ventana de Opinión: manejo de error 401 (Follow-up sin sesión)', () => {
    cy.intercept('POST', '/api/sugerencias', {
      statusCode: 401,
      body: { message: 'Se requiere sesión para seguimiento.' }
    }).as('postError401')

    cy.contains('button', 'Opinar').scrollIntoView().click()
    // Elegir modo 'Con seguimiento'
    cy.contains('button', 'Con seguimiento').click()
    cy.get('textarea').type('Intento de seguimiento sin login.')
    cy.contains('button', 'Continuar').click()
    
    cy.contains('Modo: Con seguimiento').scrollIntoView().should('be.visible')
    cy.contains('button', 'Enviar').click()
    cy.wait('@postError401')

    // Mensaje UX amigable
    cy.contains('Para seguimiento necesitas iniciar sesión.').scrollIntoView().should('be.visible')
  })
})
