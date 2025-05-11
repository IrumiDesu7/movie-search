import { render, screen, fireEvent, act } from "@testing-library/react";
import { MovieSearch } from "./movie-search";

describe("MovieSearch component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders search input correctly", () => {
    render(<MovieSearch onSearch={() => {}} />);
    expect(screen.getByPlaceholderText("Search movies...")).toBeInTheDocument();
  });

  it("calls onSearch after debounce when input changes", async () => {
    const mockOnSearch = jest.fn();
    render(<MovieSearch onSearch={mockOnSearch} debounceTime={500} />);

    const searchInput = screen.getByPlaceholderText("Search movies...");
    fireEvent.change(searchInput, { target: { value: "Avengers" } });

    expect(mockOnSearch).not.toHaveBeenCalled();

    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockOnSearch).toHaveBeenCalledWith("Avengers");
  });

  it("debounces multiple rapid input changes", () => {
    const mockOnSearch = jest.fn();
    render(<MovieSearch onSearch={mockOnSearch} debounceTime={500} />);

    const searchInput = screen.getByPlaceholderText("Search movies...");

    // Type "Av"
    fireEvent.change(searchInput, { target: { value: "Av" } });

    // Quickly type "Ave"
    act(() => {
      jest.advanceTimersByTime(200);
    });
    fireEvent.change(searchInput, { target: { value: "Ave" } });

    // Quickly type "Aven"
    act(() => {
      jest.advanceTimersByTime(200);
    });
    fireEvent.change(searchInput, { target: { value: "Aven" } });

    // Complete "Avengers"
    act(() => {
      jest.advanceTimersByTime(200);
    });
    fireEvent.change(searchInput, { target: { value: "Avengers" } });

    // At this point onSearch should not have been called yet
    expect(mockOnSearch).not.toHaveBeenCalled();

    // After the full debounce time from the last change
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should have been called only once with the final value
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith("Avengers");
  });
});
