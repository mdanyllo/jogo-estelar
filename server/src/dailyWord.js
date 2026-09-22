import { getAnswers, resolveLang } from './words.js'

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

const WORD_ORDERS = new Map()

function getWordOrder(lang) {
  const key = resolveLang(lang)
  if (!WORD_ORDERS.has(key)) {
    WORD_ORDERS.set(key, shuffle(getAnswers(key), SHUFFLE_SEED))
  }
  return WORD_ORDERS.get(key)
}

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

export function getWordOfTheDay(dateKey, lang) {
  const order = getWordOrder(lang)
  const days = daysBetween(EPOCH_DATE, dateKey)
  const index = ((days % order.length) + order.length) % order.length
  return order[index]
}

function addDay(dateKey) {
  return new Date(Date.parse(`${dateKey}T00:00:00Z`) + MS_PER_DAY).toISOString().slice(0, 10)
}

function getZoneOffset(timeZone, date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
    .formatToParts(date)
    .reduce((acc, part) => {
      acc[part.type] = part.value
      return acc
    }, {})

  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second)
  )

  return asUtc - date.getTime()
}

export function getNextResetAt(dateKey, timeZone) {
  const target = Date.parse(`${addDay(dateKey)}T00:00:00Z`)
  const firstPass = target - getZoneOffset(timeZone, new Date(target))
  return new Date(target - getZoneOffset(timeZone, new Date(firstPass)))
}
