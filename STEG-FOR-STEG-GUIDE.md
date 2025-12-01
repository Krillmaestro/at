# META ADS AUTOMATION - KOMPLETT GUIDE

Den har guiden visar exakt hur du satter upp automatisk annons-skapning for Facebook/Instagram.

---

## OVERSIKT: Sa fungerar det

```
GOOGLE DRIVE STRUKTUR:
======================

Creative Folder/              <-- Huvudmappen (ID sparas i Settings)
├── Sommarkampanj_Skor/       <-- Mappnamn = Ad Set namn
│   ├── UGC_Hook_9x16.mp4     <-- Filnamn = Annonsnamn
│   ├── Product_Demo.mp4
│   └── Lifestyle.jpg
│
├── Hostkampanj_Jackor/       <-- Mappnamn = Ad Set namn
│   └── Influencer_Video.mp4
│
Uploaded/                     <-- Hit flyttas klara mappar
├── Sommarkampanj_Skor/
└── ...

WORKFLOW:
=========
1. Editors laddar upp en mapp i Creative Folder
2. Du klickar "Run" i n8n
3. Automatiseringen:
   - Hittar alla mappar i Creative Folder
   - For varje mapp: skapar Ad Set (mappnamn)
   - For varje fil: skapar annons (filnamn)
   - Flyttar mappen till Uploaded
   - Loggar allt till Google Sheet
   - Skickar Slack-notis (valfritt)
```

---

## DEL 1: SKAPA GOOGLE SHEET

### Steg 1.1: Skapa nytt sheet
1. Ga till https://sheets.google.com
2. Klicka pa **"+ Blank"** (eller "Tomt")

### Steg 1.2: Oppna Apps Script
1. I menyn, klicka pa **Extensions** (Tillagg)
2. Klicka pa **Apps Script**

### Steg 1.3: Klistra in setup-scriptet
1. En ny flik oppnas med kod-editor
2. **Markera och radera** all befintlig kod
3. Ga till filen `setup-google-sheet.js` i detta repo
4. **Kopiera ALLT innehall**
5. **Klistra in** i Apps Script-editorn

### Steg 1.4: Kor scriptet
1. Klicka pa **disketten** (eller Ctrl+S) for att spara
2. Klicka pa **Run** (play-knappen)
3. Forsta gangen far du en varning:
   - Klicka **Review permissions**
   - Valj ditt Google-konto
   - Klicka **Advanced** -> **Go to [projektnamn] (unsafe)**
   - Klicka **Allow**
4. Vanta tills en popup visas med "SETUP KLAR!"

### Steg 1.5: Kopiera Sheet ID
1. Popupen visar ditt **Sheet ID** - **KOPIERA DETTA!**
2. Alternativt: titta pa URL:en i webblasaren:
   ```
   https://docs.google.com/spreadsheets/d/ABC123XYZ789/edit
   ```
   Delen mellan `/d/` och `/edit` ar ditt Sheet ID

---

## DEL 2: SKAPA META-APP OCH ACCESS TOKEN

### Steg 2.1: Ga till Meta for Developers
1. Oppna https://developers.facebook.com
2. Logga in med ditt Facebook-konto

### Steg 2.2: Skapa ny app
1. Klicka pa **My Apps** uppe till hoger
2. Klicka pa **Create App**
3. Valj **Other** -> Klicka **Next**
4. Valj **Business** -> Klicka **Next**
5. Fyll i:
   - **App name:** n8n Ads Automation
   - **App contact email:** din email
6. Klicka **Create app**

### Steg 2.3: Lagg till Marketing API
1. Pa dashboard-sidan, scrolla ner till "Add products to your app"
2. Hitta **Marketing API**
3. Klicka **Set up**

### Steg 2.4: Generera Access Token
1. I vanstermenyn under Marketing API, klicka pa **Tools**
2. Under "Get Access Token", bocka i:
   - ads_management
   - ads_read
3. Klicka **Get token**
4. **KOPIERA TOKEN** som visas (lang textstrang)

**OBS:** Denna token gar ut efter ~60 dagar. Se DEL 7 for permanent token.

---

## DEL 3: SKAPA GOOGLE DRIVE-STRUKTUR

### Steg 3.1: Skapa Creative Folder
1. Ga till https://drive.google.com
2. Klicka **+ New** -> **New folder**
3. Dop mappen till **"Creative Folder"** (eller valfritt namn)
4. Klicka **Create**

### Steg 3.2: Kopiera Creative Folder ID
1. Oppna mappen
2. Titta pa URL:en:
   ```
   https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz
   ```
3. **Kopiera ID:t** (delen efter `/folders/`)

### Steg 3.3: Skapa Uploaded folder
1. Ga tillbaka till rot-nivån i Drive
2. Klicka **+ New** -> **New folder**
3. Dop mappen till **"Uploaded"**
4. Kopiera dess ID ocksa (samma satt som ovan)

