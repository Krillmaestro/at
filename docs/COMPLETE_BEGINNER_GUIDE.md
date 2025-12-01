# Meta Ads Automation - KOMPLETT Nybörjarguide

**Denna guide förutsätter att du INTE har något installerat och aldrig gjort något liknande förut.**

Jag förklarar varje steg, varje klick, varje hemsida.

---

# DEL 1: INSTALLERA ALLT PÅ DIN DATOR

---

## Steg 1.1: Installera Node.js (JavaScript-motorn)

Node.js är programmet som kör vår app. Du måste installera det först.

### Gå till nedladdningssidan

1. Öppna din webbläsare (Chrome, Edge, Firefox - spelar ingen roll)
2. Skriv in i adressfältet: **https://nodejs.org**
3. Tryck **Enter**

### Ladda ner Node.js

4. Du ser nu Node.js hemsida
5. Du ser två gröna knappar:
   - Vänster knapp: "LTS" (Long Term Support) - **KLICKA PÅ DENNA**
   - Höger knapp: "Current" - (klicka INTE på denna)
6. En fil börjar laddas ner (heter något som `node-v20.x.x-x64.msi`)
7. Vänta tills nedladdningen är klar

### Installera Node.js

8. Öppna mappen **Nedladdningar** (Downloads) på din dator
   - Tryck **Windows-tangenten + E** för att öppna Utforskaren
   - Klicka på **Nedladdningar** i vänstermenyn
9. Dubbelklicka på filen **node-v20.x.x-x64.msi**
10. Ett installationsfönster öppnas
11. Klicka **Next**
12. Bocka i rutan **"I accept the terms in the License Agreement"**
13. Klicka **Next**
14. Klicka **Next** (behåll standardmappen)
15. Klicka **Next** (behåll standardinställningar)
16. Klicka **Install**
17. Om Windows frågar "Vill du tillåta att denna app gör ändringar?" - klicka **Ja**
18. Vänta medan installationen körs
19. Klicka **Finish**

### Verifiera att Node.js är installerat

20. Tryck **Windows-tangenten** på tangentbordet
21. Skriv: **cmd**
22. Klicka på **Kommandotolken** (Command Prompt)
23. Ett svart fönster öppnas
24. Skriv in: `node --version` och tryck **Enter**
25. Du ska se något som: `v20.10.0` (siffrorna kan variera)
26. Om du ser detta - **GRATTIS! Node.js är installerat!**

---

## Steg 1.2: Installera Git (Versionshantering)

Git är ett program för att hantera kod och ladda ner projekt.

### Gå till nedladdningssidan

1. Öppna webbläsaren
2. Gå till: **https://git-scm.com**
3. Klicka på **Download for Windows** (stor knapp till höger)

### Ladda ner Git

4. Sidan tar dig automatiskt till nedladdning
5. Klicka på **"Click here to download"** länken
6. En fil börjar laddas ner (heter något som `Git-2.x.x-64-bit.exe`)
7. Vänta tills nedladdningen är klar

### Installera Git

8. Gå till mappen **Nedladdningar**
9. Dubbelklicka på filen **Git-2.x.x-64-bit.exe**
10. Om Windows frågar om tillåtelse - klicka **Ja**
11. Klicka **Next** (7-8 gånger, behåll alla standardinställningar)
12. Klicka **Install**
13. Vänta medan installationen körs
14. Klicka **Finish**

### Verifiera att Git är installerat

15. Öppna **Kommandotolken** igen (Windows-tangent → skriv "cmd" → Enter)
16. Skriv: `git --version` och tryck **Enter**
17. Du ska se något som: `git version 2.42.0.windows.1`
18. Om du ser detta - **Git är installerat!**

---

## Steg 1.3: Installera Visual Studio Code (Kodredigerare)

VS Code är programmet där du ser och redigerar koden.

### Gå till nedladdningssidan

1. Gå till: **https://code.visualstudio.com**
2. Klicka på den stora blå knappen **"Download for Windows"**

### Ladda ner och installera

