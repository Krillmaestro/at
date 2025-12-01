# Meta Ads Automation med n8n + Google Sheets

## KOMPLETT NYBÖRJARGUIDE

Denna guide tar dig från NOLL till en fungerande automation som:
- Hämtar bilder/videos från Google Drive
- Skapar Facebook/Instagram ads automatiskt
- Loggar allt i Google Sheets

**Tid:** Ca 1-2 timmar första gången

---

# INNEHÅLL

1. [Skapa Google Sheet (Dashboard)](#del-1-skapa-google-sheet-dashboard)
2. [Installera n8n](#del-2-installera-n8n)
3. [Skapa Meta Developer App](#del-3-skapa-meta-developer-app)
4. [Koppla ihop allt i n8n](#del-4-koppla-ihop-allt-i-n8n)
5. [Testa workflowen](#del-5-testa-workflowen)

---

# DEL 1: SKAPA GOOGLE SHEET (DASHBOARD)

Google Sheet är din kontrollpanel där du:
- Ställer in alla inställningar
- Ser alla skapade ads
- Skriver ad-texter

## Steg 1.1: Skapa Google Sheet (AUTOMATISKT)

1. Gå till: **https://sheets.google.com**
2. Logga in med ditt Google-konto
3. Klicka på **+ Blank** (Tom) för att skapa ett nytt sheet
4. Klicka på **Extensions** → **Apps Script**
5. Ta bort all kod som finns i editorn
6. Kopiera och klistra in HELA denna kod:

```javascript
function setupMetaAdsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.rename('Meta Ads Automation');

  // Rename first sheet to Settings
  const settingsSheet = ss.getSheets()[0];
  settingsSheet.setName('Settings');

  // Create other sheets
  const adsLogSheet = ss.insertSheet('Ads Log');
  const adCopySheet = ss.insertSheet('Ad Copy');

  // ===== SETTINGS SHEET =====
  settingsSheet.getRange('A1:B1').setValues([['Setting', 'Value']]);
  settingsSheet.getRange('A2:B12').setValues([
    ['ad_account_id', ''],
    ['facebook_page_id', ''],
    ['pixel_id', ''],
    ['custom_event_type', 'ADD_TO_CART'],
    ['website_link', 'https://dinwebbsida.com'],
    ['campaign_name', 'Creative_Test'],
    ['daily_budget', '500'],
    ['drive_folder_id', ''],
    ['primary_text', 'Din primära annonstext här'],
    ['headline', 'Din headline här'],
    ['description', 'Din beskrivning här']
  ]);
  settingsSheet.getRange('A1:B1').setFontWeight('bold').setBackground('#4285f4').setFontColor('white');
  settingsSheet.setColumnWidth(1, 200);
  settingsSheet.setColumnWidth(2, 400);

  // ===== ADS LOG SHEET =====
  adsLogSheet.getRange('A1:G1').setValues([[
    'Timestamp', 'FileName', 'Type', 'CampaignID', 'AdsetID', 'CreativeID', 'AdID'
  ]]);
  adsLogSheet.getRange('A1:G1').setFontWeight('bold').setBackground('#34a853').setFontColor('white');
  adsLogSheet.setFrozenRows(1);

  // ===== AD COPY SHEET =====
  adCopySheet.getRange('A1:E1').setValues([['Name', 'Primary Text', 'Headline', 'Description', 'Call to Action']]);
  adCopySheet.getRange('A2:E4').setValues([
    ['Default', 'Check out our amazing product!', 'Shop Now', 'Limited time offer', 'SHOP_NOW'],
    ['Sale', 'Big sale - Up to 50% off!', 'Dont Miss Out', 'Ends soon', 'SHOP_NOW'],
    ['New Product', 'Introducing something new', 'See Whats New', 'Be the first to try', 'LEARN_MORE']
  ]);
  adCopySheet.getRange('A1:E1').setFontWeight('bold').setBackground('#fbbc04').setFontColor('black');
  adCopySheet.setFrozenRows(1);
  adCopySheet.setColumnWidth(2, 300);

  SpreadsheetApp.flush();

  SpreadsheetApp.getUi().alert(
    'Setup Complete! ✅\\n\\n' +
    'Ditt Meta Ads sheet är klart med 3 flikar:\\n' +
    '• Settings - Fyll i dina credentials här\\n' +
    '• Ads Log - Ads loggas här automatiskt\\n' +
    '• Ad Copy - Dina annonstext-mallar\\n\\n' +
    'Nästa steg: Fyll i Settings-fliken med dina Meta-värden.'
  );
}
```

7. Klicka **Save** (Ctrl+S eller Cmd+S)
8. Klicka på **Run** ▶️ (play-knappen)
9. Första gången: Klicka **Review permissions** → Välj ditt konto → **Allow**
10. Vänta tills popup-rutan säger "Setup Complete!"
11. Stäng Apps Script-fliken och gå tillbaka till ditt Sheet

**Klart!** Du har nu 3 flikar: Settings, Ads Log, och Ad Copy - alla färdiga!

## Steg 1.2: Skapa Google Drive-mapp

1. Gå till: **https://drive.google.com**
2. Klicka på **+ New** → **New folder**
3. Döp mappen till: **Ad Creatives**
4. Klicka **Create**
5. Öppna mappen du just skapade
6. **VIKTIGT:** Kopiera mappens ID från URL:en:
   - URL ser ut så här: `https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz`
   - Mapp-ID är: `1AbCdEfGhIjKlMnOpQrStUvWxYz`
7. Gå till ditt Google Sheet → Settings-fliken → Klistra in ID:t i raden **drive_folder_id**

## Steg 1.3: Kopiera Sheet-ID

1. Gå tillbaka till ditt Google Sheet
2. Titta på URL:en, den ser ut så här:
   `https://docs.google.com/spreadsheets/d/1XyZ123AbCdEfGhIjKlMnOp/edit`
3. Sheet-ID är delen mellan `/d/` och `/edit`:
   `1XyZ123AbCdEfGhIjKlMnOp`
4. **Spara detta ID** - du behöver det i n8n!

---

# DEL 2: INSTALLERA N8N

Du har två alternativ:

## Alternativ A: n8n Cloud (Enklast - Rekommenderas)

1. Gå till: **https://n8n.io**
2. Klicka på **Get started free**
3. Skapa ett konto med din email
4. Verifiera din email
5. Du får en gratis trial - sedan kostar det ~€20/månad

**Klart!** Du har nu n8n redo att användas.

## Alternativ B: Self-hosted med Docker (Gratis men tekniskt)

Om du vill köra n8n gratis på din egen dator:

### Installera Docker Desktop (Windows)

1. Gå till: **https://docker.com/products/docker-desktop**
2. Klicka **Download for Windows**
3. Kör installationsfilen
4. Starta om datorn när det frågas
5. Öppna Docker Desktop

### Starta n8n

6. Öppna **Kommandotolken** (Windows + cmd)
7. Kör detta kommando:
```
docker run -it --rm --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n n8nio/n8n
```
8. Vänta medan n8n laddas ner och startar
9. Öppna webbläsaren och gå till: **http://localhost:5678**
10. Skapa ett admin-konto

---

# DEL 3: SKAPA META DEVELOPER APP

## Steg 3.1: Gå till Meta for Developers

1. Gå till: **https://developers.facebook.com**
2. Klicka **Logga in** (uppe till höger)
3. Logga in med ditt Facebook-konto

## Steg 3.2: Registrera dig som utvecklare

Om det är första gången:
1. Klicka **Kom igång**
2. Godkänn villkoren
3. Verifiera din email om det behövs

## Steg 3.3: Skapa en App

1. Klicka på **My Apps** (uppe till höger)
2. Klicka på **Create App**
3. Välj **Other** → klicka **Next**
4. Välj **Business** → klicka **Next**
5. Fyll i:
   - App name: `Meta Ads Automation`
   - App contact email: din email
   - Business Account: Välj ditt eller "I don't want to connect"
6. Klicka **Create App**
7. Skriv in ditt Facebook-lösenord

## Steg 3.4: Hitta App ID och App Secret

1. I din app, gå till **Settings** → **Basic** (vänstermenyn)
2. Du ser:
   - **App ID:** `123456789012345` - KOPIERA DETTA!
   - **App Secret:** Klicka "Show" - KOPIERA DETTA!

## Steg 3.5: Generera Access Token

1. Gå till: **https://developers.facebook.com/tools/explorer**
2. I dropdown "Meta App" - välj din app
3. Klicka på **Generate Access Token**
4. Bocka i dessa permissions:
   - ✅ ads_management
   - ✅ ads_read
   - ✅ business_management
   - ✅ pages_show_list
   - ✅ pages_read_engagement
5. Klicka **Generate Access Token**
6. Logga in och godkänn
7. KOPIERA den långa token som visas

## Steg 3.6: Gör token långlivad (60 dagar)

1. Öppna en ny webbläsarflik
2. Gå till denna URL (byt ut värdena):

```
https://graph.facebook.com/v23.0/oauth/access_token?grant_type=fb_exchange_token&client_id=DITT_APP_ID&client_secret=DITT_APP_SECRET&fb_exchange_token=DIN_KORTA_TOKEN
```

3. Du ser ett JSON-svar:
```json
{
  "access_token": "EAAxxxLÅNGLIVADTOKENxxx",
  "token_type": "bearer"
}
```
4. KOPIERA denna nya access_token - den håller i 60 dagar!

## Steg 3.7: Hitta dina IDs

### Ad Account ID:
1. Gå till: **https://adsmanager.facebook.com**
2. Klicka på dropdown-menyn längst upp till vänster
3. Du ser dina ad accounts - notera ID:t (t.ex. `123456789`)
4. Skriv in i Google Sheet: Settings → ad_account_id

### Page ID:
1. Gå till din Facebook-sida
2. Klicka på **About** (Om)
3. Scrolla ner - du ser **Page ID**
4. Skriv in i Google Sheet: Settings → facebook_page_id

### Pixel ID (valfritt):
1. Gå till: **https://business.facebook.com/events_manager**
2. Välj din Pixel
3. Kopiera Pixel ID
4. Skriv in i Google Sheet: Settings → pixel_id

---

# DEL 4: KOPPLA IHOP ALLT I N8N

Nu ska vi importera workflowen och koppla den till dina konton.

## Steg 4.1: Importera workflowen

1. Öppna n8n i webbläsaren
2. Klicka på **+ Add workflow** (eller liknande)
3. Klicka på **⋮** (tre prickar) uppe till höger
4. Välj **Import from JSON**
5. Kopiera HELA JSON-koden nedan och klistra in:

---

## 📋 KOMPLETT WORKFLOW JSON - KOPIERA ALLT NEDAN:

```json
{
  "name": "Meta Ads Automation - Google Sheets Edition",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "weeks",
              "triggerAtDay": [1],
              "triggerAtHour": 10
            }
          ]
        }
      },
      "id": "schedule-trigger",
      "name": "Weekly Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.2,
      "position": [-1200, 300]
    },
    {
      "parameters": {},
      "id": "manual-trigger",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [-1200, 500]
    },
    {
      "parameters": {
        "documentId": {
          "__rl": true,
          "value": "YOUR_SHEET_ID_HERE",
          "mode": "id"
        },
        "sheetName": {
          "__rl": true,
          "value": "Settings",
          "mode": "list"
        },
        "options": {}
      },
      "id": "get-settings",
      "name": "Get Settings",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.5,
      "position": [-980, 400],
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "GOOGLE_CREDENTIAL_ID",
          "name": "Google Sheets"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "ad_account_id",
              "name": "ad_account_id",
              "value": "={{ $json.Value }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "format-settings",
      "name": "Format Settings",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [-760, 400]
    },
    {
      "parameters": {
        "jsCode": "// Convert settings array to object\nconst settings = {};\nfor (const item of $input.all()) {\n  if (item.json.Setting && item.json.Value) {\n    settings[item.json.Setting] = item.json.Value;\n  }\n}\nreturn [{ json: settings }];"
      },
      "id": "settings-to-object",
      "name": "Settings to Object",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [-760, 400]
    },
    {
      "parameters": {
        "resource": "fileFolder",
        "operation": "search",
        "queryString": "=(mimeType='image/jpeg' or mimeType='image/png' or mimeType='video/mp4') and '{{ $json.drive_folder_id }}' in parents and trashed=false",
        "returnAll": true,
        "options": {
          "fields": ["id", "name", "mimeType", "webViewLink", "thumbnailLink"]
        }
      },
      "id": "search-files",
      "name": "Search Drive Files",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3,
      "position": [-520, 400],
      "credentials": {
        "googleDriveOAuth2Api": {
          "id": "GOOGLE_CREDENTIAL_ID",
          "name": "Google Drive"
        }
      }
    },
    {
      "parameters": {
        "operation": "download",
        "fileId": {
          "__rl": true,
          "value": "={{ $json.id }}",
          "mode": "id"
        },
        "options": {}
      },
      "id": "download-file",
      "name": "Download File",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3,
      "position": [-280, 400],
      "credentials": {
        "googleDriveOAuth2Api": {
          "id": "GOOGLE_CREDENTIAL_ID",
          "name": "Google Drive"
        }
      }
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict"
          },
          "conditions": [
            {
              "id": "is-video",
              "leftValue": "={{ $json.mimeType }}",
              "rightValue": "video",
              "operator": {
                "type": "string",
                "operation": "contains"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "is-video",
      "name": "Is Video?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [-40, 400]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "=https://graph-video.facebook.com/v23.0/act_{{ $('Settings to Object').item.json.ad_account_id }}/advideos",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "facebookGraphApi",
        "sendBody": true,
        "contentType": "multipart-form-data",
        "bodyParameters": {
          "parameters": [
            {
              "name": "source",
              "parameterType": "formBinaryData",
              "inputDataFieldName": "data"
            }
          ]
        },
        "options": {}
      },
      "id": "upload-video",
      "name": "Upload Video to Meta",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [200, 300],
      "credentials": {
        "facebookGraphApi": {
          "id": "META_CREDENTIAL_ID",
          "name": "Facebook Graph API"
        }
      }
    },
    {
      "parameters": {
        "method": "POST",
        "url": "=https://graph.facebook.com/v23.0/act_{{ $('Settings to Object').item.json.ad_account_id }}/adimages",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "facebookGraphApi",
        "sendBody": true,
        "contentType": "multipart-form-data",
        "bodyParameters": {
          "parameters": [
            {
              "name": "source",
              "parameterType": "formBinaryData",
              "inputDataFieldName": "data"
            }
          ]
        },
        "options": {}
      },
      "id": "upload-image",
      "name": "Upload Image to Meta",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [200, 500],
      "credentials": {
        "facebookGraphApi": {
          "id": "META_CREDENTIAL_ID",
          "name": "Facebook Graph API"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "video_id",
              "name": "video_id",
              "value": "={{ $json.id }}",
              "type": "string"
            },
            {
              "id": "original_file_name",
              "name": "original_file_name",
              "value": "={{ $('Download File').item.json.name }}",
              "type": "string"
            },
            {
              "id": "thumbnail_url",
              "name": "thumbnail_url",
              "value": "={{ $('Search Drive Files').item.json.thumbnailLink }}",
              "type": "string"
            },
            {
              "id": "media_type",
              "name": "media_type",
              "value": "video",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "set-video-data",
      "name": "Set Video Data",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [440, 300]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "image_hash",
              "name": "image_hash",
              "value": "={{ $json.images[Object.keys($json.images)[0]].hash }}",
              "type": "string"
            },
            {
              "id": "original_file_name",
              "name": "original_file_name",
              "value": "={{ $('Download File').item.json.name }}",
              "type": "string"
            },
            {
              "id": "media_type",
              "name": "media_type",
              "value": "image",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "set-image-data",
      "name": "Set Image Data",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [440, 500]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "=https://graph.facebook.com/v23.0/act_{{ $('Settings to Object').item.json.ad_account_id }}/adcreatives",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "facebookGraphApi",
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"name\": \"{{ $json.original_file_name }}\",\n  \"object_story_spec\": {\n    \"page_id\": \"{{ $('Settings to Object').item.json.facebook_page_id }}\",\n    \"video_data\": {\n      \"video_id\": \"{{ $json.video_id }}\",\n      \"image_url\": \"{{ $json.thumbnail_url }}\",\n      \"message\": \"{{ $('Settings to Object').item.json.primary_text }}\",\n      \"title\": \"{{ $('Settings to Object').item.json.headline }}\",\n      \"call_to_action\": {\n        \"type\": \"LEARN_MORE\",\n        \"value\": {\n          \"link\": \"{{ $('Settings to Object').item.json.website_link }}\"\n        }\n      }\n    }\n  }\n}",
        "options": {}
      },
      "id": "create-video-creative",
      "name": "Create Video Creative",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [680, 300],
      "credentials": {
        "facebookGraphApi": {
          "id": "META_CREDENTIAL_ID",
          "name": "Facebook Graph API"
        }
      }
    },
    {
      "parameters": {
        "method": "POST",
        "url": "=https://graph.facebook.com/v23.0/act_{{ $('Settings to Object').item.json.ad_account_id }}/adcreatives",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "facebookGraphApi",
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"name\": \"{{ $json.original_file_name }}\",\n  \"object_story_spec\": {\n    \"page_id\": \"{{ $('Settings to Object').item.json.facebook_page_id }}\",\n    \"link_data\": {\n      \"image_hash\": \"{{ $json.image_hash }}\",\n      \"link\": \"{{ $('Settings to Object').item.json.website_link }}\",\n      \"message\": \"{{ $('Settings to Object').item.json.primary_text }}\",\n      \"name\": \"{{ $('Settings to Object').item.json.headline }}\",\n      \"call_to_action\": {\n        \"type\": \"LEARN_MORE\"\n      }\n    }\n  }\n}",
        "options": {}
      },
      "id": "create-image-creative",
      "name": "Create Image Creative",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [680, 500],
      "credentials": {
        "facebookGraphApi": {
          "id": "META_CREDENTIAL_ID",
          "name": "Facebook Graph API"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "creative_id",
              "name": "creative_id",
              "value": "={{ $json.id }}",
              "type": "string"
            },
            {
              "id": "original_file_name",
              "name": "original_file_name",
              "value": "={{ $('Set Video Data').item.json.original_file_name }}",
              "type": "string"
            },
            {
              "id": "media_type",
              "name": "media_type",
              "value": "video",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "set-video-creative",
      "name": "Set Video Creative ID",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [920, 300]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "creative_id",
              "name": "creative_id",
              "value": "={{ $json.id }}",
              "type": "string"
            },
            {
              "id": "original_file_name",
              "name": "original_file_name",
              "value": "={{ $('Set Image Data').item.json.original_file_name }}",
              "type": "string"
            },
            {
              "id": "media_type",
              "name": "media_type",
              "value": "image",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "set-image-creative",
      "name": "Set Image Creative ID",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [920, 500]
    },
    {
      "parameters": {
        "mode": "combine",
        "combineBy": "combineAll",
        "options": {}
      },
      "id": "merge-creatives",
      "name": "Merge Creatives",
      "type": "n8n-nodes-base.merge",
      "typeVersion": 3,
      "position": [1160, 400]
    },
    {
      "parameters": {
        "jsCode": "// Only run once to create campaign\nreturn [$input.first()];"
      },
      "id": "run-once",
      "name": "Run Once",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1400, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "=https://graph.facebook.com/v23.0/act_{{ $('Settings to Object').item.json.ad_account_id }}/campaigns",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "facebookGraphApi",
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"name\": \"{{ $('Settings to Object').item.json.campaign_name }}_{{ $now.format('yyyy-MM-dd') }}\",\n  \"objective\": \"OUTCOME_SALES\",\n  \"status\": \"PAUSED\",\n  \"special_ad_categories\": [\"NONE\"]\n}",
        "options": {}
      },
      "id": "create-campaign",
      "name": "Create Campaign",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [1640, 300],
      "credentials": {
        "facebookGraphApi": {
          "id": "META_CREDENTIAL_ID",
          "name": "Facebook Graph API"
        }
      }
    },
    {
      "parameters": {
        "method": "POST",
        "url": "=https://graph.facebook.com/v23.0/act_{{ $('Settings to Object').item.json.ad_account_id }}/adsets",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "facebookGraphApi",
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"name\": \"{{ $('Settings to Object').item.json.campaign_name }}_{{ $now.format('yyyy-MM-dd') }}\",\n  \"campaign_id\": \"{{ $json.id }}\",\n  \"status\": \"PAUSED\",\n  \"daily_budget\": \"{{ $('Settings to Object').item.json.daily_budget }}\",\n  \"billing_event\": \"IMPRESSIONS\",\n  \"optimization_goal\": \"OFFSITE_CONVERSIONS\",\n  \"bid_strategy\": \"LOWEST_COST_WITHOUT_CAP\",\n  \"promoted_object\": {\n    \"pixel_id\": \"{{ $('Settings to Object').item.json.pixel_id }}\",\n    \"custom_event_type\": \"{{ $('Settings to Object').item.json.custom_event_type }}\"\n  },\n  \"targeting\": {\n    \"geo_locations\": {\n      \"countries\": [\"US\"]\n    }\n  }\n}",
        "options": {}
      },
      "id": "create-adset",
      "name": "Create Ad Set",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [1880, 300],
      "credentials": {
        "facebookGraphApi": {
          "id": "META_CREDENTIAL_ID",
          "name": "Facebook Graph API"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "adset_id",
              "name": "adset_id",
              "value": "={{ $json.id }}",
              "type": "string"
            },
            {
              "id": "campaign_id",
              "name": "campaign_id",
              "value": "={{ $('Create Campaign').item.json.id }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "save-adset-id",
      "name": "Save AdSet ID",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [2120, 300]
    },
    {
      "parameters": {
        "mode": "combine",
        "combineBy": "combineAll",
        "options": {}
      },
      "id": "merge-with-adset",
      "name": "Merge with AdSet",
      "type": "n8n-nodes-base.merge",
      "typeVersion": 3,
      "position": [2360, 400]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "=https://graph.facebook.com/v23.0/act_{{ $('Settings to Object').item.json.ad_account_id }}/ads",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "facebookGraphApi",
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"name\": \"{{ $json.original_file_name }}\",\n  \"adset_id\": \"{{ $json.adset_id }}\",\n  \"creative\": {\n    \"creative_id\": \"{{ $json.creative_id }}\"\n  },\n  \"status\": \"PAUSED\"\n}",
        "options": {}
      },
      "id": "create-ad",
      "name": "Create Ad",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [2600, 400],
      "credentials": {
        "facebookGraphApi": {
          "id": "META_CREDENTIAL_ID",
          "name": "Facebook Graph API"
        }
      }
    },
    {
      "parameters": {
        "operation": "append",
        "documentId": {
          "__rl": true,
          "value": "YOUR_SHEET_ID_HERE",
          "mode": "id"
        },
        "sheetName": {
          "__rl": true,
          "value": "Ads Log",
          "mode": "list"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "Timestamp": "={{ $now.format('yyyy-MM-dd HH:mm:ss') }}",
            "FileName": "={{ $('Merge with AdSet').item.json.original_file_name }}",
            "Type": "={{ $('Merge with AdSet').item.json.media_type }}",
            "CampaignID": "={{ $('Merge with AdSet').item.json.campaign_id }}",
            "AdsetID": "={{ $('Merge with AdSet').item.json.adset_id }}",
            "CreativeID": "={{ $('Merge with AdSet').item.json.creative_id }}",
            "AdID": "={{ $json.id }}"
          },
          "schema": [
            {"id": "Timestamp", "displayName": "Timestamp", "required": false, "defaultMatch": false, "display": true, "type": "string", "canBeUsedToMatch": true},
            {"id": "FileName", "displayName": "FileName", "required": false, "defaultMatch": false, "display": true, "type": "string", "canBeUsedToMatch": true},
            {"id": "Type", "displayName": "Type", "required": false, "defaultMatch": false, "display": true, "type": "string", "canBeUsedToMatch": true},
            {"id": "CampaignID", "displayName": "CampaignID", "required": false, "defaultMatch": false, "display": true, "type": "string", "canBeUsedToMatch": true},
            {"id": "AdsetID", "displayName": "AdsetID", "required": false, "defaultMatch": false, "display": true, "type": "string", "canBeUsedToMatch": true},
            {"id": "CreativeID", "displayName": "CreativeID", "required": false, "defaultMatch": false, "display": true, "type": "string", "canBeUsedToMatch": true},
            {"id": "AdID", "displayName": "AdID", "required": false, "defaultMatch": false, "display": true, "type": "string", "canBeUsedToMatch": true}
          ]
        },
        "options": {}
      },
      "id": "log-to-sheet",
      "name": "Log to Google Sheet",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.5,
      "position": [2840, 400],
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "GOOGLE_CREDENTIAL_ID",
          "name": "Google Sheets"
        }
      }
    }
  ],
  "connections": {
    "Weekly Trigger": {
      "main": [[{"node": "Get Settings", "type": "main", "index": 0}]]
    },
    "Manual Trigger": {
      "main": [[{"node": "Get Settings", "type": "main", "index": 0}]]
    },
    "Get Settings": {
      "main": [[{"node": "Settings to Object", "type": "main", "index": 0}]]
    },
    "Settings to Object": {
      "main": [[{"node": "Search Drive Files", "type": "main", "index": 0}]]
    },
    "Search Drive Files": {
      "main": [[{"node": "Download File", "type": "main", "index": 0}]]
    },
    "Download File": {
      "main": [[{"node": "Is Video?", "type": "main", "index": 0}]]
    },
    "Is Video?": {
      "main": [
        [{"node": "Upload Video to Meta", "type": "main", "index": 0}],
        [{"node": "Upload Image to Meta", "type": "main", "index": 0}]
      ]
    },
    "Upload Video to Meta": {
      "main": [[{"node": "Set Video Data", "type": "main", "index": 0}]]
    },
    "Upload Image to Meta": {
      "main": [[{"node": "Set Image Data", "type": "main", "index": 0}]]
    },
    "Set Video Data": {
      "main": [[{"node": "Create Video Creative", "type": "main", "index": 0}]]
    },
    "Set Image Data": {
      "main": [[{"node": "Create Image Creative", "type": "main", "index": 0}]]
    },
    "Create Video Creative": {
      "main": [[{"node": "Set Video Creative ID", "type": "main", "index": 0}]]
    },
    "Create Image Creative": {
      "main": [[{"node": "Set Image Creative ID", "type": "main", "index": 0}]]
    },
    "Set Video Creative ID": {
      "main": [[{"node": "Merge Creatives", "type": "main", "index": 0}]]
    },
    "Set Image Creative ID": {
      "main": [[{"node": "Merge Creatives", "type": "main", "index": 1}]]
    },
    "Merge Creatives": {
      "main": [
        [
          {"node": "Run Once", "type": "main", "index": 0},
          {"node": "Merge with AdSet", "type": "main", "index": 0}
        ]
      ]
    },
    "Run Once": {
      "main": [[{"node": "Create Campaign", "type": "main", "index": 0}]]
    },
    "Create Campaign": {
      "main": [[{"node": "Create Ad Set", "type": "main", "index": 0}]]
    },
    "Create Ad Set": {
      "main": [[{"node": "Save AdSet ID", "type": "main", "index": 0}]]
    },
    "Save AdSet ID": {
      "main": [[{"node": "Merge with AdSet", "type": "main", "index": 1}]]
    },
    "Merge with AdSet": {
      "main": [[{"node": "Create Ad", "type": "main", "index": 0}]]
    },
    "Create Ad": {
      "main": [[{"node": "Log to Google Sheet", "type": "main", "index": 0}]]
    }
  },
  "settings": {
    "executionOrder": "v1"
  },
  "staticData": null,
  "tags": [],
  "triggerCount": 0,
  "updatedAt": "2024-12-01T12:00:00.000Z",
  "versionId": "1"
}
```

---

6. Klicka **Import**
7. Workflowen visas nu i editorn!

## Steg 4.2: Uppdatera Sheet ID i workflowen

1. Hitta noden **"Get Settings"** - dubbelklicka på den
2. I fältet **Document** → byt ut `YOUR_SHEET_ID_HERE` mot ditt Google Sheet-ID
3. Gör samma sak för noden **"Log to Google Sheet"**

## Steg 4.3: Koppla Google-konto

1. Klicka på vilken Google-nod som helst (t.ex. "Get Settings")
2. Under **Credential to connect with** - klicka **Create New**
3. Ett popup-fönster öppnas:
   - Klicka **Sign in with Google**
   - Välj ditt Google-konto
   - Tillåt alla permissions
4. Klicka **Save**
5. Nu är alla Google-noder kopplade!

## Steg 4.4: Koppla Meta-konto

1. Klicka på en Meta-nod (t.ex. "Upload Image to Meta")
2. Under **Credential to connect with** - klicka **Create New**
3. Du behöver fylla i:
   - **Access Token:** Din långlivade token från steg 3.6
4. Klicka **Save**
5. Nu är alla Meta-noder kopplade!

---

# DEL 5: TESTA WORKFLOWEN

## Steg 5.1: Lägg till testbilder i Google Drive

1. Gå till din Google Drive-mapp "Ad Creatives"
2. Ladda upp 2-3 testbilder (JPG eller PNG)

## Steg 5.2: Fyll i Settings i Google Sheet

1. Gå till ditt Google Sheet → Settings-fliken
2. Fyll i alla värden i kolumn B:
   - ad_account_id: ditt ad account ID
   - facebook_page_id: ditt page ID
   - pixel_id: ditt pixel ID (eller lämna tomt)
   - website_link: din webbsidas URL
   - primary_text: Din annonstext
   - headline: Din headline
   - osv...

## Steg 5.3: Kör workflowen!

1. I n8n, se till att din workflow är öppen
2. Klicka på **Test workflow** (eller kör manuellt)
3. Titta på hur varje nod blir grön - det betyder att den lyckades!
4. Om något blir rött - klicka på noden för att se felet

## Steg 5.4: Kolla resultatet

1. Gå till ditt Google Sheet → **Ads Log** fliken
2. Du ska se en ny rad för varje skapad ad!
3. Gå till **https://adsmanager.facebook.com**
4. Du ska se en ny kampanj i PAUSED-status!

---

# 🎉 GRATTIS!

Du har nu:
- ✅ En Google Sheet som dashboard
- ✅ En fungerande n8n workflow
- ✅ Automatisk ad-skapning från Google Drive
- ✅ Loggning av alla skapade ads

---

# FELSÖKNING

## "Invalid OAuth access token"
→ Din Meta-token har gått ut. Skapa en ny enligt steg 3.5-3.6.

## "Permission denied" på Google Drive
→ Se till att du delat mappen, eller kör igenom Google OAuth igen.

## "No files found"
→ Kolla att drive_folder_id är korrekt i Google Sheet.

## Ads skapas inte
→ Kolla att din Meta-app är i "Live" mode (inte Development).

---

# BONUS: Aktivera Schema

Om du vill att workflowen ska köra automatiskt varje vecka:

1. Klicka på noden **"Weekly Trigger"**
2. Ändra dag/tid till när du vill att den ska köra
3. Klicka **Save** på workflowen
4. Klicka **Activate** (toggle uppe till höger)

Nu körs workflowen automatiskt! 🚀
