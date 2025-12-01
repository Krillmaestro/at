/**
 * AI Analysis Service
 * Analyzes images with OpenAI Vision and videos with Google Gemini
 */

import { IMAGE_ANALYSIS_PROMPT, VIDEO_ANALYSIS_PROMPT } from './prompts';

/**
 * Analyze an image using OpenAI Vision
 * @param {string} apiKey - OpenAI API key
 * @param {string|ArrayBuffer} image - Image URL or base64 data
 * @returns {Promise<object>} - Analysis results
 */
export async function analyzeImage(apiKey, image) {
  // Convert ArrayBuffer to base64 if needed
  let imageContent;
  if (image instanceof ArrayBuffer) {
    const base64 = Buffer.from(image).toString('base64');
    imageContent = {
      type: 'image_url',
      image_url: {
        url: `data:image/jpeg;base64,${base64}`,
      },
    };
  } else if (image.startsWith('data:') || image.startsWith('http')) {
    imageContent = {
      type: 'image_url',
      image_url: { url: image },
    };
  } else {
    // Assume it's base64
    imageContent = {
      type: 'image_url',
      image_url: {
        url: `data:image/jpeg;base64,${image}`,
      },
    };
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            imageContent,
            { type: 'text', text: IMAGE_ANALYSIS_PROMPT },
          ],
        },
      ],
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  try {
    return JSON.parse(content);
  } catch (e) {
    throw new Error('Failed to parse AI response as JSON');
  }
}

/**
 * Analyze a video using Google Gemini
 * @param {string} apiKey - Google AI API key
 * @param {ArrayBuffer} videoBuffer - Video file buffer
 * @param {string} mimeType - Video MIME type
 * @returns {Promise<object>} - Analysis results
 */
export async function analyzeVideo(apiKey, videoBuffer, mimeType = 'video/mp4') {
  // Step 1: Upload video to Gemini Files API
  const uploadUrl = await initiateVideoUpload(apiKey, videoBuffer.byteLength, mimeType);
  const fileUri = await uploadVideoChunks(uploadUrl, videoBuffer);

  // Step 2: Wait for video processing
  const file = await waitForVideoProcessing(apiKey, fileUri);

  // Step 3: Analyze with Gemini
  const analysis = await generateVideoAnalysis(apiKey, file.uri, mimeType);

  return analysis;
}

/**
 * Initiate resumable upload to Gemini
 */
async function initiateVideoUpload(apiKey, fileSize, mimeType) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'X-Goog-Upload-Protocol': 'resumable',
        'X-Goog-Upload-Command': 'start',
        'X-Goog-Upload-Header-Content-Length': fileSize.toString(),
        'X-Goog-Upload-Header-Content-Type': mimeType,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: { displayName: 'video_for_analysis' },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to initiate upload: ${response.statusText}`);
  }

  return response.headers.get('X-Goog-Upload-URL');
}

/**
 * Upload video chunks
 */
async function uploadVideoChunks(uploadUrl, videoBuffer) {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'X-Goog-Upload-Command': 'upload, finalize',
      'X-Goog-Upload-Offset': '0',
      'Content-Type': 'application/octet-stream',
    },
    body: videoBuffer,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload video: ${response.statusText}`);
  }

  const data = await response.json();
  return data.file.name;
}

/**
 * Wait for video to finish processing
 */
async function waitForVideoProcessing(apiKey, fileName, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${fileName}?key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Failed to check file status: ${response.statusText}`);
    }

    const file = await response.json();

    if (file.state === 'ACTIVE') {
      return file;
    } else if (file.state === 'FAILED') {
      throw new Error('Video processing failed');
    }

    // Wait 3 seconds before next check
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  throw new Error('Video processing timeout');
}

/**
 * Generate analysis using Gemini
 */
async function generateVideoAnalysis(apiKey, fileUri, mimeType) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                fileData: {
                  mimeType,
                  fileUri,
                },
              },
              {
                text: VIDEO_ANALYSIS_PROMPT,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error('No content in Gemini response');
  }

  try {
    return JSON.parse(content);
  } catch (e) {
    // Try to extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse Gemini response as JSON');
  }
}

/**
 * Analyze an asset (auto-detects image vs video)
 */
export async function analyzeAsset({ openaiKey, geminiKey, buffer, mimeType }) {
  if (mimeType.startsWith('video/')) {
    if (!geminiKey) {
      throw new Error('Gemini API key required for video analysis');
    }
    return analyzeVideo(geminiKey, buffer, mimeType);
  } else if (mimeType.startsWith('image/')) {
    if (!openaiKey) {
      throw new Error('OpenAI API key required for image analysis');
    }
    return analyzeImage(openaiKey, buffer);
  } else {
    throw new Error(`Unsupported mime type: ${mimeType}`);
  }
}

/**
 * Generate ad copy suggestions using OpenAI
 */
export async function generateAdCopy(apiKey, context) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert Facebook/Instagram ad copywriter. Generate compelling, concise ad copy.',
        },
        {
          role: 'user',
          content: `Generate 3 ad copy variations for:
Product: ${context.product}
Target audience: ${context.audience}
Tone: ${context.tone || 'professional'}
Key benefit: ${context.benefit}

Return JSON with format:
{
  "variations": [
    {"primaryText": "...", "headline": "...", "description": "...", "cta": "SHOP_NOW"}
  ]
}`,
        },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}
