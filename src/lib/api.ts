import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * Jikan API Rate Limiting Configuration
 * 
 * Jikan API allows ~3 requests/second
 * We implement a 350ms delay between requests to stay well under the limit
 * This prevents 429 (Too Many Requests) errors
 */

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';
const REQUEST_DELAY = 400; // milliseconds

let lastRequestTime = 0;
let requestQueue = Promise.resolve();

const rateLimitDelay = async (): Promise<void> => {
  // Chain this execution onto the shared promise
  const currentTask = requestQueue.then(async () => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < REQUEST_DELAY) {
      const delayTime = REQUEST_DELAY - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delayTime));
    }
    
    lastRequestTime = Date.now();
  });

  // Update requestQueue to point to the end of this task
  // catch errors so the queue doesn't break if one request fails (though the delay logic itself shouldn't fail)
  requestQueue = currentTask.catch(() => {});
  
  return currentTask;
};

/**
 * Axios instance configured for Jikan API
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: JIKAN_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add rate limiting
 */
apiClient.interceptors.request.use(
  async (config) => {
    await rateLimitDelay();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 429) {
      console.warn('Rate limit hit, waiting 2 seconds before retry...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      return apiClient.request(error.config);
    }
    return Promise.reject(error);
  }
);

/**
 * Generic API request wrapper with rate limiting
 */
export const fetchWithDelay = async <T>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient.get<T>(endpoint, config);
    return response.data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// ==================== Anime API Endpoints ====================

export interface AnimeData {
  mal_id: number;
  title: string;
  title_english?: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  trailer?: {
    youtube_id?: string;
    url?: string;
    embed_url?: string;
  };
  synopsis?: string;
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  members?: number;
  favorites?: number;
  episodes?: number;
  status?: string;
  airing?: boolean;
  aired?: {
    from?: string;
    to?: string;
    string?: string;
  };
  season?: string;
  year?: number;
  genres?: Array<{ mal_id: number; type: string; name: string; url: string }>;
  studios?: Array<{ mal_id: number; type: string; name: string; url: string }>;
}

export interface PaginatedResponse<T> {
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
  data: T[];
}

/**
 * Fetch top/trending anime
 */
export const getTopAnime = async (page = 1, limit = 25): Promise<PaginatedResponse<AnimeData>> => {
  return fetchWithDelay<PaginatedResponse<AnimeData>>(
    `/top/anime?page=${page}&limit=${limit}`
  );
};

/**
 * Fetch upcoming anime
 */
export const getUpcomingAnime = async (page = 1): Promise<PaginatedResponse<AnimeData>> => {
  return fetchWithDelay<PaginatedResponse<AnimeData>>(
    `/seasons/upcoming?page=${page}`
  );
};

/**
 * Search anime by query
 */
export const searchAnime = async (query: string, page = 1): Promise<PaginatedResponse<AnimeData>> => {
  return fetchWithDelay<PaginatedResponse<AnimeData>>(
    `/anime?q=${encodeURIComponent(query)}&page=${page}&sfw=true`
  );
};

/**
 * Fetch anime details by ID
 */
export const getAnimeById = async (id: number): Promise<{ data: AnimeData }> => {
  return fetchWithDelay<{ data: AnimeData }>(`/anime/${id}/full`);
};

/**
 * Fetch current season anime
 */
export const getCurrentSeasonAnime = async (page = 1): Promise<PaginatedResponse<AnimeData>> => {
  return fetchWithDelay<PaginatedResponse<AnimeData>>(
    `/seasons/now?page=${page}`
  );
};

export default apiClient;
