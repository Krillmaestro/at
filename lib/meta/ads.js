/**
 * Meta Ads Service
 * High-level functions for creating ads, campaigns, and creatives
 */

import { createMetaClient } from './client';

/**
 * Create a complete ad from an asset
 * This is the main orchestration function that creates:
 * 1. Uploads media (image or video)
 * 2. Creates ad creative
 * 3. Creates campaign (if needed)
 * 4. Creates ad set (if needed)
 * 5. Creates ad
 */
export async function createAdFromAsset({
  accessToken,
  adAccountId,
  pageId,
  pixelId,
  asset, // { buffer, fileName, mimeType, thumbnailUrl }
  adCopy, // { primaryText, headline, description, callToAction, destinationUrl }
  campaignConfig, // { name, objective } or { existingCampaignId }
  adSetConfig, // { name, dailyBudget, targeting, optimizationGoal } or { existingAdSetId }
}) {
  const client = createMetaClient(accessToken);
  const isVideo = asset.mimeType.startsWith('video/');
  const results = {
    mediaId: null,
    mediaHash: null,
    creativeId: null,
    campaignId: null,
    adSetId: null,
    adId: null,
  };

  // Step 1: Upload media
  if (isVideo) {
    const uploadResult = await client.uploadVideo(adAccountId, asset.buffer, asset.fileName);
    results.mediaId = uploadResult.id;

    // Wait for video processing
    let videoReady = false;
    let attempts = 0;
    while (!videoReady && attempts < 30) {
      await sleep(3000);
      const status = await client.getVideoStatus(uploadResult.id);
      if (status.status?.video_status === 'ready') {
        videoReady = true;
      }
      attempts++;
    }

    if (!videoReady) {
      throw new Error('Video processing timeout');
    }
  } else {
    const uploadResult = await client.uploadImage(adAccountId, asset.buffer, asset.fileName);
    // Extract hash from response (format: { images: { filename: { hash: "..." } } })
    const imageKey = Object.keys(uploadResult.images)[0];
    results.mediaHash = uploadResult.images[imageKey].hash;
  }

  // Step 2: Create creative
  const creativeSpec = buildCreativeSpec({
    isVideo,
    pageId,
    mediaId: results.mediaId,
    mediaHash: results.mediaHash,
    thumbnailUrl: asset.thumbnailUrl,
    adCopy,
    fileName: asset.fileName,
  });

  const creativeResult = await client.createCreative(adAccountId, creativeSpec);
  results.creativeId = creativeResult.id;

  // Step 3: Create or use existing campaign
  if (campaignConfig.existingCampaignId) {
    results.campaignId = campaignConfig.existingCampaignId;
  } else {
    const campaignResult = await client.createCampaign(adAccountId, {
      name: campaignConfig.name || `Campaign_${formatDate(new Date())}`,
      objective: campaignConfig.objective || 'OUTCOME_SALES',
      status: 'PAUSED',
      special_ad_categories: ['NONE'],
    });
    results.campaignId = campaignResult.id;
  }

  // Step 4: Create or use existing ad set
  if (adSetConfig.existingAdSetId) {
    results.adSetId = adSetConfig.existingAdSetId;
  } else {
    const adSetResult = await client.createAdSet(adAccountId, {
      name: adSetConfig.name || `AdSet_${formatDate(new Date())}`,
      campaign_id: results.campaignId,
      status: 'PAUSED',
      daily_budget: adSetConfig.dailyBudget || 500,
      billing_event: 'IMPRESSIONS',
      optimization_goal: adSetConfig.optimizationGoal || 'OFFSITE_CONVERSIONS',
      bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
      promoted_object: pixelId ? {
        pixel_id: pixelId,
        custom_event_type: adSetConfig.customEventType || 'ADD_TO_CART',
      } : undefined,
      targeting: adSetConfig.targeting || {
        geo_locations: { countries: ['US'] },
      },
    });
    results.adSetId = adSetResult.id;
  }

  // Step 5: Create ad
  const adResult = await client.createAd(adAccountId, {
    name: asset.fileName.replace(/\.[^/.]+$/, ''), // Remove extension
    adset_id: results.adSetId,
    creative: { creative_id: results.creativeId },
    status: 'PAUSED',
  });
  results.adId = adResult.id;

  return results;
}

/**
 * Build creative specification based on media type
 */
function buildCreativeSpec({ isVideo, pageId, mediaId, mediaHash, thumbnailUrl, adCopy, fileName }) {
  const name = fileName.replace(/\.[^/.]+$/, ''); // Remove extension

  if (isVideo) {
    return {
      name,
      object_story_spec: {
        page_id: pageId,
        video_data: {
          video_id: mediaId,
          image_url: thumbnailUrl,
          call_to_action: {
            type: adCopy.callToAction || 'LEARN_MORE',
            value: {
              link: adCopy.destinationUrl,
            },
          },
          message: adCopy.primaryText,
          title: adCopy.headline,
        },
      },
    };
  } else {
    return {
      name,
      object_story_spec: {
        page_id: pageId,
        link_data: {
          image_hash: mediaHash,
          link: adCopy.destinationUrl,
          message: adCopy.primaryText,
          name: adCopy.headline,
          description: adCopy.description,
          call_to_action: {
            type: adCopy.callToAction || 'LEARN_MORE',
          },
        },
      },
    };
  }
}

/**
 * Build multi-image creative (carousel-like)
 */
export function buildMultiImageCreativeSpec({
  pageId,
  images, // Array of { hash, link, headline, description }
  primaryText,
  callToAction,
}) {
  return {
    object_story_spec: {
      page_id: pageId,
      link_data: {
        message: primaryText,
        child_attachments: images.map((img) => ({
          image_hash: img.hash,
          link: img.link,
          name: img.headline,
          description: img.description,
          call_to_action: {
            type: callToAction || 'LEARN_MORE',
          },
        })),
      },
    },
  };
}

/**
 * Upload media only (without creating full ad)
 */
export async function uploadMedia({ accessToken, adAccountId, buffer, fileName, mimeType }) {
  const client = createMetaClient(accessToken);
  const isVideo = mimeType.startsWith('video/');

  if (isVideo) {
    const result = await client.uploadVideo(adAccountId, buffer, fileName);
    return { type: 'video', id: result.id };
  } else {
    const result = await client.uploadImage(adAccountId, buffer, fileName);
    const imageKey = Object.keys(result.images)[0];
    return { type: 'image', hash: result.images[imageKey].hash };
  }
}

/**
 * Create creative only
 */
export async function createCreativeOnly({
  accessToken,
  adAccountId,
  pageId,
  mediaType,
  mediaId,
  mediaHash,
  thumbnailUrl,
  adCopy,
  name,
}) {
  const client = createMetaClient(accessToken);

  const creativeSpec = buildCreativeSpec({
    isVideo: mediaType === 'video',
    pageId,
    mediaId,
    mediaHash,
    thumbnailUrl,
    adCopy,
    fileName: name,
  });

  return client.createCreative(adAccountId, creativeSpec);
}

// Helper functions
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatDate(date) {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}${m}${y}`;
}
