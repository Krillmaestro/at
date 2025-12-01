/**
 * API Route: List assets
 * GET /api/assets/list
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
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { status, folderId, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('assets')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    if (folderId) {
      query = query.eq('drive_folder_id', folderId);
    }

    const { data: assets, error, count } = await query;

    if (error) {
      throw error;
    }

    return res.status(200).json({ assets, total: count });
  } catch (error) {
    console.error('Error listing assets:', error);
    return res.status(500).json({ error: error.message });
  }
}
