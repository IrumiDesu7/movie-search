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
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { MovieDetailsDialog } from "./movie-details-dialog";
import { MovieFilters } from "./movie-filters";
import { MoviePagination } from "./movie-pagination";
import { MovieSearch } from "./movie-search";
import { MovieCardSkeleton } from "./movie-skeletons";

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
          <motion.button
            onClick={toggleFilters}
            className="bg-background flex w-full items-center justify-between p-4 text-left font-medium"
            whileHover={{ backgroundColor: "rgba(0,0,0,0.025)" }}
            whileTap={{ backgroundColor: "rgba(0,0,0,0.05)" }}
          >
            <span>Filters</span>
            <motion.div
              animate={{ rotate: showFilters ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="h-5 w-5" />
            </motion.div>
          </motion.button>

          <AnimatePresence initial={false}>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: "auto",
                  opacity: 1,
                  transition: {
                    height: { duration: 0.3 },
                    opacity: { duration: 0.3, delay: 0.1 },
                  },
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                  transition: {
                    height: { duration: 0.3 },
                    opacity: { duration: 0.2 },
                  },
                }}
                className="overflow-hidden"
              >
                <MovieFilters
                  minYear={minYear}
                  maxYear={maxYear}
                  minRating={minRating}
                  onYearRangeChange={handleYearRangeChange}
                  onRatingChange={setMinRating}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(10)].map((_, index) => (
            <motion.div
              key={`skeleton-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <MovieCardSkeleton />
            </motion.div>
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
          <motion.div
            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            layout
            transition={{ type: "inertia", stiffness: 200, damping: 25 }}
          >
            <AnimatePresence>
              {filteredMovies.map((movie) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.03 }}
                  layout
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
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

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
