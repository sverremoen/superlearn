import { defaultAvatarId } from '@/data/avatars';
import { createInitialProgress } from '@/lib/progress';
import type { AppData, ChildProfile } from '@/lib/types';

export const STORAGE_KEY = 'superlearn.app';
export const STORAGE_VERSION = 1;

function createProfile(
  name: string,
  age: number,
  levelLabel: string,
  avatarId = defaultAvatarId,
  id = crypto.randomUUID(),
): ChildProfile {
  return {
    id,
    name,
    age,
    levelLabel,
    avatarId,
    createdAt: new Date().toISOString(),
    progress: createInitialProgress(),
    rewards: {
      totalStars: 0,
      totalStickers: 0,
    },
    settings: {
      soundEnabled: true,
      reducedMotion: false,
    },
  };
}

export function createDefaultAppData(): AppData {
  const first = createProfile('Ada', 5, 'Nybegynner', 'fox', 'profile-ada');
  const second = createProfile('Leo', 7, 'Utforsker', 'lion', 'profile-leo');

  return {
    version: STORAGE_VERSION,
    activeProfileId: first.id,
    profiles: [first, second],
  };
}

type MigrationResult = {
  data: AppData;
  didMigrate: boolean;
};

export function migrateAppData(input: unknown): MigrationResult {
  if (!input || typeof input !== 'object') {
    return { data: createDefaultAppData(), didMigrate: true };
  }

  const raw = input as Partial<AppData> & { version?: number };
  const profiles = Array.isArray(raw.profiles) ? raw.profiles : [];

  const normalizedProfiles = profiles
    .map((profile, index) => {
      if (!profile || typeof profile !== 'object') {
        return null;
      }

      const candidate = profile as Partial<ChildProfile>;
      const fallback = createProfile(
        typeof candidate.name === 'string' && candidate.name.trim() ? candidate.name : `Barn ${index + 1}`,
        typeof candidate.age === 'number' && Number.isFinite(candidate.age) ? candidate.age : 6,
        typeof candidate.levelLabel === 'string' && candidate.levelLabel.trim() ? candidate.levelLabel : 'Nybegynner',
        typeof candidate.avatarId === 'string' ? candidate.avatarId : defaultAvatarId,
        typeof candidate.id === 'string' && candidate.id ? candidate.id : `profile-${index + 1}`,
      );

      return {
        ...fallback,
        ...candidate,
        progress: {
          letters: { ...fallback.progress.letters, ...(candidate.progress?.letters ?? {}) },
          math: { ...fallback.progress.math, ...(candidate.progress?.math ?? {}) },
        },
        rewards: {
          totalStars:
            candidate.rewards?.totalStars ??
            ((candidate.progress?.letters?.stars ?? 0) + (candidate.progress?.math?.stars ?? 0)),
          totalStickers:
            candidate.rewards?.totalStickers ??
            ((candidate.progress?.letters?.stickers ?? 0) + (candidate.progress?.math?.stickers ?? 0)),
        },
        settings: {
          soundEnabled: candidate.settings?.soundEnabled ?? true,
          reducedMotion: candidate.settings?.reducedMotion ?? false,
        },
      } satisfies ChildProfile;
    })
    .filter((profile): profile is ChildProfile => profile !== null);

  const defaultData = createDefaultAppData();
  const finalProfiles = normalizedProfiles.length > 0 ? normalizedProfiles : defaultData.profiles;

  const data: AppData = {
    version: STORAGE_VERSION,
    activeProfileId:
      typeof raw.activeProfileId === 'string' && finalProfiles.some((profile) => profile.id === raw.activeProfileId)
        ? raw.activeProfileId
        : finalProfiles[0]?.id ?? null,
    profiles: finalProfiles,
  };

  return {
    data,
    didMigrate: raw.version !== STORAGE_VERSION || normalizedProfiles.length !== profiles.length,
  };
}

export function loadAppData(storage?: Pick<Storage, 'getItem'>): AppData {
  if (!storage) {
    return createDefaultAppData();
  }

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultAppData();
    }

    return migrateAppData(JSON.parse(raw)).data;
  } catch {
    throw new Error('Kunne ikke lese lagrede data.');
  }
}

export function saveAppData(data: AppData, storage?: Pick<Storage, 'setItem'>) {
  if (!storage) {
    return;
  }

  storage.setItem(STORAGE_KEY, JSON.stringify({ ...data, version: STORAGE_VERSION }));
}
