export type LetterHuntChallenge = {
  kind: 'hunt';
  prompt: string;
  target: string;
  options: string[];
  hint: string;
};

export type BuildWordChallenge = {
  kind: 'build';
  prompt: string;
  word: string;
  image: string;
  scrambledLetters: string[];
  hint: string;
};

export type LettersChallenge = LetterHuntChallenge | BuildWordChallenge;

const easyLetters = ['A', 'E', 'I', 'O', 'S', 'L', 'M', 'R'];
const mediumLetters = ['B', 'D', 'F', 'G', 'H', 'K', 'N', 'T'];
const hardLetters = ['J', 'P', 'U', 'V', 'Y', 'Æ', 'Ø', 'Å'];

const wordBank = [
  { word: 'SOL', image: '☀️', minAge: 4 },
  { word: 'IS', image: '🍦', minAge: 4 },
  { word: 'MAT', image: '🍎', minAge: 4 },
  { word: 'HUS', image: '🏠', minAge: 5 },
  { word: 'BIL', image: '🚗', minAge: 5 },
  { word: 'FISK', image: '🐟', minAge: 6 },
  { word: 'BOK', image: '📘', minAge: 6 },
  { word: 'ULV', image: '🐺', minAge: 7 },
  { word: 'TOG', image: '🚂', minAge: 7 },
  { word: 'STJERNE', image: '⭐', minAge: 8 },
  { word: 'SKOLE', image: '🎒', minAge: 8 },
];

function pickByAge(age: number) {
  if (age <= 5) {
    return easyLetters;
  }

  if (age <= 7) {
    return [...easyLetters, ...mediumLetters];
  }

  return [...easyLetters, ...mediumLetters, ...hardLetters];
}

function rotate<T>(items: T[], seed: number): T[] {
  if (items.length === 0) {
    return [];
  }

  const offset = seed % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

export function createLetterHuntChallenge(age: number, step = 0): LetterHuntChallenge {
  const pool = pickByAge(age);
  const rotated = rotate(pool, step);
  const target = rotated[0];
  const distractors = rotated.slice(1, 4);
  const options = rotate([target, ...distractors], step + age);

  return {
    kind: 'hunt',
    prompt: `Finn bokstaven ${target}`,
    target,
    options,
    hint: `Se etter bokstaven som starter lyden ${target}.`,
  };
}

export function createBuildWordChallenge(age: number, step = 0): BuildWordChallenge {
  const candidates = wordBank.filter((item) => item.minAge <= Math.max(age, 4));
  const chosen = rotate(candidates, step)[0] ?? wordBank[0];
  const scrambledLetters = rotate(chosen.word.split(''), step + 1);

  return {
    kind: 'build',
    prompt: `Bygg ordet ${chosen.word}`,
    word: chosen.word,
    image: chosen.image,
    scrambledLetters,
    hint: `Start med bokstaven ${chosen.word[0]}.`,
  };
}

export function isLetterHuntCorrect(challenge: LetterHuntChallenge, answer: string) {
  return answer.toUpperCase() === challenge.target;
}

export function appendLetter(current: string, nextLetter: string) {
  return `${current}${nextLetter}`.slice(0, 12);
}

export function isBuildWordCorrect(challenge: BuildWordChallenge, answer: string) {
  return answer.toUpperCase() === challenge.word;
}

export function createLettersReward(isPerfectRound: boolean) {
  return {
    stars: isPerfectRound ? 2 : 1,
    stickers: 1,
  };
}
