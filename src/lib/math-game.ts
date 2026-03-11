export type CountChallenge = {
  kind: 'count';
  prompt: string;
  count: number;
  choices: number[];
  visual: string;
  hint: string;
};

export type SumChallenge = {
  kind: 'sum';
  prompt: string;
  left: number;
  right: number;
  operator: '+' | '-';
  answer: number;
  choices: number[];
  hint: string;
};

function rangeByAge(age: number) {
  if (age <= 5) {
    return { maxCount: 10, maxValue: 10 };
  }

  if (age <= 7) {
    return { maxCount: 20, maxValue: 20 };
  }

  return { maxCount: 30, maxValue: 100 };
}

function rotate<T>(items: T[], seed: number): T[] {
  if (items.length === 0) {
    return [];
  }

  const offset = seed % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

function buildChoices(answer: number, maxValue: number) {
  const rawChoices = [answer, Math.max(0, answer - 1), Math.min(maxValue, answer + 1), Math.min(maxValue, answer + 2)];
  return [...new Set(rawChoices)];
}

export function createCountChallenge(age: number, step = 0): CountChallenge {
  const { maxCount } = rangeByAge(age);
  const count = (step % Math.max(4, Math.min(maxCount, 10))) + 1;
  const choices = rotate(buildChoices(count, maxCount), age + step);

  return {
    kind: 'count',
    prompt: 'Hvor mange ser du?',
    count,
    choices,
    visual: '🍎'.repeat(count),
    hint: 'Tell én og én rolig.',
  };
}

export function createSumChallenge(age: number, step = 0): SumChallenge {
  const { maxValue } = rangeByAge(age);
  const operator: '+' | '-' = step % 2 === 0 ? '+' : '-';
  const leftBase = (step % 5) + 2;
  const rightBase = (step % 4) + 1;
  const left = Math.min(maxValue, age + leftBase);
  const right = operator === '+' ? Math.min(maxValue - left, rightBase) : Math.min(left - 1, rightBase);
  const answer = operator === '+' ? left + right : left - right;
  const choices = rotate(buildChoices(answer, maxValue), step + age);

  return {
    kind: 'sum',
    prompt: `${left} ${operator} ${right}`,
    left,
    right,
    operator,
    answer,
    choices,
    hint: operator === '+' ? 'Legg sammen begge tallene.' : 'Ta bort det siste tallet.',
  };
}

export function isMathAnswerCorrect(answer: number, guess: number) {
  return answer === guess;
}

export function createMathReward(isPerfectRound: boolean) {
  return {
    stars: isPerfectRound ? 2 : 1,
    stickers: 1,
  };
}
