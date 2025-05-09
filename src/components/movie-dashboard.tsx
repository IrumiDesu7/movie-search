import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  useMovieDetails,
  useMovieSearch,
  usePopularMovies,
} from "@/lib/hooks/use-movies";
import { getPosterUrl } from "@/lib/tmdb-api";
import { Calendar, ChevronDown, Info, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { MovieFilters } from "./movie-filters";
import { MovieSearch } from "./movie-search";

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

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        <div className="py-12 text-center">
          <p className="text-xl text-gray-500">Loading movies...</p>
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

          {totalPages > 1 && (
            <div className="my-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={
                        currentPage > 1
                          ? () => handlePageChange(currentPage - 1)
                          : undefined
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {/* First page */}
                  {currentPage > 3 && (
                    <>
                      <PaginationItem>
                        <PaginationLink onClick={() => handlePageChange(1)}>
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    </>
                  )}

                  {/* Page numbers */}
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    // Calculate the page number to display
                    let pageNum;
                    if (totalPages <= 5) {
                      // If we have 5 or fewer pages, show all pages
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      // If we're near the beginning, show pages 1-5
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      // If we're near the end, show the last 5 pages
                      pageNum = totalPages - 4 + i;
                    } else {
                      // Otherwise show 2 pages before and 2 pages after current page
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          isActive={pageNum === currentPage}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {/* Last page ellipsis */}
                  {currentPage < totalPages - 2 && totalPages > 5 && (
                    <>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={
                        currentPage < totalPages
                          ? () => handlePageChange(currentPage + 1)
                          : undefined
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Movie Details Dialog */}
      <Dialog open={selectedMovieId !== null} onOpenChange={handleCloseDetails}>
        <DialogContent className="max-w-4xl">
          {isDetailsLoading ? (
            <div className="py-10 text-center">
              <p>Loading movie details...</p>
            </div>
          ) : movieDetails ? (
            <>
              <DialogHeader className="mb-4">
                <DialogTitle className="text-3xl font-bold">
                  {movieDetails.title}
                </DialogTitle>
                <DialogDescription className="mt-2 flex flex-wrap items-center gap-4">
                  <div className="flex items-center">
                    <Star
                      className="mr-1 h-5 w-5 text-yellow-500"
                      fill="currentColor"
                    />
                    <span className="font-medium">
                      {movieDetails.vote_average.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-5 w-5 text-gray-500" />
                    <span>{formatDate(movieDetails.release_date)}</span>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_2fr]">
                <div className="flex flex-col gap-4">
                  <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-md">
                    <img
                      src={getPosterUrl(movieDetails.poster_path, "w342")}
                      alt={movieDetails.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">Quick Info</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2 p-4 pt-0 text-sm">
                      <div>
                        <span className="font-medium">Release Year:</span>
                        <p className="text-gray-600">
                          {formatYear(movieDetails.release_date)}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Rating:</span>
                        <p className="text-gray-600">
                          {movieDetails.vote_average.toFixed(1)} / 10
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex flex-col gap-4">
                  <Card className="flex-1">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-gray-700">{movieDetails.overview}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 p-4 pt-0 text-sm">
                      <div>
                        <span className="font-medium">Movie ID:</span>
                        <p className="text-gray-600">{movieDetails.id}</p>
                      </div>
                      <div>
                        <span className="font-medium">Release Date:</span>
                        <p className="text-gray-600">
                          {formatDate(movieDetails.release_date)}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Vote Average:</span>
                        <p className="text-gray-600">
                          {movieDetails.vote_average.toFixed(1)} / 10
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Title:</span>
                        <p className="text-gray-600">{movieDetails.title}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <div className="py-10 text-center">
              <p>No movie details available</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
