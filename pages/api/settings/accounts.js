/**
 * API Route: Manage ad accounts
 * GET/POST /api/settings/accounts
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
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

    switch (req.method) {
      case 'GET': {
        const { data: accounts, error } = await supabase
          .from('ad_accounts')
          .select('id, name, meta_account_id, meta_page_id, meta_pixel_id, is_active, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        return res.status(200).json({ accounts });
      }

      case 'POST': {
        const {
          name,
          metaAccountId,
          metaPageId,
          metaPixelId,
          metaInstagramId,
          accessToken,
        } = req.body;

        if (!name || !metaAccountId || !metaPageId || !accessToken) {
          return res.status(400).json({
            error: 'Missing required fields: name, metaAccountId, metaPageId, accessToken',
          });
        }

        const { data: account, error } = await supabase
          .from('ad_accounts')
          .insert({
            user_id: user.id,
            name,
            meta_account_id: metaAccountId,
            meta_page_id: metaPageId,
            meta_pixel_id: metaPixelId,
            meta_instagram_id: metaInstagramId,
            access_token: accessToken,
          })
          .select('id, name, meta_account_id, meta_page_id, meta_pixel_id, is_active, created_at')
          .single();

        if (error) {
          if (error.code === '23505') {
            return res.status(400).json({ error: 'Ad account already exists' });
          }
          throw error;
        }

        return res.status(201).json({ account });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error managing accounts:', error);
    return res.status(500).json({ error: error.message });
  }
}
