import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star } from "lucide-react";
import { useState } from "react";
import { MovieFilters } from "./movie-filters";
import { MovieSearch } from "./movie-search";

// Sample movie data (replace with actual API data later)
const mockMovies = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    year: 1994,
    rating: 9.3,
    poster: "https://via.placeholder.com/300x450?text=Shawshank+Redemption",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
  },
  {
    id: 2,
    title: "The Godfather",
    year: 1972,
    rating: 9.2,
    poster: "https://via.placeholder.com/300x450?text=The+Godfather",
    description:
      "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
  },
  {
    id: 3,
    title: "The Dark Knight",
    year: 2008,
    rating: 9.0,
    poster: "https://via.placeholder.com/300x450?text=The+Dark+Knight",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
  },
  {
    id: 4,
    title: "Pulp Fiction",
    year: 1994,
    rating: 8.9,
    poster: "https://via.placeholder.com/300x450?text=Pulp+Fiction",
    description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
  },
  {
    id: 5,
    title: "Fight Club",
    year: 1999,
    rating: 8.8,
    poster: "https://via.placeholder.com/300x450?text=Fight+Club",
    description:
      "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.",
  },
  {
    id: 6,
    title: "Inception",
    year: 2010,
    rating: 8.7,
    poster: "https://via.placeholder.com/300x450?text=Inception",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
  },
];

export function MovieDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [minYear, setMinYear] = useState(1900);
  const [maxYear, setMaxYear] = useState(2099);
  const [minRating, setMinRating] = useState(0);

  const handleYearRangeChange = (min: number, max: number) => {
    setMinYear(min);
    setMaxYear(max);
  };

  const filteredMovies = mockMovies.filter(
    (movie) =>
      // Filter by search query
      (movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      // Filter by year range
      movie.year >= minYear &&
      movie.year <= maxYear &&
      // Filter by rating
      movie.rating >= minRating
  );

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

      {filteredMovies.length === 0 ? (
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
                  src={movie.poster}
                  alt={movie.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader>
                <CardTitle>{movie.title}</CardTitle>
                <CardDescription>{movie.year}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {movie.description}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center">
                  <Star
                    className="w-5 h-5 text-yellow-500 mr-1"
                    fill="currentColor"
                  />
                  <span>{movie.rating.toFixed(1)}</span>
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
