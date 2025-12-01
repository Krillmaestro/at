# Meta Ads Automation - Steg-för-steg Guide

Den här guiden visar hur du sätter upp automatisk annons-skapning för Facebook/Instagram.

---

## Vad du behöver innan du börjar

- Ett Google-konto
- Ett Meta Business Manager-konto med ett annonskonto
- En Facebook-sida kopplad till ditt annonskonto
- n8n installerat (self-hosted eller cloud)
- Slack (valfritt, för notifikationer)

---

## DEL 1: Skapa Google Sheet

### Steg 1.1: Öppna Google Sheets
1. Gå till [sheets.google.com](https://sheets.google.com)
2. Klicka på **"+ Blank"** för att skapa ett nytt sheet

### Steg 1.2: Kör Setup-scriptet
1. I ditt nya sheet, klicka på **Extensions** (Tillägg) i menyn
2. Klicka på **Apps Script**
3. Ta bort all kod som finns där
4. Kopiera och klistra in hela innehållet från filen `setup-google-sheet.js`
5. Klicka på **Save** (diskikonen eller Ctrl+S)
6. Klicka på **Run** (play-knappen)
7. Första gången: Klicka **Review permissions** → välj ditt konto → **Allow**
8. Gå tillbaka till ditt sheet - du ser nu två flikar: "Settings" och "Ads Log"

### Steg 1.3: Kopiera Sheet ID
1. Titta på URL:en i din webbläsare
2. Den ser ut så här: `https://docs.google.com/spreadsheets/d/ABC123XYZ/edit`
3. Kopiera delen mellan `/d/` och `/edit` - det är ditt **Sheet ID**
4. Spara detta ID - du behöver det senare

---

## DEL 2: Skapa Google Drive-mapp

### Steg 2.1: Skapa mapp
1. Gå till [drive.google.com](https://drive.google.com)
2. Klicka på **+ New** → **New folder**
3. Döp mappen till t.ex. "Meta Ads Assets"
4. Klicka **Create**

### Steg 2.2: Kopiera mapp-URL
1. Öppna mappen du skapade
2. Kopiera hela URL:en från webbläsaren
3. Den ser ut så här: `https://drive.google.com/drive/folders/ABC123XYZ`
4. Spara denna URL - du behöver den när du skapar annonser

---

## DEL 3: Skapa Meta-app och Access Token

### Steg 3.1: Skapa Meta-app
1. Gå till [developers.facebook.com](https://developers.facebook.com)
2. Logga in med ditt Facebook-konto
3. Klicka på **My Apps** uppe till höger
4. Klicka på **Create App**
5. Välj **Other** → **Next**
6. Välj **Business** → **Next**
7. Fyll i:
   - App name: "n8n Ads Automation" (eller valfritt namn)
   - Contact email: din email
8. Klicka **Create App**

### Steg 3.2: Lägg till Marketing API
1. I din nya app, scrolla ner till **Add products to your app**
2. Hitta **Marketing API** och klicka **Set up**
3. Klicka på **Tools** i vänstermenyn under Marketing API
4. Under **Get Access Token**, bocka i:
   - `ads_management`
   - `ads_read`
5. Klicka **Get Token**
6. Kopiera token som visas - det är din **Access Token**
7. **VIKTIGT:** Denna token går ut. Se Del 6 för hur du skapar en permanent token.

### Steg 3.3: Hitta dina ID:n
1. Gå till [business.facebook.com/settings](https://business.facebook.com/settings)
2. **Ad Account ID:**
   - Klicka på **Accounts** → **Ad accounts** i vänstermenyn
   - Klicka på ditt annonskonto
   - Kopiera numret (utan "act_")
3. **Facebook Page ID:**
   - Klicka på **Accounts** → **Pages**
   - Klicka på din sida
   - Kopiera Page ID

---

## DEL 4: Sätt upp n8n

### Steg 4.1: Importera workflow
1. Öppna n8n
2. Klicka på **+** för att skapa nytt workflow
3. Klicka på **...** (tre prickar) uppe till höger
4. Välj **Import from file**
5. Välj filen `meta-ads-automation-pro.json`

### Steg 4.2: Skapa Google-credentials
1. Klicka på valfri **Google Sheets**-nod
2. Klicka på **Credential** → **Create new**
3. Välj **OAuth2**
4. Följ instruktionerna för att logga in med Google
5. Ge n8n tillgång till Sheets och Drive
6. Spara credentials

### Steg 4.3: Skapa Meta-credentials
1. Klicka på valfri **HTTP Request**-nod (t.ex. "Upload Video to Meta")
2. Klicka på **Credential** → **Create new**
3. Välj **Facebook Graph API**
4. Klistra in din **Access Token** från Del 3
5. Spara credentials

### Steg 4.4: Uppdatera Sheet ID
1. Klicka på **Get Settings**-noden
2. Ersätt `YOUR_SHEET_ID_HERE` med ditt Sheet ID från Del 1
3. Gör samma sak för **Log to Google Sheet**-noden

### Steg 4.5: Fyll i Settings-sheetet
1. Gå till ditt Google Sheet
2. I **Settings**-fliken, fyll i:

| Setting | Value |
|---------|-------|
| ad_account_id | Ditt Ad Account ID (utan act_) |
| facebook_page_id | Din Facebook Page ID |

---

## DEL 5: Testa automatiseringen

### Steg 5.1: Ladda upp testfiler
1. Gå till din Google Drive-mapp
2. Ladda upp en testbild (JPG eller PNG)
3. Filnamnet bör vara enkelt, t.ex. `test-ad.jpg`

### Steg 5.2: Hitta Campaign och Ad Set ID
1. Gå till [adsmanager.facebook.com](https://adsmanager.facebook.com)
2. Öppna kampanjen du vill lägga till annonser i
3. **Campaign ID:** Klicka på kampanjen → kopiera ID från URL eller info
4. **Ad Set ID:** Klicka på ad set → kopiera ID

### Steg 5.3: Aktivera workflow
1. I n8n, klicka på **Inactive** växeln för att aktivera workflow
2. Kopiera **Form URL** som visas i Submit Form-noden

### Steg 5.4: Fyll i formuläret
1. Öppna Form URL i webbläsaren
2. Fyll i:
   - **Google Drive Folder URL:** URL:en till din mapp
   - **Campaign ID:** Från steg 5.2
   - **Ad Set ID:** Från steg 5.2
   - **Primary Text:** "Det här är en testannons"
   - **Headline:** "Testrubrik"
   - **Website URL:** Din webbplats
   - **Call to Action:** LEARN_MORE
3. Klicka **Submit**

### Steg 5.5: Verifiera
1. Gå till Facebook Ads Manager
2. Öppna ditt ad set
3. Du ska nu se en ny annons (status: PAUSED)
4. Kolla ditt Google Sheet - ny rad i "Ads Log"

---

## DEL 6: Skapa permanent Access Token (Valfritt men rekommenderat)

Tokens från Del 3 går ut efter ~60 dagar. Så här skapar du en som inte går ut:

### Steg 6.1: System User
1. Gå till [business.facebook.com/settings](https://business.facebook.com/settings)
2. Klicka **Users** → **System users**
3. Klicka **Add**
4. Namnge: "n8n Automation"
5. Role: **Admin**
6. Klicka **Create system user**

### Steg 6.2: Ge tillgång
1. Klicka på din nya system user
2. Klicka **Add assets**
3. Välj **Ad accounts** → välj ditt konto → **Full control**
4. Välj **Pages** → välj din sida → **Full control**
5. Klicka **Save changes**

### Steg 6.3: Generera permanent token
1. Klicka på system usern
2. Klicka **Generate new token**
3. Välj din app
4. Bocka i: `ads_management`, `ads_read`, `pages_read_engagement`
5. Klicka **Generate token**
6. Kopiera token och uppdatera credentials i n8n

---

## DEL 7: Slack-notifikationer (Valfritt)

### Steg 7.1: Skapa Slack-app
1. Gå till [api.slack.com/apps](https://api.slack.com/apps)
2. Klicka **Create New App** → **From scratch**
3. Namnge: "n8n Ads Notifier"
4. Välj din workspace

### Steg 7.2: Lägg till permissions
1. Klicka **OAuth & Permissions** i vänstermenyn
2. Under **Scopes** → **Bot Token Scopes**, lägg till:
   - `chat:write`
   - `chat:write.public`
3. Scrolla upp och klicka **Install to Workspace**
4. Kopiera **Bot User OAuth Token**

### Steg 7.3: Konfigurera i n8n
1. I varje Slack-nod, skapa ny credential
2. Klistra in din Bot Token
3. Ersätt `YOUR_SLACK_CHANNEL_ID` med din kanal-ID
   - Högerklicka på kanalen i Slack → **Copy link** → ID är sista delen av URL:en

---

## Vanliga problem

### "No Access to Folder"
- Kontrollera att du kopierade rätt mapp-URL
- Se till att mappen inte är i papperskorgen

### "Invalid filename format"
- Filnamn får bara innehålla bokstäver, siffror, understreck och bindestreck
- Undvik åäö och specialtecken

### "Missing Settings"
- Kolla att du fyllt i `ad_account_id` och `facebook_page_id` i Settings-fliken

### Token expired
- Skapa en ny token (Del 3 eller helst Del 6)
- Uppdatera credentials i n8n

---

## Support

Om något inte fungerar:
1. Kolla n8n execution logs
2. Verifiera alla ID:n är korrekta
3. Testa med en enkel bildfil först
