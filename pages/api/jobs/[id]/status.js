/**
 * API Route: Get job status
 * GET /api/jobs/[id]/status
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

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

    // Get job with items
    const { data: job, error } = await supabase
      .from('jobs')
      .select(`
        *,
        job_items (
          id,
          asset_id,
          status,
          step,
          error_message,
          meta_ids,
          updated_at
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    return res.status(200).json({ job });
  } catch (error) {
    console.error('Error getting job status:', error);
    return res.status(500).json({ error: error.message });
  }
}
