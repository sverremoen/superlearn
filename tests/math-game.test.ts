import { describe, expect, it } from 'vitest';
import { createCountChallenge, createMathReward, createSumChallenge, isMathAnswerCorrect } from '@/lib/math-game';

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

  it('validates math answers', () => {
    expect(isMathAnswerCorrect(7, 7)).toBe(true);
    expect(isMathAnswerCorrect(7, 8)).toBe(false);
  });

  it('awards extra stars for perfect round', () => {
    expect(createMathReward(true)).toEqual({ stars: 2, stickers: 1 });
    expect(createMathReward(false)).toEqual({ stars: 1, stickers: 1 });
  });
});
