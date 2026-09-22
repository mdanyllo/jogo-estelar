const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

export default function Keyboard({ letterStates, texts, onKey }) {
  const labels = { ENTER: texts.enter, BACKSPACE: texts.backspace };

  return (
    <div className="keyboard">
      {ROWS.map((row, index) => (
        <div key={index} className="keyboard-row">
          {row.map((key) => {
            const state = letterStates[key];
            const classes = ['key'];
            if (key.length > 1) classes.push('key-wide');
            if (state) classes.push(`key-${state}`);

            return (
              <button key={key} type="button" className={classes.join(' ')} onClick={() => onKey(key)}>
                {labels[key] || key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
