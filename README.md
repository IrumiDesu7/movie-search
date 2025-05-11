# Movie Search App

A React application for searching and browsing movies using The Movie Database (TMDB) API.

## API Setup

This project uses The Movie Database (TMDB) API. To use it:

1. Sign up for an account at [TMDB](https://www.themoviedb.org/signup)
2. Go to your [API settings](https://www.themoviedb.org/settings/api)
3. Create a new API key (v3 auth)
4. Create a `.env` file in the project root with:
   ```
   VITE_TMDB_API_KEY=your_api_key_here
   ```

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Pagination Feature

The application includes a sophisticated pagination system for browsing through movie results:

### Features

- Navigate between pages of movie results
- Previous and Next buttons for easy navigation
- Smart page number display that shows:
  - Current page highlighted
  - Always shows first and last page when possible
  - Shows ellipsis (...) for skipped page ranges
  - Displays up to 5 page numbers at once
- Automatically scrolls to the top when changing pages
- Handles both search results and popular movies listing
- Pagination is hidden when only one page of results exists

### Implementation

The pagination component is fully responsive and accessible, with proper ARIA labels for screen readers. It smartly adjusts its display based on the current position within the total result set, ensuring users always have context of where they are in the results.

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
