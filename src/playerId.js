const STORAGE_KEY = 'jogo-estelar:player-id';

export function getPlayerId() {
  let playerId = localStorage.getItem(STORAGE_KEY);
  if (!playerId) {
    playerId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, playerId);
  }
  return playerId;
}
