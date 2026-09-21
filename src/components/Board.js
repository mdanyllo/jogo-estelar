import Row from './Row';

export default function Board({ game, currentGuess, invalid }) {
  const rows = [];

  for (let index = 0; index < game.maxAttempts; index++) {
    const guess = game.guesses[index];

    if (guess) {
      rows.push(<Row key={index} word={guess.word} result={guess.result} length={game.wordLength} />);
      continue;
    }

    const isCurrentRow = index === game.guesses.length && game.status === 'playing';
    rows.push(
      <Row
        key={index}
        word={isCurrentRow ? currentGuess : ''}
        length={game.wordLength}
        invalid={isCurrentRow && invalid}
      />
    );
  }

  return <div className="board">{rows}</div>;
}
