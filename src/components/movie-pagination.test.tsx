import { render, screen, fireEvent } from "@testing-library/react";
import { MoviePagination } from "./movie-pagination";

describe("MoviePagination", () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  test("should not render when there is only one page", () => {
    const { container } = render(
      <MoviePagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  test("should render pagination with correct page numbers", () => {
    render(
      <MoviePagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />,
    );

    // Should show pages 1, 2, 3, 4, 5 and ellipsis
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();

    // Current page should be marked as active
    expect(screen.getByText("3").closest("a")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("should show ellipsis when needed", () => {
    render(
      <MoviePagination
        currentPage={6}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />,
    );

    // Should show both ellipses when in the middle
    const ellipses = screen.getAllByTestId("pagination-ellipsis");
    expect(ellipses).toHaveLength(2);

    // Should show pages around current page
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  test("should show pages near the end correctly", () => {
    render(
      <MoviePagination
        currentPage={9}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />,
    );

    // Should show first page and ellipsis
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getAllByTestId("pagination-ellipsis")).toHaveLength(1);

    // Should show last 5 pages
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  test("should handle small number of pages correctly", () => {
    render(
      <MoviePagination
        currentPage={2}
        totalPages={4}
        onPageChange={mockOnPageChange}
      />,
    );

    // Should show all pages without ellipsis
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.queryByTestId("pagination-ellipsis")).not.toBeInTheDocument();
  });

  test("clicking on page number should call onPageChange with correct page", () => {
    render(
      <MoviePagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />,
    );

    fireEvent.click(screen.getByText("5"));
    expect(mockOnPageChange).toHaveBeenCalledWith(5);
  });

  test("previous button should be disabled on first page", () => {
    render(
      <MoviePagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />,
    );

    const prevButton = screen.getByText("Previous");
    expect(prevButton.closest("a")).toHaveClass(
      "pointer-events-none opacity-50",
    );

    fireEvent.click(prevButton);
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  test("next button should be disabled on last page", () => {
    render(
      <MoviePagination
        currentPage={10}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />,
    );

    const nextButton = screen.getByText("Next");
    expect(nextButton.closest("a")).toHaveClass(
      "pointer-events-none opacity-50",
    );

    fireEvent.click(nextButton);
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  test("clicking previous button should go to previous page", () => {
    render(
      <MoviePagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />,
    );

    fireEvent.click(screen.getByText("Previous"));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  test("clicking next button should go to next page", () => {
    render(
      <MoviePagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />,
    );

    fireEvent.click(screen.getByText("Next"));
    expect(mockOnPageChange).toHaveBeenCalledWith(6);
  });
});
