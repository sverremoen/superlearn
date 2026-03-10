export type ModuleId = 'letters' | 'math';

export type ModuleProgress = {
  stars: number;
  stickers: number;
  level: number;
  completedSessions: number;
  lastPlayedAt: string | null;
};

export type ProfileSettings = {
  soundEnabled: boolean;
  reducedMotion: boolean;
};

export type ChildProfile = {
  id: string;
  name: string;
  age: number;
  levelLabel: string;
  avatarId: string;
  createdAt: string;
  progress: Record<ModuleId, ModuleProgress>;
  rewards: {
    totalStars: number;
    totalStickers: number;
  };
  settings: ProfileSettings;
};

export type AppData = {
  version: number;
  activeProfileId: string | null;
  profiles: ChildProfile[];
};
