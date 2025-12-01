/**
 * Google Drive Integration
 * Functions for listing and downloading files from Google Drive
 */

const GOOGLE_DRIVE_API = 'https://www.googleapis.com/drive/v3';
const GOOGLE_DRIVE_UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3';

/**
 * Create a Google Drive client
 * @param {string} accessToken - Google OAuth access token
 */
export function createDriveClient(accessToken) {
  if (!accessToken) {
    throw new Error('Google access token is required');
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  /**
   * List files in a folder
   * @param {string} folderId - Google Drive folder ID
   * @param {object} options - Query options
   */
  async function listFiles(folderId, options = {}) {
    const {
      mimeTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime'],
      pageSize = 100,
      pageToken,
    } = options;

    // Build query: files in folder with specific mime types
    const mimeTypeQuery = mimeTypes.map((t) => `mimeType='${t}'`).join(' or ');
    const query = `'${folderId}' in parents and (${mimeTypeQuery}) and trashed=false`;

    const params = new URLSearchParams({
      q: query,
      pageSize: pageSize.toString(),
      fields: 'nextPageToken,files(id,name,mimeType,size,thumbnailLink,webViewLink,createdTime,modifiedTime)',
      orderBy: 'modifiedTime desc',
    });

    if (pageToken) {
      params.set('pageToken', pageToken);
    }

    const response = await fetch(`${GOOGLE_DRIVE_API}/files?${params}`, { headers });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Google Drive API error: ${error.error?.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * List all files in a folder (handles pagination)
   */
  async function listAllFiles(folderId, options = {}) {
    const allFiles = [];
    let pageToken = null;

    do {
      const result = await listFiles(folderId, { ...options, pageToken });
      allFiles.push(...result.files);
      pageToken = result.nextPageToken;
    } while (pageToken);

    return allFiles;
  }

  /**
   * Get file metadata
   */
  async function getFile(fileId) {
    const params = new URLSearchParams({
      fields: 'id,name,mimeType,size,thumbnailLink,webViewLink,createdTime,modifiedTime',
    });

    const response = await fetch(`${GOOGLE_DRIVE_API}/files/${fileId}?${params}`, { headers });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Google Drive API error: ${error.error?.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Download a file's content
   * @param {string} fileId - Google Drive file ID
   * @returns {Promise<ArrayBuffer>} - File content as ArrayBuffer
   */
  async function downloadFile(fileId) {
    const response = await fetch(`${GOOGLE_DRIVE_API}/files/${fileId}?alt=media`, { headers });

    if (!response.ok) {
      // Handle large files that require virus scan acknowledgment
      if (response.status === 403) {
        // Try with acknowledgeAbuse parameter
        const retryResponse = await fetch(
          `${GOOGLE_DRIVE_API}/files/${fileId}?alt=media&acknowledgeAbuse=true`,
          { headers }
        );
        if (retryResponse.ok) {
          return retryResponse.arrayBuffer();
        }
      }
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    return response.arrayBuffer();
  }

  /**
   * Get folder information
   */
  async function getFolder(folderId) {
    const params = new URLSearchParams({
      fields: 'id,name,mimeType',
    });

    const response = await fetch(`${GOOGLE_DRIVE_API}/files/${folderId}?${params}`, { headers });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Google Drive API error: ${error.error?.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Extract folder ID from Google Drive URL
   */
  function extractFolderId(url) {
    // Handle various Google Drive URL formats
    // https://drive.google.com/drive/folders/FOLDER_ID
    // https://drive.google.com/drive/u/0/folders/FOLDER_ID
    const folderMatch = url.match(/folders\/([a-zA-Z0-9_-]+)/);
    if (folderMatch) {
      return folderMatch[1];
    }

    // Handle direct ID
    if (/^[a-zA-Z0-9_-]+$/.test(url)) {
      return url;
    }

    throw new Error('Invalid Google Drive folder URL or ID');
  }

  /**
   * Extract file ID from Google Drive URL
   */
  function extractFileId(url) {
    // https://drive.google.com/file/d/FILE_ID/view
    // https://drive.google.com/open?id=FILE_ID
    const fileMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (fileMatch) {
      return fileMatch[1];
    }

    // Handle direct ID
    if (/^[a-zA-Z0-9_-]+$/.test(url)) {
      return url;
    }

    throw new Error('Invalid Google Drive file URL or ID');
  }

  return {
    listFiles,
    listAllFiles,
    getFile,
    downloadFile,
    getFolder,
    extractFolderId,
    extractFileId,
  };
}

/**
 * Check if a file is a video based on mime type
 */
export function isVideoFile(mimeType) {
  return mimeType.startsWith('video/');
}

/**
 * Check if a file is an image based on mime type
 */
export function isImageFile(mimeType) {
  return mimeType.startsWith('image/');
}

/**
 * Get high-quality thumbnail URL
 * Google Drive thumbnails are small by default, this gets a larger version
 */
export function getHighQualityThumbnail(thumbnailLink, size = 1000) {
  if (!thumbnailLink) return null;
  // Replace size parameter in thumbnail URL
  return thumbnailLink.replace(/=s\d+/, `=s${size}`);
}
