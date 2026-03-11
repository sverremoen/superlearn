import { describe, expect, it } from 'vitest';
import {
  appendLetter,
  createBuildWordChallenge,
  createLetterHuntChallenge,
  createLettersReward,
  isBuildWordCorrect,
  isLetterHuntCorrect,
} from '@/lib/letters-game';

describe('letters game', () => {
  it('creates letter hunt choices including the target', () => {
    const challenge = createLetterHuntChallenge(5, 0);
    expect(challenge.options).toContain(challenge.target);
    expect(challenge.options).toHaveLength(4);
  });

  it('expands letter pool for older children', () => {
    const younger = createLetterHuntChallenge(5, 0);
    const older = createLetterHuntChallenge(8, 21);
    expect(younger.options.some((option) => ['Æ', 'Ø', 'Å'].includes(option))).toBe(false);
    expect(older.options.some((option) => ['Æ', 'Ø', 'Å'].includes(option))).toBe(true);
  });

  it('validates letter hunt answer', () => {
    const challenge = createLetterHuntChallenge(6, 1);
    expect(isLetterHuntCorrect(challenge, challenge.target.toLowerCase())).toBe(true);
    expect(isLetterHuntCorrect(challenge, 'X')).toBe(false);
  });

  it('creates build-word challenge with scrambled letters', () => {
    const challenge = createBuildWordChallenge(6, 2);
    expect(challenge.scrambledLetters.sort()).toEqual(challenge.word.split('').sort());
  });

  it('uses shorter words for younger children and longer words for older children', () => {
    const younger = createBuildWordChallenge(4, 0);
    const older = createBuildWordChallenge(8, 10);
    expect(younger.word.length).toBeLessThanOrEqual(3);
    expect(older.word.length).toBeGreaterThanOrEqual(5);
  });

  it('keeps build-word hint aligned with the first letter', () => {
    const challenge = createBuildWordChallenge(7, 3);
    expect(challenge.hint).toContain(challenge.word[0]);
  });

  it('appends letters without exceeding limit', () => {
    expect(appendLetter('SO', 'L')).toBe('SOL');
    expect(appendLetter('ABCDEFGHIJKL', 'M')).toBe('ABCDEFGHIJKL');
  });

  it('validates built word', () => {
    const challenge = createBuildWordChallenge(4, 0);
    expect(isBuildWordCorrect(challenge, challenge.word.toLowerCase())).toBe(true);
    expect(isBuildWordCorrect(challenge, 'FEIL')).toBe(false);
  });

  it('awards extra stars for perfect round', () => {
    expect(createLettersReward(true)).toEqual({ stars: 2, stickers: 1 });
    expect(createLettersReward(false)).toEqual({ stars: 1, stickers: 1 });
  });
});
