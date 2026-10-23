# Hawaayein

A responsive weather dashboard built with React and Vite. Hawaayein shows current conditions, a 24-hour outlook, a 7-day forecast, air quality, UV, wind, sunrise and sunset, and a compact set of live weather details.

Weather, geocoding, and air-quality data come from [Open-Meteo](https://open-meteo.com/). No API key or backend is required.

## Features

- Current temperature, feels-like temperature, condition, and daily high/low
- 24-hour hourly forecast with precipitation chance
- 7-day forecast with temperature ranges
- Air quality index with PM2.5, PM10, ozone, and nitrogen dioxide
- UV index, humidity, dew point, wind and gusts, visibility, pressure, and cloud cover
- City search with autocomplete
- Device geolocation
- Celsius/Fahrenheit and metric/imperial units
- Weather- and time-aware visual theme
- Saved unit and last-location preferences
- Responsive layout for phones, tablets, foldables, laptops, and large screens
- Keyboard-accessible controls, visible focus states, semantic headings, and reduced-motion support
- Open-Meteo attribution and 10-minute client-side caching

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm start
   ```

3. Open `http://127.0.0.1:3000`.

No environment variables are needed.

## Scripts

- `npm start` / `npm run dev` - start the Vite dev server
- `npm run build` - build for production into `build/`
- `npm run preview` - preview the production build
- `npm test` - run the test suite once
- `npm run test:watch` - run tests in watch mode

## Data and attribution

- Forecast, geocoding, and air quality: [Open-Meteo](https://open-meteo.com/)
- Weather data is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- The attribution is displayed in the app footer.

## Privacy

The app runs entirely in the browser. It stores only the last location, units, and a short-lived weather cache in local/session storage. Geolocation is requested only when you press the location button.

## License

The application code is part of this repository. Open-Meteo data is subject to its own license and attribution requirements.
