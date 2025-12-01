/**
 * Meta Graph API Client
 * Core client for interacting with Facebook/Meta Ads API
 */

const META_API_VERSION = 'v23.0';
const META_GRAPH_URL = 'https://graph.facebook.com';
const META_VIDEO_URL = 'https://graph-video.facebook.com';

class MetaApiError extends Error {
  constructor(message, statusCode, errorData) {
    super(message);
    this.name = 'MetaApiError';
    this.statusCode = statusCode;
    this.errorData = errorData;
  }
}

/**
 * Create a Meta API client instance
 * @param {string} accessToken - Meta access token
 * @returns {object} - Client methods
 */
export function createMetaClient(accessToken) {
  if (!accessToken) {
    throw new Error('Access token is required');
  }

  /**
   * Make a request to the Meta Graph API
   */
  async function request(endpoint, options = {}) {
    const {
      method = 'GET',
      body,
      isVideo = false,
      isFormData = false,
    } = options;

    const baseUrl = isVideo ? META_VIDEO_URL : META_GRAPH_URL;
    const url = new URL(`${META_API_VERSION}/${endpoint}`, baseUrl);

    // Add access token to URL for GET requests or form data
    if (method === 'GET' || isFormData) {
      url.searchParams.set('access_token', accessToken);
    }

    const fetchOptions = {
      method,
      headers: {},
    };

    if (body) {
      if (isFormData) {
        // FormData for file uploads
        fetchOptions.body = body;
      } else {
        // JSON for regular requests
        fetchOptions.headers['Content-Type'] = 'application/json';
        fetchOptions.body = JSON.stringify({
          ...body,
          access_token: accessToken,
        });
      }
    }

    const response = await fetch(url.toString(), fetchOptions);
    const data = await response.json();

    if (!response.ok || data.error) {
      throw new MetaApiError(
        data.error?.message || 'Meta API request failed',
        response.status,
        data.error
      );
    }

    return data;
  }

  /**
   * Upload an image to Meta Ads
   */
  async function uploadImage(adAccountId, imageBuffer, fileName) {
    const formData = new FormData();
    formData.append('source', new Blob([imageBuffer]), fileName);

    return request(`act_${adAccountId}/adimages`, {
      method: 'POST',
      body: formData,
      isFormData: true,
    });
  }

  /**
   * Upload a video to Meta Ads
   */
  async function uploadVideo(adAccountId, videoBuffer, fileName) {
    const formData = new FormData();
    formData.append('source', new Blob([videoBuffer]), fileName);

    return request(`act_${adAccountId}/advideos`, {
      method: 'POST',
      body: formData,
      isFormData: true,
      isVideo: true,
    });
  }

  /**
   * Check video upload status
   */
  async function getVideoStatus(videoId) {
    return request(`${videoId}`, {
      method: 'GET',
    });
  }

  /**
   * Create an ad creative
   */
  async function createCreative(adAccountId, creativeData) {
    return request(`act_${adAccountId}/adcreatives`, {
      method: 'POST',
      body: creativeData,
    });
  }

  /**
   * Create a campaign
   */
  async function createCampaign(adAccountId, campaignData) {
    return request(`act_${adAccountId}/campaigns`, {
      method: 'POST',
      body: campaignData,
    });
  }

  /**
   * Create an ad set
   */
  async function createAdSet(adAccountId, adSetData) {
    return request(`act_${adAccountId}/adsets`, {
      method: 'POST',
      body: adSetData,
    });
  }

  /**
   * Create an ad
   */
  async function createAd(adAccountId, adData) {
    return request(`act_${adAccountId}/ads`, {
      method: 'POST',
      body: adData,
    });
  }

  /**
   * Get ad account info
   */
  async function getAdAccount(adAccountId) {
    return request(`act_${adAccountId}`, {
      method: 'GET',
    });
  }

  /**
   * Get campaigns for an ad account
   */
  async function getCampaigns(adAccountId, limit = 25) {
    return request(`act_${adAccountId}/campaigns?limit=${limit}&fields=id,name,status,objective`, {
      method: 'GET',
    });
  }

  /**
   * Get ad sets for a campaign
   */
  async function getAdSets(campaignId, limit = 25) {
    return request(`${campaignId}/adsets?limit=${limit}&fields=id,name,status,daily_budget`, {
      method: 'GET',
    });
  }

  return {
    request,
    uploadImage,
    uploadVideo,
    getVideoStatus,
    createCreative,
    createCampaign,
    createAdSet,
    createAd,
    getAdAccount,
    getCampaigns,
    getAdSets,
  };
}

export { MetaApiError };
