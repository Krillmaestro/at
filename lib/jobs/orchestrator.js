/**
 * Job Orchestrator
 * Manages the execution of ad creation jobs
 */

import { createClient } from '@supabase/supabase-js';
import { createDriveClient, isVideoFile } from '../google/drive';
import { createMetaClient } from '../meta/client';
import { analyzeAsset } from '../ai/analyzer';

/**
 * Job types
 */
export const JOB_TYPES = {
  SYNC_FOLDER: 'sync_folder',
  AI_ANALYSIS: 'ai_analysis',
  CREATE_ADS: 'create_ads',
  FULL_PIPELINE: 'full_pipeline',
};

/**
 * Job statuses
 */
export const JOB_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

/**
 * Create a job orchestrator instance
 */
export function createOrchestrator(supabaseUrl, supabaseKey) {
  const supabase = createClient(supabaseUrl, supabaseKey);

  /**
   * Create a new job
   */
  async function createJob(userId, type, config = {}) {
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        user_id: userId,
        type,
        config,
        status: JOB_STATUS.PENDING,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update job status
   */
  async function updateJob(jobId, updates) {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Process a sync folder job
   * Downloads file list from Google Drive and syncs to database
   */
  async function processSyncFolder(job, credentials) {
    const { googleAccessToken } = credentials;
    const { folderId, driveFolderId } = job.config;

    await updateJob(job.id, { status: JOB_STATUS.RUNNING, started_at: new Date().toISOString() });

    try {
      const drive = createDriveClient(googleAccessToken);
      const files = await drive.listAllFiles(folderId);

      // Get existing assets for this user
      const { data: existingAssets } = await supabase
        .from('assets')
        .select('drive_file_id')
        .eq('user_id', job.user_id);

      const existingIds = new Set(existingAssets?.map((a) => a.drive_file_id) || []);

      // Filter to new files only
      const newFiles = files.filter((f) => !existingIds.has(f.id));

      // Create job items for each new file
      const jobItems = [];
      for (const file of newFiles) {
        // Create asset record
        const { data: asset } = await supabase
          .from('assets')
          .insert({
            user_id: job.user_id,
            drive_folder_id: driveFolderId,
            drive_file_id: file.id,
            file_name: file.name,
            mime_type: file.mimeType,
            file_size: file.size ? parseInt(file.size) : null,
            thumbnail_url: file.thumbnailLink,
            web_view_link: file.webViewLink,
            status: 'pending',
          })
          .select()
          .single();

        // Create job item
        const { data: jobItem } = await supabase
          .from('job_items')
          .insert({
            job_id: job.id,
            asset_id: asset.id,
            status: 'completed',
          })
          .select()
          .single();

        jobItems.push(jobItem);
      }

      await updateJob(job.id, {
        status: JOB_STATUS.COMPLETED,
        completed_at: new Date().toISOString(),
        total_items: files.length,
        completed_items: newFiles.length,
        result: {
          total_files: files.length,
          new_files: newFiles.length,
          skipped_files: files.length - newFiles.length,
        },
      });

      return { success: true, newAssets: jobItems.length };
    } catch (error) {
      await updateJob(job.id, {
        status: JOB_STATUS.FAILED,
        completed_at: new Date().toISOString(),
        error_message: error.message,
      });
      throw error;
    }
  }

  /**
   * Process AI analysis job
   * Analyzes assets with OpenAI/Gemini
   */
  async function processAIAnalysis(job, credentials) {
    const { openaiKey, geminiKey, googleAccessToken } = credentials;
    const { assetIds } = job.config;

    await updateJob(job.id, { status: JOB_STATUS.RUNNING, started_at: new Date().toISOString() });

    try {
      // Get assets to analyze
      let query = supabase
        .from('assets')
        .select('*')
        .eq('user_id', job.user_id);

      if (assetIds && assetIds.length > 0) {
        query = query.in('id', assetIds);
      } else {
        query = query.eq('status', 'pending');
      }

      const { data: assets } = await query;

      if (!assets || assets.length === 0) {
        await updateJob(job.id, {
          status: JOB_STATUS.COMPLETED,
          completed_at: new Date().toISOString(),
          total_items: 0,
          completed_items: 0,
          result: { message: 'No assets to analyze' },
        });
        return { success: true, analyzed: 0 };
      }

      await updateJob(job.id, { total_items: assets.length });

      const drive = createDriveClient(googleAccessToken);
      let completed = 0;
      let failed = 0;

      for (const asset of assets) {
        // Create job item
        const { data: jobItem } = await supabase
          .from('job_items')
          .insert({
            job_id: job.id,
            asset_id: asset.id,
            status: 'processing',
            step: 'downloading',
          })
          .select()
          .single();

        try {
          // Update asset status
          await supabase
            .from('assets')
            .update({ status: 'downloading' })
            .eq('id', asset.id);

          // Download file from Google Drive
          const buffer = await drive.downloadFile(asset.drive_file_id);

          // Update status to analyzing
          await supabase.from('assets').update({ status: 'analyzing' }).eq('id', asset.id);
          await supabase.from('job_items').update({ step: 'analyzing' }).eq('id', jobItem.id);

          // Analyze with AI
          const analysis = await analyzeAsset({
            openaiKey,
            geminiKey,
            buffer: Buffer.from(buffer),
            mimeType: asset.mime_type,
          });

          // Save analysis results
          await supabase
            .from('assets')
            .update({
              status: 'analyzed',
              ai_analysis: analysis,
              ai_suggested_copy: analysis.adCopyVariations || null,
            })
            .eq('id', asset.id);

          await supabase
            .from('job_items')
            .update({ status: 'completed', step: 'done' })
            .eq('id', jobItem.id);

          completed++;
          await updateJob(job.id, { completed_items: completed, failed_items: failed });
        } catch (error) {
          failed++;
          await supabase
            .from('assets')
            .update({ status: 'failed', error_message: error.message })
            .eq('id', asset.id);

          await supabase
            .from('job_items')
            .update({ status: 'failed', error_message: error.message })
            .eq('id', jobItem.id);

          await updateJob(job.id, { completed_items: completed, failed_items: failed });
        }

        // Small delay to respect rate limits
        await sleep(1000);
      }

      await updateJob(job.id, {
        status: failed === assets.length ? JOB_STATUS.FAILED : JOB_STATUS.COMPLETED,
        completed_at: new Date().toISOString(),
        result: { total: assets.length, analyzed: completed, failed },
      });

      return { success: true, analyzed: completed, failed };
    } catch (error) {
      await updateJob(job.id, {
        status: JOB_STATUS.FAILED,
        completed_at: new Date().toISOString(),
        error_message: error.message,
      });
      throw error;
    }
  }

  /**
   * Process create ads job
   * Creates Meta ads from analyzed assets
   */
  async function processCreateAds(job, credentials) {
    const { metaAccessToken, googleAccessToken } = credentials;
    const { assetIds, adAccountId, pageId, pixelId, campaignConfig, adSetConfig, adCopy } = job.config;

    await updateJob(job.id, {
      status: JOB_STATUS.RUNNING,
      started_at: new Date().toISOString(),
      ad_account_id: adAccountId
    });

    try {
      // Get ad account details
      const { data: adAccount } = await supabase
        .from('ad_accounts')
        .select('*')
        .eq('id', adAccountId)
        .single();

      if (!adAccount) throw new Error('Ad account not found');

      // Get assets to process
      let query = supabase
        .from('assets')
        .select('*')
        .eq('user_id', job.user_id)
        .in('status', ['analyzed', 'uploaded']);

      if (assetIds && assetIds.length > 0) {
        query = query.in('id', assetIds);
      }

      const { data: assets } = await query;

      if (!assets || assets.length === 0) {
        await updateJob(job.id, {
          status: JOB_STATUS.COMPLETED,
          completed_at: new Date().toISOString(),
          total_items: 0,
          result: { message: 'No assets to process' },
        });
        return { success: true, created: 0 };
      }

      await updateJob(job.id, { total_items: assets.length });

      const meta = createMetaClient(metaAccessToken);
      const drive = createDriveClient(googleAccessToken);

      // Create campaign once
      let campaignId = campaignConfig?.existingCampaignId;
      if (!campaignId) {
        const campaign = await meta.createCampaign(adAccount.meta_account_id, {
          name: campaignConfig?.name || `Campaign_${formatDate(new Date())}`,
          objective: campaignConfig?.objective || 'OUTCOME_SALES',
          status: 'PAUSED',
          special_ad_categories: ['NONE'],
        });
        campaignId = campaign.id;

        // Save to database
        await supabase.from('campaigns').insert({
          user_id: job.user_id,
          ad_account_id: adAccountId,
          meta_campaign_id: campaignId,
          name: campaignConfig?.name || `Campaign_${formatDate(new Date())}`,
          objective: campaignConfig?.objective || 'OUTCOME_SALES',
        });
      }

      // Create ad set once
      let adSetId = adSetConfig?.existingAdSetId;
      if (!adSetId) {
        const adSet = await meta.createAdSet(adAccount.meta_account_id, {
          name: adSetConfig?.name || `AdSet_${formatDate(new Date())}`,
          campaign_id: campaignId,
          status: 'PAUSED',
          daily_budget: adSetConfig?.dailyBudget || 500,
          billing_event: 'IMPRESSIONS',
          optimization_goal: adSetConfig?.optimizationGoal || 'OFFSITE_CONVERSIONS',
          bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
          promoted_object: pixelId ? {
            pixel_id: pixelId,
            custom_event_type: adSetConfig?.customEventType || 'ADD_TO_CART',
          } : undefined,
          targeting: adSetConfig?.targeting || { geo_locations: { countries: ['US'] } },
        });
        adSetId = adSet.id;

        // Save to database
        await supabase.from('ad_sets').insert({
          user_id: job.user_id,
          campaign_id: campaignId,
          meta_adset_id: adSetId,
          name: adSetConfig?.name || `AdSet_${formatDate(new Date())}`,
          daily_budget: adSetConfig?.dailyBudget || 500,
          pixel_id: pixelId,
        });
      }

      let completed = 0;
      let failed = 0;

      for (const asset of assets) {
        const { data: jobItem } = await supabase
          .from('job_items')
          .insert({
            job_id: job.id,
            asset_id: asset.id,
            status: 'processing',
            step: 'uploading_media',
          })
          .select()
          .single();

        try {
          const isVideo = isVideoFile(asset.mime_type);
          let mediaId = asset.meta_asset_id;
          let mediaHash = asset.meta_asset_hash;

          // Upload media if not already uploaded
          if (!mediaId && !mediaHash) {
            const buffer = await drive.downloadFile(asset.drive_file_id);

            if (isVideo) {
              const upload = await meta.uploadVideo(adAccount.meta_account_id, Buffer.from(buffer), asset.file_name);
              mediaId = upload.id;

              // Wait for video processing
              let videoReady = false;
              for (let i = 0; i < 30 && !videoReady; i++) {
                await sleep(3000);
                try {
                  const status = await meta.getVideoStatus(mediaId);
                  if (status.status?.video_status === 'ready') {
                    videoReady = true;
                  }
                } catch (e) {
                  // Continue waiting
                }
              }
            } else {
              const upload = await meta.uploadImage(adAccount.meta_account_id, Buffer.from(buffer), asset.file_name);
              const imageKey = Object.keys(upload.images)[0];
              mediaHash = upload.images[imageKey].hash;
            }

            // Save media IDs to asset
            await supabase
              .from('assets')
              .update({
                status: 'uploaded',
                meta_asset_id: mediaId,
                meta_asset_hash: mediaHash,
              })
              .eq('id', asset.id);
          }

          // Get ad copy (from AI suggestions or provided copy)
          const copy = adCopy || asset.ai_suggested_copy?.[0] || {
            primaryText: '',
            headline: asset.file_name.replace(/\.[^/.]+$/, ''),
            description: '',
            callToAction: 'LEARN_MORE',
            destinationUrl: adSetConfig?.destinationUrl || 'https://example.com',
          };

          await supabase.from('job_items').update({ step: 'creating_creative' }).eq('id', jobItem.id);

          // Create creative
          const creativeSpec = isVideo
            ? {
                name: asset.file_name,
                object_story_spec: {
                  page_id: pageId || adAccount.meta_page_id,
                  video_data: {
                    video_id: mediaId,
                    image_url: asset.thumbnail_url,
                    message: copy.primaryText,
                    title: copy.headline,
                    call_to_action: {
                      type: copy.callToAction || copy.suggestedCta || 'LEARN_MORE',
                      value: { link: copy.destinationUrl },
                    },
                  },
                },
              }
            : {
                name: asset.file_name,
                object_story_spec: {
                  page_id: pageId || adAccount.meta_page_id,
                  link_data: {
                    image_hash: mediaHash,
                    link: copy.destinationUrl,
                    message: copy.primaryText,
                    name: copy.headline,
                    description: copy.description,
                    call_to_action: {
                      type: copy.callToAction || copy.suggestedCta || 'LEARN_MORE',
                    },
                  },
                },
              };

          const creative = await meta.createCreative(adAccount.meta_account_id, creativeSpec);

          // Save creative to database
          const { data: creativeRecord } = await supabase
            .from('creatives')
            .insert({
              user_id: job.user_id,
              ad_account_id: adAccountId,
              asset_id: asset.id,
              meta_creative_id: creative.id,
              name: asset.file_name,
              primary_text: copy.primaryText,
              headline: copy.headline,
              description: copy.description,
              call_to_action: copy.callToAction || copy.suggestedCta,
              destination_url: copy.destinationUrl,
              creative_type: isVideo ? 'single_video' : 'single_image',
              status: 'created',
            })
            .select()
            .single();

          await supabase.from('job_items').update({ step: 'creating_ad' }).eq('id', jobItem.id);

          // Create ad
          const ad = await meta.createAd(adAccount.meta_account_id, {
            name: asset.file_name.replace(/\.[^/.]+$/, ''),
            adset_id: adSetId,
            creative: { creative_id: creative.id },
            status: 'PAUSED',
          });

          // Save ad to database
          await supabase.from('ads').insert({
            user_id: job.user_id,
            ad_set_id: adSetId,
            creative_id: creativeRecord.id,
            meta_ad_id: ad.id,
            name: asset.file_name.replace(/\.[^/.]+$/, ''),
          });

          await supabase
            .from('job_items')
            .update({
              status: 'completed',
              step: 'done',
              meta_ids: {
                campaign_id: campaignId,
                adset_id: adSetId,
                creative_id: creative.id,
                ad_id: ad.id,
              },
            })
            .eq('id', jobItem.id);

          completed++;
          await updateJob(job.id, { completed_items: completed, failed_items: failed });

          // Rate limiting delay
          await sleep(2000);
        } catch (error) {
          failed++;
          await supabase
            .from('job_items')
            .update({ status: 'failed', error_message: error.message })
            .eq('id', jobItem.id);

          await updateJob(job.id, { completed_items: completed, failed_items: failed });
        }
      }

      await updateJob(job.id, {
        status: failed === assets.length ? JOB_STATUS.FAILED : JOB_STATUS.COMPLETED,
        completed_at: new Date().toISOString(),
        result: {
          campaign_id: campaignId,
          adset_id: adSetId,
          total: assets.length,
          created: completed,
          failed,
        },
      });

      return { success: true, campaignId, adSetId, created: completed, failed };
    } catch (error) {
      await updateJob(job.id, {
        status: JOB_STATUS.FAILED,
        completed_at: new Date().toISOString(),
        error_message: error.message,
      });
      throw error;
    }
  }

  /**
   * Process full pipeline job
   * Runs sync → analysis → ad creation
   */
  async function processFullPipeline(job, credentials) {
    const { folderId, driveFolderId, adAccountId, pageId, pixelId, campaignConfig, adSetConfig, adCopy } = job.config;

    await updateJob(job.id, { status: JOB_STATUS.RUNNING, started_at: new Date().toISOString() });

    try {
      // Step 1: Sync folder
      const syncJob = await createJob(job.user_id, JOB_TYPES.SYNC_FOLDER, { folderId, driveFolderId });
      await processSyncFolder(syncJob, credentials);

      // Step 2: AI Analysis
      const analysisJob = await createJob(job.user_id, JOB_TYPES.AI_ANALYSIS, {});
      await processAIAnalysis(analysisJob, credentials);

      // Step 3: Create Ads
      const adsJob = await createJob(job.user_id, JOB_TYPES.CREATE_ADS, {
        adAccountId,
        pageId,
        pixelId,
        campaignConfig,
        adSetConfig,
        adCopy,
      });
      const result = await processCreateAds(adsJob, credentials);

      await updateJob(job.id, {
        status: JOB_STATUS.COMPLETED,
        completed_at: new Date().toISOString(),
        result: {
          ...result,
          sync_job_id: syncJob.id,
          analysis_job_id: analysisJob.id,
          ads_job_id: adsJob.id,
        },
      });

      return result;
    } catch (error) {
      await updateJob(job.id, {
        status: JOB_STATUS.FAILED,
        completed_at: new Date().toISOString(),
        error_message: error.message,
      });
      throw error;
    }
  }

  /**
   * Main job processor - routes to appropriate handler
   */
  async function processJob(jobId, credentials) {
    const { data: job, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error || !job) {
      throw new Error('Job not found');
    }

    switch (job.type) {
      case JOB_TYPES.SYNC_FOLDER:
        return processSyncFolder(job, credentials);
      case JOB_TYPES.AI_ANALYSIS:
        return processAIAnalysis(job, credentials);
      case JOB_TYPES.CREATE_ADS:
        return processCreateAds(job, credentials);
      case JOB_TYPES.FULL_PIPELINE:
        return processFullPipeline(job, credentials);
      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }
  }

  return {
    createJob,
    updateJob,
    processJob,
    processSyncFolder,
    processAIAnalysis,
    processCreateAds,
    processFullPipeline,
  };
}

// Helpers
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatDate(date) {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}${m}${y}`;
}
