/**
 * API Route: Get/Update/Delete asset
 * GET/PATCH/DELETE /api/assets/[id]
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    switch (req.method) {
      case 'GET': {
        const { data: asset, error } = await supabase
          .from('assets')
          .select(`
            *,
            creatives (
              id,
              meta_creative_id,
              name,
              primary_text,
              headline,
              status
            )
          `)
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error || !asset) {
          return res.status(404).json({ error: 'Asset not found' });
        }

        return res.status(200).json({ asset });
      }

      case 'PATCH': {
        const updates = req.body;

        // Only allow certain fields to be updated
        const allowedFields = ['status', 'ai_analysis', 'ai_suggested_copy'];
        const filteredUpdates = Object.fromEntries(
          Object.entries(updates).filter(([key]) => allowedFields.includes(key))
        );

        const { data: asset, error } = await supabase
          .from('assets')
          .update(filteredUpdates)
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        return res.status(200).json({ asset });
      }

      case 'DELETE': {
        const { error } = await supabase
          .from('assets')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        return res.status(200).json({ success: true });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling asset:', error);
    return res.status(500).json({ error: error.message });
  }
}
