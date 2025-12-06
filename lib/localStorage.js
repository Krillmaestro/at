// Local Storage Utilities - Works without Supabase
// Stores all data in browser localStorage

const STORAGE_KEYS = {
  VIDEOS: 'alpineVideo_videos',
  USER: 'alpineVideo_user',
  COMPARISONS: 'alpineVideo_comparisons',
};

// Helper to get data from localStorage
const getStorageData = (key, defaultValue = []) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

// Helper to set data in localStorage
const setStorageData = (key, data) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// ============================================
// USER (Fake auth for local development)
// ============================================
export const localAuth = {
  getUser: () => {
    const user = getStorageData(STORAGE_KEYS.USER, null);
    return user || {
      id: 'local-user',
      email: 'coach@local.dev',
      full_name: 'Local Coach',
      role: 'coach',
    };
  },

  setUser: (user) => {
    setStorageData(STORAGE_KEYS.USER, user);
  },

  // Always returns true in local mode
  isAuthenticated: () => true,
};

// ============================================
// VIDEOS
// ============================================
export const localVideos = {
  // Get all videos
  getAll: () => {
    return getStorageData(STORAGE_KEYS.VIDEOS, []);
  },

  // Get video by ID
  getById: (id) => {
    const videos = getStorageData(STORAGE_KEYS.VIDEOS, []);
    return videos.find((v) => v.id === id) || null;
  },

  // Add new video
  add: (videoData) => {
    const videos = getStorageData(STORAGE_KEYS.VIDEOS, []);
    const newVideo = {
      id: generateId(),
      created_at: new Date().toISOString(),
      ...videoData,
    };
    videos.unshift(newVideo); // Add to beginning
    setStorageData(STORAGE_KEYS.VIDEOS, videos);
    return newVideo;
  },

  // Update video
  update: (id, updates) => {
    const videos = getStorageData(STORAGE_KEYS.VIDEOS, []);
    const index = videos.findIndex((v) => v.id === id);
    if (index !== -1) {
      videos[index] = { ...videos[index], ...updates };
      setStorageData(STORAGE_KEYS.VIDEOS, videos);
      return videos[index];
    }
    return null;
  },

  // Delete video
  delete: (id) => {
    const videos = getStorageData(STORAGE_KEYS.VIDEOS, []);
    const filtered = videos.filter((v) => v.id !== id);
    setStorageData(STORAGE_KEYS.VIDEOS, filtered);
  },

  // Filter videos
  filter: ({ athlete, discipline, search }) => {
    let videos = getStorageData(STORAGE_KEYS.VIDEOS, []);

    if (athlete) {
      videos = videos.filter((v) => v.athlete_name === athlete);
    }
    if (discipline) {
      videos = videos.filter((v) => v.discipline === discipline);
    }
    if (search) {
      const query = search.toLowerCase();
      videos = videos.filter(
        (v) =>
          v.title?.toLowerCase().includes(query) ||
          v.athlete_name?.toLowerCase().includes(query) ||
          v.location?.toLowerCase().includes(query)
      );
    }

    return videos;
  },

  // Get unique athletes
  getAthletes: () => {
    const videos = getStorageData(STORAGE_KEYS.VIDEOS, []);
    const athletes = [...new Set(videos.map((v) => v.athlete_name).filter(Boolean))];
    return athletes.map((name, i) => ({ id: String(i + 1), full_name: name }));
  },

  // Initialize with demo data if empty
  initializeDemoData: () => {
    const existing = getStorageData(STORAGE_KEYS.VIDEOS, []);
    if (existing.length === 0) {
      const demoVideos = [
        {
          id: 'demo-1',
          title: 'Slalom Run 1 - Morning Training',
          src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          thumbnail_path: null,
          duration_seconds: 23,
          athlete_name: 'Erik Lindqvist',
          run_date: '2024-12-05',
          location: 'Åre',
          discipline: 'slalom',
          notes: 'Good timing on gates 3-5, need to work on upper body position.',
          created_at: new Date().toISOString(),
        },
        {
          id: 'demo-2',
          title: 'Giant Slalom - Gate Analysis',
          src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          thumbnail_path: null,
          duration_seconds: 45,
          athlete_name: 'Anna Svensson',
          run_date: '2024-12-04',
          location: 'Sälen',
          discipline: 'giant_slalom',
          notes: null,
          created_at: new Date().toISOString(),
        },
        {
          id: 'demo-3',
          title: 'Super-G Practice Run',
          src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          thumbnail_path: null,
          duration_seconds: 31,
          athlete_name: 'Marcus Berg',
          run_date: '2024-12-03',
          location: 'Åre',
          discipline: 'super_g',
          notes: null,
          created_at: new Date().toISOString(),
        },
        {
          id: 'demo-4',
          title: 'Slalom Run 2 - Afternoon Session',
          src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          thumbnail_path: null,
          duration_seconds: 21,
          athlete_name: 'Erik Lindqvist',
          run_date: '2024-12-05',
          location: 'Åre',
          discipline: 'slalom',
          notes: 'Much better hip position this run!',
          created_at: new Date().toISOString(),
        },
        {
          id: 'demo-5',
          title: 'Downhill Training',
          src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          thumbnail_path: null,
          duration_seconds: 58,
          athlete_name: 'Anna Svensson',
          run_date: '2024-12-02',
          location: 'Trysil',
          discipline: 'downhill',
          notes: null,
          created_at: new Date().toISOString(),
        },
        {
          id: 'demo-6',
          title: 'Giant Slalom - Competition Run',
          src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
          thumbnail_path: null,
          duration_seconds: 42,
          athlete_name: 'Marcus Berg',
          run_date: '2024-12-01',
          location: 'Hemsedal',
          discipline: 'giant_slalom',
          notes: 'Personal best time!',
          created_at: new Date().toISOString(),
        },
      ];
      setStorageData(STORAGE_KEYS.VIDEOS, demoVideos);
      return demoVideos;
    }
    return existing;
  },
};

// ============================================
// COMPARISONS
// ============================================
export const localComparisons = {
  getAll: () => getStorageData(STORAGE_KEYS.COMPARISONS, []),

  add: (comparison) => {
    const comparisons = getStorageData(STORAGE_KEYS.COMPARISONS, []);
    const newComparison = {
      id: generateId(),
      created_at: new Date().toISOString(),
      ...comparison,
    };
    comparisons.unshift(newComparison);
    setStorageData(STORAGE_KEYS.COMPARISONS, comparisons);
    return newComparison;
  },

  delete: (id) => {
    const comparisons = getStorageData(STORAGE_KEYS.COMPARISONS, []);
    const filtered = comparisons.filter((c) => c.id !== id);
    setStorageData(STORAGE_KEYS.COMPARISONS, filtered);
  },
};

export default {
  auth: localAuth,
  videos: localVideos,
  comparisons: localComparisons,
};
