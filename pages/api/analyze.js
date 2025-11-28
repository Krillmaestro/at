// Landing Page Analyzer API
// This API endpoint analyzes landing pages using AI

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, industry, goal } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Step 1: Fetch the landing page HTML
    const pageResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const html = await pageResponse.text();

    // Step 2: Extract page elements
    const pageData = extractPageElements(html, url);

    // Step 3: Generate screenshot URL (using screenshot API)
    const screenshotUrl = `https://api.screenshotone.com/take?url=${encodeURIComponent(url)}&viewport_width=1280&viewport_height=800&format=jpg&cache=true&access_key=demo`;

    // Step 4: Return extracted data for client-side AI analysis
    return res.status(200).json({
      success: true,
      pageData: {
        ...pageData,
        screenshot_url: screenshotUrl,
        industry: industry || 'General',
        goal: goal || 'Generate Leads',
        analyzed_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({
      error: 'Failed to analyze page',
      message: error.message
    });
  }
}

function extractPageElements(html, url) {
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const pageTitle = titleMatch ? titleMatch[1].trim() : 'No title found';

  // Extract meta description
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                        html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
  const metaDescription = metaDescMatch ? metaDescMatch[1] : 'No meta description';

  // Extract headings
  const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  const h1s = h1Matches.map(h => h.replace(/<[^>]*>/g, '').trim()).filter(h => h.length > 0).slice(0, 5);

  const h2Matches = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [];
  const h2s = h2Matches.map(h => h.replace(/<[^>]*>/g, '').trim()).filter(h => h.length > 0).slice(0, 10);

  // Extract CTAs
  const ctaPattern = /(get started|buy now|sign up|subscribe|download|learn more|contact|book|try|start|join|register|free|demo|quote|call)/gi;
  const buttonMatches = html.match(/<button[^>]*>([\s\S]*?)<\/button>/gi) || [];
  const linkMatches = html.match(/<a[^>]*>([\s\S]*?)<\/a>/gi) || [];
  const allCTAs = [...buttonMatches, ...linkMatches]
    .map(cta => cta.replace(/<[^>]*>/g, '').trim())
    .filter(text => text.length > 0 && text.length < 50 && ctaPattern.test(text))
    .slice(0, 10);

  // Count forms
  const formCount = (html.match(/<form/gi) || []).length;

  // Check for common frameworks/tools
  const hasReact = html.includes('react') || html.includes('__NEXT');
  const hasBootstrap = html.includes('bootstrap');
  const hasTailwind = html.includes('tailwind');
  const hasGA = html.includes('google-analytics') || html.includes('gtag') || html.includes('GA-') || html.includes('G-');
  const hasFBPixel = html.includes('facebook') || html.includes('fbq');
  const hasHotjar = html.includes('hotjar');

  // Extract word count
  const textContent = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = textContent.split(/\s+/).length;

  // Check mobile viewport
  const hasMobileViewport = html.includes('viewport') && html.includes('width=device-width');

  // Extract images
  const imgMatches = html.match(/<img[^>]*>/gi) || [];
  const imageCount = imgMatches.length;
  const hasAltTags = imgMatches.filter(img => /alt=["'][^"']+["']/i.test(img)).length;

  // Check for SSL
  const hasSSL = url.startsWith('https');

  // Check for social proof indicators
  const hasSocialProof = html.toLowerCase().includes('testimonial') ||
                         html.toLowerCase().includes('review') ||
                         html.toLowerCase().includes('customer') ||
                         html.toLowerCase().includes('trusted by');

  // Check for urgency elements
  const hasUrgency = html.toLowerCase().includes('limited') ||
                     html.toLowerCase().includes('hurry') ||
                     html.toLowerCase().includes('now') ||
                     html.toLowerCase().includes('today only');

  // Extract colors (basic)
  const colorMatches = html.match(/#[0-9A-Fa-f]{6}|rgb\([^)]+\)/g) || [];
  const uniqueColors = [...new Set(colorMatches)].slice(0, 10);

  return {
    url: url,
    page_title: pageTitle,
    meta_description: metaDescription,
    h1_headings: h1s,
    h2_headings: h2s,
    cta_buttons: allCTAs,
    form_count: formCount,
    word_count: wordCount,
    image_count: imageCount,
    images_with_alt: hasAltTags,
    has_mobile_viewport: hasMobileViewport,
    has_ssl: hasSSL,
    has_social_proof: hasSocialProof,
    has_urgency: hasUrgency,
    detected_tech: {
      react: hasReact,
      bootstrap: hasBootstrap,
      tailwind: hasTailwind,
      google_analytics: hasGA,
      facebook_pixel: hasFBPixel,
      hotjar: hasHotjar
    },
    colors_detected: uniqueColors,
    html_length: html.length,
    text_content_preview: textContent.substring(0, 1000)
  };
}
