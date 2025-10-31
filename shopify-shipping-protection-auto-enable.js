/**
 * Automatisk aktivering av leveransskydd i UPcart
 *
 * Lägg till denna kod i ditt Shopify-tema:
 * 1. Gå till Online Store > Themes > Edit code
 * 2. Öppna theme.liquid eller den layout-fil som används
 * 3. Lägg till denna script innan </body>-taggen
 */

(function() {
  'use strict';

  // Funktion för att aktivera leveransskyddet
  function enableShippingProtection() {
    // Hitta leveransskydd-modulen genom att leta efter texten "Leverans skydd"
    const addonsModules = document.querySelectorAll('.styles_AddonsModule__title__, .upcart-addons-title');
    let shippingProtectionToggle = null;

    // Leta efter rätt modul
    addonsModules.forEach(function(module) {
      const titleText = module.textContent || module.innerText;
      if (titleText.includes('Leverans skydd') || titleText.includes('Leveransskydd')) {
        // Hitta toggle-knappen i samma container
        const container = module.closest('.Stack');
        if (container) {
          shippingProtectionToggle = container.querySelector('.upcart-addons-toggle, .styles_AddonsModule__toggle__');
        }
      }
    });

    // Om vi hittar toggle:n, kolla om den är aktiverad
    if (shippingProtectionToggle) {
      const toggleSwitch = shippingProtectionToggle.querySelector('.styles_ToggleSwitch__');

      // Kontrollera om toggle:n redan är aktiverad
      // UPcart lägger ofta till en klass eller attribut när toggle:n är aktiv
      const isActive = shippingProtectionToggle.classList.contains('active') ||
                       shippingProtectionToggle.classList.contains('checked') ||
                       toggleSwitch?.classList.contains('active') ||
                       toggleSwitch?.classList.contains('checked');

      if (!isActive) {
        console.log('Aktiverar leveransskydd automatiskt...');
        // Klicka på toggle:n för att aktivera den
        shippingProtectionToggle.click();
      } else {
        console.log('Leveransskydd är redan aktiverat');
      }
    } else {
      console.log('Kunde inte hitta leveransskydd-toggle');
    }
  }

  // Vänta tills DOM:en är laddad
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      // Vänta lite extra för att låta UPcart ladda klart
      setTimeout(enableShippingProtection, 500);
    });
  } else {
    // DOM:en är redan laddad
    setTimeout(enableShippingProtection, 500);
  }

  // Lyssna även på eventuella AJAX-uppdateringar (för när kundvagnen öppnas)
  // UPcart kan ladda innehållet dynamiskt
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            if (node.classList && (node.classList.contains('upcart-addons-toggle') ||
                node.querySelector && node.querySelector('.upcart-addons-toggle'))) {
              setTimeout(enableShippingProtection, 300);
            }
          }
        });
      }
    });
  });

  // Starta observationen när DOM:en är redo
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }
})();
