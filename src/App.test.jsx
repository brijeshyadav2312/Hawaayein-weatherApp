import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import App from './App';

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    })
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test('renders the city search input and reports request failures', async () => {
  render(<App />);

  expect(screen.getByPlaceholderText(/city name/i)).toBeInTheDocument();
  expect(await screen.findByText(/invalid city name/i)).toBeInTheDocument();
});
