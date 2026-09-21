import { useEffect } from 'react';
import Board from './components/Board';
import GameOver from './components/GameOver';
import Keyboard from './components/Keyboard';
import { useGame } from './hooks/useGame';
import './App.css';

export default function App() {
  const { game, currentGuess, message, invalid, loading, letterStates, handleKey, restart } = useGame();

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
        <h1>Termo</h1>
        <p className="subtitle">Uma palavra nova por dia, seis tentativas</p>
      </header>

      <main className="content">
        {loading && <p className="status">Carregando...</p>}

        {!loading && game && (
          <>
            <div className="message-area">{message && <div className="message">{message}</div>}</div>

            <Board game={game} currentGuess={currentGuess} invalid={invalid} />

            {game.status === 'playing' ? (
              <Keyboard letterStates={letterStates} onKey={handleKey} />
            ) : (
              <GameOver status={game.status} answer={game.answer} onRestart={restart} />
            )}
          </>
        )}

        {!loading && !game && <p className="status">{message || 'Servidor indisponível'}</p>}
      </main>
    </div>
  );
}
