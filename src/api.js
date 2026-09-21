import { getPlayerId } from './playerId';

const BASE_URL = '/api/game';

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-player-id': getPlayerId(),
      ...options.headers
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || 'REQUEST_FAILED');
    error.code = data.error || 'REQUEST_FAILED';
    throw error;
  }

  return data;
}

export function fetchGame() {
  return request('');
}

export function sendGuess(guess) {
  return request('/guess', { method: 'POST', body: JSON.stringify({ guess }) });
}

export function resetGame() {
  return request('/reset', { method: 'POST' });
}
