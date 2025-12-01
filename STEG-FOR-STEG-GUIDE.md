# META ADS AUTOMATION - KOMPLETT GUIDE

Den här guiden visar exakt hur du sätter upp automatisk annons-skapning för Facebook/Instagram.

---

## ÖVERSIKT: Så fungerar det

```
1. Du skapar en mapp i Google Drive med bilder/videor
2. Du fyller i ett enkelt formulär
3. Automatiseringen:
   - Hämtar alla filer från mappen
   - Laddar upp dem till Meta
   - Skapar ett nytt Ad Set (namngivet efter mappen)
   - Skapar annonser för varje fil
   - Loggar allt till Google Sheets
   - Skickar Slack-notis (valfritt)
```

---

## DEL 1: SKAPA GOOGLE SHEET

### Steg 1.1: Skapa nytt sheet
1. Gå till https://sheets.google.com
2. Klicka på **"+ Blank"** (eller "Tomt")

### Steg 1.2: Öppna Apps Script
1. I menyn, klicka på **Extensions** (Tillägg)
2. Klicka på **Apps Script**

### Steg 1.3: Klistra in setup-scriptet
1. En ny flik öppnas med kod-editor
2. **Markera och radera** all befintlig kod
3. Gå till filen `setup-google-sheet.js` i detta repo
4. **Kopiera ALLT innehåll**
5. **Klistra in** i Apps Script-editorn

### Steg 1.4: Kör scriptet
1. Klicka på **disketten** (eller Ctrl+S) för att spara
2. Klicka på **▶ Run** (play-knappen)
3. Första gången får du en varning:
   - Klicka **Review permissions**
   - Välj ditt Google-konto
   - Klicka **Advanced** → **Go to [projektnamn] (unsafe)**
   - Klicka **Allow**
4. Vänta tills en popup visas med "SETUP KLAR!"

### Steg 1.5: Kopiera Sheet ID
1. Popupen visar ditt **Sheet ID** - **KOPIERA DETTA!**
2. Alternativt: titta på URL:en i webbläsaren:
   ```
   https://docs.google.com/spreadsheets/d/ABC123XYZ789/edit
   ```
   Delen mellan `/d/` och `/edit` är ditt Sheet ID

### Steg 1.6: Fyll i Settings
Gå till Settings-fliken och fyll i:

