# Meta Ads Automation - Complete Analysis & Architecture

## Executive Summary

This document analyzes three n8n workflow variants and proposes a unified Next.js implementation that combines the best features of each into a production-grade application.

---

## Workflow Analysis

### Workflow 1: Form-Based Ad Upload (Simple)
**Trigger:** Form submission / Webhook
**Complexity:** Medium
**Key Features:**
- Single ad creation from form input
- Google Drive link → Download → Upload to Meta
- Slack notifications on success/error
- UTM tracking parameters

### Workflow 2: Scheduled Batch Creative Testing (Free Version)
**Trigger:** Weekly schedule (Mondays 3PM)
**Complexity:** Medium-High
**Key Features:**
- Scans Google Drive folder for new assets
- Handles both images and videos
- Creates Campaign → Ad Set → Ads pipeline
- Logs results to Google Sheets
- Configuration via n8n Set node

### Workflow 3: AI-Powered Premium Version (Advanced)
**Trigger:** Google Drive folder watcher + Manual trigger
**Complexity:** High
**Key Features:**
- **AI Analysis Pipeline** - Uses Gemini for video analysis, OpenAI for images
- **Structured Output Parsing** - Converts AI responses to structured data
- **Two-Phase Architecture:**
  - Phase 1: Asset ingestion + AI analysis
  - Phase 2: Ad creation (separate trigger)
- **Multi-Image Support** - Creates carousel-style ads
- **Video Thumbnail Generation** - Extracts preview frames
- **State Machine** - Polls video processing status
- **Settings from Sheets** - Fully configurable via Google Sheets

---

## Feature Matrix

| Feature | Workflow 1 | Workflow 2 | Workflow 3 | Our Version |
|---------|------------|------------|------------|-------------|
| Manual trigger | ✅ | ❌ | ✅ | ✅ |
| Scheduled trigger | ❌ | ✅ | ❌ | ✅ |
| Folder watch trigger | ❌ | ❌ | ✅ | ✅ |
| Webhook trigger | ✅ | ❌ | ❌ | ✅ |
| Image ads | ✅ | ✅ | ✅ | ✅ |
| Video ads | ✅ | ✅ | ✅ | ✅ |
| Multi-image ads | ❌ | ❌ | ✅ | ✅ |
| AI content analysis | ❌ | ❌ | ✅ | ✅ |
| Auto-generate descriptions | ❌ | ❌ | ✅ | ✅ |
| A/B text variations | ❌ | ❌ | ❌ | ✅ |
| Multi-account support | ❌ | ❌ | ❌ | ✅ |
| Custom audiences | ❌ | ❌ | ❌ | ✅ |
| Error handling/retry | Basic | Basic | Basic | ✅ Advanced |
| Slack notifications | ✅ | ❌ | ❌ | ✅ |
| Dashboard UI | ❌ | ❌ | ❌ | ✅ |
| Job history | ❌ | ✅ | ✅ | ✅ |

---

