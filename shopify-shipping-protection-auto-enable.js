/**
 * Automatisk aktivering av leveransskydd i UPcart
 *
 * Version 3 - Mycket mer specifik sökning för att undvika fel element
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
  var maxAttempts = 30; // Försök i max 15 sekunder (30 försök x 500ms)

  function log(message) {
    if (DEBUG) {
      console.log('[Leveransskydd Auto-Enable] ' + message);
    }
  }

  // Funktion för att aktivera leveransskyddet i ett dokument (main eller iframe)
  function enableShippingProtectionInDocument(doc, context) {
    context = context || 'huvuddokument';
    log('Söker i ' + context + '...');

    var shippingElement = null;
    var toggleElement = null;

    // FÖRBÄTTRAD SÖKNING: Sök endast efter små element som troligen innehåller titeln
    var candidates = doc.querySelectorAll('h1, h2, h3, h4, h5, h6, span, div, p, label, strong');

    log('Söker bland ' + candidates.length + ' kandidater...');

    for (var i = 0; i < candidates.length; i++) {
      var el = candidates[i];
      var text = (el.textContent || '').trim();

      // Kolla om detta element innehåller "Leverans skydd"
      if (text.includes('Leverans skydd') || text.includes('Leveransskydd')) {

        // VIKTIGT: Ignorera element med för många barn (hela html-taggen etc)
        if (el.children.length > 8) {
          continue;
        }

        // Ignorera element med för mycket text (hela sidor)
        if (text.length > 300) {
          continue;
        }

        // Beräkna hur relevant detta element är
        var searchTerm = 'Leverans skydd';
        var relevance = searchTerm.length / text.length;

        // Om "Leverans skydd" utgör minst 15% av texten
        if (relevance > 0.15) {
          shippingElement = el;
          log('✓ Hittade element: ' + el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''));
          log('  Text: "' + text.substring(0, 60) + (text.length > 60 ? '...' : '') + '"');
          log('  Barn: ' + el.children.length + ', Relevans: ' + Math.round(relevance * 100) + '%');
          break;
        }
      }
    }

    if (!shippingElement) {
      log('✗ Hittade inget passande element med "Leverans skydd"');
      return false;
    }

    // Nu när vi hittat rätt element, leta efter toggle i närheten
    var parent = shippingElement;

    // Gå upp i DOM-trädet för att hitta containern
    for (var level = 0; level < 6; level++) {
      if (!parent) break;

      log('Söker toggles i nivå ' + level + ' (' + parent.tagName + ')...');

      // Metod 1: Sök efter element med "toggle" eller "switch" i klassnamnet
      var toggles = parent.querySelectorAll('[class*="toggle" i], [class*="Toggle" i], [class*="switch" i], [class*="Switch" i]');

      for (var t = 0; t < toggles.length; t++) {
        var toggle = toggles[t];
        var className = toggle.className || '';

        // VIKTIGT: Ignorera navigation-toggles
        if (className.includes('nav') ||
            className.includes('Nav') ||
            className.includes('menu') ||
            className.includes('Menu') ||
            className.includes('mobile') ||
            className.includes('Mobile')) {
          log('  ✗ Ignorerar navigation-toggle: ' + className);
          continue;
        }

        // Detta verkar vara rätt toggle!
        toggleElement = toggle;
        log('  ✓ Hittade toggle: ' + className);
        break;
      }

      if (toggleElement) break;

      // Metod 2: Sök efter klickbara element nära leveransskydd-texten
      var clickables = parent.querySelectorAll('div[role="button"], button, [onclick], input[type="checkbox"]');
      for (var j = 0; j < clickables.length; j++) {
        var clickable = clickables[j];
        var className2 = clickable.className || '';

        // Ignorera navigation-element
        if (className2.includes('nav') || className2.includes('menu')) {
          continue;
        }

        var rect = clickable.getBoundingClientRect();
        if (rect.width > 15 && rect.height > 15 && rect.width < 200) { // Rimlig storlek för en toggle
          toggleElement = clickable;
          log('  ✓ Hittade klickbart element: ' + clickable.tagName);
          break;
        }
      }

      if (toggleElement) break;
      parent = parent.parentElement;
    }

    // Om vi hittat toggle:n, klicka på den
    if (toggleElement) {
      // Kolla om den redan är aktiverad
      var isActive = toggleElement.className.includes('active') ||
                     toggleElement.className.includes('checked') ||
                     toggleElement.className.includes('on') ||
                     toggleElement.getAttribute('aria-checked') === 'true' ||
                     toggleElement.getAttribute('data-checked') === 'true' ||
                     (toggleElement.checked === true);

      if (!isActive) {
        log('✅ Aktiverar leveransskydd genom att klicka...');
        toggleElement.click();
        return true;
      } else {
        log('ℹ️ Leveransskydd är redan aktiverat');
        return true;
      }
    } else {
      log('✗ Kunde inte hitta toggle-element i ' + context);
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
          log('Söker i iframe #' + i + '...');
          var found = enableShippingProtectionInDocument(iframeDoc, 'iframe #' + i);
          if (found) {
            log('✅ SUCCESS! Leveransskydd aktiverat i iframe #' + i + '!');
            return true;
          }
        }
      } catch (e) {
        log('Kan inte komma åt iframe #' + i + ' (CORS-skydd): ' + e.message);
      }
    }
    return false;
  }

  // Huvudfunktion som försöker aktivera leveransskyddet
  function tryEnableShippingProtection() {
    attemptCount++;
    log('');
    log('═══ Försök #' + attemptCount + ' av ' + maxAttempts + ' ═══');

    // Försök först i huvuddokumentet
    var foundInMain = enableShippingProtectionInDocument(document, 'huvuddokument');

    // Om inte hittat, sök i iframes
    if (!foundInMain) {
      var foundInIframe = searchInIframes();

      if (foundInIframe) {
        return true;
      }
    } else {
      log('✅ SUCCESS! Leveransskydd aktiverat i huvuddokument!');
      return true;
    }

    // Om vi inte hittat något och fortfarande har försök kvar, försök igen
    if (attemptCount < maxAttempts) {
      setTimeout(tryEnableShippingProtection, 500);
    } else {
      log('');
      log('⚠️ Gav upp efter ' + maxAttempts + ' försök.');
      log('Tips: Öppna kundvagnen manuellt och kör detta i konsolen för mer info:');
      log('document.querySelectorAll("*[class*=\\'Leverans\\'], *[class*=\\'skydd\\']")');
    }

    return false;
  }

  // Starta när sidan laddas
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(tryEnableShippingProtection, 1000);
    });
  } else {
    setTimeout(tryEnableShippingProtection, 1000);
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
      log('');
      log('🔄 DOM-ändring detekterad (kundvagn öppnad?), försöker aktivera...');
      attemptCount = 0; // Återställ räknaren
      setTimeout(tryEnableShippingProtection, 500);
    }
  });

  // Starta observationen
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  log('🚀 Leveransskydd auto-enable initierad!');
})();
