import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchGame, resetGame, sendGuess } from '../api';
import { getTexts } from '../i18n';
import { normalizeLetter } from '../normalize';

const STATE_PRIORITY = { absent: 0, present: 1, correct: 2 };

export function useGame(lang) {
  const [game, setGame] = useState(null);
  const [currentGuess, setCurrentGuess] = useState('');
  const [message, setMessage] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const messageTimeout = useRef(null);
  const texts = getTexts(lang);

  const showMessage = useCallback((text, duration = 2000) => {
    clearTimeout(messageTimeout.current);
    setMessage(text);
    if (duration > 0) {
      messageTimeout.current = setTimeout(() => setMessage(''), duration);
    }
  }, []);

  const describeError = useCallback(
    (error) => texts.errors[error?.code] || texts.errors.REQUEST_FAILED,
    [texts]
  );

  const rejectGuess = useCallback(
    (text) => {
      showMessage(text);
      setInvalid(true);
      setTimeout(() => setInvalid(false), 500);
    },
    [showMessage]
  );

  useEffect(() => {
    let active = true;

    setLoading(true);
    setGame(null);
    setCurrentGuess('');
    showMessage('', 0);

    fetchGame(lang)
      .then((nextGame) => {
        if (active) setGame(nextGame);
      })
      .catch((error) => {
        if (active) showMessage(describeError(error), 0);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [lang, describeError, showMessage]);

  useEffect(() => () => clearTimeout(messageTimeout.current), []);

  const submitGuess = useCallback(async () => {
    if (!game || submitting) return;

    if (currentGuess.length < game.wordLength) {
      rejectGuess(texts.errors.INVALID_LENGTH);
      return;
    }

    setSubmitting(true);
    try {
      const nextGame = await sendGuess(currentGuess, lang);
      setGame(nextGame);
      setCurrentGuess('');
    } catch (error) {
      rejectGuess(describeError(error));
    } finally {
      setSubmitting(false);
    }
  }, [currentGuess, game, lang, describeError, rejectGuess, submitting, texts]);

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

  const reload = useCallback(() => {
    fetchGame(lang)
      .then(setGame)
      .catch((error) => showMessage(describeError(error), 0));
  }, [lang, describeError, showMessage]);

  const restart = useCallback(async () => {
    try {
      const nextGame = await resetGame(lang);
      setGame(nextGame);
      setCurrentGuess('');
      showMessage('', 0);
    } catch (error) {
      showMessage(describeError(error));
    }
  }, [lang, describeError, showMessage]);

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

  return { game, currentGuess, message, invalid, loading, letterStates, texts, handleKey, restart, reload };
}
