import { useQuery } from "@tanstack/react-query";
import { tmdbApi } from "../tmdb-api";

export function usePopularMovies(page = 1) {
  return useQuery({
    queryKey: ["popularMovies", page],
    queryFn: () => tmdbApi.getPopularMovies(page),
  });
}

export function useMovieSearch(query: string, page = 1) {
  return useQuery({
    queryKey: ["movieSearch", query, page],
    queryFn: () => tmdbApi.searchMovies(query, page),
    enabled: query.trim().length > 0,
  });
}

export function useMovieDetails(id: number) {
  return useQuery({
    queryKey: ["movieDetails", id],
    queryFn: () => tmdbApi.getMovieDetails(id),
  });
}
