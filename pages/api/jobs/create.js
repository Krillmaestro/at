/**
 * API Route: Create a new job
 * POST /api/jobs/create
 */

import { createClient } from '@supabase/supabase-js';
import { createOrchestrator, JOB_TYPES } from '../../../lib/jobs/orchestrator';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user from session/token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { type, config, runImmediately = false } = req.body;

    // Validate job type
    if (!Object.values(JOB_TYPES).includes(type)) {
      return res.status(400).json({ error: 'Invalid job type' });
    }

    const orchestrator = createOrchestrator(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Create the job
    const job = await orchestrator.createJob(user.id, type, config);

    // If runImmediately, start processing (in background for production)
    if (runImmediately) {
      // Get credentials from user settings or config
      const { data: settings } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const { data: adAccount } = await supabase
        .from('ad_accounts')
        .select('*')
        .eq('id', config.adAccountId || settings?.default_ad_account_id)
        .single();

      // In production, this should be a background job
      // For now, we'll process synchronously (not recommended for large jobs)
      const credentials = {
        metaAccessToken: adAccount?.access_token || process.env.META_ACCESS_TOKEN,
        googleAccessToken: req.headers['x-google-token'] || process.env.GOOGLE_ACCESS_TOKEN,
        openaiKey: process.env.OPENAI_API_KEY,
        geminiKey: process.env.GOOGLE_AI_API_KEY,
      };

      // Start processing in background
      orchestrator.processJob(job.id, credentials).catch(console.error);
    }

    // Log activity
    await supabase.rpc('log_activity', {
      p_user_id: user.id,
      p_action: 'job_created',
      p_entity_type: 'job',
      p_entity_id: job.id,
      p_job_id: job.id,
      p_details: { type, config },
    });

    return res.status(200).json({ job });
  } catch (error) {
    console.error('Error creating job:', error);
    return res.status(500).json({ error: error.message });
  }
}
