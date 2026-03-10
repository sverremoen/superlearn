import type { ModuleId, ModuleProgress } from '@/lib/types';

export function createEmptyModuleProgress(): ModuleProgress {
  return {
    stars: 0,
    stickers: 0,
    level: 1,
    completedSessions: 0,
    lastPlayedAt: null,
  };
}

export function createInitialProgress() {
  return {
    letters: createEmptyModuleProgress(),
    math: createEmptyModuleProgress(),
  } satisfies Record<ModuleId, ModuleProgress>;
}

export function applySessionReward(
  progress: ModuleProgress,
  reward: { stars: number; stickers: number; completedAt?: string },
): ModuleProgress {
  const nextStars = progress.stars + reward.stars;
  const nextStickers = progress.stickers + reward.stickers;

  return {
    stars: nextStars,
    stickers: nextStickers,
    completedSessions: progress.completedSessions + 1,
    level: Math.max(1, 1 + Math.floor(nextStars / 6)),
    lastPlayedAt: reward.completedAt ?? new Date().toISOString(),
  };
}
