import { MovieDetailsDialog } from "@/components/movie-details-dialog";
import { MovieFilters } from "@/components/movie-filters";
import { MoviePagination } from "@/components/movie-pagination";
import { MovieSearch } from "@/components/movie-search";
import { MovieCardSkeleton } from "@/components/movie-skeletons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useMovieDetails,
  useMovieSearch,
  usePopularMovies,
} from "@/lib/hooks/use-movies";
import { getPosterUrl } from "@/lib/tmdb-api";
import { ChevronDown, Info, Star } from "lucide-react";
import { useState } from "react";

export function MovieDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [minYear, setMinYear] = useState(1950);
  const [maxYear, setMaxYear] = useState(2025);
  const [minRating, setMinRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  const { data: searchData, isLoading: isSearchLoading } = useMovieSearch(
    searchQuery,
    currentPage,
  );
  const { data: popularData, isLoading: isPopularLoading } =
    usePopularMovies(currentPage);
  const { data: movieDetails, isLoading: isDetailsLoading } = useMovieDetails(
    selectedMovieId || 0,
  );

  const isLoading = searchQuery ? isSearchLoading : isPopularLoading;
  const data = searchQuery ? searchData : popularData;
  const movies = data?.results || [];
  const totalPages = Math.min(data?.total_pages || 0, 500);

  const handleYearRangeChange = (min: number, max: number) => {
    setMinYear(min);
    setMaxYear(max);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMovieSelect = (id: number) => {
    setSelectedMovieId(id);
  };

  const handleCloseDetails = () => {
    setSelectedMovieId(null);
  };

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

  const formatYear = (dateString: string) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).getFullYear();
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Movie Dashboard</h1>

      <div className="mb-6">
        <div className="mb-4 w-full">
          <MovieSearch
            onSearch={(query) => {
              setSearchQuery(query);
            }}
          />
        </div>

        <div className="w-full overflow-hidden rounded-lg border">
          <button
            onClick={toggleFilters}
            className="bg-background hover:bg-opacity-50 active:bg-opacity-75 flex w-full items-center justify-between p-4 text-left font-medium"
          >
            <span>Filters</span>
            <div
              className="transform transition-transform duration-300"
              style={{
                transform: showFilters ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <ChevronDown className="h-5 w-5" />
            </div>
          </button>

          {showFilters && (
            <div className="overflow-hidden">
              <MovieFilters
                minYear={minYear}
                maxYear={maxYear}
                minRating={minRating}
                onYearRangeChange={handleYearRangeChange}
                onRatingChange={setMinRating}
              />
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(10)].map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="opacity-100 transition-opacity duration-300"
            >
              <MovieCardSkeleton />
            </div>
          ))}
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-xl text-gray-500">
            No movies found matching your criteria
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="transition-transform duration-300 hover:scale-[1.01]"
              >
                <Card className="h-full overflow-hidden">
                  <div className="relative aspect-[2/3]">
                    <img
                      src={getPosterUrl(movie.poster_path, "w342")}
                      alt={movie.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardHeader className="p-3">
                    <CardTitle className="text-base">{movie.title}</CardTitle>
                    <CardDescription>
                      {formatYear(movie.release_date)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-muted-foreground line-clamp-2 text-xs">
                      {movie.overview}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between p-3">
                    <div className="flex items-center">
                      <Star
                        className="mr-1 h-4 w-4 text-yellow-500"
                        fill="currentColor"
                      />
                      <span className="text-sm">
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                    <button
                      className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                      onClick={() => handleMovieSelect(movie.id)}
                    >
                      <Info className="h-3 w-3" />
                      Details
                    </button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>

          <MoviePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <MovieDetailsDialog
        isOpen={selectedMovieId !== null}
        onClose={handleCloseDetails}
        movieDetails={movieDetails}
        isLoading={isDetailsLoading}
      />
    </div>
  );
}
