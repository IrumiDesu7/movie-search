import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Star } from "lucide-react";
import { MovieDetailsSkeleton } from "./movie-skeletons";
import { getPosterUrl } from "@/lib/tmdb-api";

interface MovieDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  movieDetails: any;
  isLoading: boolean;
}

export function MovieDetailsDialog({
  isOpen,
  onClose,
  movieDetails,
  isLoading,
}: MovieDetailsDialogProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatYear = (dateString: string) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).getFullYear();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        {isLoading ? (
          <MovieDetailsSkeleton />
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
                      <p className="text-gray-600 dark:text-gray-400">
                        {formatYear(movieDetails.release_date)}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Rating:</span>
                      <p className="text-gray-600 dark:text-gray-400">
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
                    <p className="text-gray-700 dark:text-gray-300">
                      {movieDetails.overview}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 p-4 pt-0 text-sm">
                    <div>
                      <span className="font-medium">Movie ID:</span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {movieDetails.id}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Release Date:</span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {formatDate(movieDetails.release_date)}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Vote Average:</span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {movieDetails.vote_average.toFixed(1)} / 10
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Title:</span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {movieDetails.title}
                      </p>
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
  );
}
