import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchGame, resetGame, sendGuess } from '../api';
import { normalizeLetter } from '../normalize';

const ERROR_MESSAGES = {
  WORD_NOT_FOUND: 'Essa palavra não está na lista',
  INVALID_LENGTH: 'Complete a palavra',
  GAME_OVER: 'Esta partida já terminou',
  PLAYER_ID_REQUIRED: 'Sessão inválida, recarregue a página',
  REQUEST_FAILED: 'Não foi possível falar com o servidor'
};

const STATE_PRIORITY = { absent: 0, present: 1, correct: 2 };

export function useGame() {
  const [game, setGame] = useState(null);
  const [currentGuess, setCurrentGuess] = useState('');
  const [message, setMessage] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const messageTimeout = useRef(null);

  const showMessage = useCallback((text, duration = 2000) => {
    clearTimeout(messageTimeout.current);
    setMessage(text);
    if (duration > 0) {
      messageTimeout.current = setTimeout(() => setMessage(''), duration);
    }
  }, []);

  const rejectGuess = useCallback(
    (text) => {
      showMessage(text);
      setInvalid(true);
      setTimeout(() => setInvalid(false), 500);
    },
    [showMessage]
  );

  useEffect(() => {
    fetchGame()
      .then(setGame)
      .catch((error) => showMessage(ERROR_MESSAGES[error.code] || ERROR_MESSAGES.REQUEST_FAILED, 0))
      .finally(() => setLoading(false));
  }, [showMessage]);

  useEffect(() => () => clearTimeout(messageTimeout.current), []);

  const submitGuess = useCallback(async () => {
    if (!game || submitting) return;

    if (currentGuess.length < game.wordLength) {
      rejectGuess(ERROR_MESSAGES.INVALID_LENGTH);
      return;
    }

    setSubmitting(true);
    try {
      const nextGame = await sendGuess(currentGuess);
      setGame(nextGame);
      setCurrentGuess('');
    } catch (error) {
      rejectGuess(ERROR_MESSAGES[error.code] || ERROR_MESSAGES.REQUEST_FAILED);
    } finally {
      setSubmitting(false);
    }
  }, [currentGuess, game, rejectGuess, submitting]);

  const handleKey = useCallback(
    (key) => {
      if (!game || game.status !== 'playing' || submitting) return;

      if (key === 'ENTER') {
        submitGuess();
        return;
      }

      if (key === 'BACKSPACE') {
        setCurrentGuess((value) => value.slice(0, -1));
        return;
      }

      const letter = normalizeLetter(key);
      if (/^[A-Z]$/.test(letter)) {
        setCurrentGuess((value) => (value.length < game.wordLength ? value + letter : value));
      }
    },
    [game, submitGuess, submitting]
  );

  const restart = useCallback(async () => {
    try {
      const nextGame = await resetGame();
      setGame(nextGame);
      setCurrentGuess('');
      showMessage('');
    } catch (error) {
      showMessage(ERROR_MESSAGES[error.code] || ERROR_MESSAGES.REQUEST_FAILED);
    }
  }, [showMessage]);

  const letterStates = useMemo(() => {
    const states = {};
    if (!game) return states;

    for (const guess of game.guesses) {
      guess.word.split('').forEach((letter, index) => {
        const state = guess.result[index];
        const current = states[letter];
        if (!current || STATE_PRIORITY[state] > STATE_PRIORITY[current]) {
          states[letter] = state;
        }
      });
    }

    return states;
  }, [game]);

  return { game, currentGuess, message, invalid, loading, letterStates, handleKey, restart };
}
