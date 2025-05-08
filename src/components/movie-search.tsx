import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MovieSearchProps {
  onSearch: (query: string) => void;
}

export function MovieSearch({ onSearch }: MovieSearchProps) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="mb-6">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search movies..."
          className="w-full pl-10 pr-4"
          onChange={handleSearch}
        />
      </div>
    </div>
  );
}
