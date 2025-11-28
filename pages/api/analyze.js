// Enhanced Landing Page Analyzer API
// Extracts page data and optionally triggers n8n workflow for email

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, industry, goal, email, n8nWebhookUrl } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Step 1: Fetch the landing page HTML
    const pageResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });

    const html = await pageResponse.text();

    // Step 2: Extract page elements
    const pageData = extractPageElements(html, url);

    // Step 3: Generate screenshot URL (free service)
    const screenshotUrl = `https://image.thum.io/get/width/1280/crop/800/noanimate/${encodeURIComponent(url)}`;

    // Step 4: If n8n webhook URL and email provided, trigger the workflow
    if (n8nWebhookUrl && email) {
      try {
        fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            'Landing Page URL': url,
            "What's your industry?": industry || 'General',
            'Primary goal of this page': goal || 'Generate Leads',
            'Current conversion rate (if known)': 'Unknown',
            'Biggest frustration with current page': 'Dashboard analysis',
            'Your Email': email
          })
        }).catch(err => console.log('n8n webhook triggered'));
      } catch (e) {
        console.log('n8n trigger attempted');
      }
    }

    // Step 5: Return extracted data
    return res.status(200).json({
      success: true,
      pageData: {
        ...pageData,
        screenshot_url: screenshotUrl,
        industry: industry || 'General',
        goal: goal || 'Generate Leads',
        user_email: email || null,
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
  const ctaPattern = /(get started|buy now|sign up|subscribe|download|learn more|contact|book|try|start|join|register|free|demo|quote|call|shop|order|add to cart)/gi;
  const buttonMatches = html.match(/<button[^>]*>([\s\S]*?)<\/button>/gi) || [];
  const linkMatches = html.match(/<a[^>]*>([\s\S]*?)<\/a>/gi) || [];
  const allCTAs = [...buttonMatches, ...linkMatches]
    .map(cta => cta.replace(/<[^>]*>/g, '').trim())
    .filter(text => text.length > 0 && text.length < 50 && ctaPattern.test(text))
    .slice(0, 10);

  // Count forms
  const formCount = (html.match(/<form/gi) || []).length;
  const inputCount = (html.match(/<input/gi) || []).length;

  // Check for common frameworks/tools
  const hasReact = html.includes('react') || html.includes('__NEXT') || html.includes('_next');
  const hasWordPress = html.includes('wp-content') || html.includes('wordpress');
  const hasShopify = html.includes('shopify') || html.includes('cdn.shopify');
  const hasWebflow = html.includes('webflow');
  const hasBootstrap = html.includes('bootstrap');
  const hasTailwind = html.includes('tailwind');
  const hasGA = html.includes('google-analytics') || html.includes('gtag') || html.includes('GA-') || html.includes('G-');
  const hasGTM = html.includes('googletagmanager');
  const hasFBPixel = html.includes('facebook') || html.includes('fbq');
  const hasHotjar = html.includes('hotjar');
  const hasHubspot = html.includes('hubspot') || html.includes('hs-scripts');

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
  const imagesWithAlt = imgMatches.filter(img => /alt=["'][^"']+["']/i.test(img)).length;

  // Check for SSL
  const hasSSL = url.startsWith('https');

  // Social proof
  const hasSocialProof = html.toLowerCase().includes('testimonial') ||
                         html.toLowerCase().includes('review') ||
                         html.toLowerCase().includes('customer') ||
                         html.toLowerCase().includes('trusted by') ||
                         html.toLowerCase().includes('client');

  // Trust badges
  const hasTrustBadges = html.toLowerCase().includes('secure') ||
                         html.toLowerCase().includes('guarantee') ||
                         html.toLowerCase().includes('money back') ||
                         html.toLowerCase().includes('certified');

  // Urgency
  const hasUrgency = html.toLowerCase().includes('limited') ||
                     html.toLowerCase().includes('hurry') ||
                     html.toLowerCase().includes('now') ||
                     html.toLowerCase().includes('today only') ||
                     html.toLowerCase().includes('expires');

  // Pricing
  const hasPricing = html.includes('$') || html.includes('€') || html.includes('£') ||
                     html.toLowerCase().includes('/month') ||
                     html.toLowerCase().includes('/year');

  // FAQ
  const hasFAQ = html.toLowerCase().includes('faq') || html.toLowerCase().includes('frequently asked');

  // Videos
  const videoCount = (html.match(/<video/gi) || []).length +
                     (html.match(/youtube|vimeo|wistia/gi) || []).length;

  // Social links
  const socialPlatforms = ['facebook.com', 'twitter.com', 'linkedin.com', 'instagram.com', 'youtube.com'];
  const socialLinks = socialPlatforms.filter(p => html.toLowerCase().includes(p));

  // Page size
  const htmlSize = html.length;

  return {
    url,
    page_title: pageTitle,
    meta_description: metaDescription,
    h1_headings: h1s,
    h2_headings: h2s,
    cta_buttons: allCTAs,
    form_count: formCount,
    input_count: inputCount,
    word_count: wordCount,
    image_count: imageCount,
    images_with_alt: imagesWithAlt,
    video_count: videoCount,
    has_mobile_viewport: hasMobileViewport,
    has_ssl: hasSSL,
    has_social_proof: hasSocialProof,
    has_trust_badges: hasTrustBadges,
    has_urgency: hasUrgency,
    has_pricing: hasPricing,
    has_faq: hasFAQ,
    social_links: socialLinks,
    detected_tech: {
      framework: hasReact ? 'React/Next.js' : hasWordPress ? 'WordPress' : hasShopify ? 'Shopify' : hasWebflow ? 'Webflow' : null,
      css: hasBootstrap ? 'Bootstrap' : hasTailwind ? 'Tailwind' : null,
      google_analytics: hasGA,
      google_tag_manager: hasGTM,
      facebook_pixel: hasFBPixel,
      hotjar: hasHotjar,
      hubspot: hasHubspot
    },
    html_size_kb: Math.round(htmlSize / 1024),
    text_preview: textContent.substring(0, 1500)
  };
}
