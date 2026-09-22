import { useEffect, useState } from 'react';
import Board from './components/Board';
import Flag from './components/Flag';
import GameOver from './components/GameOver';
import Keyboard from './components/Keyboard';
import { useGame } from './hooks/useGame';
import { DEFAULT_LANG, SUPPORTED_LANGS } from './i18n';
import './App.css';

export default function App() {
  const [lang, setLang] = useState(DEFAULT_LANG);
  const { game, currentGuess, message, invalid, loading, letterStates, texts, handleKey, restart, reload } =
    useGame(lang);

  useEffect(() => {
    document.documentElement.lang = texts.htmlLang;
    document.title = texts.title;
  }, [texts]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.ctrlKey || event.altKey || event.metaKey) return;

      if (event.key === 'Enter') handleKey('ENTER');
      else if (event.key === 'Backspace') handleKey('BACKSPACE');
      else if (event.key.length === 1) handleKey(event.key);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey]);

  return (
    <div className="app">
      <header className="header">
        <h1>{texts.title}</h1>
        <p className="subtitle">{texts.subtitle}</p>

        <div className="lang-switch">
          {SUPPORTED_LANGS.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              className={`lang-button ${lang === code ? 'lang-button-active' : ''}`}
              aria-pressed={lang === code}
              aria-label={texts.switchTo[code]}
            >
              <Flag lang={code} />
              <span className="lang-label">{code.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </header>

      <main className="content">
        {loading && <p className="status">{texts.loading}</p>}

        {!loading && game && (
          <>
            <div className="message-area">{message && <div className="message">{message}</div>}</div>

            <Board game={game} currentGuess={currentGuess} invalid={invalid} />

            {game.status === 'playing' ? (
              <Keyboard letterStates={letterStates} texts={texts} onKey={handleKey} />
            ) : (
              <GameOver
                status={game.status}
                answer={game.answer}
                canRestart={game.canRestart}
                nextResetAt={game.nextResetAt}
                texts={texts}
                onRestart={restart}
                onExpire={reload}
              />
            )}
          </>
        )}

        {!loading && !game && <p className="status">{message || texts.offline}</p>}
      </main>
    </div>
  );
}
