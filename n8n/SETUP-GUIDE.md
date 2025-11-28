# ApotekHunden & FirstZoo - Facebook Auto-Reply Setup

## Dina två Facebook-sidor

| Sida | Page ID | Status |
|------|---------|--------|
| FirstZoo | 334560683076234 | Workflow redo |
| Apotek Hunden | 265790413295490 | Workflow redo |

---

## STEG 1: Skapa Facebook Credentials i n8n

Du behöver skapa **TVÅ separata credentials** (en för varje sida).

### Credential 1: Facebook FirstZoo

1. Gå till **Settings** → **Credentials** → **Add Credential**
2. Sök efter **"Facebook Graph API"**
3. Namn: `Facebook FirstZoo`
4. Access Token:
```
EAALncAam7isBQBBgXxZBHv8ZBY8FG6MICrSl0ZBjxIGNTlnjvZAPhRHb6JKiuVO6rxSgd8fyQAZBMg88Giy8FYCcpaz4fdsO3UNdLQV589VGHhZCeILO4T79Fzau3h5ZAFbVtPMAmpQHbjKV53RI3ZBa0ir1k5MZCjiuXJG6whaMDQ12Ta3LFBGIvX6wM2na9OgHrEVS1O8pZBGlXctkEnvpJN5kXeblTZCA0VqOFZCAoSra4aSZBjVxBkgqi
```
5. Klicka **Save**

### Credential 2: Facebook Apotek Hunden

1. Gå till **Settings** → **Credentials** → **Add Credential**
2. Sök efter **"Facebook Graph API"**
3. Namn: `Facebook Apotek Hunden`
4. Access Token:
```
EAALncAam7isBQOSK8AAOD6dNIHb8kBcfKhWUqCZC98H5qXtVT01J411oFAZCGUa1SwZAxOH3oJF3TIp7azEefpn34AAfwMUG5Q09aZA2OuqfHRVZC4NeM12zOUUtpI4mHBo7iy2uOVnbZBEZBMKD31DJp07ZA7lVu51lV599SV78HImJEMs6zzBQrQSsCVPZC6bCZB0dcL45ZADpdzSMwlfUiKvB2NNm3dTIKBDbaET111xj6pc5uXLXZB0ZD
```
5. Klicka **Save**

---

## STEG 2: Importera Workflows

### Workflow 1: FirstZoo

1. Gå till **Workflows** → **Import from File**
2. Välj filen: `workflow-firstzoo.json`
3. Efter import, **klicka på varje nod som har Facebook-credential** och välj `Facebook FirstZoo`
   - Posts Fetcher
   - Last Post Fetcher
   - Latest Comment
   - Reply Writer

### Workflow 2: Apotek Hunden

1. Gå till **Workflows** → **Import from File**
2. Välj filen: `workflow-apotekhunden.json`
3. Efter import, **klicka på varje nod som har Facebook-credential** och välj `Facebook Apotek Hunden`
   - Posts Fetcher
   - Last Post Fetcher
   - Latest Comment
   - Reply Writer

---

## STEG 3: Verifiera Notion

Notion Database IDs är redan konfigurerade:
- Knowledge Base: `252f4caadbf44136a31fa48541c3c604`
- Processed Comments: `c19128967ed94e99898fb35495eb20ad`

**Viktigt:** Se till att dina Notion-databaser har rätt kolumner:

### Knowledge Base
| Kolumn | Typ |
|--------|-----|
| Name | Title |
| Description | Text |
| Price | Text |
| Product | Text |

### Processed Facebook Comments
| Kolumn | Typ |
|--------|-----|
| Comment ID | Text (Rich Text) |
| Response Status | Status (Done/Pending/Failed) |

---

## STEG 4: Testa

1. Öppna ett workflow
2. Klicka **Execute Workflow** (manuellt)
3. Kontrollera varje nod för fel
4. Om allt fungerar, aktivera workflow

---

## Felsökning

### "Invalid OAuth 2.0 Access Token"
→ Du använder fel token. Se till att du använder **Page Access Token** (från `me/accounts`), inte User Token.

### "Could not find database"
→ Notion-databasen är inte delad med din integration. Öppna databasen i Notion → Share → Invite din integration.

### Inga kommentarer hittas
→ Sidan har inga inlägg med kommentarer ännu.

---

## Token-förnyelse

Facebook Page Access Tokens löper ut efter ca 60 dagar. Förnya dem genom att köra `me/accounts` i Graph API Explorer igen.

---

## Sammanfattning

| Fil | Sida | Page ID |
|-----|------|---------|
| `workflow-firstzoo.json` | FirstZoo | 334560683076234 |
| `workflow-apotekhunden.json` | Apotek Hunden | 265790413295490 |
