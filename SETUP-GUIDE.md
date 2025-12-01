# Meta Ads Automation Pro - Setup Guide

## Overview

This n8n workflow automates Facebook/Meta ad creation from Google Drive assets. It matches the functionality of professional automation tools costing 99+ EUR.

## Features

| Feature | Description |
|---------|-------------|
| Form Submission | Interactive form for ad configuration |
| Google Drive Integration | Automatic asset discovery and download |
| File Validation | Naming conventions and size limit checks |
| UTM Parameters | Automatic tracking parameter injection |
| Attribution Windows | Support for 1dc, 7dc, 7dc1dv |
| Rate Limiting | Wait nodes to respect API limits |
| Error Handling | Comprehensive error notifications |
| Slack Notifications | Success and failure alerts |
| Audit Logging | All ads logged to Google Sheets |
| Standard Enhancements | Disabled by default (OPT_OUT) |

## Prerequisites

1. **Self-hosted n8n instance** (or n8n cloud)
2. **Google Cloud Project** with:
   - Google Drive API enabled
   - Google Sheets API enabled
   - OAuth 2.0 credentials
3. **Meta Business Manager** with:
   - Ad account access
   - Marketing API app
   - Access token with `ads_management` permission
4. **Slack workspace** (optional, for notifications)

## Setup Steps

### 1. Google Sheets Setup

Create a Google Sheet with two tabs:

#### Tab 1: "Ad Accounts"
| Column A | Column B | Column C |
|----------|----------|----------|
| account_id | account_name | status |
| 123456789 | Main Account | active |
| 987654321 | Secondary | inactive |

#### Tab 2: "Ads Log"
| Timestamp | CampaignName | AdName | MediaType | CampaignID | AdSetID | CreativeID | AdID | Attribution | Status |
|-----------|--------------|--------|-----------|------------|---------|------------|------|-------------|--------|

### 2. n8n Credentials Setup

#### Google (OAuth2)
1. Go to Google Cloud Console
2. Create OAuth 2.0 Client ID
3. Add scopes: `drive.readonly`, `spreadsheets`
4. In n8n, create "Google Sheets OAuth2 API" credential
5. Create "Google Drive OAuth2 API" credential

#### Meta/Facebook Graph API
1. Go to Meta for Developers
2. Create or use existing app
3. Add "Marketing API" product
4. Generate long-lived access token with `ads_management` scope
5. In n8n, create "Facebook Graph API" credential

#### Slack (optional)
1. Create Slack app at api.slack.com
2. Add `chat:write` scope
3. Install to workspace
4. Copy Bot User OAuth Token
5. In n8n, create "Slack API" credential

### 3. Import Workflow

1. Open n8n
2. Go to Workflows > Import
3. Select `meta-ads-automation-pro.json`
4. Update placeholder values:
   - `YOUR_SHEET_ID_HERE` - Your Google Sheet ID
   - `GOOGLE_CREDENTIAL_ID` - Your Google credential ID
   - `META_CREDENTIAL_ID` - Your Facebook credential ID
   - `SLACK_CREDENTIAL_ID` - Your Slack credential ID
   - `YOUR_SLACK_CHANNEL_ID` - Target Slack channel

### 4. Google Drive Folder Setup

1. Create a folder in Google Drive for ad assets
2. Share folder with your Google service account email
3. Supported file types:
   - Images: JPG, JPEG, PNG, WebP (max 30MB)
   - Videos: MP4, MOV (max 4GB)

### 5. Test the Workflow

1. Activate the workflow
2. Open the form URL (shown in Submit Form node)
3. Fill in test data
4. Check Slack for notifications
5. Verify ads in Meta Ads Manager

## Form Fields Reference

| Field | Required | Description |
|-------|----------|-------------|
| Google Drive Folder URL | Yes | Full URL to folder with assets |
| Ad Account ID | Yes | Meta ad account ID (without act_) |
| Facebook Page ID | Yes | Page to publish ads from |
| Campaign Name | Yes | Name for the campaign |
| Primary Text | Yes | Main ad copy |
| Headline | Yes | Ad headline |
| Description | No | Additional description |
| Website URL | Yes | Landing page URL |
| Call to Action | Yes | CTA button type |
| Daily Budget | Yes | Budget in cents (1000 = $10) |
| Target Countries | Yes | Comma-separated country codes |
| Pixel ID | Yes | Meta pixel for conversion tracking |
| Conversion Event | Yes | Event type to optimize for |
| Attribution Window | Yes | Click/view attribution setting |
| UTM Source/Medium/Campaign | No | Custom UTM parameters |

## Error Handling

The workflow handles these error scenarios:

1. **Invalid Ad Account** - Account not found or inactive in sheet
2. **No Folder Access** - Cannot read Google Drive folder
3. **Invalid Files** - Files with bad names or too large
4. **API Errors** - Meta API failures (logged to Slack)

## Customization

### Adding More Attribution Windows

Edit the `Format Ad Copy` code node to add more options:

```javascript
const attributionMap = {
  '1d_click': { click: 1, view: 0, name: '1dc' },
  '7d_click': { click: 7, view: 0, name: '7dc' },
  '7d_click_1d_view': { click: 7, view: 1, name: '7dc1dv' },
  // Add more here
};
```

### Modifying Targeting

Edit the `Create Ad Set` HTTP Request node JSON body to change:
- Age range
- Placements
- Detailed targeting
- Custom audiences

### Adding Multiple Ad Sets

To create multiple ad sets with different attribution windows (like the commercial product):
1. After `Save Campaign ID`, add a Split node
2. Create separate `Create Ad Set` nodes for each attribution
3. Merge results before creating ads

## Comparison: Your Original vs This Version

| Feature | Original | Pro Version |
|---------|----------|-------------|
| Trigger | Schedule/Manual | Interactive Form |
| Error Handling | None | Comprehensive |
| Slack Notifications | None | Success + Errors |
| UTM Parameters | Manual | Automatic |
| File Validation | None | Name + Size checks |
| Rate Limiting | None | Wait nodes |
| Attribution | None | Configurable |
| Standard Enhancements | Default | OPT_OUT |
| Binary Rename | Missing | Included |

## Support

For issues or questions:
- Check n8n documentation
- Meta Marketing API docs
- Google Drive API docs
