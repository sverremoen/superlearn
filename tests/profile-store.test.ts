import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addProfile, awardModuleProgress, getActiveProfile, setActiveProfile } from '@/lib/profile-store';
import { createDefaultAppData } from '@/lib/storage';

describe('profile store', () => {
  beforeEach(() => {
    vi.stubGlobal('crypto', { randomUUID: () => 'new-profile-id' });
  });

  it('returns active profile', () => {
    const data = createDefaultAppData();
    expect(getActiveProfile(data)?.name).toBe('Ada');
  });

  it('switches active profile', () => {
    const data = createDefaultAppData();
    const next = setActiveProfile(data, 'profile-leo');
    expect(next.activeProfileId).toBe('profile-leo');
  });

  it('ignores unknown profile when switching', () => {
    const data = createDefaultAppData();
    const next = setActiveProfile(data, 'missing');
    expect(next).toEqual(data);
  });

  it('adds a new profile and makes it active', () => {
    const data = createDefaultAppData();
    const next = addProfile(data, { name: ' Nora ', age: 8, levelLabel: 'Modig', avatarId: 'unicorn' });
    expect(next.profiles).toHaveLength(3);
    expect(next.activeProfileId).toBe('new-profile-id');
    expect(next.profiles[2].name).toBe('Nora');
  });

  it('awards progress only to selected profile and module', () => {
    const data = createDefaultAppData();
    const next = awardModuleProgress(data, 'profile-ada', 'letters', { stars: 2, stickers: 1, completedAt: '2026-03-10T00:00:00.000Z' });
    expect(next.profiles[0].progress.letters.stars).toBe(2);
    expect(next.profiles[0].progress.math.stars).toBe(0);
    expect(next.profiles[0].rewards.totalStars).toBe(2);
    expect(next.profiles[1].rewards.totalStars).toBe(0);
  });
});
