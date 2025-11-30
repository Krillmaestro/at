export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, email } = req.body;

  // Validate inputs
  if (!url || !email) {
    return res.status(400).json({ error: 'URL and email are required' });
  }

  // Validate URL format
  try {
    new URL(url);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    // Replace with your actual n8n webhook URL
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'YOUR_N8N_WEBHOOK_URL_HERE';

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'Landing Page Url': url,
        'Email': email,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to trigger analysis');
    }

    return res.status(200).json({
      success: true,
      message: 'Analysis started. Check your email for results.'
    });
  } catch (error) {
    console.error('Error triggering n8n workflow:', error);
    return res.status(500).json({
      error: 'Failed to start analysis. Please try again later.'
    });
  }
}
