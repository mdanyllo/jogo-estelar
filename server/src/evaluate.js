export function evaluateGuess(guess, answer) {
  const result = new Array(guess.length).fill('absent')
  const unmatched = new Map()

  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === answer[i]) {
      result[i] = 'correct'
    } else {
      unmatched.set(answer[i], (unmatched.get(answer[i]) || 0) + 1)
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i] === 'correct') continue
    const letter = guess[i]
    const available = unmatched.get(letter) || 0
    if (available > 0) {
      result[i] = 'present'
      unmatched.set(letter, available - 1)
    }
  }

  return result
}
