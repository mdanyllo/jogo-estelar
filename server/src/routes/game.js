import { Router } from 'express'
import { config } from '../config.js'
import { getDateKey, getWordOfTheDay } from '../dailyWord.js'
import { evaluateGuess } from '../evaluate.js'
import { getGame, resetGame, removeExpiredGames } from '../gameStore.js'
import { normalizeWord } from '../normalize.js'
import { isValidWord } from '../words.js'

export const gameRouter = Router()

function requirePlayerId(request, response, next) {
  const playerId = request.header('x-player-id')
  if (!playerId || playerId.length > 64) {
    return response.status(400).json({ error: 'PLAYER_ID_REQUIRED' })
  }
  request.playerId = playerId
  next()
}

function buildState(game, answer) {
  return {
    date: game.dateKey,
    wordLength: config.wordLength,
    maxAttempts: config.maxAttempts,
    guesses: game.guesses,
    status: game.status,
    answer: game.status === 'playing' ? null : answer
  }
}

function loadContext(playerId) {
  const dateKey = getDateKey(config.timeZone)
  removeExpiredGames(dateKey)
  return { dateKey, answer: getWordOfTheDay(dateKey), game: getGame(playerId, dateKey) }
}

gameRouter.use(requirePlayerId)

gameRouter.get('/', (request, response) => {
  const { game, answer } = loadContext(request.playerId)
  response.json(buildState(game, answer))
})

gameRouter.post('/guess', (request, response) => {
  const { game, answer } = loadContext(request.playerId)

  if (game.status !== 'playing') {
    return response.status(409).json({ error: 'GAME_OVER' })
  }

  const guess = normalizeWord(request.body?.guess)

  if (guess.length !== config.wordLength) {
    return response.status(400).json({ error: 'INVALID_LENGTH' })
  }

  if (!isValidWord(guess)) {
    return response.status(400).json({ error: 'WORD_NOT_FOUND' })
  }

  game.guesses.push({ word: guess, result: evaluateGuess(guess, answer) })

  if (guess === answer) {
    game.status = 'won'
  } else if (game.guesses.length >= config.maxAttempts) {
    game.status = 'lost'
  }

  response.json(buildState(game, answer))
})

gameRouter.post('/reset', (request, response) => {
  const dateKey = getDateKey(config.timeZone)
  const game = resetGame(request.playerId, dateKey)
  response.json(buildState(game, getWordOfTheDay(dateKey)))
})
