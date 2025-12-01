# Meta Ads Automation - Komplett Setup Guide

Denna guide tar dig steg för steg genom hela installationen av Meta Ads Automation-systemet.

---

## Innehåll

1. [Förutsättningar](#1-förutsättningar)
2. [Supabase Setup](#2-supabase-setup)
3. [Meta Developer Setup](#3-meta-developer-setup)
4. [Google Cloud Setup](#4-google-cloud-setup)
5. [AI Services Setup](#5-ai-services-setup-valfritt)
6. [Konfigurera Miljövariabler](#6-konfigurera-miljövariabler)
7. [Starta Applikationen](#7-starta-applikationen)
8. [Första Konfigurationen](#8-första-konfigurationen)
9. [Testa Workflowen](#9-testa-workflowen)

---

## 1. Förutsättningar

Innan du börjar, se till att du har:

- [ ] Node.js 18+ installerat
- [ ] Git installerat
- [ ] En webbläsare
- [ ] Ett Facebook Business Manager-konto med minst ett Ad Account
- [ ] Ett Google-konto
- [ ] (Valfritt) OpenAI-konto för AI-analys
- [ ] (Valfritt) Google AI Studio-konto för video-analys

---

## 2. Supabase Setup

### Steg 2.1: Skapa ett Supabase-projekt

1. Gå till [supabase.com](https://supabase.com)
2. Klicka **"Start your project"**
3. Logga in med GitHub (eller skapa konto)
4. Klicka **"New Project"**
5. Fyll i:
   - **Name:** `meta-ads-automation`
   - **Database Password:** Välj ett starkt lösenord (spara detta!)
   - **Region:** Välj närmast dig (t.ex. Frankfurt för EU)
6. Klicka **"Create new project"**
7. Vänta ca 2 minuter medan projektet skapas

### Steg 2.2: Hämta dina API-nycklar

1. När projektet är klart, gå till **Settings** (kugghjulet) → **API**
2. Under "Project URL", kopiera URL:en:
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
3. Under "Project API keys", kopiera **anon public** nyckeln:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Kopiera också **service_role** nyckeln (för server-side operationer)

**Spara dessa värden! Du behöver dem senare.**

### Steg 2.3: Skapa databastabellerna

1. I Supabase, gå till **SQL Editor** (i vänstermenyn)
2. Klicka **"New query"**
3. Kopiera HELA innehållet från filen `lib/database/schema.sql` i ditt projekt
4. Klistra in i SQL Editor
5. Klicka **"Run"** (eller Cmd/Ctrl + Enter)
6. Du ska se "Success. No rows returned" - det betyder att det fungerade!

**Verifiera:**
- Gå till **Table Editor** i vänstermenyn
- Du ska nu se tabeller som: `ad_accounts`, `assets`, `jobs`, `campaigns`, etc.

---

## 3. Meta Developer Setup

### Steg 3.1: Skapa ett Meta Developer-konto

1. Gå till [developers.facebook.com](https://developers.facebook.com)
2. Klicka **"Get Started"** uppe till höger
3. Logga in med ditt Facebook-konto
4. Godkänn villkoren

### Steg 3.2: Skapa en App

1. Gå till **"My Apps"** i toppmenyn
2. Klicka **"Create App"**
3. Välj **"Other"** → **"Next"**
4. Välj **"Business"** som app-typ → **"Next"**
5. Fyll i:
   - **App name:** `Meta Ads Automation`
   - **Contact email:** Din email
   - **Business Account:** Välj ditt Business Manager-konto (eller skapa ett)
6. Klicka **"Create App"**

### Steg 3.3: Lägg till Marketing API

1. I din nya app, scrolla ner till **"Add products to your app"**
2. Hitta **"Marketing API"** och klicka **"Set up"**
3. Gå till **Tools** → **Graph API Explorer** (i vänstermenyn)

### Steg 3.4: Generera Access Token

1. I **Graph API Explorer** (https://developers.facebook.com/tools/explorer/)
2. Välj din app i dropdown-menyn **"Meta App"**
3. Klicka **"Generate Access Token"**
4. Välj följande permissions (bocka i dessa):
   - `ads_management`
   - `ads_read`
   - `business_management`
   - `pages_read_engagement`
   - `pages_show_list`
5. Klicka **"Generate Access Token"**
6. Logga in och godkänn alla permissions
7. Kopiera den långa token som visas

**OBS! Denna token är kortlivad (ca 1 timme).**

### Steg 3.5: Skapa en långlivad token

1. Gå till din app → **Settings** → **Basic**
2. Kopiera **App ID** och **App Secret** (klicka "Show")
3. Öppna denna URL i webbläsaren (byt ut värdena):

```
https://graph.facebook.com/v23.0/oauth/access_token?grant_type=fb_exchange_token&client_id=DITT_APP_ID&client_secret=DITT_APP_SECRET&fb_exchange_token=DIN_KORTLIVADE_TOKEN
```

4. Du får tillbaka en JSON med en ny `access_token` - denna är långlivad (~60 dagar)
5. **Spara denna token!**

### Steg 3.6: Hitta dina Meta IDs

**Ad Account ID:**
1. Gå till [Business Manager](https://business.facebook.com)
2. Gå till **Business Settings** → **Accounts** → **Ad Accounts**
3. Klicka på ditt ad account
4. Kopiera **Ad Account ID** (ser ut som: `123456789012345`)

**Page ID:**
1. Gå till **Business Settings** → **Accounts** → **Pages**
2. Klicka på din sida
3. Kopiera **Page ID**

**Pixel ID (valfritt men rekommenderat):**
1. Gå till **Events Manager** (i Business Manager)
2. Välj din Pixel
3. Kopiera **Pixel ID**

---

## 4. Google Cloud Setup

### Steg 4.1: Skapa ett Google Cloud-projekt

1. Gå till [console.cloud.google.com](https://console.cloud.google.com)
2. Logga in med ditt Google-konto
3. Klicka på projektväljaren uppe till vänster
4. Klicka **"New Project"**
5. Fyll i:
   - **Project name:** `meta-ads-automation`
6. Klicka **"Create"**
7. Vänta tills projektet skapas och välj det

### Steg 4.2: Aktivera Google Drive API

1. Gå till **APIs & Services** → **Library**
2. Sök efter **"Google Drive API"**
3. Klicka på den och sedan **"Enable"**

### Steg 4.3: Skapa OAuth Credentials

1. Gå till **APIs & Services** → **Credentials**
2. Klicka **"Create Credentials"** → **"OAuth client ID"**
3. Om du får en varning om "consent screen":
   - Klicka **"Configure Consent Screen"**
   - Välj **"External"** → **"Create"**
   - Fyll i:
     - App name: `Meta Ads Automation`
     - User support email: Din email
     - Developer contact: Din email
   - Klicka **"Save and Continue"** genom alla steg
   - Gå tillbaka till Credentials

4. Klicka **"Create Credentials"** → **"OAuth client ID"**
5. Välj **"Web application"**
6. Fyll i:
   - **Name:** `Meta Ads Web Client`
   - **Authorized redirect URIs:** Lägg till `http://localhost:3000/api/auth/callback/google`
7. Klicka **"Create"**
8. Kopiera **Client ID** och **Client Secret**

### Steg 4.4: Få en Refresh Token (Avancerat)

För att få en långlivad Google-token behöver du göra OAuth-flödet manuellt:

1. Öppna denna URL i webbläsaren (byt ut CLIENT_ID):

```
https://accounts.google.com/o/oauth2/v2/auth?client_id=DITT_CLIENT_ID&redirect_uri=http://localhost:3000/api/auth/callback/google&response_type=code&scope=https://www.googleapis.com/auth/drive.readonly&access_type=offline&prompt=consent
```

2. Logga in och godkänn
3. Du blir redirectad till localhost med en `code` parameter
4. Kopiera koden från URL:en
5. Kör detta i terminalen (byt ut värdena):

```bash
curl -X POST https://oauth2.googleapis.com/token \
  -d "client_id=DITT_CLIENT_ID" \
  -d "client_secret=DITT_CLIENT_SECRET" \
  -d "code=KODEN_DU_FICK" \
  -d "grant_type=authorization_code" \
  -d "redirect_uri=http://localhost:3000/api/auth/callback/google"
```

6. Du får tillbaka JSON med `access_token` och `refresh_token`
7. **Spara båda!**

---

## 5. AI Services Setup (Valfritt)

AI-analys är valfritt men ger dig automatiskt genererade ad-texter och insikter.

### Steg 5.1: OpenAI API Key (för bildanalys)

1. Gå till [platform.openai.com](https://platform.openai.com)
2. Skapa konto eller logga in
3. Gå till **API Keys** (i vänstermenyn)
4. Klicka **"Create new secret key"**
5. Namnge den: `meta-ads-automation`
6. Kopiera nyckeln (börjar med `sk-...`)
7. **Spara denna!** Den visas bara en gång.

**OBS:** OpenAI kräver betalmetod. GPT-4 Vision kostar ca $0.01-0.03 per bild.

### Steg 5.2: Google AI (Gemini) API Key (för videoanalys)

1. Gå till [makersuite.google.com](https://makersuite.google.com)
2. Logga in med ditt Google-konto
3. Klicka **"Get API Key"** (eller gå till API Keys)
4. Klicka **"Create API Key"**
5. Välj ditt Google Cloud-projekt
6. Kopiera API-nyckeln

---

## 6. Konfigurera Miljövariabler

### Steg 6.1: Skapa .env.local

1. I projektmappen, skapa filen `.env.local`
2. Kopiera in detta och fyll i dina värden:

```env
# ===========================================
# SUPABASE
# ===========================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ===========================================
# META / FACEBOOK
# ===========================================
META_APP_ID=123456789012345
META_APP_SECRET=abcdef1234567890abcdef
META_ACCESS_TOKEN=EAAG...din-långa-token...

# ===========================================
# GOOGLE
# ===========================================
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
GOOGLE_REFRESH_TOKEN=1//0abc...

# ===========================================
# AI SERVICES (Valfritt)
# ===========================================
OPENAI_API_KEY=sk-...
GOOGLE_AI_API_KEY=AIza...

# ===========================================
# APP
# ===========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Steg 6.2: Verifiera att .env.local inte committas

Kör detta i terminalen för att dubbelkolla:

```bash
git status
```

`.env.local` ska INTE visas i listan (den är gitignored).

---

## 7. Starta Applikationen

### Steg 7.1: Installera dependencies

```bash
npm install
```

### Steg 7.2: Starta utvecklingsservern

```bash
npm run dev
```

### Steg 7.3: Öppna i webbläsaren

Gå till: [http://localhost:3000](http://localhost:3000)

Du ska se login-sidan. Skapa ett konto eller logga in.

---

## 8. Första Konfigurationen

### Steg 8.1: Lägg till ditt Ad Account

1. Gå till **Settings** (i sidomenyn)
2. Klicka **"Add Account"**
3. Fyll i:
   - **Account Name:** T.ex. "Mitt Företag"
   - **Meta Ad Account ID:** Din ad account ID (utan "act_")
   - **Facebook Page ID:** Din page ID
   - **Pixel ID:** (valfritt) Din pixel ID
   - **Access Token:** Din långlivade Meta-token
4. Klicka **"Add Account"**

### Steg 8.2: Lägg till en Google Drive-mapp

1. Gå till **Settings** → **Drive Folders** tab
2. Klicka **"Add Folder"**
3. Fyll i:
   - **Folder Name:** T.ex. "Creative Assets"
   - **Google Drive Folder URL:** Klistra in länken till din mapp
4. Klicka **"Add Folder"**

### Steg 8.3: Konfigurera Preferences (valfritt)

1. Gå till **Settings** → **Preferences** tab
2. Fyll i:
   - **Default Destination URL:** Var ska ads länka?
   - **Default Daily Budget:** Budget i cents (500 = $5)
   - **Slack Webhook:** För notifikationer

---

## 9. Testa Workflowen

### Steg 9.1: Lägg till test-bilder i Google Drive

1. Gå till din Google Drive-mapp
2. Ladda upp 2-3 testbilder (JPG eller PNG)

### Steg 9.2: Synka mappen

1. Gå till **Dashboard** i appen
2. Klicka **"Sync Drive Folder"**
3. Välj din mapp och account
4. Klicka **"Start Job"**

### Steg 9.3: Kolla statusen

1. Gå till **Jobs**
2. Du ska se ditt jobb köras
3. När det är klart, gå till **Assets**
4. Du ska se dina bilder importerade

### Steg 9.4: Skapa Ads

1. Gå till **Upload** (eller klicka "New Upload" i sidomenyn)
2. Gå igenom wizard-stegen:
   - Välj källa (din mapp)
   - Välj ad account
   - Konfigurera campaign-inställningar
   - Granska och starta
3. Jobbet körs och skapar ads i Meta

### Steg 9.5: Verifiera i Meta Ads Manager

1. Gå till [adsmanager.facebook.com](https://adsmanager.facebook.com)
2. Du ska se en ny kampanj i PAUSED-status
3. Granska och aktivera när du är redo!

---

## Felsökning

### "Invalid access token"
- Din Meta-token har gått ut
- Generera en ny enligt Steg 3.4-3.5

### "Google Drive permission denied"
- Kontrollera att Drive API är aktiverat
- Verifiera att din refresh token är korrekt
- Kör OAuth-flödet igen

### "Supabase error"
- Kontrollera att alla tabeller skapades
- Verifiera dina API-nycklar i .env.local

### Ads skapas inte
- Kontrollera att Meta-appen är i "Live" mode (inte Development)
- Verifiera att du har rätt permissions på din token

---

## Nästa Steg

När allt fungerar kan du:

1. **Schemalägga automatisk sync** - Lägg till cron-jobb
2. **Aktivera AI-analys** - Få automatiska ad-texter
3. **Sätta upp Slack-notifikationer** - Bli notifierad när ads skapas
4. **Skala upp** - Lägg till fler ad accounts och mappar

---

## Behöver du hjälp?

Om du kör fast på något steg, beskriv:
1. Vilket steg du är på
2. Vad du försöker göra
3. Vilket felmeddelande du får (om något)

Lycka till! 🚀
