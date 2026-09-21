import { ANSWERS } from './words.js'

const EPOCH_DATE = '2024-01-01'
const SHUFFLE_SEED = 20240101
const MS_PER_DAY = 86400000

function createRandom(seed) {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

function shuffle(list, seed) {
  const random = createRandom(seed)
  const result = [...list]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}

const WORD_ORDER = shuffle(ANSWERS, SHUFFLE_SEED)

export function getDateKey(timeZone, date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

function daysBetween(fromKey, toKey) {
  const from = Date.parse(`${fromKey}T00:00:00Z`)
  const to = Date.parse(`${toKey}T00:00:00Z`)
  return Math.floor((to - from) / MS_PER_DAY)
}

export function getWordOfTheDay(dateKey) {
  const days = daysBetween(EPOCH_DATE, dateKey)
  const index = ((days % WORD_ORDER.length) + WORD_ORDER.length) % WORD_ORDER.length
  return WORD_ORDER[index]
}
