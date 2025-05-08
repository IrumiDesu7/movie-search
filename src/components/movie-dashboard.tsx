import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMovieSearch, usePopularMovies } from "@/lib/hooks/use-movies";
import { getPosterUrl } from "@/lib/tmdb-api";
import { Star } from "lucide-react";
import { useState } from "react";
import { MovieFilters } from "./movie-filters";
import { MovieSearch } from "./movie-search";

export function MovieDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [minYear, setMinYear] = useState(1900);
  const [maxYear, setMaxYear] = useState(2099);
  const [minRating, setMinRating] = useState(0);
  const [currentPage] = useState(1);

  // Use the appropriate query based on whether we're searching or not
  const { data: searchData, isLoading: isSearchLoading } = useMovieSearch(
    searchQuery,
    currentPage
  );
  const { data: popularData, isLoading: isPopularLoading } =
    usePopularMovies(currentPage);

  const isLoading = searchQuery ? isSearchLoading : isPopularLoading;
  const data = searchQuery ? searchData : popularData;
  const movies = data?.results || [];

  const handleYearRangeChange = (min: number, max: number) => {
    setMinYear(min);
    setMaxYear(max);
  };

  // Filter movies client-side by year and rating
  const filteredMovies = movies.filter((movie) => {
    const releaseYear = movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : 0;
    return (
      releaseYear >= minYear &&
      releaseYear <= maxYear &&
      movie.vote_average >= minRating
    );
  });

  // Function to format release year from date string
  const formatYear = (dateString: string) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).getFullYear();
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Movie Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-3">
          <MovieSearch onSearch={setSearchQuery} />
        </div>
        <div className="lg:col-span-1">
          <MovieFilters
            minYear={minYear}
            maxYear={maxYear}
            minRating={minRating}
            onYearRangeChange={handleYearRangeChange}
            onRatingChange={setMinRating}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">Loading movies...</p>
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">
            No movies found matching your criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMovies.map((movie) => (
            <Card key={movie.id} className="overflow-hidden">
              <div className="aspect-[2/3] relative">
                <img
                  src={getPosterUrl(movie.poster_path)}
                  alt={movie.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader>
                <CardTitle>{movie.title}</CardTitle>
                <CardDescription>
                  {formatYear(movie.release_date)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {movie.overview}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center">
                  <Star
                    className="w-5 h-5 text-yellow-500 mr-1"
                    fill="currentColor"
                  />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
                <button className="text-sm text-blue-600 hover:underline">
                  Details
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