3. Filen laddas ner (heter något som `VSCodeUserSetup-x64-1.x.x.exe`)
4. Gå till **Nedladdningar** och dubbelklicka på filen
5. Godkänn licensavtalet - klicka **Next**
6. Klicka **Next** (behåll standardmapp)
7. Klicka **Next**
8. **VIKTIGT:** Bocka i dessa rutor:
   - ☑️ "Add to PATH"
   - ☑️ "Add 'Open with Code' action to Windows Explorer file context menu"
   - ☑️ "Add 'Open with Code' action to Windows Explorer directory context menu"
9. Klicka **Next**
10. Klicka **Install**
11. Vänta medan installationen körs
12. Bocka i "Launch Visual Studio Code"
13. Klicka **Finish**

VS Code öppnas nu. Du kan stänga det för nu.

---

## Steg 1.4: Skapa en projektmapp

Nu ska vi skapa en mapp där projektet ska ligga.

1. Tryck **Windows-tangenten + E** för att öppna Utforskaren
2. Klicka på **Dokument** i vänstermenyn
3. Högerklicka på en tom yta i mappens innehåll
4. Välj **Nytt** → **Mapp**
5. Döp mappen till: **meta-ads-projekt**
6. Tryck **Enter**

Du har nu en tom mapp: `C:\Users\DITTNAMN\Documents\meta-ads-projekt`

---

# DEL 2: SKAPA KONTON PÅ ALLA TJÄNSTER

Nu ska vi skapa konton på alla tjänster vi behöver.

---

## Steg 2.1: Skapa GitHub-konto (Kodlagring)

GitHub är där kod lagras och delas.

### Gå till GitHub

1. Öppna webbläsaren
2. Gå till: **https://github.com**
3. Klicka på **Sign up** (uppe till höger)

### Skapa konto

4. Skriv in din **email-adress**
5. Klicka **Continue**
6. Skapa ett **lösenord** (minst 8 tecken, en siffra, en liten bokstav)
7. Klicka **Continue**
8. Välj ett **användarnamn** (t.ex. dittnamn123)
9. Klicka **Continue**
10. Skriv **n** (för att inte få reklam-email)
11. Klicka **Continue**
12. Lös CAPTCHA-pusslet (klicka på rätt bilder)
13. Klicka **Create account**
14. Kolla din email - du får en kod
15. Skriv in koden på GitHub-sidan
16. Klicka **Continue**

**Klart! Du har nu ett GitHub-konto.**

---

## Steg 2.2: Skapa Supabase-konto (Databas)

Supabase är vår databas där all data sparas.

### Gå till Supabase

1. Gå till: **https://supabase.com**
2. Klicka på **Start your project** (grön knapp)

### Logga in med GitHub

3. Klicka på **Continue with GitHub**
4. Om du inte är inloggad på GitHub - logga in
5. Klicka **Authorize Supabase**

### Skapa ett nytt projekt

6. Du är nu inne i Supabase Dashboard
7. Klicka på **New project** (grön knapp)
8. Om du måste skapa en organisation först:
   - Skriv organisationsnamn: **mitt-foretag** (eller vad du vill)
   - Klicka **Create organization**
9. Nu ser du "Create a new project" formuläret:

Fyll i:
```
Name:               meta-ads-automation
Database Password:  [SKRIV ETT STARKT LÖSENORD - SPARA DETTA!]
Region:             West EU (Frankfurt) - eller närmast dig
```

10. Klicka **Create new project**
11. Vänta 1-2 minuter medan projektet skapas (du ser en laddningsindikator)

### Hämta dina API-nycklar

12. När projektet är klart ser du Dashboard
13. I vänstermenyn, klicka på **kugghjulet (Settings)** längst ner
14. Klicka på **API** (under Configuration)
15. Du ser nu tre viktiga saker:

**Project URL:**
```
https://xyzxyzxyz.supabase.co
```
📋 Kopiera denna och spara i en textfil!

**anon public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx...
```
📋 Kopiera denna och spara i textfilen!

**service_role key:** (klicka på ögat för att visa)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.yyyyy...
```
📋 Kopiera denna och spara i textfilen!

### Skapa databastabellerna

