import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface FilterProps {
  minYear: number;
  maxYear: number;
  minRating: number;
  onYearRangeChange: (min: number, max: number) => void;
  onRatingChange: (rating: number) => void;
}

export function MovieFilters({
  minYear,
  maxYear,
  minRating,
  onYearRangeChange,
  onRatingChange,
}: FilterProps) {
  const handleMinYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onYearRangeChange(value, maxYear);
  };

  const handleMaxYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onYearRangeChange(minYear, value);
  };

  return (
    <div className="my-2 space-y-4 rounded-lg p-4">
      <h2 className="text-lg font-medium">Filters</h2>

      <div>
        <h3 className="mb-2 text-sm font-medium">Release Year</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="min-year" className="text-xs text-gray-500">
              From
            </Label>
            <Input
              id="min-year"
              type="number"
              value={minYear}
              min={1900}
              max={2099}
              onChange={handleMinYearChange}
              className="h-8"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-year" className="text-xs text-gray-500">
              To
            </Label>
            <Input
              id="max-year"
              type="number"
              value={maxYear}
              min={1900}
              max={2099}
              onChange={handleMaxYearChange}
              className="h-8"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">
          Minimum Rating: {minRating.toFixed(1)}
        </h3>
        <Slider
          min={0}
          max={10}
          step={0.1}
          value={[minRating]}
          onValueChange={(values) => onRatingChange(values[0])}
          className="my-4"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>0</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
}