### Steg 3.4: Dela mapparna (om editors anvander andra konton)
1. Hogerklicka pa Creative Folder
2. Klicka **Share**
3. Lagg till dina editors email-adresser
4. Ge dem **Editor**-rattigheter
5. Gor samma for Uploaded-mappen

---

## DEL 4: SKAPA KAMPANJ I META ADS MANAGER

### Steg 4.1: Ga till Ads Manager
1. Oppna https://adsmanager.facebook.com

### Steg 4.2: Skapa ny kampanj
1. Klicka pa **+ Create**
2. Valj kampanjmal: **Sales** (Forsaljning)
3. Klicka **Continue**
4. Ge kampanjen ett namn, t.ex. "Automatiserade Annonser 2024"
5. **VIKTIGT:** Stall in kampanjen som **manual** (inte Advantage+)
6. Klicka **Next**
7. Du behover INTE skapa Ad Set eller Ads har - bara kampanjen
8. Publicera kampanjen (den kan vara pausad)

### Steg 4.3: Kopiera Campaign ID
1. I kampanjlistan, klicka pa din kampanj
2. I URL:en ser du:
   ```
   ...?act=123456789&selected_campaign_ids=987654321...
   ```
3. `987654321` ar ditt **Campaign ID** - kopiera det!

---

## DEL 5: FYLL I SETTINGS

Oppna ditt Google Sheet och ga till Settings-fliken. Fyll i:

### META KONTO (obligatoriskt)
| Setting | Var du hittar det |
|---------|-------------------|
| ad_account_id | Business Settings -> Ad Accounts -> valj konto -> kopiera numret |
| facebook_page_id | Din Facebook-sida -> About -> Page ID |
| pixel_id | Events Manager -> Data Sources -> valj pixel -> kopiera ID |
| campaign_id | Fran DEL 4.3 |

### GOOGLE DRIVE (obligatoriskt)
| Setting | Vad du fyller i |
|---------|-----------------|
| creative_folder_id | ID fran DEL 3.2 |
| uploaded_folder_id | ID fran DEL 3.3 |

### BUDGET & TARGETING (obligatoriskt)
| Setting | Exempel |
|---------|---------|
| daily_budget | 100 (i kronor, inte cents!) |
| target_countries | SE (eller SE,NO,DK for flera lander) |

### ANNONSINNEHALL (obligatoriskt)
| Setting | Vad det ar |
|---------|-----------|
| website_url | Din landningssida, t.ex. https://dinbutik.se/kampanj |
| primary_text | Huvudtexten i annonsen, t.ex. "Sommarrea - 50% rabatt!" |
| headline | Rubrik under bilden/videon, t.ex. "Handla nu" |
| description | Extra beskrivning (valfritt) |
| call_to_action | SHOP_NOW, LEARN_MORE, SIGN_UP, etc. |

---

## DEL 6: INSTALLERA N8N-WORKFLOW

### Steg 6.1: Oppna n8n
1. Oppna din n8n-installation i webblasaren

### Steg 6.2: Importera workflow
1. Klicka pa **+** for att skapa nytt workflow
2. Klicka pa **...** (tre prickar) uppe till hoger
3. Valj **Import from file...**
4. Valj filen `meta-ads-automation-pro.json`

### Steg 6.3: Skapa Google-credentials
1. Klicka pa noden **"Get Settings"**
2. I panelen till hoger, klicka pa **Credential to connect with**
3. Klicka **Create new credential**
4. Valj **Google Sheets OAuth2 API**
5. Folj instruktionerna for att koppla ditt Google-konto
6. Nar du ar klar, klicka **Save**

**Gor samma sak for Google Drive:**
1. Klicka pa noden **"List Ad Set Folders"**
2. Skapa/valj **Google Drive OAuth2 API** credential

### Steg 6.4: Skapa Meta-credentials
1. Klicka pa noden **"Upload Video"**
2. Klicka pa **Credential to connect with**
3. Klicka **Create new credential**
4. Valj **Facebook Graph API**
5. Klistra in din **Access Token** fran DEL 2
6. Klicka **Save**

### Steg 6.5: Uppdatera Sheet ID
1. Klicka pa noden **"Get Settings"**
2. I faltet **Document ID**, ersatt `YOUR_SHEET_ID_HERE` med ditt Sheet ID
3. Gor samma sak for noden **"Log to Sheet"**

---

## DEL 7: TESTA AUTOMATISERINGEN

### Steg 7.1: Skapa en testmapp
1. Ga till din **Creative Folder** i Google Drive
2. Skapa en ny mapp, t.ex. **"Test_Kampanj"**
3. Ladda upp 1-2 bilder eller videor i mappen

