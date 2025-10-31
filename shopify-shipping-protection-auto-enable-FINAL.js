/**
 * SLUTGILTIG VERSION - Automatisk aktivering av leveransskydd i UPcart
 *
 * Fungerar med UPcarts Shadow DOM implementation
 *
 * Lägg till denna kod i ditt Shopify-tema:
 * 1. Gå till Online Store > Themes > Edit code
 * 2. Öppna theme.liquid
 * 3. Lägg till denna script innan </body>-taggen
 */

(function() {
  'use strict';

  var DEBUG = true;
  var maxAttempts = 10;
  var attemptCount = 0;

  function log(message) {
    if (DEBUG) {
      console.log('[Leveransskydd Auto-Enable] ' + message);
    }
  }

  function tryActivateShippingProtection() {
    attemptCount++;
    log('Försök #' + attemptCount + ' att aktivera leveransskydd...');

    // Hitta UPcart Shadow DOM
    var upCart = document.querySelector('div#upCart');

    if (!upCart) {
      log('✗ Hittade inte #upCart element');
      if (attemptCount < maxAttempts) {
        setTimeout(tryActivateShippingProtection, 500);
      }
      return;
    }

    if (!upCart.shadowRoot) {
      log('✗ #upCart har ingen shadowRoot');
      if (attemptCount < maxAttempts) {
        setTimeout(tryActivateShippingProtection, 500);
      }
      return;
    }

    var shadowRoot = upCart.shadowRoot;
    log('✓ Hittade Shadow DOM');

    // Leta efter toggle i shadow DOM
    var toggleContainer = shadowRoot.querySelector('.upcart-addons-toggle, .styles_AddonsModule__toggle__');

    if (!toggleContainer) {
      log('✗ Hittade inte toggle container i shadow DOM');
      if (attemptCount < maxAttempts) {
        setTimeout(tryActivateShippingProtection, 500);
      }
      return;
    }

    log('✓ Hittade toggle container');

    var toggle = toggleContainer.querySelector('.styles_ToggleSwitch__');

    if (!toggle) {
      log('✗ Hittade inte toggle element');
      if (attemptCount < maxAttempts) {
        setTimeout(tryActivateShippingProtection, 500);
      }
      return;
    }

    log('✓ Hittade toggle element');

    // Kolla om redan aktiverad
    if (toggle.className.includes('styles_ToggleSwitch--active__')) {
      log('ℹ️  Leveransskydd är redan aktiverat!');
      return;
    }

    // Aktivera!
    log('✅ Klickar på toggle för att aktivera...');
    toggle.click();

    // Verifiera efter en kort stund
    setTimeout(function() {
      if (toggle.className.includes('styles_ToggleSwitch--active__')) {
        log('✅ SUCCESS! Leveransskydd har aktiverats!');
      } else {
        log('⚠️  Klick fungerade inte som förväntat, försöker igen...');
        toggle.click();
      }
    }, 500);
  }

  // Registrera callback när kundvagnen öppnas
  function registerCallback() {
    if (typeof upcartOnCartOpened === 'function') {
      log('🚀 Registrerar UPcart callback...');

      upcartOnCartOpened(function() {
        log('🔔 Kundvagn öppnad! Startar aktivering...');
        attemptCount = 0;
        setTimeout(tryActivateShippingProtection, 800);
      });

      log('✓ Callback registrerad - leveransskydd aktiveras automatiskt när vagnen öppnas!');
    } else {
      log('⏳ upcartOnCartOpened finns inte än, väntar...');
      setTimeout(registerCallback, 1000);
    }
  }

  // Starta
  log('📦 Leveransskydd auto-enable initierad...');
  registerCallback();
})();
