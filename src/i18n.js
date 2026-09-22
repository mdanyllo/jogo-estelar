export const DEFAULT_LANG = 'pt';

const TRANSLATIONS = {
  pt: {
    htmlLang: 'pt-BR',
    title: 'Termo',
    subtitle: 'Uma palavra nova por dia, seis tentativas',
    loading: 'Carregando...',
    offline: 'Servidor indisponível',
    enter: 'Enter',
    backspace: 'Apagar',
    won: 'Você venceu',
    lost: 'Você perdeu',
    answerLabel: 'A palavra de hoje era',
    restart: 'Começar de novo',
    nextWordIn: 'Próxima palavra em',
    lockedHint: 'Você já acertou hoje, volte depois da meia-noite',
    switchTo: { pt: 'Português', en: 'Inglês' },
    errors: {
      WORD_NOT_FOUND: 'Essa palavra não está na lista',
      INVALID_LENGTH: 'Complete a palavra',
      GAME_OVER: 'Esta partida já terminou',
      PLAYER_ID_REQUIRED: 'Sessão inválida, recarregue a página',
      LOCKED_UNTIL_MIDNIGHT: 'Você já acertou hoje, volte depois da meia-noite',
      REQUEST_FAILED: 'Não foi possível falar com o servidor'
    }
  },
  en: {
    htmlLang: 'en',
    title: 'Wordle',
    subtitle: 'A new word every day, six tries',
    loading: 'Loading...',
    offline: 'Server unavailable',
    enter: 'Enter',
    backspace: 'Delete',
    won: 'You won',
    lost: 'You lost',
    answerLabel: "Today's word was",
    restart: 'Play again',
    nextWordIn: 'Next word in',
    lockedHint: 'You already solved it today, come back after midnight',
    switchTo: { pt: 'Portuguese', en: 'English' },
    errors: {
      WORD_NOT_FOUND: 'That word is not in the list',
      INVALID_LENGTH: 'Finish the word',
      GAME_OVER: 'This game is already over',
      PLAYER_ID_REQUIRED: 'Invalid session, reload the page',
      LOCKED_UNTIL_MIDNIGHT: 'You already solved it today, come back after midnight',
      REQUEST_FAILED: 'Could not reach the server'
    }
  }
};

export const SUPPORTED_LANGS = Object.keys(TRANSLATIONS);

export function getTexts(lang) {
  return TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];
}