| Setting | Var du hittar det |
|---------|-------------------|
| ad_account_id | Business Settings → Ad Accounts → välj konto → kopiera numret |
| facebook_page_id | Din Facebook-sida → About → Page ID |
| pixel_id | Events Manager → Data Sources → välj pixel → kopiera ID |
| daily_budget | Din budget per dag i KRONOR (t.ex. 100) |
| target_countries | Landskoder (t.ex. SE eller SE,NO,DK) |
| website_url | Din landningssida (t.ex. https://dinbutik.se/kampanj) |

---

## DEL 2: SKAPA META-APP OCH ACCESS TOKEN

### Steg 2.1: Gå till Meta for Developers
1. Öppna https://developers.facebook.com
2. Logga in med ditt Facebook-konto

### Steg 2.2: Skapa ny app
1. Klicka på **My Apps** uppe till höger
2. Klicka på **Create App**
3. Välj **Other** → Klicka **Next**
4. Välj **Business** → Klicka **Next**
5. Fyll i:
   - **App name:** n8n Ads Automation
   - **App contact email:** din email
6. Klicka **Create app**

### Steg 2.3: Lägg till Marketing API
1. På dashboard-sidan, scrolla ner till "Add products to your app"
2. Hitta **Marketing API**
3. Klicka **Set up**

### Steg 2.4: Generera Access Token
1. I vänstermenyn under Marketing API, klicka på **Tools**
2. Under "Get Access Token", bocka i:
   - ☑ ads_management
   - ☑ ads_read
3. Klicka **Get token**
4. **KOPIERA TOKEN** som visas (lång textsträng)

**OBS:** Denna token går ut efter ~60 dagar. Se DEL 6 för permanent token.

---

## DEL 3: SKAPA GOOGLE DRIVE-MAPP

### Steg 3.1: Skapa mapp
1. Gå till https://drive.google.com
2. Klicka **+ New** → **New folder**
3. Döp mappen till något beskrivande, t.ex. "Kampanj Sommar 2024"
   - **VIKTIGT:** Mappnamnet blir Ad Set-namnet!
4. Klicka **Create**

### Steg 3.2: Ladda upp filer
1. Öppna mappen
2. Dra in dina bilder/videor eller klicka **+ New** → **File upload**

**Filkrav:**
- Bilder: JPG, PNG, WebP (max 30 MB)
- Videor: MP4, MOV (max 4 GB)
- Filnamn: Använd bokstäver, siffror, bindestreck och understreck

### Steg 3.3: Kopiera mapp-URL
1. Titta på URL:en i webbläsaren när du är i mappen
2. Den ser ut så här:
   ```
   https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz
   ```
3. **Kopiera hela URL:en** - du behöver den i formuläret

---

## DEL 4: INSTALLERA N8N-WORKFLOW

### Steg 4.1: Öppna n8n
1. Öppna din n8n-installation i webbläsaren

### Steg 4.2: Importera workflow
1. Klicka på **+** för att skapa nytt workflow
2. Klicka på **⋮** (tre prickar) uppe till höger
3. Välj **Import from file...**
4. Välj filen `meta-ads-automation-pro.json`

### Steg 4.3: Skapa Google-credentials
1. Klicka på noden **"Get Settings"**
2. I panelen till höger, klicka på **Credential to connect with**
3. Klicka **Create new credential**
4. Välj **Google Sheets OAuth2 API**
5. Följ instruktionerna:
   - Du behöver skapa OAuth-credentials i Google Cloud Console
   - Eller använd befintliga om du har
6. När du är klar, klicka **Save**

**Gör samma sak för Google Drive:**
1. Klicka på noden **"Get Folder Info"**
2. Skapa/välj **Google Drive OAuth2 API** credential

### Steg 4.4: Skapa Meta-credentials
1. Klicka på noden **"Upload Video"** eller **"Upload Image"**
2. Klicka på **Credential to connect with**
3. Klicka **Create new credential**
4. Välj **Facebook Graph API**
5. Klistra in din **Access Token** från DEL 2
6. Klicka **Save**

### Steg 4.5: Uppdatera Sheet ID
1. Klicka på noden **"Get Settings"**
2. I fältet **Document ID**, ersätt `YOUR_SHEET_ID_HERE` med ditt Sheet ID
3. Gör samma sak för noden **"Log to Sheet"**

### Steg 4.6: Aktivera workflow
1. Klicka på växeln uppe till höger som säger **Inactive**
2. Den ska nu visa **Active**
3. Kopiera **Webhook URL** som visas i noden "Submit Form"

---

## DEL 5: SKAPA KAMPANJ I META ADS MANAGER

### Steg 5.1: Gå till Ads Manager
1. Öppna https://adsmanager.facebook.com

### Steg 5.2: Skapa ny kampanj
1. Klicka på **+ Create**
2. Välj kampanjmål: **Sales** (Försäljning)
3. Klicka **Continue**
4. Ge kampanjen ett namn
5. **VIKTIGT:** Ställ in kampanjen som **manual** (inte Advantage+)
6. Klicka **Next**
7. Du behöver INTE skapa Ad Set eller Ads här - bara kampanjen
8. Publicera kampanjen (den kan vara pausad)

### Steg 5.3: Kopiera Campaign ID
1. I kampanjlistan, klicka på din kampanj
2. I URL:en ser du:
   ```
   ...?act=123456789&selected_campaign_ids=987654321...
   ```
3. `987654321` är ditt **Campaign ID** - kopiera det!

**Alternativt:**
1. Klicka på kampanjnamnet
2. I infopanelen till höger visas Campaign ID

---

## DEL 6: TESTA AUTOMATISERINGEN

### Steg 6.1: Öppna formuläret
1. Klistra in Webhook URL:en från DEL 4.6 i webbläsaren
2. Ett formulär visas

### Steg 6.2: Fyll i formuläret

| Fält | Vad du fyller i |
|------|-----------------|
| Google Drive Folder URL | URL:en till din mapp (från DEL 3.3) |
| Campaign ID | Campaign ID (från DEL 5.3) |
| Primary Text | Din annonstext, t.ex. "Sommarrea - 50% rabatt på allt!" |
| Headline | Rubrik, t.ex. "Handla nu" |
| Description | Extra beskrivning (valfritt) |
| Website URL | Lämna tomt för att använda default från Settings |
| Call to Action | Välj t.ex. SHOP_NOW |

### Steg 6.3: Skicka formuläret
1. Klicka **Submit**
2. Du ser "Tack! Annons-skapandet har startat..."

### Steg 6.4: Verifiera
1. Gå till **Meta Ads Manager**
2. Öppna din kampanj
3. Du ska se ett nytt **Ad Set** med samma namn som din Google Drive-mapp
4. Inuti finns annonser för varje fil

5. Kolla **Google Sheet** - nya rader i "Ads Log"

---

## DEL 7: SKAPA PERMANENT ACCESS TOKEN (Valfritt men rekommenderat)

Tokens från DEL 2 går ut efter ~60 dagar. Så här skapar du en permanent:

### Steg 7.1: Skapa System User
1. Gå till https://business.facebook.com/settings
2. Klicka **Users** → **System users** i vänstermenyn
3. Klicka **Add**
4. Namn: "n8n Automation"
5. Role: **Admin**
6. Klicka **Create system user**

### Steg 7.2: Ge tillgångar
1. Klicka på din nya system user
2. Klicka **Add assets**
3. Välj **Ad accounts** → välj ditt konto → **Full control**
4. Välj **Pages** → välj din sida → **Full control**
5. Klicka **Save changes**

### Steg 7.3: Generera token
1. Klicka på system usern igen
2. Klicka **Generate new token**
3. Välj din app (skapad i DEL 2)
4. Bocka i:
   - ☑ ads_management
   - ☑ ads_read
5. Klicka **Generate token**
6. **KOPIERA** den nya token
7. Uppdatera credentials i n8n med den nya token

---

## DEL 8: SLACK-NOTIFIKATIONER (Valfritt)

### Steg 8.1: Skapa Slack-app
1. Gå till https://api.slack.com/apps
2. Klicka **Create New App** → **From scratch**
3. App name: "Meta Ads Notifier"
4. Välj din workspace
5. Klicka **Create App**

### Steg 8.2: Lägg till permissions
1. I vänstermenyn, klicka **OAuth & Permissions**
2. Scrolla ner till **Scopes** → **Bot Token Scopes**
3. Klicka **Add an OAuth Scope**
4. Lägg till:
   - `chat:write`
   - `chat:write.public`

### Steg 8.3: Installera i workspace
1. Scrolla upp till **OAuth Tokens for Your Workspace**
2. Klicka **Install to Workspace**
3. Klicka **Allow**
4. **KOPIERA** Bot User OAuth Token

### Steg 8.4: Hitta kanal-ID
1. Öppna Slack
2. Högerklicka på kanalen du vill använda
3. Klicka **Copy link**
4. URL:en ser ut så här: `https://app.slack.com/client/T123/C456789`
5. `C456789` är ditt **kanal-ID**

### Steg 8.5: Konfigurera i n8n
1. I n8n, klicka på en **Slack**-nod
2. Skapa ny credential med din Bot Token
3. Lägg till kanal-ID i Google Sheet → Settings → slack_channel

---

## VANLIGA FEL OCH LÖSNINGAR

### "Saknade settings i Google Sheet"
**Orsak:** Du har inte fyllt i alla obligatoriska värden i Settings-fliken.
**Lösning:** Öppna Google Sheet → Settings → fyll i alla värden markerade som obligatoriskt.

### "Website URL saknas"
**Orsak:** Ingen URL i Settings och ingen angiven i formuläret.
**Lösning:** Fyll i `website_url` i Settings ELLER ange URL i formuläret.

### "Inga filer hittades"
**Orsak:** Mappen är tom eller innehåller ej stödda filer.
**Lösning:** Lägg till bilder (JPG, PNG) eller videor (MP4) i mappen.

### "Invalid OAuth token"
**Orsak:** Din Meta-token har gått ut.
**Lösning:** Generera ny token (DEL 2.4 eller DEL 7) och uppdatera i n8n.

### "Campaign not found"
**Orsak:** Fel Campaign ID.
**Lösning:** Dubbelkolla att du kopierat rätt ID från Ads Manager.

### Annonser skapas men syns inte
**Orsak:** Annonserna skapas som PAUSED.
**Lösning:** Gå till Ads Manager → aktivera annonserna manuellt.

---

## SAMMANFATTNING

När allt är uppsatt:

1. **Skapa ny mapp** i Google Drive med bilder/videor
2. **Öppna formulär-URL:en**
3. **Fyll i:** mapp-URL, campaign ID, annonstext
4. **Klicka Submit**
5. **Klart!** Annonserna skapas automatiskt

Alla annonser loggas i Google Sheet och du får Slack-notis (om konfigurerat).
