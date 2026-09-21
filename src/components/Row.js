import Tile from './Tile';

export default function Row({ word = '', result = [], length, invalid = false }) {
  const letters = Array.from({ length }, (_, index) => word[index] || '');

  return (
    <div className={invalid ? 'row row-invalid' : 'row'}>
      {letters.map((letter, index) => (
        <Tile key={index} letter={letter} state={result[index]} position={index} />
      ))}
    </div>
  );
}