### Steg 7.2: Kor workflowet
1. Ga till n8n
2. Oppna ditt workflow
3. Klicka pa **"Test workflow"** eller **"Execute workflow"**

### Steg 7.3: Verifiera
1. Vanta tills workflowet ar klart (grona bockar pa alla noder)
2. Ga till **Meta Ads Manager**
3. Du ska se ett nytt **Ad Set** som heter "Test_Kampanj"
4. Inuti finns annonser for varje fil du laddade upp
5. Kolla **Google Sheet** - nya rader i "Ads Log"
6. Kolla **Google Drive** - mappen har flyttats till "Uploaded"

---

## DEL 8: PERMANENT ACCESS TOKEN (Rekommenderat)

Tokens fran DEL 2 gar ut efter ~60 dagar. Sa har skapar du en permanent:

### Steg 8.1: Skapa System User
1. Ga till https://business.facebook.com/settings
2. Klicka **Users** -> **System users** i vanstermenyn
3. Klicka **Add**
4. Namn: "n8n Automation"
5. Role: **Admin**
6. Klicka **Create system user**

### Steg 8.2: Ge tillgangar
1. Klicka pa din nya system user
2. Klicka **Add assets**
3. Valj **Ad accounts** -> valj ditt konto -> **Full control**
4. Valj **Pages** -> valj din sida -> **Full control**
5. Klicka **Save changes**

### Steg 8.3: Generera token
1. Klicka pa system usern igen
2. Klicka **Generate new token**
3. Valj din app (skapad i DEL 2)
4. Bocka i:
   - ads_management
   - ads_read
5. Klicka **Generate token**
6. **KOPIERA** den nya token
7. Uppdatera credentials i n8n med den nya token

---

## DEL 9: SLACK-NOTIFIKATIONER (Valfritt)

### Steg 9.1: Skapa Slack-app
1. Ga till https://api.slack.com/apps
2. Klicka **Create New App** -> **From scratch**
3. App name: "Meta Ads Notifier"
4. Valj din workspace
5. Klicka **Create App**

### Steg 9.2: Lagg till permissions
1. I vanstermenyn, klicka **OAuth & Permissions**
2. Scrolla ner till **Scopes** -> **Bot Token Scopes**
3. Klicka **Add an OAuth Scope**
4. Lagg till:
   - `chat:write`
   - `chat:write.public`

### Steg 9.3: Installera i workspace
1. Scrolla upp till **OAuth Tokens for Your Workspace**
2. Klicka **Install to Workspace**
3. Klicka **Allow**
4. **KOPIERA** Bot User OAuth Token

### Steg 9.4: Konfigurera i n8n och Sheet
1. I n8n, klicka pa en **Slack**-nod
2. Skapa ny credential med din Bot Token
3. Lagg till kanal-ID i Google Sheet -> Settings -> slack_channel
   - Hitta kanal-ID: Hogerklicka pa kanalen -> Copy link -> sista delen

---

## VANLIGA FEL OCH LOSNINGAR

### "Saknade settings i Google Sheet"
**Orsak:** Du har inte fyllt i alla obligatoriska varden.
**Losning:** Oppna Google Sheet -> Settings -> fyll i ALLA varden.

### "Inga mappar hittades"
**Orsak:** Creative Folder ar tom.
**Losning:** Lagg till minst en mapp med filer i Creative Folder.

### "Inga filer hittades i mappen"
**Orsak:** Undermappen ar tom eller innehaller fel filtyper.
**Losning:** Lagg till bilder (JPG, PNG) eller videor (MP4) i mappen.

### "Invalid OAuth token"
**Orsak:** Din Meta-token har gatt ut.
**Losning:** Generera ny token (DEL 2.4 eller DEL 8) och uppdatera i n8n.

### Annonser skapas men syns inte
**Orsak:** Annonserna skapas som PAUSED.
**Losning:** Ga till Ads Manager -> aktivera annonserna manuellt.

### Mappar flyttas inte till Uploaded
**Orsak:** n8n har inte rattigheter till Uploaded-mappen.
**Losning:** Kontrollera att samma Google-konto har tillgang till bada mapparna.

---

## DAGLIG ANVANDNING

Nar allt ar uppsatt sa har enkelt ar det:

### For Video Editors:
1. Skapa en mapp i **Creative Folder**
2. Dop mappen till onskat **Ad Set-namn**
3. Ladda upp bilder/videor
4. Dop filerna till onskade **annonsnamn**
5. Klart - meddela att ny mapp finns

### For dig som kor annonser:
1. Oppna **n8n**
2. Klicka **"Execute workflow"**
3. Klart! Alla nya mappar processas automatiskt

### Resultat:
- Nya Ad Sets skapas i din kampanj
- Varje fil blir en annons
- Mappar flyttas till Uploaded
- Allt loggas i Google Sheet
- Du far Slack-notis (om konfigurerat)
