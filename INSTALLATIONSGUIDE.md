# Guide: Aktivera Leveransskydd Automatiskt i Shopify

Denna guide visar hur du lägger till kod i ditt Shopify-tema för att automatiskt aktivera leveransskyddet från UPcart.

## Metod 1: Inline Script (Enklast)

1. Logga in i din Shopify-admin
2. Gå till **Online Store** > **Themes**
3. Klicka på **Actions** > **Edit code** på ditt aktiva tema
4. Öppna filen `theme.liquid` (finns under Layout)
5. Scrolla ner till slutet, precis innan `</body>`-taggen
6. Klistra in följande kod:

```html
<script>
(function() {
  'use strict';

  function enableShippingProtection() {
    const addonsModules = document.querySelectorAll('.styles_AddonsModule__title__, .upcart-addons-title');
    let shippingProtectionToggle = null;

    addonsModules.forEach(function(module) {
      const titleText = module.textContent || module.innerText;
      if (titleText.includes('Leverans skydd') || titleText.includes('Leveransskydd')) {
        const container = module.closest('.Stack');
        if (container) {
          shippingProtectionToggle = container.querySelector('.upcart-addons-toggle, .styles_AddonsModule__toggle__');
        }
      }
    });

    if (shippingProtectionToggle) {
      const toggleSwitch = shippingProtectionToggle.querySelector('.styles_ToggleSwitch__');
      const isActive = shippingProtectionToggle.classList.contains('active') ||
                       shippingProtectionToggle.classList.contains('checked') ||
                       toggleSwitch?.classList.contains('active') ||
                       toggleSwitch?.classList.contains('checked');

      if (!isActive) {
        console.log('Aktiverar leveransskydd automatiskt...');
        shippingProtectionToggle.click();
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(enableShippingProtection, 500);
    });
  } else {
    setTimeout(enableShippingProtection, 500);
  }

  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            if (node.classList && (node.classList.contains('upcart-addons-toggle') ||
                node.querySelector && node.querySelector('.upcart-addons-toggle'))) {
              setTimeout(enableShippingProtection, 300);
            }
          }
        });
      }
    });
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      observer.observe(document.body, { childList: true, subtree: true });
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