## Proposed Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           NEXT.JS APPLICATION                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         FRONTEND (React)                             │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │  📊 Dashboard        │  📤 Upload Form    │  ⚙️ Settings            │    │
│  │  - Job status        │  - Single ad       │  - Ad accounts          │    │
│  │  - Recent ads        │  - Batch upload    │  - Pages/Pixels         │    │
│  │  - Error logs        │  - Drive folder    │  - Default targeting    │    │
│  │  - Analytics         │  - AI analysis     │  - Notification prefs   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      API ROUTES (/api/*)                             │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │                                                                      │    │
│  │  /api/jobs/*           /api/meta/*           /api/integrations/*    │    │
│  │  ├─ create             ├─ upload-image       ├─ google/drive        │    │
│  │  ├─ status             ├─ upload-video       ├─ google/sheets       │    │
│  │  ├─ cancel             ├─ create-creative    ├─ ai/analyze-image    │    │
│  │  └─ history            ├─ create-campaign    ├─ ai/analyze-video    │    │
│  │                        ├─ create-adset       └─ slack/notify        │    │
│  │  /api/webhooks/*       └─ create-ad                                 │    │
│  │  ├─ drive-trigger                                                   │    │
│  │  ├─ manual-trigger     /api/settings/*                              │    │
│  │  └─ schedule-trigger   ├─ accounts                                  │    │
│  │                        ├─ defaults                                  │    │
│  │                        └─ credentials                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      SERVICE LAYER (/lib/*)                          │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │                                                                      │    │
│  │  MetaAdsService        GoogleService         AIService               │    │
│  │  ├─ uploadImage()      ├─ listFiles()        ├─ analyzeImage()      │    │
│  │  ├─ uploadVideo()      ├─ downloadFile()     ├─ analyzeVideo()      │    │
│  │  ├─ createCreative()   ├─ readSheet()        └─ generateAdCopy()    │    │
│  │  ├─ createCampaign()   └─ writeSheet()                              │    │
│  │  ├─ createAdSet()                            NotificationService     │    │
│  │  └─ createAd()         JobOrchestrator       ├─ sendSlack()         │    │
│  │                        ├─ processJob()       └─ sendEmail()         │    │
│  │                        ├─ retryFailed()                              │    │
│  │                        └─ scheduleJob()                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL SERVICES                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   SUPABASE   │  │  META GRAPH  │  │   GOOGLE     │  │   AI APIs    │    │
│  │              │  │     API      │  │   APIS       │  │              │    │
│  │  - Users     │  │              │  │              │  │  - OpenAI    │    │
│  │  - Jobs      │  │  - Ads API   │  │  - Drive     │  │  - Gemini    │    │
│  │  - Accounts  │  │  - Pages     │  │  - Sheets    │  │              │    │
│  │  - Creatives │  │  - Pixels    │  │              │  │              │    │
│  │  - Logs      │  │              │  │              │  │              │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema (Supabase)

### Tables

```sql
-- Ad Account configurations
CREATE TABLE ad_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  meta_account_id TEXT NOT NULL,
  meta_page_id TEXT NOT NULL,
  meta_pixel_id TEXT,
  meta_instagram_id TEXT,
  access_token TEXT NOT NULL, -- encrypted
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Google Drive folder configurations
CREATE TABLE drive_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  ad_account_id UUID REFERENCES ad_accounts(id),
  folder_id TEXT NOT NULL,
  folder_name TEXT,
  watch_enabled BOOLEAN DEFAULT false,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assets (images/videos from Google Drive)
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  drive_file_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER,
  thumbnail_url TEXT,
  meta_asset_id TEXT, -- After upload to Meta
  meta_asset_hash TEXT, -- For images
  ai_analysis JSONB, -- AI-generated insights
  ai_suggested_copy JSONB, -- AI-generated ad copy
  status TEXT DEFAULT 'pending', -- pending, analyzed, uploaded, failed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad Creatives
CREATE TABLE creatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  asset_id UUID REFERENCES assets(id),
  ad_account_id UUID REFERENCES ad_accounts(id),
  meta_creative_id TEXT,
  name TEXT NOT NULL,
  primary_text TEXT,
  headline TEXT,
  description TEXT,
  call_to_action TEXT DEFAULT 'LEARN_MORE',
  destination_url TEXT,
  creative_type TEXT, -- single_image, single_video, multi_image
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  ad_account_id UUID REFERENCES ad_accounts(id),
  meta_campaign_id TEXT,
  name TEXT NOT NULL,
  objective TEXT DEFAULT 'OUTCOME_SALES',
  status TEXT DEFAULT 'PAUSED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad Sets
CREATE TABLE ad_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  meta_adset_id TEXT,
  name TEXT NOT NULL,
  daily_budget INTEGER, -- in cents
  optimization_goal TEXT DEFAULT 'OFFSITE_CONVERSIONS',
  targeting JSONB,
  status TEXT DEFAULT 'PAUSED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ads
CREATE TABLE ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_set_id UUID REFERENCES ad_sets(id),
  creative_id UUID REFERENCES creatives(id),
  meta_ad_id TEXT,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'PAUSED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs (for tracking batch operations)
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  type TEXT NOT NULL, -- 'batch_upload', 'sync_folder', 'ai_analysis'
  status TEXT DEFAULT 'pending', -- pending, running, completed, failed
  progress INTEGER DEFAULT 0,
  total_items INTEGER DEFAULT 0,
  completed_items INTEGER DEFAULT 0,
  failed_items INTEGER DEFAULT 0,
  config JSONB, -- Job-specific configuration
  result JSONB, -- Final result/summary
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Items (individual items within a job)
CREATE TABLE job_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id),
  asset_id UUID REFERENCES assets(id),
  status TEXT DEFAULT 'pending',
  step TEXT, -- current step: 'downloading', 'uploading', 'creating_creative', etc.
  error_message TEXT,
  meta_ids JSONB, -- {creative_id, campaign_id, adset_id, ad_id}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Log
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  job_id UUID REFERENCES jobs(id),
  action TEXT NOT NULL,
  entity_type TEXT, -- 'asset', 'creative', 'campaign', 'ad'
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Job Processing Flow

### Phase 1: Asset Ingestion & AI Analysis

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ASSET INGESTION PIPELINE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  TRIGGER                                                                     │
│  (Folder watch / Manual / Webhook)                                          │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────┐                                                    │
│  │ 1. List Drive Files │ ──▶ Get new files from Google Drive folder        │
│  └──────────┬──────────┘                                                    │
│             │                                                                │
│             ▼                                                                │
│  ┌─────────────────────┐                                                    │
│  │ 2. Filter New Files │ ──▶ Exclude already processed (check DB)          │
│  └──────────┬──────────┘                                                    │
│             │                                                                │
│             ▼                                                                │
│  ┌─────────────────────┐                                                    │
│  │ 3. Create Asset     │ ──▶ Save to Supabase with status='pending'        │
│  │    Records          │                                                    │
│  └──────────┬──────────┘                                                    │
│             │                                                                │
│             ▼                                                                │
│  ┌─────────────────────┐     ┌─────────────────────────────────────────┐   │
│  │ 4. For Each Asset   │     │                                         │   │
│  │    (parallel)       │────▶│  Is Video?                              │   │
│  └─────────────────────┘     │     │                                   │   │
│                              │     ├── YES ──▶ Upload to Gemini        │   │
│                              │     │           Wait for processing     │   │
│                              │     │           Analyze with Gemini     │   │
│                              │     │           Extract thumbnail       │   │
│                              │     │                                   │   │
│                              │     └── NO ───▶ Download image          │   │
│                              │                 Analyze with OpenAI     │   │
│                              │                 Vision                  │   │
│                              └─────────────────────────────────────────┘   │
│                                        │                                    │
│                                        ▼                                    │
│                              ┌─────────────────────┐                        │
│                              │ 5. Parse AI Output  │                        │
│                              │    - Description    │                        │
│                              │    - Key themes     │                        │
│                              │    - Suggested copy │                        │
│                              │    - Target audience│                        │
│                              └──────────┬──────────┘                        │
│                                         │                                   │
│                                         ▼                                   │
│                              ┌─────────────────────┐                        │
│                              │ 6. Update Asset     │                        │
│                              │    status='analyzed'│                        │
│                              │    Save AI insights │                        │
│                              └─────────────────────┘                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Phase 2: Ad Creation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AD CREATION PIPELINE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  TRIGGER                                                                     │
│  (Manual / Schedule / After Phase 1)                                        │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────┐                                        │
│  │ 1. Get Assets to Process        │                                        │
│  │    (status='analyzed' OR        │                                        │
│  │     manually selected)          │                                        │
│  └──────────────┬──────────────────┘                                        │
│                 │                                                            │
│                 ▼                                                            │
│  ┌─────────────────────────────────┐                                        │
│  │ 2. Load Configuration           │                                        │
│  │    - Ad Account settings        │                                        │
│  │    - Default targeting          │                                        │
│  │    - Campaign settings          │                                        │
│  └──────────────┬──────────────────┘                                        │
│                 │                                                            │
│                 ▼                                                            │
│  ┌─────────────────────────────────┐                                        │
│  │ 3. Upload Media to Meta         │                                        │
│  │    ├── Video ▶ POST /advideos   │                                        │
│  │    └── Image ▶ POST /adimages   │                                        │
│  │    Save meta_asset_id/hash      │                                        │
│  └──────────────┬──────────────────┘                                        │
│                 │                                                            │
│                 ▼                                                            │
│  ┌─────────────────────────────────┐                                        │
│  │ 4. Create Ad Creative           │                                        │
│  │    POST /adcreatives            │                                        │
│  │    ├── Single Image             │                                        │
│  │    ├── Single Video             │                                        │
│  │    └── Multi-Image (carousel)   │                                        │
│  └──────────────┬──────────────────┘                                        │
│                 │                                                            │
│                 ▼                                                            │
│  ┌─────────────────────────────────┐                                        │
│  │ 5. Create Campaign (once)       │                                        │
│  │    POST /campaigns              │                                        │
│  │    objective: OUTCOME_SALES     │                                        │
│  │    status: PAUSED               │                                        │
│  └──────────────┬──────────────────┘                                        │
│                 │                                                            │
│                 ▼                                                            │
│  ┌─────────────────────────────────┐                                        │
│  │ 6. Create Ad Set (once)         │                                        │
│  │    POST /adsets                 │                                        │
│  │    optimization: CONVERSIONS    │                                        │
│  │    targeting: from config       │                                        │
│  └──────────────┬──────────────────┘                                        │
│                 │                                                            │
│                 ▼                                                            │
│  ┌─────────────────────────────────┐                                        │
│  │ 7. Create Ads (for each)        │                                        │
│  │    POST /ads                    │                                        │
│  │    Link creative to adset       │                                        │
│  │    status: PAUSED               │                                        │
│  └──────────────┬──────────────────┘                                        │
│                 │                                                            │
│                 ▼                                                            │
│  ┌─────────────────────────────────┐                                        │
│  │ 8. Log Results                  │                                        │
│  │    - Update Supabase            │                                        │
│  │    - Send notifications         │                                        │
│  │    - Export to Sheets (opt)     │                                        │
│  └─────────────────────────────────┘                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## AI Analysis Feature

### Video Analysis (Gemini)

```javascript
const analyzeVideo = async (fileUrl) => {
  // 1. Generate upload URL from Gemini
  const uploadUrl = await gemini.files.generateUploadUrl();

  // 2. Upload video to Gemini
  const file = await gemini.files.upload(uploadUrl, videoBuffer);

  // 3. Wait for processing
  let state = 'PROCESSING';
  while (state === 'PROCESSING') {
    await sleep(3000);
    const status = await gemini.files.get(file.name);
    state = status.state;
  }

  // 4. Analyze with Gemini
  const analysis = await gemini.models.generateContent({
    model: 'gemini-1.5-pro',
    contents: [{
      parts: [
        { fileData: { mimeType: file.mimeType, fileUri: file.uri } },
        { text: VIDEO_ANALYSIS_PROMPT }
      ]
    }]
  });

  return parseStructuredOutput(analysis);
};
```

### Image Analysis (OpenAI Vision)

```javascript
const analyzeImage = async (imageUrl) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    messages: [{
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url: imageUrl } },
        { type: 'text', text: IMAGE_ANALYSIS_PROMPT }
      ]
    }],
    response_format: { type: 'json_object' }
  });

  return JSON.parse(response.choices[0].message.content);
};
```

### AI Prompt Templates

```javascript
const VIDEO_ANALYSIS_PROMPT = `
Analyze this video advertisement and provide:

1. **Description**: A brief description of what's happening in the video
2. **Key Themes**: Main themes/messages conveyed
3. **Target Audience**: Who this ad would appeal to
4. **Emotional Tone**: The emotional response it aims to evoke
5. **Call to Action Suggestions**: 3 CTA options that would work well
6. **Ad Copy Suggestions**: Generate 3 variations of:
   - Primary text (125 chars max)
   - Headline (40 chars max)
   - Description (30 chars max)

Return as JSON with this structure:
{
  "description": "...",
  "themes": ["...", "..."],
  "targetAudience": "...",
  "emotionalTone": "...",
  "ctaSuggestions": ["LEARN_MORE", "SHOP_NOW", "..."],
  "adCopyVariations": [
    {
      "primaryText": "...",
      "headline": "...",
      "description": "..."
    }
  ]
}
`;

const IMAGE_ANALYSIS_PROMPT = `
Analyze this image for use in a Facebook/Instagram advertisement.

Provide:
1. **Description**: What's in the image
2. **Product/Service**: What's being advertised (if apparent)
3. **Visual Style**: The aesthetic/mood
4. **Target Audience**: Who would this appeal to
5. **Best Placements**: Which Meta placements suit this image (Feed, Stories, Reels)
6. **Ad Copy Suggestions**: Generate 3 variations of ad copy

Return as JSON with this structure:
{
  "description": "...",
  "product": "...",
  "visualStyle": "...",
  "targetAudience": "...",
  "bestPlacements": ["FEED", "STORY"],
  "adCopyVariations": [
    {
      "primaryText": "...",
      "headline": "...",
      "description": "..."
    }
  ]
}
`;
```

---

## File Structure

```
/home/user/at/
├── pages/
│   ├── index.js                    # Dashboard
│   ├── upload.js                   # Upload new assets
│   ├── assets.js                   # Asset library
│   ├── campaigns.js                # Campaign management
│   ├── jobs.js                     # Job history
│   ├── settings.js                 # Configuration
│   └── api/
│       ├── jobs/
│       │   ├── create.js           # Start new job
│       │   ├── [id]/
│       │   │   ├── status.js       # Get job status
│       │   │   └── cancel.js       # Cancel job
│       │   └── process.js          # Background job processor
│       ├── meta/
│       │   ├── upload-image.js
│       │   ├── upload-video.js
│       │   ├── create-creative.js
│       │   ├── create-campaign.js
│       │   ├── create-adset.js
│       │   └── create-ad.js
│       ├── google/
│       │   ├── drive/
│       │   │   ├── list.js
│       │   │   └── download.js
│       │   └── sheets/
│       │       ├── read.js
│       │       └── write.js
│       ├── ai/
│       │   ├── analyze-image.js
│       │   └── analyze-video.js
│       ├── webhooks/
│       │   ├── drive-trigger.js
│       │   └── manual-trigger.js
│       └── settings/
│           ├── accounts.js
│           └── defaults.js
├── lib/
│   ├── supabaseClient.js           # Already exists
│   ├── meta/
│   │   ├── client.js               # Meta Graph API client
│   │   ├── ads.js                  # Ad operations
│   │   ├── creatives.js            # Creative operations
│   │   └── campaigns.js            # Campaign operations
│   ├── google/
│   │   ├── drive.js                # Google Drive operations
│   │   └── sheets.js               # Google Sheets operations
│   ├── ai/
│   │   ├── gemini.js               # Gemini client
│   │   ├── openai.js               # OpenAI client
│   │   └── prompts.js              # Prompt templates
│   ├── jobs/
│   │   ├── orchestrator.js         # Job orchestration
│   │   ├── processors/
│   │   │   ├── ingest.js           # Asset ingestion
│   │   │   ├── analyze.js          # AI analysis
│   │   │   └── create-ads.js       # Ad creation
│   │   └── scheduler.js            # Cron-like scheduling
│   └── notifications/
│       ├── slack.js
│       └── email.js
├── components/
│   ├── LoginForm.js                # Already exists
│   ├── SignUpForm.js               # Already exists
│   ├── dashboard/
│   │   ├── JobsList.js
│   │   ├── RecentAds.js
│   │   ├── StatsCards.js
│   │   └── ActivityFeed.js
│   ├── upload/
│   │   ├── UploadForm.js
│   │   ├── DriveSelector.js
│   │   └── AssetPreview.js
│   ├── assets/
│   │   ├── AssetGrid.js
│   │   ├── AssetCard.js
│   │   └── AIInsights.js
│   ├── settings/
│   │   ├── AccountForm.js
│   │   ├── TargetingForm.js
│   │   └── NotificationPrefs.js
│   └── shared/
│       ├── Layout.js
│       ├── Sidebar.js
│       └── StatusBadge.js
└── docs/
    └── META_ADS_AUTOMATION_ANALYSIS.md  # This file
```

---

## Implementation Phases

### Phase 1: Foundation (Core Infrastructure)
- [ ] Database schema setup in Supabase
- [ ] Meta Graph API client with authentication
- [ ] Basic upload image/video endpoints
- [ ] Create creative/campaign/adset/ad endpoints

### Phase 2: Google Integration
- [ ] Google Drive OAuth setup
- [ ] List files from folder
- [ ] Download files
- [ ] Google Sheets read/write (optional)

### Phase 3: Job System
- [ ] Job creation and tracking
- [ ] Basic orchestrator (process assets → create ads)
- [ ] Error handling and retry logic
- [ ] Progress updates

### Phase 4: AI Analysis
- [ ] OpenAI Vision integration for images
- [ ] Gemini integration for videos
- [ ] Structured output parsing
- [ ] Auto-generate ad copy suggestions

### Phase 5: UI/Dashboard
- [ ] Dashboard with job status
- [ ] Upload form
- [ ] Asset library with AI insights
- [ ] Settings management

### Phase 6: Advanced Features
- [ ] Multi-image ad support
- [ ] A/B testing with copy variations
- [ ] Scheduled triggers
- [ ] Slack notifications
- [ ] Multi-account support

---

## Environment Variables Needed

```env
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Meta/Facebook
META_APP_ID=
META_APP_SECRET=
META_ACCESS_TOKEN=

# Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=

# AI Services
OPENAI_API_KEY=
GOOGLE_AI_API_KEY=  # For Gemini

# Notifications
SLACK_WEBHOOK_URL=
SLACK_BOT_TOKEN=

# App
NEXT_PUBLIC_APP_URL=
CRON_SECRET=  # For scheduled jobs
```

---

## API Rate Limits to Handle

| Service | Limit | Strategy |
|---------|-------|----------|
| Meta Graph API | 200 calls/hour per ad account | Queue with delays |
| Google Drive API | 1000 requests/100 seconds | Batch operations |
| OpenAI API | 10,000 tokens/min (GPT-4V) | Queue with backoff |
| Gemini API | 60 requests/minute | Queue with delays |

---

## Security Considerations

1. **Token Storage**: Encrypt Meta access tokens in database
2. **OAuth Refresh**: Implement token refresh for Google
3. **API Route Protection**: Verify user owns resources
4. **Webhook Validation**: Verify webhook signatures
5. **Rate Limiting**: Implement per-user rate limits

---

## Success Metrics

- Time saved per ad creation batch
- Error rate reduction
- AI copy adoption rate
- User engagement with AI suggestions
