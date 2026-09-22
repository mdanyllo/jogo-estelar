import { useEffect, useState } from 'react';

function formatRemaining(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = String(Math.floor(total / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const seconds = String(total % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export default function GameOver({ status, answer, canRestart, nextResetAt, texts, onRestart, onExpire }) {
  const won = status === 'won';
  const target = nextResetAt ? Date.parse(nextResetAt) : 0;
  const [remaining, setRemaining] = useState(() => target - Date.now());

  useEffect(() => {
    if (!target || canRestart) return undefined;

    setRemaining(target - Date.now());
    const id = setInterval(() => setRemaining(target - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target, canRestart]);

  useEffect(() => {
    if (canRestart || remaining > 0 || !target) return;
    onExpire();
  }, [canRestart, remaining, target, onExpire]);

  return (
    <div className="game-over">
      <p className="game-over-title">{won ? texts.won : texts.lost}</p>
      <p className="game-over-answer">
        {texts.answerLabel} <strong>{answer}</strong>
      </p>

      {canRestart ? (
        <button type="button" className="restart" onClick={onRestart}>
          {texts.restart}
        </button>
      ) : (
        <div className="countdown">
          <p className="countdown-label">{texts.nextWordIn}</p>
          <p className="countdown-clock">{formatRemaining(remaining)}</p>
        </div>
      )}
    </div>
  );
}
