import { DEFAULT_LANG } from './i18n';
import { getPlayerId } from './playerId';

const BASE_URL = '/api/game';

async function request(path, lang, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-player-id': getPlayerId(),
      'x-lang': lang || DEFAULT_LANG,
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

export function fetchGame(lang) {
  return request('', lang);
}

export function sendGuess(guess, lang) {
  return request('/guess', lang, { method: 'POST', body: JSON.stringify({ guess }) });
}

export function resetGame(lang) {
  return request('/reset', lang, { method: 'POST' });
}
