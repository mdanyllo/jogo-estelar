import { config } from './config.js'
import { normalizeWord } from './normalize.js'
import ptData from './data/palavras.json' with { type: 'json' }
import enData from './data/words.json' with { type: 'json' }

const DICTIONARIES = {
  pt: {
    answers: ptData.answers,
    validSet: new Set([...ptData.answers, ...ptData.extra])
  },
  en: {
    answers: enData.answers,
    validSet: new Set([...enData.answers, ...enData.extra])
  }
}

export const DEFAULT_LANG = 'pt'

export const SUPPORTED_LANGS = Object.keys(DICTIONARIES)

export function resolveLang(lang) {
  return Object.prototype.hasOwnProperty.call(DICTIONARIES, lang) ? lang : DEFAULT_LANG
}

function getDictionary(lang) {
  return DICTIONARIES[resolveLang(lang)]
}

export function getAnswers(lang) {
  return getDictionary(lang).answers
}

export function isValidWord(word, lang = DEFAULT_LANG) {
  const clean = normalizeWord(word)
  return clean.length === config.wordLength && getDictionary(lang).validSet.has(clean)
}
