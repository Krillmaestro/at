/**
 * AI Prompt Templates
 * Prompts for analyzing images and videos for ad creation
 */

export const IMAGE_ANALYSIS_PROMPT = `
You are an expert digital marketer analyzing an image for use in Facebook and Instagram advertisements.

Analyze this image and provide a detailed assessment including:

1. **Description**: A concise description of what's shown in the image
2. **Product/Service**: What product or service appears to be advertised (if apparent)
3. **Visual Style**: The aesthetic, mood, and visual appeal
4. **Target Audience**: Demographics and interests this would appeal to
5. **Emotional Appeal**: The emotions this image evokes
6. **Best Placements**: Which Meta ad placements suit this image:
   - FEED (Facebook/Instagram feed)
   - STORY (Stories)
   - REELS (Reels)
   - RIGHT_COLUMN (Facebook right column)
7. **Strengths**: What makes this image effective for advertising
8. **Suggestions**: Any improvements that could enhance performance

Additionally, generate 3 variations of ad copy that would work well with this image:
- Primary Text (max 125 characters): The main message
- Headline (max 40 characters): Attention-grabbing headline
- Description (max 30 characters): Supporting text
- Suggested CTA: LEARN_MORE, SHOP_NOW, SIGN_UP, GET_OFFER, BOOK_NOW, CONTACT_US, DOWNLOAD, GET_QUOTE

Return your response as valid JSON with this exact structure:
{
  "description": "...",
  "product": "...",
  "visualStyle": "...",
  "targetAudience": {
    "demographics": "...",
    "interests": ["...", "..."]
  },
  "emotionalAppeal": "...",
  "bestPlacements": ["FEED", "STORY"],
  "strengths": ["...", "..."],
  "suggestions": ["...", "..."],
  "adCopyVariations": [
    {
      "primaryText": "...",
      "headline": "...",
      "description": "...",
      "suggestedCta": "SHOP_NOW"
    },
    {
      "primaryText": "...",
      "headline": "...",
      "description": "...",
      "suggestedCta": "LEARN_MORE"
    },
    {
      "primaryText": "...",
      "headline": "...",
      "description": "...",
      "suggestedCta": "GET_OFFER"
    }
  ]
}
`;

export const VIDEO_ANALYSIS_PROMPT = `
You are an expert digital marketer analyzing a video advertisement for Facebook and Instagram.

Watch this video carefully and provide a comprehensive analysis:

1. **Description**: A summary of what happens in the video
2. **Duration Assessment**: Is the length appropriate for social ads?
3. **Key Messages**: Main points or messages conveyed
4. **Visual Quality**: Production quality and visual appeal
5. **Audio/Music**: Assessment of sound design (if present)
6. **Hook**: Does it capture attention in the first 3 seconds?
7. **Target Audience**: Who this video would appeal to
8. **Emotional Journey**: How the video makes viewers feel
9. **Call to Action**: Any CTA present in the video
10. **Best Placements**: Recommended Meta ad placements:
    - FEED (Facebook/Instagram feed)
    - STORY (Stories - vertical format works best)
    - REELS (Reels - vertical, engaging content)
    - IN_STREAM (In-stream video ads)

Generate 3 variations of ad copy to accompany this video:
- Primary Text (max 125 characters)
- Headline (max 40 characters)
- Description (max 30 characters)
- Suggested CTA: LEARN_MORE, SHOP_NOW, SIGN_UP, WATCH_MORE, GET_OFFER, BOOK_NOW

Return your response as valid JSON with this exact structure:
{
  "description": "...",
  "durationAssessment": "...",
  "keyMessages": ["...", "..."],
  "visualQuality": "...",
  "audioAssessment": "...",
  "hookEffectiveness": "...",
  "targetAudience": {
    "demographics": "...",
    "interests": ["...", "..."]
  },
  "emotionalJourney": "...",
  "existingCta": "...",
  "bestPlacements": ["FEED", "REELS"],
  "strengths": ["...", "..."],
  "improvements": ["...", "..."],
  "adCopyVariations": [
    {
      "primaryText": "...",
      "headline": "...",
      "description": "...",
      "suggestedCta": "SHOP_NOW"
    },
    {
      "primaryText": "...",
      "headline": "...",
      "description": "...",
      "suggestedCta": "LEARN_MORE"
    },
    {
      "primaryText": "...",
      "headline": "...",
      "description": "...",
      "suggestedCta": "WATCH_MORE"
    }
  ]
}
`;

export const AD_COPY_GENERATION_PROMPT = `
You are an expert copywriter specializing in Facebook and Instagram advertisements.

Based on the following information about a product/service, generate compelling ad copy variations.

Product/Service: {product}
Target Audience: {audience}
Key Benefits: {benefits}
Tone: {tone}
Destination URL purpose: {urlPurpose}

Generate 5 unique ad copy variations. Each should have a different angle or approach:
1. Problem-Solution focused
2. Benefit-driven
3. Emotional appeal
4. Social proof/FOMO
5. Direct offer/promotion

For each variation provide:
- Primary Text (max 125 characters): Compelling main message
- Headline (max 40 characters): Attention-grabbing
- Description (max 30 characters): Supporting text
- Suggested CTA: Best call-to-action button

Return as JSON:
{
  "variations": [
    {
      "approach": "Problem-Solution",
      "primaryText": "...",
      "headline": "...",
      "description": "...",
      "suggestedCta": "..."
    }
  ]
}
`;

/**
 * Build prompt with variables replaced
 */
export function buildPrompt(template, variables = {}) {
  let prompt = template;
  for (const [key, value] of Object.entries(variables)) {
    prompt = prompt.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return prompt;
}
