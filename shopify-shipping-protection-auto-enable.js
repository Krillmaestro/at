/**
 * Automatisk aktivering av leveransskydd i UPcart
 *
 * Denna version fungerar med BÅDE iframes OCH direktladdade UPcart-implementationer
 *
 * Lägg till denna kod i ditt Shopify-tema:
 * 1. Gå till Online Store > Themes > Edit code
 * 2. Öppna theme.liquid eller den layout-fil som används
 * 3. Lägg till denna script innan </body>-taggen
 */

(function() {
  'use strict';

  var DEBUG = true; // Sätt till false för att stänga av debug-meddelanden
  var attemptCount = 0;
  var maxAttempts = 20; // Försök i max 10 sekunder (20 försök x 500ms)

  function log(message) {
    if (DEBUG) {
      console.log('[Leveransskydd Auto-Enable] ' + message);
    }
  }

  // Funktion för att aktivera leveransskyddet i ett dokument (main eller iframe)
  function enableShippingProtectionInDocument(doc, context) {
    context = context || 'huvuddokument';
    log('Söker i ' + context + '...');

    // Metod 1: Sök efter alla element som innehåller texten "Leverans skydd"
    var allElements = doc.querySelectorAll('*');
    var shippingElement = null;
    var toggleElement = null;

    // Hitta elementet med texten "Leverans skydd"
    for (var i = 0; i < allElements.length; i++) {
      var el = allElements[i];
      // Kolla om detta element innehåller texten men inte har för många barn (vi vill ha det specifika elementet)
      if (el.textContent && el.textContent.includes('Leverans skydd') && el.children.length < 10) {
        shippingElement = el;
        log('Hittade element med "Leverans skydd": ' + el.className);
        break;
      }
    }

    if (shippingElement) {
      // Leta efter toggle i närheten
      var parent = shippingElement;

      // Gå upp i DOM-trädet för att hitta containern
      for (var level = 0; level < 5; level++) {
        if (!parent) break;

        // Metod A: Sök efter element med "toggle" i klassnamnet
        var toggles = parent.querySelectorAll('[class*="toggle" i], [class*="Toggle" i], [class*="switch" i], [class*="Switch" i]');
        if (toggles.length > 0) {
          toggleElement = toggles[0];
          log('Hittade toggle via klass: ' + toggleElement.className);
          break;
        }

        // Metod B: Sök efter klickbara element nära leveransskydd-texten
        var clickables = parent.querySelectorAll('div[role="button"], button, [onclick]');
        for (var j = 0; j < clickables.length; j++) {
          var rect = clickables[j].getBoundingClientRect();
          if (rect.width > 20 && rect.height > 20) { // Rimlig storlek för en toggle
            toggleElement = clickables[j];
            log('Hittade toggle via klickbart element: ' + toggleElement.className);
            break;
          }
        }

        if (toggleElement) break;
        parent = parent.parentElement;
      }
    }

    // Om vi hittat toggle:n, klicka på den
    if (toggleElement) {
      // Kolla om den redan är aktiverad genom att titta efter vissa klasser eller attribut
      var isActive = toggleElement.className.includes('active') ||
                     toggleElement.className.includes('checked') ||
                     toggleElement.className.includes('on') ||
                     toggleElement.getAttribute('aria-checked') === 'true' ||
                     toggleElement.getAttribute('data-checked') === 'true';

      if (!isActive) {
        log('✅ Aktiverar leveransskydd genom att klicka på toggle...');
        toggleElement.click();
        return true;
      } else {
        log('ℹ️ Leveransskydd är redan aktiverat');
        return true;
      }
    } else {
      log('❌ Kunde inte hitta toggle-element i ' + context);
      return false;
    }
  }

  // Funktion för att söka i alla iframes
  function searchInIframes() {
    var iframes = document.querySelectorAll('iframe');
    log('Hittade ' + iframes.length + ' iframe(s)');

    for (var i = 0; i < iframes.length; i++) {
      try {
        var iframeDoc = iframes[i].contentDocument || iframes[i].contentWindow.document;
        if (iframeDoc) {
          var found = enableShippingProtectionInDocument(iframeDoc, 'iframe #' + i);
          if (found) {
            return true;
          }
        }
      } catch (e) {
        log('Kan inte komma åt iframe #' + i + ' (CORS-skydd)');
      }
    }
    return false;
  }

  // Huvudfunktion som försöker aktivera leveransskyddet
  function tryEnableShippingProtection() {
    attemptCount++;
    log('Försök #' + attemptCount + ' av ' + maxAttempts);

    // Försök först i huvuddokumentet
    var foundInMain = enableShippingProtectionInDocument(document, 'huvuddokument');

    // Om inte hittat, sök i iframes
    if (!foundInMain) {
      var foundInIframe = searchInIframes();

      if (foundInIframe) {
        log('✅ Leveransskydd aktiverat (hittades i iframe)!');
        return true;
      }
    } else {
      log('✅ Leveransskydd aktiverat (hittades i huvuddokument)!');
      return true;
    }

    // Om vi inte hittat något och fortfarande har försök kvar, försök igen
    if (attemptCount < maxAttempts) {
      setTimeout(tryEnableShippingProtection, 500);
    } else {
      log('⚠️ Gav upp efter ' + maxAttempts + ' försök. Leveransskydd kanske inte är tillgängligt?');
    }

    return false;
  }

  // Starta när sidan laddas
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(tryEnableShippingProtection, 500);
    });
  } else {
    setTimeout(tryEnableShippingProtection, 500);
  }

  // Lyssna på DOM-ändringar (när kundvagn öppnas dynamiskt)
  var observer = new MutationObserver(function(mutations) {
    var shouldCheck = false;

    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            var text = node.textContent || '';
            // Om nytt element innehåller "Leverans" eller "skydd", försök igen
            if (text.includes('Leverans') || text.includes('skydd') ||
                node.tagName === 'IFRAME' ||
                (node.className && (node.className.includes('cart') ||
                                   node.className.includes('Cart') ||
                                   node.className.includes('upcart') ||
                                   node.className.includes('Upcart')))) {
              shouldCheck = true;
            }
          }
        });
      }
    });

    if (shouldCheck) {
      log('DOM-ändring detekterad, försöker aktivera leveransskydd...');
      attemptCount = 0; // Återställ räknaren
      setTimeout(tryEnableShippingProtection, 300);
    }
  });

  // Starta observationen
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();
