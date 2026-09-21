export default function GameOver({ status, answer, onRestart }) {
  const won = status === 'won';

  return (
    <div className="game-over">
      <p className="game-over-title">{won ? 'Você venceu' : 'Você perdeu'}</p>
      <p className="game-over-answer">
        A palavra de hoje era <strong>{answer}</strong>
      </p>
      <button type="button" className="restart" onClick={onRestart}>
        Começar de novo
      </button>
    </div>
  );
}
