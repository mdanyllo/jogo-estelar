export default function Tile({ letter, state, position }) {
  const classes = ['tile'];
  if (state) classes.push('tile-revealed', `tile-${state}`);
  else if (letter) classes.push('tile-filled');

  return (
    <div className={classes.join(' ')} style={{ animationDelay: `${position * 250}ms` }}>
      {letter}
    </div>
  );
}
