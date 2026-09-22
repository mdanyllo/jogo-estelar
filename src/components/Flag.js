const STRIPE = 10 / 13;

function BrazilFlag() {
  return (
    <svg className="flag" viewBox="0 0 20 14" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="20" height="14" fill="#009C3B" />
      <path d="M10 1.4 18.6 7 10 12.6 1.4 7Z" fill="#FFDF00" />
      <circle cx="10" cy="7" r="2.45" fill="#002776" />
      <path d="M7.78 8.04C9.2 6.4 11.2 6.4 12.22 8.04L11.75 8.04C10.9 6.95 9.2 6.95 8.25 8.04Z" fill="#FFFFFF" />
    </svg>
  );
}

function UnitedStatesFlag() {
  const stars = [];
  for (let row = 0; row < 5; row += 1) {
    const columns = row % 2 === 0 ? 6 : 5;
    for (let column = 0; column < columns; column += 1) {
      stars.push(
        <circle
          key={`${row}-${column}`}
          cx={(row % 2 === 0 ? 0.72 : 1.34) + column * 1.24}
          cy={0.62 + row * 1.04}
          r="0.24"
          fill="#FFFFFF"
        />
      );
    }
  }

  return (
    <svg className="flag" viewBox="0 0 19 10" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="19" height="10" fill="#FFFFFF" />
      {[0, 2, 4, 6, 8, 10, 12].map((index) => (
        <rect key={index} y={index * STRIPE} width="19" height={STRIPE} fill="#B31942" />
      ))}
      <rect width="7.6" height={7 * STRIPE} fill="#0A3161" />
      {stars}
    </svg>
  );
}

export default function Flag({ lang }) {
  return lang === 'en' ? <UnitedStatesFlag /> : <BrazilFlag />;
}
