const games = new Map()

function buildKey(playerId, dateKey) {
  return `${playerId}:${dateKey}`
}

function createGame(playerId, dateKey) {
  return { playerId, dateKey, guesses: [], status: 'playing' }
}

export function getGame(playerId, dateKey) {
  const key = buildKey(playerId, dateKey)
  if (!games.has(key)) {
    games.set(key, createGame(playerId, dateKey))
  }
  return games.get(key)
}

export function resetGame(playerId, dateKey) {
  const key = buildKey(playerId, dateKey)
  const game = createGame(playerId, dateKey)
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
