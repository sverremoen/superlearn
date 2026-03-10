import { describe, expect, it } from 'vitest';
import { applySessionReward, createEmptyModuleProgress, createInitialProgress } from '@/lib/progress';

describe('progress', () => {
  it('creates empty module progress', () => {
    expect(createEmptyModuleProgress()).toEqual({
      stars: 0,
      stickers: 0,
      level: 1,
      completedSessions: 0,
      lastPlayedAt: null,
    });
  });

  it('creates both module buckets', () => {
    const progress = createInitialProgress();
    expect(Object.keys(progress)).toEqual(['letters', 'math']);
  });

  it('levels up after enough stars', () => {
    const next = applySessionReward(createEmptyModuleProgress(), { stars: 6, stickers: 1, completedAt: '2026-03-10T00:00:00.000Z' });
    expect(next.level).toBe(2);
    expect(next.completedSessions).toBe(1);
    expect(next.lastPlayedAt).toBe('2026-03-10T00:00:00.000Z');
  });
});
