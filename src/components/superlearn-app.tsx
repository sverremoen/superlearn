'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { avatarOptions } from '@/data/avatars';
import { AppErrorBoundary } from '@/components/app-error-boundary';
import { Card, PillButton, ProgressBar, RewardBadge, Screen, SectionTitle } from '@/components/ui';
import { addProfile, awardModuleProgress, getActiveProfile, setActiveProfile } from '@/lib/profile-store';
import { STORAGE_KEY, createDefaultAppData, loadAppData, saveAppData } from '@/lib/storage';
import type { AppData, ModuleId } from '@/lib/types';

const moduleContent: Array<{ id: ModuleId; title: string; description: string; color: string; icon: string }> = [
  { id: 'letters', title: 'Bokstaver', description: 'Lek med lyder, bokstaver og ord.', color: 'from-pink-200 to-orange-200', icon: '🔤' },
  { id: 'math', title: 'Matte', description: 'Tell, sammenlign og regn i små steg.', color: 'from-sky-200 to-cyan-200', icon: '🔢' },
];

export function SuperlearnApp() {
  const [data, setData] = useState<AppData>(createDefaultAppData());
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newProfile, setNewProfile] = useState({ name: '', age: 6, levelLabel: 'Nybegynner', avatarId: avatarOptions[0].id });

  useEffect(() => {
    try {
      const next = loadAppData(window.localStorage);
      setData(next);
      saveAppData(next, window.localStorage);
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : 'Kunne ikke lese lagring.');
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready || storageError) {
      return;
    }

    saveAppData(data, window.localStorage);
  }, [data, ready, storageError]);

  const activeProfile = useMemo(() => getActiveProfile(data), [data]);

  function handleCreateProfile() {
    if (!newProfile.name.trim()) {
      return;
    }

    setData((current) => addProfile(current, newProfile));
    setNewProfile({ name: '', age: 6, levelLabel: 'Nybegynner', avatarId: avatarOptions[0].id });
    setShowCreate(false);
  }

  function handleTryModule(moduleId: ModuleId) {
    if (!activeProfile) {
      return;
    }

    setData((current) => awardModuleProgress(current, activeProfile.id, moduleId, { stars: 1, stickers: 1 }));
  }

  function handleResetStorage() {
    const fallback = createDefaultAppData();
    window.localStorage.removeItem(STORAGE_KEY);
    saveAppData(fallback, window.localStorage);
    setStorageError(null);
    setData(fallback);
    setReady(true);
  }

  if (!ready) {
    return (
      <Screen>
        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <p className="text-lg font-semibold text-slate-700">Laster Superlearn …</p>
          </Card>
        </div>
      </Screen>
    );
  }

  if (storageError) {
    return (
      <Screen>
        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <div className="text-5xl">🧰</div>
            <h1 className="mt-3 text-2xl font-bold text-slate-900">Trygg gjenoppretting</h1>
            <p className="mt-2 text-slate-600">{storageError} Du kan nullstille lokalt og fortsette.</p>
            <PillButton className="mt-5 w-full bg-rose-500 text-white" onClick={handleResetStorage}>
              Nullstill lokal lagring
            </PillButton>
          </Card>
        </div>
      </Screen>
    );
  }

  return (
    <AppErrorBoundary onReset={handleResetStorage}>
      <Screen>
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-500">Superlearn</p>
            <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">Lær med lek og små seiere</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <RewardBadge icon="⭐" label="Stjerner" value={activeProfile?.rewards.totalStars ?? 0} />
            <RewardBadge icon="🎁" label="Klistremerker" value={activeProfile?.rewards.totalStickers ?? 0} />
          </div>
        </header>

        <main className="grid flex-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-violet-100 via-white to-sky-100">
              <SectionTitle title="Velg profil" detail="Minst to barn støttes fra start" />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {data.profiles.map((profile) => {
                  const avatar = avatarOptions.find((option) => option.id === profile.avatarId) ?? avatarOptions[0];
                  const isActive = profile.id === activeProfile?.id;
                  return (
                    <button
                      key={profile.id}
                      className={`rounded-[1.75rem] border-2 p-4 text-left transition ${
                        isActive ? 'border-violet-500 bg-white shadow-lg' : 'border-transparent bg-white/80'
                      }`}
                      onClick={() => setData((current) => setActiveProfile(current, profile.id))}
                      type="button"
                    >
                      <div className={`inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-gradient-to-br ${avatar.gradient} text-4xl`}>
                        {avatar.emoji}
                      </div>
                      <p className="mt-3 text-xl font-bold text-slate-900">{profile.name}</p>
                      <p className="text-sm text-slate-600">{profile.age} år · {profile.levelLabel}</p>
                      <p className="mt-2 text-sm text-slate-500">Nivå {profile.progress.letters.level} i bokstaver · Nivå {profile.progress.math.level} i matte</p>
                    </button>
                  );
                })}
              </div>
              <PillButton className="mt-4 bg-slate-900 text-white" onClick={() => setShowCreate((current) => !current)}>
                {showCreate ? 'Lukk profilskjema' : 'Legg til profil'}
              </PillButton>
              {showCreate ? (
                <div className="mt-4 rounded-[1.75rem] bg-white p-4 ring-1 ring-slate-100">
                  <div className="grid gap-3">
                    <label className="grid gap-1 text-sm font-semibold text-slate-700">
                      Navn
                      <input className="min-h-12 rounded-2xl border border-slate-200 px-4" value={newProfile.name} onChange={(event) => setNewProfile((current) => ({ ...current, name: event.target.value }))} />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="grid gap-1 text-sm font-semibold text-slate-700">
                        Alder
                        <input className="min-h-12 rounded-2xl border border-slate-200 px-4" type="number" min={3} max={12} value={newProfile.age} onChange={(event) => setNewProfile((current) => ({ ...current, age: Number(event.target.value) }))} />
                      </label>
                      <label className="grid gap-1 text-sm font-semibold text-slate-700">
                        Nivå
                        <input className="min-h-12 rounded-2xl border border-slate-200 px-4" value={newProfile.levelLabel} onChange={(event) => setNewProfile((current) => ({ ...current, levelLabel: event.target.value }))} />
                      </label>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Velg avatar</p>
                      <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {avatarOptions.map((avatar) => (
                          <button
                            key={avatar.id}
                            className={`rounded-2xl border-2 p-3 text-center ${newProfile.avatarId === avatar.id ? 'border-violet-500' : 'border-transparent bg-slate-50'}`}
                            onClick={() => setNewProfile((current) => ({ ...current, avatarId: avatar.id }))}
                            type="button"
                          >
                            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${avatar.gradient} text-3xl`}>
                              {avatar.emoji}
                            </div>
                            <div className="mt-2 text-xs font-semibold text-slate-600">{avatar.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <PillButton className="bg-emerald-500 text-white" onClick={handleCreateProfile}>
                      Lagre ny profil
                    </PillButton>
                  </div>
                </div>
              ) : null}
            </Card>

            <Card>
              <SectionTitle title="Velg modul" detail={activeProfile ? `Aktiv profil: ${activeProfile.name}` : undefined} />
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {moduleContent.map((module) => {
                  const progress = activeProfile?.progress[module.id];
                  return (
                    <div key={module.id} className={`rounded-[1.75rem] bg-gradient-to-br ${module.color} p-4`}>
                      <div className="text-4xl">{module.icon}</div>
                      <h3 className="mt-3 text-2xl font-black text-slate-900">{module.title}</h3>
                      <p className="mt-1 text-slate-700">{module.description}</p>
                      <div className="mt-4 space-y-2 rounded-[1.25rem] bg-white/80 p-3">
                        <p className="text-sm font-semibold text-slate-600">Nivå {progress?.level ?? 1} · {progress?.completedSessions ?? 0} økter</p>
                        <ProgressBar value={progress?.stars ?? 0} max={12} />
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-900 px-5 text-base font-semibold text-white" href={`/${module.id}`}>
                          Åpne
                        </Link>
                        <PillButton className="bg-white text-slate-900" onClick={() => handleTryModule(module.id)}>
                          Test belønning
                        </PillButton>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <SectionTitle title="Dagens progresjon" />
              <div className="mt-4 space-y-4">
                {moduleContent.map((module) => {
                  const progress = activeProfile?.progress[module.id];
                  return (
                    <div key={module.id}>
                      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
                        <span>{module.title}</span>
                        <span>{progress?.stars ?? 0} / 12 stjerner</span>
                      </div>
                      <ProgressBar value={progress?.stars ?? 0} max={12} />
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card>
              <SectionTitle title="Trygg app" />
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• Lokal lagring per profil for progresjon, belønninger og innstillinger.</li>
                <li>• Sikker innlasting med fallback hvis lagring er ødelagt.</li>
                <li>• Store trykkflater for mobil og iPad.</li>
              </ul>
            </Card>
          </div>
        </main>
      </Screen>
    </AppErrorBoundary>
  );
}