16. I vänstermenyn, klicka på **SQL Editor** (ikonen som ser ut som en cylinder)
17. Klicka på **New query** (uppe till höger)
18. Du ser nu ett tomt textfält

Nu behöver du klistra in SQL-koden. Jag ger dig den här:

---

**KOPIERA ALLT MELLAN LINJERNA OCH KLISTRA IN I SQL EDITOR:**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- AD ACCOUNTS
CREATE TABLE ad_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  meta_account_id TEXT NOT NULL,
  meta_page_id TEXT NOT NULL,
  meta_pixel_id TEXT,
  meta_instagram_id TEXT,
  access_token TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, meta_account_id)
);

-- DRIVE FOLDERS
CREATE TABLE drive_folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_account_id UUID REFERENCES ad_accounts(id) ON DELETE CASCADE,
  folder_id TEXT NOT NULL,
  folder_name TEXT,
  watch_enabled BOOLEAN DEFAULT false,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, folder_id)
);

-- ASSETS
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  drive_folder_id UUID REFERENCES drive_folders(id) ON DELETE SET NULL,
  drive_file_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER,
  thumbnail_url TEXT,
  web_view_link TEXT,
  meta_asset_id TEXT,
  meta_asset_hash TEXT,
  ai_analysis JSONB,
  ai_suggested_copy JSONB,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, drive_file_id)
);

-- CAMPAIGNS
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_account_id UUID REFERENCES ad_accounts(id) ON DELETE CASCADE,
  meta_campaign_id TEXT,
  name TEXT NOT NULL,
  objective TEXT DEFAULT 'OUTCOME_SALES',
  special_ad_categories TEXT[] DEFAULT ARRAY['NONE'],
  status TEXT DEFAULT 'PAUSED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AD SETS
CREATE TABLE ad_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  meta_adset_id TEXT,
  name TEXT NOT NULL,
  daily_budget INTEGER DEFAULT 500,
  lifetime_budget INTEGER,
  optimization_goal TEXT DEFAULT 'OFFSITE_CONVERSIONS',
  billing_event TEXT DEFAULT 'IMPRESSIONS',
  bid_strategy TEXT DEFAULT 'LOWEST_COST_WITHOUT_CAP',
  pixel_id TEXT,
  custom_event_type TEXT DEFAULT 'ADD_TO_CART',
  targeting JSONB DEFAULT '{"geo_locations": {"countries": ["US"]}}',
  status TEXT DEFAULT 'PAUSED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREATIVES
