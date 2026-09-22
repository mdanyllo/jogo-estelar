const games = new Map()

function buildKey(playerId, lang, dateKey) {
  return `${playerId}:${lang}:${dateKey}`
}

function createGame(playerId, lang, dateKey) {
  return { playerId, lang, dateKey, guesses: [], status: 'playing' }
}

export function getGame(playerId, lang, dateKey) {
  const key = buildKey(playerId, lang, dateKey)
  if (!games.has(key)) {
    games.set(key, createGame(playerId, lang, dateKey))
  }
  return games.get(key)
}

export function resetGame(playerId, lang, dateKey) {
  const key = buildKey(playerId, lang, dateKey)
  const game = createGame(playerId, lang, dateKey)
  games.set(key, game)
  return game
}

export function removeExpiredGames(currentDateKey) {
  for (const [key, game] of games) {
    if (game.dateKey !== currentDateKey) {
      games.delete(key)
    }
  }
}
