import { z } from "zod";

// API configuration
const API_BASE_URL = "https://api.themoviedb.org/3";
const API_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// Environment variables validation
const envSchema = z.object({
  VITE_TMDB_API_KEY: z.string().min(1),
});

// This will throw an error if the API key is not set
export function getApiKey(): string {
  try {
    const env = envSchema.parse(import.meta.env);
    return env.VITE_TMDB_API_KEY;
  } catch {
    console.error(
      "❌ API key not found. Please add your TMDB API key to .env file"
    );
    throw new Error(
      "Missing TMDB API key. Add VITE_TMDB_API_KEY to your .env file"
    );
  }
}

// Default fetch options for all API requests with bearer token
const REQUEST_OPTIONS = {
  headers: {
    Authorization: `Bearer ${getApiKey()}`,
    "Content-Type": "application/json",
  },
};

// Image sizes available from TMDB
export const posterSizes = {
  tiny: "w92",
  small: "w185",
  medium: "w342",
  large: "w500",
  xlarge: "w780",
  original: "original",
} as const;

// Get full image URL
export function getPosterUrl(
  path: string | null,
  size = posterSizes.medium
): string {
  if (!path) return "https://via.placeholder.com/300x450?text=No+Poster";
  return `${API_IMAGE_BASE_URL}/${size}${path}`;
}

// Movie interfaces
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
}

export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_results: number;
  total_pages: number;
}

// API endpoints
export const tmdbApi = {
  // Popular movies
  getPopularMovies: async (page = 1): Promise<MovieListResponse> => {
    const url = `${API_BASE_URL}/movie/popular?page=${page}`;
    const response = await fetch(url, REQUEST_OPTIONS);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  },

  // Search movies
  searchMovies: async (query: string, page = 1): Promise<MovieListResponse> => {
    if (!query.trim()) {
      throw new Error("Search query cannot be empty");
    }

    const url = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
      query
    )}&page=${page}`;
    const response = await fetch(url, REQUEST_OPTIONS);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  },

  // Movie details
  getMovieDetails: async (id: number): Promise<Movie> => {
    const url = `${API_BASE_URL}/movie/${id}`;
    const response = await fetch(url, REQUEST_OPTIONS);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  },
};