CREATE TABLE creatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_account_id UUID REFERENCES ad_accounts(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
  meta_creative_id TEXT,
  name TEXT NOT NULL,
  primary_text TEXT,
  headline TEXT,
  description TEXT,
  call_to_action TEXT DEFAULT 'LEARN_MORE',
  destination_url TEXT,
  creative_type TEXT DEFAULT 'single_image',
  object_story_spec JSONB,
  additional_asset_ids UUID[],
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ADS
CREATE TABLE ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_set_id UUID REFERENCES ad_sets(id) ON DELETE CASCADE,
  creative_id UUID REFERENCES creatives(id) ON DELETE SET NULL,
  meta_ad_id TEXT,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'PAUSED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- JOBS
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_account_id UUID REFERENCES ad_accounts(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  total_items INTEGER DEFAULT 0,
  completed_items INTEGER DEFAULT 0,
  failed_items INTEGER DEFAULT 0,
  config JSONB DEFAULT '{}',
  result JSONB,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- JOB ITEMS
CREATE TABLE job_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending',
  step TEXT,
  error_message TEXT,
  meta_ids JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SETTINGS
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  default_ad_account_id UUID REFERENCES ad_accounts(id) ON DELETE SET NULL,
  default_daily_budget INTEGER DEFAULT 500,
  default_optimization_goal TEXT DEFAULT 'OFFSITE_CONVERSIONS',
  default_custom_event_type TEXT DEFAULT 'ADD_TO_CART',
  default_targeting JSONB DEFAULT '{"geo_locations": {"countries": ["US"]}}',
  default_destination_url TEXT,
  default_call_to_action TEXT DEFAULT 'LEARN_MORE',
  slack_webhook_url TEXT,
  email_notifications BOOLEAN DEFAULT true,
  auto_analyze_assets BOOLEAN DEFAULT true,
  use_ai_copy_suggestions BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ACTIVITY LOG
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE ad_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE drive_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE creatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users access own ad_accounts" ON ad_accounts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own drive_folders" ON drive_folders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own assets" ON assets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own campaigns" ON campaigns FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own ad_sets" ON ad_sets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own creatives" ON creatives FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own ads" ON ads FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own jobs" ON jobs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own job_items" ON job_items FOR ALL USING (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_items.job_id AND jobs.user_id = auth.uid())
);
CREATE POLICY "Users access own settings" ON settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own activity_log" ON activity_log FOR ALL USING (auth.uid() = user_id);
```

---

19. Efter att du klistrat in koden, klicka på **Run** (grön knapp uppe till höger)
    - Eller tryck **Ctrl + Enter**
20. Du ska se meddelandet: **"Success. No rows returned"**
21. Det betyder att alla tabeller skapades!

### Verifiera att tabellerna finns

22. I vänstermenyn, klicka på **Table Editor** (ikonen som ser ut som en tabell)
23. Du ska nu se en lista med tabeller:
    - ad_accounts
    - ads
    - ad_sets
    - assets
    - campaigns
    - creatives
    - drive_folders
    - job_items
    - jobs
    - settings
    - activity_log

**Om du ser alla dessa tabeller - SUPABASE ÄR KLART! ✅**

---

## Steg 2.3: Skapa Meta Developer-konto

Meta Developer är där vi får tillgång till Facebook/Instagram Ads API.

### Förutsättning

**Du måste ha:**
- Ett Facebook-konto
- En Facebook-sida (för företag)
- Tillgång till ett Facebook Ads-konto

Om du inte har en Facebook-sida:
1. Gå till facebook.com
2. Klicka på ditt namn uppe till höger
3. Klicka på "Se alla profiler"
4. Klicka på "Skapa sida"
5. Följ instruktionerna

### Gå till Meta for Developers

1. Gå till: **https://developers.facebook.com**
2. Klicka på **Logga in** (uppe till höger)
3. Logga in med ditt Facebook-konto
4. Om du aldrig registrerat dig som utvecklare:
   - Klicka **Kom igång** (Get Started)
   - Godkänn villkoren
   - Verifiera din email om det behövs

### Skapa en App

5. Klicka på **My Apps** i toppmenyn
6. Klicka på **Create App** (grön knapp)
7. Du får frågan "What do you want your app to do?"
   - Välj **Other** → klicka **Next**
8. Välj app-typ:
   - Välj **Business** → klicka **Next**
9. Fyll i app-detaljer:
```
App name:           Meta Ads Automation
App contact email:  din@email.com
Business Account:   Välj ditt Business Manager-konto (eller "I don't want to connect...")
```
10. Klicka **Create App**
11. Ange ditt Facebook-lösenord om det frågas
12. Du är nu inne i din apps Dashboard

### Lägg till Marketing API

13. Scrolla ner på Dashboard-sidan
14. Hitta **"Add products to your app"**
15. Hitta **Marketing API** i listan
16. Klicka **Set up** på Marketing API-kortet
17. Marketing API är nu tillagd!

### Hitta din App ID och App Secret

18. I vänstermenyn, klicka på **Settings** → **Basic**
19. Du ser nu:

**App ID:**
```
123456789012345
```
📋 Kopiera och spara i din textfil!

**App Secret:** (klicka "Show" för att visa)
```
abcdef1234567890abcdef1234567890
```
📋 Kopiera och spara i din textfil!

### Generera Access Token

20. Gå till: **https://developers.facebook.com/tools/explorer**
21. Uppe till höger, se till att din app är vald i dropdown-menyn "Meta App"
22. Klicka på **Generate Access Token** (blå knapp)
23. Ett popup-fönster öppnas - du ska välja permissions:
24. Bocka i dessa permissions:
    - ☑️ ads_management
    - ☑️ ads_read
    - ☑️ business_management
    - ☑️ pages_show_list
    - ☑️ pages_read_engagement
25. Klicka **Generate Access Token**
26. Logga in/godkänn om det frågas
27. Du ser nu en lång token i fältet "Access Token":
```
EAAGxxxxxx...väldigt_lång_sträng...xxxxZD
```
📋 Kopiera hela denna token!

**VIKTIGT:** Denna token är KORTLIVAD (1-2 timmar). Vi ska göra den långlivad.

### Skapa långlivad token

28. Öppna en ny flik i webbläsaren
29. Klistra in denna URL (men ERSÄTT de tre värdena):

```
https://graph.facebook.com/v23.0/oauth/access_token?grant_type=fb_exchange_token&client_id=DIN_APP_ID&client_secret=DIN_APP_SECRET&fb_exchange_token=DIN_KORTA_TOKEN
```

**Exempel:**
```
https://graph.facebook.com/v23.0/oauth/access_token?grant_type=fb_exchange_token&client_id=123456789012345&client_secret=abcdef1234567890abcdef1234567890&fb_exchange_token=EAAGxxxxxx...
```

30. Tryck **Enter**
31. Du ser JSON-svar som detta:
```json
{
  "access_token": "EAAGxxxxxxNY_LÅNGLIVAD_TOKENxxxxxxZD",
  "token_type": "bearer",
  "expires_in": 5183944
}
```

32. Kopiera värdet för **access_token** - detta är din LÅNGLIVADE token (60 dagar)!
📋 Spara denna i din textfil!

### Hitta ditt Ad Account ID

33. Gå till: **https://business.facebook.com/settings**
34. Om du har flera Business Manager-konton, välj rätt
35. I vänstermenyn, klicka på **Accounts** → **Ad Accounts**
36. Du ser dina ad accounts listade
37. Klicka på ett ad account
38. Till höger ser du **Ad Account ID**:
```
123456789012345
```
📋 Kopiera och spara! (OBS: spara UTAN "act_" prefix)

### Hitta ditt Page ID

39. I samma Business Settings, klicka på **Accounts** → **Pages**
40. Klicka på din Facebook-sida
41. Du ser **Page ID**:
```
109876543210987
```
📋 Kopiera och spara!

### Hitta ditt Pixel ID (valfritt men rekommenderat)

42. Gå till: **https://business.facebook.com/events_manager**
43. I vänstermenyn, välj **Data sources**
44. Klicka på din Pixel
45. Du ser **Pixel ID** (eller Dataset ID):
```
123456789012345
```
📋 Kopiera och spara!

**META SETUP ÄR KLART! ✅**

---

## Steg 2.4: Skapa Google Cloud-projekt

Google Cloud ger oss tillgång till Google Drive API.

### Gå till Google Cloud Console

1. Gå till: **https://console.cloud.google.com**
2. Logga in med ditt Google-konto
3. Första gången måste du godkänna villkoren:
   - Bocka i "I agree to..."
   - Välj ditt land
   - Klicka **Agree and Continue**

### Skapa ett projekt

4. Klicka på dropdown-menyn längst upp (står "Select a project" eller ett projektnamn)
5. I popup-fönstret, klicka på **New Project** (uppe till höger)
6. Fyll i:
```
Project name:   meta-ads-automation
Location:       No organization (eller din organisation om du har en)
```
7. Klicka **Create**
8. Vänta några sekunder
9. Klicka på notifikationen "Select Project" när den visas, ELLER:
   - Klicka på projekt-dropdown igen
   - Välj **meta-ads-automation**

### Aktivera Google Drive API

10. I vänstermenyn, klicka på **APIs & Services**
11. Klicka på **+ Enable APIs and Services** (blå knapp uppe)
12. I sökfältet, skriv: **Google Drive API**
13. Klicka på **Google Drive API** i sökresultaten
14. Klicka på **Enable** (blå knapp)
15. Vänta några sekunder

### Skapa OAuth Consent Screen

Innan vi kan skapa credentials måste vi konfigurera consent screen.

16. I vänstermenyn, klicka på **OAuth consent screen**
17. Välj **External** (om du inte har Google Workspace)
18. Klicka **Create**
19. Fyll i:
```
App name:               Meta Ads Automation
User support email:     din@email.com
Developer contact:      din@email.com
```
20. Klicka **Save and Continue**
21. På "Scopes" sidan - klicka bara **Save and Continue** (vi lägger till scopes senare)
22. På "Test users" sidan - klicka **Add Users**
23. Lägg till din egen email-adress
24. Klicka **Add**
25. Klicka **Save and Continue**
26. Klicka **Back to Dashboard**

### Skapa OAuth Credentials

27. I vänstermenyn, klicka på **Credentials**
28. Klicka på **+ Create Credentials** (uppe)
29. Välj **OAuth client ID**
30. Application type: Välj **Web application**
31. Fyll i:
```
Name:   Meta Ads Web Client
```
32. Under **Authorized redirect URIs**, klicka **+ Add URI**
33. Lägg till:
```
http://localhost:3000/api/auth/callback/google
```
34. Klicka **Create**
35. Ett popup-fönster visar dina credentials:

**Client ID:**
```
123456789-abcdefghijk.apps.googleusercontent.com
```
📋 Kopiera och spara!

**Client Secret:**
```
GOCSPX-abcdefghijklmnop
```
📋 Kopiera och spara!

36. Klicka **OK**

### Få en Refresh Token

Nu behöver vi få en refresh token. Detta är lite mer avancerat.

37. Öppna denna URL i webbläsaren (ERSÄTT client_id):

```
https://accounts.google.com/o/oauth2/v2/auth?client_id=DIN_CLIENT_ID&redirect_uri=http://localhost:3000/api/auth/callback/google&response_type=code&scope=https://www.googleapis.com/auth/drive.readonly&access_type=offline&prompt=consent
```

38. Du blir ombedd att logga in/välja Google-konto
39. Du ser en varning "Google hasn't verified this app":
    - Klicka **Continue** (längst ner till vänster)
40. Klicka **Continue** igen för att ge tillgång till Drive
41. Du blir nu redirectad till en URL som INTE fungerar (det är OK!)
42. Titta på URL:en i adressfältet - den ser ut så här:
```
http://localhost:3000/api/auth/callback/google?code=4/0AXxxxx...&scope=...
```
43. Kopiera delen efter `code=` och före `&scope`
    - I exemplet: `4/0AXxxxx...`
📋 Spara denna kod tillfälligt!

44. Öppna **Kommandotolken** (Windows + cmd)
45. Kör detta kommando (ERSÄTT alla värden):

```
curl -X POST https://oauth2.googleapis.com/token -d "client_id=DIN_CLIENT_ID" -d "client_secret=DIN_CLIENT_SECRET" -d "code=DIN_KOD" -d "grant_type=authorization_code" -d "redirect_uri=http://localhost:3000/api/auth/callback/google"
```

**OBS:** Om `curl` inte fungerar på Windows, gör så här istället:

46. Gå till: **https://reqbin.com/curl**
47. Klistra in curl-kommandot i fältet
48. Klicka **Run**

49. Du får tillbaka JSON som detta:
```json
{
  "access_token": "ya29.xxxxx...",
  "expires_in": 3599,
  "refresh_token": "1//0abc123...",
  "scope": "https://www.googleapis.com/auth/drive.readonly",
  "token_type": "Bearer"
}
```

50. Kopiera **refresh_token** värdet!
📋 Spara denna i din textfil!

**GOOGLE CLOUD SETUP ÄR KLART! ✅**

---

## Steg 2.5: Skapa OpenAI-konto (Valfritt - för AI-analys av bilder)

Om du vill ha AI-genererade ad-texter för bilder.

### Skapa konto

1. Gå till: **https://platform.openai.com**
2. Klicka **Sign up**
3. Skapa konto med email eller Google
4. Verifiera din email
5. Ange telefonnummer för verifiering

### Skapa API Key

6. När du är inloggad, klicka på din profil (uppe till höger)
7. Klicka på **View API Keys**
8. Klicka på **+ Create new secret key**
9. Namnge den: `meta-ads-automation`
10. Klicka **Create secret key**
11. **VIKTIGT:** Kopiera nyckeln NU - den visas bara EN gång!
```
sk-abcdefghijklmnopqrstuvwxyz123456
```
📋 Spara i din textfil!

### Lägg till betalmetod

12. Gå till **Settings** → **Billing**
13. Klicka **Add payment method**
14. Lägg till ett betalkort
15. Lägg till credits (minst $5)

**OPENAI SETUP ÄR KLART! ✅**

---

## Steg 2.6: Skapa Google AI-konto (Valfritt - för AI-analys av videos)

### Skapa API Key

1. Gå till: **https://makersuite.google.com/app/apikey**
2. Logga in med ditt Google-konto
3. Klicka **Create API Key**
4. Välj ditt Google Cloud-projekt (meta-ads-automation)
5. Klicka **Create API Key in existing project**
6. Kopiera API-nyckeln:
```
AIzaSyAbcdefghijklmnop1234567890
```
📋 Spara i din textfil!

**GOOGLE AI SETUP ÄR KLART! ✅**

---

# DEL 3: SÄTT UPP PROJEKTET

Nu ska vi ladda ner koden och konfigurera allt.

---

## Steg 3.1: Ladda ner projektet

### Öppna Kommandotolken i rätt mapp

1. Tryck **Windows-tangenten + E** (öppnar Utforskaren)
2. Navigera till: **Dokument** → **meta-ads-projekt**
3. Klicka i adressfältet (där det står sökvägen)
4. Skriv: **cmd**
5. Tryck **Enter**
6. Kommandotolken öppnas i rätt mapp!

### Klona projektet från GitHub

7. Skriv in detta kommando och tryck Enter:
```
git clone https://github.com/Krillmaestro/at.git .
```
(OBS: Det finns en punkt på slutet!)

8. Vänta medan filerna laddas ner
9. Du ska se meddelanden som "Cloning into..."

### Installera dependencies

10. Skriv detta kommando och tryck Enter:
```
npm install
```
11. Vänta medan paketen installeras (kan ta 1-2 minuter)
12. Du ser en massa text scrolla förbi - det är normalt
13. När det är klart ser du kommandoprompten igen

---

## Steg 3.2: Skapa miljövariabler-filen

### Öppna projektet i VS Code

1. I kommandotolken, skriv:
```
code .
```
2. VS Code öppnas med projektet

### Skapa .env.local filen

3. I VS Code, högerklicka i fillistan (vänster sida) på en tom yta
4. Välj **New File**
5. Döp filen till exakt: `.env.local`
6. Tryck **Enter**
7. Filen öppnas - den är tom

### Fyll i dina credentials

8. Kopiera in följande text och ERSÄTT alla värden med dina egna:

```env
# ============================================
# SUPABASE - från steg 2.2
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://dittproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...din_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...din_service_role_key

# ============================================
# META / FACEBOOK - från steg 2.3
# ============================================
META_APP_ID=123456789012345
META_APP_SECRET=abcdef1234567890
META_ACCESS_TOKEN=EAAGxxxxx...din_långlivade_token...xxxxxZD

# ============================================
# GOOGLE - från steg 2.4
# ============================================
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
GOOGLE_REFRESH_TOKEN=1//0abc123xxxxx

# ============================================
# AI (Valfritt) - från steg 2.5 och 2.6
# ============================================
OPENAI_API_KEY=sk-xxxxx
GOOGLE_AI_API_KEY=AIzaSyxxxxx

# ============================================
# APP
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

9. Spara filen: **Ctrl + S**

---

## Steg 3.3: Starta appen

### Starta utvecklingsservern

1. Gå tillbaka till Kommandotolken (eller öppna en ny i projektmappen)
2. Skriv:
```
npm run dev
```
3. Vänta några sekunder
4. Du ska se:
```
   ▲ Next.js 15.1.7
   - Local:        http://localhost:3000

 ✓ Ready in 2.3s
```

### Öppna appen i webbläsaren

5. Öppna webbläsaren
6. Gå till: **http://localhost:3000**
7. Du ska se login-sidan!

**PROJEKTET KÖRS! ✅**

---

# DEL 4: FÖRSTA ANVÄNDNINGEN

---

## Steg 4.1: Skapa ett konto i appen

1. På login-sidan, klicka **Sign Up** (eller motsvarande länk)
2. Fyll i:
   - Email: din@email.com
   - Password: ett säkert lösenord
3. Klicka **Sign Up**
4. Kolla din email - du kan få en verifieringslänk
5. Klicka på länken för att verifiera
6. Logga in med dina nya credentials

---

## Steg 4.2: Lägg till ditt Meta Ad Account

1. Klicka på **Settings** i sidomenyn (eller kugghjulet)
2. Du ser "Ad Accounts" sektionen
3. Klicka **Add Account**
4. Fyll i formuläret:

```
Account Name:       Mitt Företag (eller vad du vill kalla det)
Meta Ad Account ID: 123456789012345 (UTAN "act_" prefix)
Facebook Page ID:   109876543210987
Pixel ID:           123456789012345 (eller lämna tomt)
Access Token:       EAAGxxxxx...din_token...xxxxxZD
```

5. Klicka **Add Account**
6. Du ska nu se ditt account i listan!

---

## Steg 4.3: Lägg till en Google Drive-mapp

Först, skapa en mapp i Google Drive:

1. Gå till: **https://drive.google.com**
2. Klicka på **+ New** → **New folder**
3. Döp den till: `Ad Creatives`
4. Klicka **Create**
5. Öppna den nya mappen
6. Kopiera URL:en från adressfältet:
```
https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz
```

Nu, lägg till den i appen:

7. I appen, gå till **Settings**
8. Klicka på **Drive Folders** fliken
9. Klicka **Add Folder**
10. Fyll i:
```
Folder Name:  Ad Creatives
Folder URL:   https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz
```
11. Klicka **Add Folder**

---

## Steg 4.4: Lägg till testbilder

1. Gå till din Google Drive-mapp "Ad Creatives"
2. Klicka på **+ New** → **File upload**
3. Välj 2-3 testbilder (JPG eller PNG)
4. Vänta tills uppladdningen är klar

---

## Steg 4.5: Synka och skapa ads!

1. I appen, gå till **Dashboard**
2. Klicka på **Sync Drive Folder**
3. Välj din mapp och fortsätt genom wizard:en
4. På sista steget, klicka **Start Job**
5. Gå till **Jobs** för att se statusen
6. När jobbet är klart, gå till **Assets** för att se dina bilder
7. Välj bilder och klicka **Create Ads**
8. Följ wizard:en för att skapa dina första ads!

---

# GRATTIS! 🎉

Du har nu:
- ✅ Installerat alla program
- ✅ Skapat alla konton
- ✅ Konfigurerat alla credentials
- ✅ Startat appen
- ✅ Kopplat ihop allt!

---

# FELSÖKNING

## Problem: "npm is not recognized"
**Lösning:** Node.js installerades inte korrekt. Starta om datorn och testa igen.

## Problem: "Access token is invalid"
**Lösning:** Din Meta-token har gått ut. Gå tillbaka till steg 2.3 och generera en ny.

## Problem: "Permission denied" vid Google Drive
**Lösning:** Din refresh token är felaktig. Gå igenom steg 2.4 igen.

## Problem: Appen startar inte
**Lösning:** Kolla att .env.local filen:
1. Heter exakt `.env.local` (börjar med punkt!)
2. Ligger i rotmappen av projektet
3. Inte har några extra mellanslag runt `=` tecknen

## Problem: "Database error" eller tabeller saknas
**Lösning:** Kör SQL-koden i Supabase SQL Editor igen (steg 2.2).

---

# BEHÖVER DU MER HJÄLP?

Beskriv:
1. Vilket steg du fastnade på
2. Exakt vad du klickade på
3. Vilket felmeddelande du fick

Så hjälper jag dig vidare!
