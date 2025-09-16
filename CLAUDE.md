# USA History - Interactive 3D Historical Map

## Project Overview

This is an interactive historical map application that visualizes the "Industrialization and Economic Transformation" of the United States from 1877 to 1914 using a 3D map interface. The application displays historical events as 3D columns that users can interact with to learn about America's industrial transformation.

## Technology Stack

- **Frontend Framework:** React 18.3.1 with TypeScript
- **Build Tool:** Vite 5.4.20
- **3D Visualization:** Deck.gl 9.1.14 with ColumnLayer
- **Map Integration:** Mapbox GL JS with react-map-gl
- **Styling:** Tailwind CSS 3.4.17
- **Package Manager:** npm

## Key Features

### 3D Data Visualization
- Historical events represented as 3D vertical columns using Deck.gl's ColumnLayer
- Column height indicates event significance (1-10 scale)
- Column color represents chronological age (newer events are brighter)
- Smooth animations and interactive hover effects

### Timeline Control
- Interactive slider at bottom of screen
- Controls displayed year range (1877-1914)
- Real-time filtering of events based on selected year
- Period indicators showing historical context

### Event Details Modal
- Clickable 3D columns open detailed information modal
- Displays event title, year, description, and historical image
- **Modern Connection** section explaining contemporary relevance
- Historical significance rating with star visualization

### Professional UI
- Main title overlay: "Industrialization and Economic Transformation"
- Dark theme with proper contrast and readability
- Responsive design using Tailwind CSS utilities
- Clean, modern interface optimized for educational use

## Data Structure

### Events Dataset (`src/events.json`)
Contains 20 major historical events (1877-1914) with the following properties:
- `id`: Unique identifier
- `title`: Event name
- `year`: Year of occurrence
- `latitude`/`longitude`: Geographic coordinates
- `description`: Historical context and details
- `image`: Unsplash image URL for visual reference
- `modernConnection`: Explanation of contemporary relevance
- `significance`: Impact rating (1-10 scale)

### Sample Events Include:
- Great Railroad Strike (1877)
- Edison's Electric Light Bulb Patent (1879)
- Standard Oil Trust Formation (1882)
- Wright Brothers First Flight (1903)
- Ford Motor Company Founded (1903)
- Federal Reserve System Created (1913)

## Project Structure

```
src/
├── components/
│   ├── Map3D.tsx           # Main 3D map visualization
│   ├── Timeline.tsx        # Year selection slider
│   └── EventModal.tsx      # Event details popup
├── events.json             # Historical events dataset
├── types.d.ts             # TypeScript type definitions
├── App.tsx                # Main application component
├── index.css              # Global styles with Tailwind
└── main.tsx              # Application entry point
```

## Development Commands

- `npm run dev` - Start development server (runs on http://localhost:5174)
- `npm run build` - Build for production
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint code quality checks
- `npm run preview` - Preview production build

## Environment Variables

### Required for Mapbox Integration:
- `VITE_MAPBOX_TOKEN` - Mapbox access token for map tiles

If no Mapbox token is provided, the application will run with Deck.gl visualization only (without the base map layer).

## Configuration Files

- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration for Tailwind
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript configuration

## Key Implementation Details

### 3D Visualization Parameters
- **Column Radius:** 8,000 map units
- **Elevation Scale:** 1x with significance multiplier of 1,500
- **Color Algorithm:** Dynamic based on event age relative to selected year
- **Hover Effects:** Cursor changes and tooltip display
- **Click Handling:** Opens detailed modal for selected event

### Performance Optimizations
- Update triggers for efficient re-rendering
- Filtered data rendering based on timeline selection
- Reusable map instances to reduce memory usage
- Optimized bundle size with code splitting

### Educational Features
- Historical context provided for each time period
- Modern connections help students understand relevance
- Visual significance ratings aid in understanding impact
- Chronological progression through interactive timeline

## Installation & Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. (Optional) Set up Mapbox token in `.env.local`
4. Start development server: `npm run dev`
5. Open http://localhost:5174 in your browser

## Browser Compatibility

- Modern browsers supporting WebGL for 3D rendering
- Responsive design works on desktop and tablet devices
- Optimized for educational environments and presentations

## Educational Use

This application is designed for history education, specifically covering:
- American Industrial Revolution (1877-1914)
- Economic transformation and corporate development
- Geographic distribution of industrial progress
- Connections between historical events and modern society

The interactive nature encourages exploration and discovery learning, making complex historical relationships more accessible through visual storytelling.