import { describe, expect, it } from 'vitest';
import { createCountChallenge, createMathReward, createMultiplicationChallenge, createSumChallenge, isMathAnswerCorrect } from '@/lib/math-game';

describe('math game', () => {
  it('creates count challenge with matching visual and answer', () => {
    const challenge = createCountChallenge(5, 2);
    expect(challenge.count).toBeGreaterThan(0);
    expect(challenge.choices).toContain(challenge.count);
  });

  it('keeps young count challenges within small range', () => {
    const challenge = createCountChallenge(4, 8);
    expect(challenge.count).toBeLessThanOrEqual(10);
  });

  it('creates plus challenge with answer in choices', () => {
    const challenge = createSumChallenge(6, 0);
    expect(challenge.operator).toBe('+');
    expect(challenge.choices).toContain(challenge.answer);
  });

  it('creates minus challenge without negative answers', () => {
    const challenge = createSumChallenge(6, 1);
    expect(challenge.operator).toBe('-');
    expect(challenge.answer).toBeGreaterThanOrEqual(0);
  });

  it('increases answer range for older children', () => {
    const younger = createSumChallenge(5, 4);
    const older = createSumChallenge(8, 4);
    expect(older.answer).toBeGreaterThan(younger.answer);
  });

  it('keeps all answer choices unique', () => {
    const challenge = createSumChallenge(8, 3);
    expect(new Set(challenge.choices).size).toBe(challenge.choices.length);
  });

  it('creates multiplication challenge with answer in choices', () => {
    const challenge = createMultiplicationChallenge(8, 2);
    expect(challenge.operator).toBe('×');
    expect(challenge.answer).toBe(challenge.left * challenge.right);
    expect(challenge.choices).toContain(challenge.answer);
  });

  it('keeps multiplication range kid-friendly for young profiles', () => {
    const challenge = createMultiplicationChallenge(4, 5);
    expect(challenge.left).toBeLessThanOrEqual(3);
    expect(challenge.right).toBeLessThanOrEqual(3);
  });

  it('validates math answers', () => {
    expect(isMathAnswerCorrect(7, 7)).toBe(true);
    expect(isMathAnswerCorrect(7, 8)).toBe(false);
  });

  it('awards extra stars for perfect round', () => {
    expect(createMathReward(true)).toEqual({ stars: 2, stickers: 1 });
    expect(createMathReward(false)).toEqual({ stars: 1, stickers: 1 });
  });
});
