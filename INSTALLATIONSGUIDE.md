# Guide: Aktivera Leveransskydd Automatiskt i Shopify

Denna guide visar hur du lägger till kod i ditt Shopify-tema för att automatiskt aktivera leveransskyddet från UPcart.

## Metod 1: Inline Script (Enklast) ⭐ REKOMMENDERAS

1. Logga in i din Shopify-admin
2. Gå till **Online Store** > **Themes**
3. Klicka på **Actions** > **Edit code** på ditt aktiva tema
4. Öppna filen `theme.liquid` (finns under Layout)
5. Scrolla ner till slutet, precis innan `</body>`-taggen
6. Klistra in följande kod:

```html
<!-- Auto-aktivera leveransskydd -->
<script>
(function() {
  'use strict';

  var DEBUG = true;
  var attemptCount = 0;
  var maxAttempts = 20;

  function log(message) {
    if (DEBUG) {
      console.log('[Leveransskydd Auto-Enable] ' + message);
    }
  }

  function enableShippingProtectionInDocument(doc, context) {
    context = context || 'huvuddokument';
    log('Söker i ' + context + '...');

    var allElements = doc.querySelectorAll('*');
    var shippingElement = null;
    var toggleElement = null;

    for (var i = 0; i < allElements.length; i++) {
      var el = allElements[i];
      if (el.textContent && el.textContent.includes('Leverans skydd') && el.children.length < 10) {
        shippingElement = el;
        log('Hittade element med "Leverans skydd": ' + el.className);
        break;
      }
    }

    if (shippingElement) {
      var parent = shippingElement;

      for (var level = 0; level < 5; level++) {
        if (!parent) break;

        var toggles = parent.querySelectorAll('[class*="toggle" i], [class*="Toggle" i], [class*="switch" i], [class*="Switch" i]');
        if (toggles.length > 0) {
          toggleElement = toggles[0];
          log('Hittade toggle via klass: ' + toggleElement.className);
          break;
        }

        var clickables = parent.querySelectorAll('div[role="button"], button, [onclick]');
        for (var j = 0; j < clickables.length; j++) {
          var rect = clickables[j].getBoundingClientRect();
          if (rect.width > 20 && rect.height > 20) {
            toggleElement = clickables[j];
            log('Hittade toggle via klickbart element: ' + toggleElement.className);
            break;
          }
        }

        if (toggleElement) break;
        parent = parent.parentElement;
      }
    }

    if (toggleElement) {
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

  function tryEnableShippingProtection() {
    attemptCount++;
    log('Försök #' + attemptCount + ' av ' + maxAttempts);

    var foundInMain = enableShippingProtectionInDocument(document, 'huvuddokument');

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

    if (attemptCount < maxAttempts) {
      setTimeout(tryEnableShippingProtection, 500);
    } else {
      log('⚠️ Gav upp efter ' + maxAttempts + ' försök. Leveransskydd kanske inte är tillgängligt?');
    }

    return false;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(tryEnableShippingProtection, 500);
    });
  } else {
    setTimeout(tryEnableShippingProtection, 500);
  }

  var observer = new MutationObserver(function(mutations) {
    var shouldCheck = false;

    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            var text = node.textContent || '';
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
      attemptCount = 0;
      setTimeout(tryEnableShippingProtection, 300);
    }
  });

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();
</script>
```

7. Klicka på **Save**
8. Testa genom att öppna din butik och lägga till en produkt i kundvagnen

## Metod 2: Separat JavaScript-fil

1. I Shopify-admin, gå till **Online Store** > **Themes** > **Edit code**
2. Under mappen **Assets**, klicka på **Add a new asset**
3. Välj **Create a blank file**
4. Namnge filen `shipping-protection-auto.js`
5. Klistra in innehållet från filen `shopify-shipping-protection-auto-enable.js`
6. Spara filen
7. Öppna `theme.liquid`
8. Lägg till detta precis innan `</body>`:

```liquid
{{ 'shipping-protection-auto.js' | asset_url | script_tag }}
```

9. Spara och testa!

## Hur det fungerar

Koden gör följande:

1. **Letar efter leveransskydds-modulen** - Söker efter texten "Leverans skydd" eller "Leveransskydd"
2. **Kontrollerar om den är aktiverad** - Kollar om toggle:n redan är påslagen
3. **Aktiverar automatiskt** - Om inte aktiverad, klickar den på toggle:n
4. **Övervakar dynamiska ändringar** - Om UPcart laddas dynamiskt (t.ex. när kundvagnen öppnas), aktiveras skyddet då också

## Felsökning

Om det inte fungerar:

1. Öppna webbläsarens konsol (högerklicka > Inspect > Console)
2. Leta efter meddelanden som "Aktiverar leveransskydd automatiskt..."
3. Om du ser "Kunde inte hitta leveransskydd-toggle", kan texten vara annorlunda i din installation
4. Du kan behöva justera texten som söks efter i koden (rad där det står `includes('Leverans skydd')`)

## Anpassa timing

Om det inte aktiveras direkt, prova att öka väntetiden:

- Ändra `500` till `1000` eller `1500` (millisekunder)
- Detta finns på raderna där det står `setTimeout(enableShippingProtection, 500);`

## Support

Om du får problem, dubbelkolla:
- Att UPcart-appen är korrekt installerad
- Att leveransskyddet visas i kundvagnen (manuellt)
- Att din Shopify-plan tillåter temakod-redigering
