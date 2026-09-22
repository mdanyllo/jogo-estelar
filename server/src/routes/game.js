import { Router } from 'express'
import { config } from '../config.js'
import { getDateKey, getNextResetAt, getWordOfTheDay } from '../dailyWord.js'
import { evaluateGuess } from '../evaluate.js'
import { getGame, resetGame, removeExpiredGames } from '../gameStore.js'
import { normalizeWord } from '../normalize.js'
import { isValidWord, resolveLang } from '../words.js'

export const gameRouter = Router()

function requirePlayerId(request, response, next) {
  const playerId = request.header('x-player-id')
  if (!playerId || playerId.length > 64) {
    return response.status(400).json({ error: 'PLAYER_ID_REQUIRED' })
  }
  request.playerId = playerId
  request.lang = resolveLang(request.header('x-lang'))
  next()
}

function buildState(game, answer) {
  return {
    date: game.dateKey,
    lang: game.lang,
    wordLength: config.wordLength,
    maxAttempts: config.maxAttempts,
    guesses: game.guesses,
    status: game.status,
    answer: game.status === 'playing' ? null : answer,
    canRestart: game.status !== 'won',
    nextResetAt: getNextResetAt(game.dateKey, config.timeZone).toISOString()
  }
}

function loadContext(playerId, lang) {
  const dateKey = getDateKey(config.timeZone)
  removeExpiredGames(dateKey)
  return {
    dateKey,
    answer: getWordOfTheDay(dateKey, lang),
    game: getGame(playerId, lang, dateKey)
  }
}

gameRouter.use(requirePlayerId)

gameRouter.get('/', (request, response) => {
  const { game, answer } = loadContext(request.playerId, request.lang)
  response.json(buildState(game, answer))
})

gameRouter.post('/guess', (request, response) => {
  const { game, answer } = loadContext(request.playerId, request.lang)

  if (game.status !== 'playing') {
    return response.status(409).json({ error: 'GAME_OVER' })
  }

  const guess = normalizeWord(request.body?.guess)

  if (guess.length !== config.wordLength) {
    return response.status(400).json({ error: 'INVALID_LENGTH' })
  }

  if (!isValidWord(guess, request.lang)) {
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
  const { game, answer, dateKey } = loadContext(request.playerId, request.lang)

  if (game.status === 'won') {
    return response.status(409).json({ error: 'LOCKED_UNTIL_MIDNIGHT' })
  }

  const nextGame = resetGame(request.playerId, request.lang, dateKey)
  response.json(buildState(nextGame, answer))
})
