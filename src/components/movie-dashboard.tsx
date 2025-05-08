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
import { ChevronDown, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { MovieFilters } from "./movie-filters";
import { MovieSearch } from "./movie-search";
import { Pagination } from "./ui/pagination";

export function MovieDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [minYear, setMinYear] = useState(1900);
  const [maxYear, setMaxYear] = useState(2099);
  const [minRating, setMinRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

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
  const totalPages = data?.total_pages || 0;

  const handleYearRangeChange = (min: number, max: number) => {
    setMinYear(min);
    setMaxYear(max);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Movie Dashboard</h1>

      <div className="mb-6">
        <div className="w-full mb-4">
          <MovieSearch
            onSearch={(query) => {
              setSearchQuery(query);
            }}
          />
        </div>

        <div className="w-full border rounded-lg overflow-hidden">
          <motion.button
            onClick={toggleFilters}
            className="w-full p-4 bg-background flex items-center justify-between font-medium text-left"
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
                <div className="px-4 pb-4">
                  <MovieFilters
                    minYear={minYear}
                    maxYear={maxYear}
                    minRating={minRating}
                    onYearRangeChange={handleYearRangeChange}
                    onRatingChange={setMinRating}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
        <>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            layout
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
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
                  <Card className="overflow-hidden h-full">
                    <div className="aspect-[2/3] relative">
                      <img
                        src={getPosterUrl(movie.poster_path, "w342")}
                        alt={movie.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardHeader className="p-3">
                      <CardTitle className="text-base">{movie.title}</CardTitle>
                      <CardDescription>
                        {formatYear(movie.release_date)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {movie.overview}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between p-3">
                      <div className="flex items-center">
                        <Star
                          className="w-4 h-4 text-yellow-500 mr-1"
                          fill="currentColor"
                        />
                        <span className="text-sm">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                      <button className="text-xs text-blue-600 hover:underline">
                        Details
                      </button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
