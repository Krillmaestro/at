# Landing Page Analyzer - Complete Setup Guide

## Overview

This tool analyzes any landing page using 4 AI specialists (Design, Copy, SEO, Strategy) and sends a beautiful email report with grades, scores, and actionable recommendations.

**Performance:**
- Analysis time: 60-90 seconds
- Cost per analysis: ~$0.15-0.25 (Anthropic API)

---

## Part 1: n8n Workflow Setup

### Step 1: Import the Workflow

1. Open your n8n instance
2. Click **"Add workflow"** (+ button)
3. Click the **three dots (...)** menu in the top right
4. Select **"Import from file..."** or **"Import from URL..."**
5. Paste the entire JSON from `workflows/n8n-workflow-copy-paste.json`
6. Click **"Import"**

### Step 2: Add Anthropic API Credentials

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an API key if you don't have one
3. In n8n, click on any of the **"Model"** nodes (e.g., "Design Critic Model")
4. Click on **"Credential to connect with"**
5. Click **"Create New Credential"**
6. Enter your Anthropic API key
7. Save the credential
8. **Important:** Apply the same credential to ALL 4 model nodes:
   - Design Critic Model
   - Copywriter Model
   - SEO Specialist Model
   - Growth Strategist Model

### Step 3: Add Gmail OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable the **Gmail API**
4. Create **OAuth 2.0 credentials**:
   - Application type: Web application
   - Add redirect URI: `https://your-n8n-url/rest/oauth2-credential/callback`
5. In n8n, click on the **"Send Email Report"** node
6. Click **"Credential to connect with"**
7. Click **"Create New Credential"**
8. Select **"Gmail OAuth2"**
9. Enter your Client ID and Client Secret
10. Click **"Sign in with Google"** and authorize

### Step 4: Activate the Workflow

1. Toggle the workflow to **Active** (top right switch)
2. Click on the **"Form Submission"** node
3. Copy the **Production URL** - this is your form URL!

### Step 5: Test the Workflow

1. Open the Production URL in a browser
2. Fill in the form with a test landing page
3. Submit and wait 60-90 seconds
4. Check your email for the report!

---

## Part 2: Next.js Dashboard Setup (Optional)

The dashboard provides a beautiful web interface for the analyzer.

### Step 1: Install Dependencies

```bash
cd /path/to/project
npm install
```

### Step 2: Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### Step 3: Run the Development Server

```bash
npm run dev
```

### Step 4: Access the Dashboard

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Workflow Architecture

```
┌─────────────────┐
│ Form Submission │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Initialize Vars │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Fetch Page HTML │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Extract Elements│
└────────┬────────┘
         │
    ┌────┼────┐
    ▼    ▼    ▼
┌──────┐┌──────┐┌──────┐
│Design││ Copy ││ SEO  │  ← Run in PARALLEL
└──┬───┘└──┬───┘└──┬───┘
   │       │       │
   └───────┼───────┘
           ▼
   ┌───────────────┐
   │   Strategy    │  ← Synthesizes all 3
   └───────┬───────┘
           │
           ▼
   ┌───────────────┐
   │ Format Report │
   └───────┬───────┘
           │
           ▼
   ┌───────────────┐
   │  Send Email   │
   └───────────────┘
```

---

## Troubleshooting

### "Credential not found" Error
- Make sure you've added credentials to ALL 4 AI model nodes
- Each model node needs the same Anthropic credential

### Email Not Sending
- Verify Gmail OAuth is properly configured
- Check that the redirect URI matches your n8n URL
- Ensure the Gmail API is enabled in Google Cloud Console

### Workflow Times Out
- Some pages take longer to analyze
- Increase timeout in the HTTP Request node if needed
- Large pages may need the timeout increased to 30000ms

### Empty Analysis Results
- The page might be blocking bots
- Try a different landing page URL
- Check if the URL is accessible (not behind login)

---

## Customization Options

### Change the Email Template
Edit the **"Format Email Report"** code node to customize:
- Colors and branding
- Section order
- CTA links and text

### Add More Analysis Criteria
Edit the agent prompts in each AI agent node to:
- Add industry-specific analysis
- Include additional scoring dimensions
- Modify the output format

### Add Screenshot Capture
Add an HTTP Request node to capture screenshots using services like:
- ScreenshotOne API
- Urlbox API
- Puppeteer (self-hosted)

---

## Support

**Questions?** Contact: mark.marin@evervise.com

**Website:** [evervise.ai](https://evervise.ai)

---

*Built by Evervise - Automating the repetitive so you can focus on what matters*
