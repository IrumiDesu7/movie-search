import { MovieDashboard } from "@/components/movie-dashboard";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="bg-background min-h-screen">
        <div className="container mx-auto py-4">
          <div className="mb-2 flex justify-end">
            <ModeToggle />
          </div>
          <MovieDashboard />
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;
