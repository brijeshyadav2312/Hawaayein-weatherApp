# Hawaayein Weather App

A small React weather app built with [Vite](https://vite.dev/) that shows current conditions from OpenWeatherMap.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local `.env` file from `.env.example` and add your OpenWeatherMap API key:

   ```bash
   VITE_OPENWEATHER_API_KEY=your_key_here
   ```

   Get a key from https://home.openweathermap.org/api_keys

3. Start the dev server:

   ```bash
   npm start
   ```

## Scripts

- `npm start` / `npm run dev` - start the Vite dev server
- `npm run build` - build for production into `build/`
- `npm run preview` - preview the production build
- `npm test` - run the test suite once
- `npm run test:watch` - run tests in watch mode

## Security notes

- API keys used in browser apps are always visible to end users. Restrict the key to the
  OpenWeatherMap Weather API and, where possible, proxy requests through a backend so the key
  is never shipped to clients.
- An API key was previously committed to this repository. Treat it as compromised and rotate it
  in the OpenWeatherMap dashboard.
- `.env` files are git-ignored. Never commit real credentials.
