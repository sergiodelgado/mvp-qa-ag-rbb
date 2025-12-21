# Efecto Scroll Antigravity - Implementación CSS Pura

## 🎯 Por qué este enfoque replica el "feeling Antigravity" sin riesgos

1. **Sticky + Scroll-Driven Animations**: Cada panel se pega al viewport mientras su scene está visible, creando el efecto de "capas flotantes" que se revelan al hacer scroll (igual que antigravity.google).

2. **Mejora progresiva con @supports**: La animación solo se activa en navegadores modernos que soportan `animation-timeline: view()`. En navegadores antiguos, el sticky funciona perfectamente sin animación.

3. **Sin scroll-jacking**: El usuario mantiene control total del scroll. Solo aplicamos transformaciones visuales, nunca bloqueamos ni alteramos la velocidad de scroll.

4. **Accesibilidad first**: Respetamos `prefers-reduced-motion` deshabilitando todas las animaciones para usuarios que lo requieran.

5. **Mobile-safe**: Ajustamos `min-height`, `top` y `padding` en pantallas pequeñas para evitar que el contenido quede oculto o sea difícil de navegar.

---

## ✅ Checklist de validación antes de deploy

### Funcionalidad
- [ ] Los 3 bloques (Pulso, Ventana de Opinión, Indicadores) se renderizan correctamente
- [ ] El componente `OpinionWindowEmbedded` funciona sin cambios
- [ ] Los datos del feed (`home-feed.json`) se muestran correctamente
- [ ] El footer se mantiene al final de la página

### Scroll & UX
- [ ] Al hacer scroll, cada panel se "pega" al top mientras su scene está en viewport
- [ ] En navegadores modernos (Chrome 115+, Edge 115+), se ve la animación de fade + scale
- [ ] En navegadores antiguos, el sticky funciona sin animación (fallback seguro)
- [ ] El scroll es fluido, sin saltos ni bloqueos

### Accesibilidad
- [ ] Con `prefers-reduced-motion: reduce` activado, NO hay animaciones
- [ ] El contenido es accesible con teclado (Tab, Enter, etc.)
- [ ] Los `<details>` se pueden abrir/cerrar sin problemas

### Responsive
- [ ] En desktop (>640px): panels con `top: 4vh`, scenes de `min-height: 100vh`
- [ ] En mobile (≤640px): panels con `top: 2rem`, scenes con `min-height: auto`
- [ ] No hay scroll horizontal ni overflow

### Tests E2E (Cypress)
- [ ] `cypress/e2e/home_feed.cy.ts` pasa sin errores
- [ ] Los selectores CSS (`.block`, `.summary`, `.kpiItem`, etc.) siguen funcionando
- [ ] No hay warnings de "element not visible" o timeouts

### Performance
- [ ] No hay layout shifts (CLS) al cargar la página
- [ ] La animación no causa jank (usar DevTools > Performance)
- [ ] `will-change: opacity, transform` está aplicado solo en `.panel`

---

## 🔧 Rollback rápido (si algo falla)

Si necesitas revertir el efecto:

1. En `app/page.tsx`: quitar los `<section className={styles.scene}>` y `<div className={styles.panel}>`, dejar solo los `<details>`.
2. En `app/page.module.css`: restaurar el `.main` original:
   ```css
   .main {
     display: flex;
     flex-direction: column;
     gap: 2rem;
     min-height: 100vh;
     justify-content: flex-start;
     padding-top: 4vh;
   }
   ```
3. Eliminar las clases `.scene`, `.panel` y los `@supports` / `@keyframes`.

---

## 📚 Referencias técnicas

- [CSS Scroll-Driven Animations (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline/view)
- [Can I Use: animation-timeline](https://caniuse.com/mdn-css_properties_animation-timeline_view)
- [Antigravity.google](https://antigravity.google) (inspiración)
