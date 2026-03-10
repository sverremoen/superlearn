import { describe, expect, it } from 'vitest';
import { STORAGE_KEY, createDefaultAppData, loadAppData, migrateAppData, saveAppData } from '@/lib/storage';

describe('storage', () => {
  it('creates default data with two starter profiles', () => {
    const data = createDefaultAppData();
    expect(data.profiles).toHaveLength(2);
    expect(data.activeProfileId).toBe(data.profiles[0].id);
  });

  it('migrates legacy profile progress and rewards', () => {
    const migrated = migrateAppData({
      version: 0,
      activeProfileId: 'p1',
      profiles: [{ id: 'p1', name: 'Mia', age: 6, levelLabel: 'Klar', avatarId: 'cat', progress: { letters: { stars: 3 } } }],
    }).data;

    expect(migrated.profiles[0].progress.math.level).toBe(1);
    expect(migrated.profiles[0].rewards.totalStars).toBe(3);
  });

  it('falls back when input is invalid', () => {
    const migrated = migrateAppData('oops').data;
    expect(migrated.profiles.length).toBeGreaterThan(0);
  });

  it('saves and loads data from storage', () => {
    const bucket = new Map<string, string>();
    const storage = {
      getItem: (key: string) => bucket.get(key) ?? null,
      setItem: (key: string, value: string) => bucket.set(key, value),
    };
    const data = createDefaultAppData();
    saveAppData(data, storage);

    expect(loadAppData(storage)).toEqual(data);
    expect(bucket.has(STORAGE_KEY)).toBe(true);
  });

  it('throws on corrupt json', () => {
    const storage = { getItem: () => '{bad-json' };
    expect(() => loadAppData(storage)).toThrow('Kunne ikke lese lagrede data.');
  });
});
