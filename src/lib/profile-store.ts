import { applySessionReward, createInitialProgress } from '@/lib/progress';
import type { AppData, ChildProfile, ModuleId } from '@/lib/types';

export function getActiveProfile(data: AppData): ChildProfile | null {
  return data.profiles.find((profile) => profile.id === data.activeProfileId) ?? data.profiles[0] ?? null;
}

export function setActiveProfile(data: AppData, profileId: string): AppData {
  if (!data.profiles.some((profile) => profile.id === profileId)) {
    return data;
  }

  return {
    ...data,
    activeProfileId: profileId,
  };
}

export function addProfile(
  data: AppData,
  input: Pick<ChildProfile, 'name' | 'age' | 'levelLabel' | 'avatarId'>,
): AppData {
  const profile: ChildProfile = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    age: input.age,
    levelLabel: input.levelLabel.trim(),
    avatarId: input.avatarId,
    createdAt: new Date().toISOString(),
    progress: createInitialProgress(),
    rewards: { totalStars: 0, totalStickers: 0 },
    settings: { soundEnabled: true, reducedMotion: false },
  };

  return {
    ...data,
    activeProfileId: profile.id,
    profiles: [...data.profiles, profile],
  };
}

export function awardModuleProgress(
  data: AppData,
  profileId: string,
  moduleId: ModuleId,
  reward: { stars: number; stickers: number; completedAt?: string },
): AppData {
  return {
    ...data,
    profiles: data.profiles.map((profile) => {
      if (profile.id !== profileId) {
        return profile;
      }

      const nextModuleProgress = applySessionReward(profile.progress[moduleId], reward);

      return {
        ...profile,
        progress: {
          ...profile.progress,
          [moduleId]: nextModuleProgress,
        },
        rewards: {
          totalStars: profile.rewards.totalStars + reward.stars,
          totalStickers: profile.rewards.totalStickers + reward.stickers,
        },
      };
    }),
  };
}
