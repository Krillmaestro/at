# ApotekHunden Facebook Auto-Reply - Setup Guide

## Översikt

Detta workflow svarar automatiskt på Facebook-kommentarer med AI (Sandra-personligheten).

**Flöde:**
```
Trigger (var 5 min) → Hämta posts → Hämta kommentarer → Kolla om ny → AI svarar → Spara till DB
```

---

## Steg 1: Skapa Notion-databaser

### Databas 1: "Processed Facebook Comments"

Skapa en ny databas i Notion med dessa kolumner:

| Kolumnnamn | Typ | Beskrivning |
|------------|-----|-------------|
| Name | Title | Automatiskt namn |
| Comment ID | Text (Rich Text) | Facebook-kommentarens ID |
| Response Status | Status | "Done" / "Pending" / "Failed" |
| Created | Created time | När kommentaren behandlades |

**Status-alternativ att skapa:**
- Done (grön)
- Pending (gul)
- Failed (röd)


### Databas 2: "Knowledge Base" (Produktkunskap)

Skapa en ny databas med dessa kolumner:

| Kolumnnamn | Typ | Beskrivning |
|------------|-----|-------------|
| Name | Title | Produktnamn |
| Description | Text | Produktbeskrivning |
| Price | Text | Pris (t.ex. "359 kr") |
| Category | Select | Probiotika / Calm & Relax / Hip & Joint |

**Exempeldata att lägga in:**

| Name | Description | Price | Category |
|------|-------------|-------|----------|
| Probiotika 3-i-1 | 1 miljard CFU probiotika, prebiotika, naturliga fibrer. Inga utfyllnadsämnen. | 359 kr | Probiotika |
| Calm & Relax | Naturliga lugnande ingredienser. Verkar inom 30-60 min. | 359 kr | Calm & Relax |
| Hip & Joint | Stöd för leder, brosk och seniorhundar. | 359 kr | Hip & Joint |

---

## Steg 2: Hämta Notion Database IDs

1. Öppna varje databas i Notion
2. Klicka "Share" → "Copy link"
3. URL:en ser ut så här: `https://notion.so/xxxxx?v=yyyyy`
4. **Database ID** är `xxxxx` (32 tecken, före `?v=`)

---

## Steg 3: Konfigurera n8n Credentials

### Facebook Graph API

1. Gå till **Credentials** i n8n
2. Skapa/uppdatera "Facebook Graph account"
3. Sätt **Access Token** till:
```
EAARoDH2rhSABQEGT3tQFpc386kVs91KN5nnfQZC1PR6HeJ90ttwgHF8VHgimD3p6DsZAKMrG4tbHAa0qm8r8cS6jGwp4iVfwjQqduMgpZC5ZBHcgJ57KJFjgpbxKvnU5Litdy8VyGOiLN7X6mvs4C9iz1APsJYi4iUxVqRRPkeqcTSjqdHP8zKUzl0PPm2kfWBN5aoMZAhEwXR2rqLce6zKKMAToZCZAWPWBdcmPtPSAKVtPOjhu6z3C2wafwR0rQJZBTXXGoateiZBok3zUI211j7n7UHaLiFg0ZD
```

**OBS:** Facebook-tokens löper ut efter ~60 dagar. Du behöver förnya den regelbundet.

### Notion API

1. Gå till https://www.notion.so/my-integrations
2. Skapa en ny integration
3. Kopiera "Internal Integration Token"
4. **Viktigt:** Dela dina databaser med integrationen (Share → Invite → din integration)

### Google Gemini API

1. Gå till https://aistudio.google.com/app/apikey
2. Skapa en API-nyckel
3. Lägg in i n8n credentials

---

## Steg 4: Importera Workflow

1. Öppna n8n
2. Klicka **Import from File**
3. Välj `apotekhunden-facebook-workflow.json`
4. Uppdatera dessa noder med dina Notion Database IDs:
   - **Knowledge Base** - ändra `ERSATT_MED_KNOWLEDGE_BASE_ID`
   - **CommentID Checker** - ändra `ERSATT_MED_PROCESSED_COMMENTS_ID`
   - **CommentID to DB** - ändra `ERSATT_MED_PROCESSED_COMMENTS_ID`

---

## Steg 5: Testa Workflow

1. Klicka **Execute Workflow** manuellt
2. Kontrollera varje nod för fel
3. Om allt fungerar, aktivera workflow

---

## Felsökning

### "Error 400: Invalid OAuth access token"
→ Din Facebook-token har gått ut. Generera en ny på Facebook Developer.

### "Error 190: Access token has expired"
→ Samma som ovan.

### "Could not find database"
→ Du har inte delat Notion-databasen med din integration.

### Inga kommentarer hittas
→ Kontrollera att din Facebook-sida har posts med kommentarer.

### AI svarar inte
→ Kontrollera Google Gemini API credentials.

---

## Facebook Page ID

Din Page ID: **334560683076234**

Detta är redan konfigurerat i workflow-filen.

---

## Säkerhet

**VIKTIGT:**
- Dela aldrig din Facebook Access Token offentligt
- Tokens bör roteras regelbundet
- Överväg att använda environment variables i produktion
