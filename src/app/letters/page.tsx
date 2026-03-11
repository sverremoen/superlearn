'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Card, PillButton, ProgressBar, RewardBadge, Screen, SectionTitle } from '@/components/ui';
import {
  appendLetter,
  createBuildWordChallenge,
  createLetterHuntChallenge,
  createLettersReward,
  isBuildWordCorrect,
  isLetterHuntCorrect,
} from '@/lib/letters-game';
import { awardModuleProgress, getActiveProfile } from '@/lib/profile-store';
import { loadAppData, saveAppData } from '@/lib/storage';

function getInitialLettersState() {
  if (typeof window === 'undefined') {
    const buildChallenge = createBuildWordChallenge(6, 0);
    return {
      ready: false,
      profileName: 'Barnet',
      profileAge: 6,
      level: 1,
      totalStars: 0,
      availableLetters: buildChallenge.scrambledLetters,
    };
  }

  const data = loadAppData(window.localStorage);
  const profile = getActiveProfile(data);
  const buildChallenge = createBuildWordChallenge(profile?.age ?? 6, 0);

  return {
    ready: true,
    profileName: profile?.name ?? 'Barnet',
    profileAge: profile?.age ?? 6,
    level: profile?.progress.letters.level ?? 1,
    totalStars: profile?.progress.letters.stars ?? 0,
    availableLetters: buildChallenge.scrambledLetters,
  };
}

function saveLettersRound(stars: number, stickers: number) {
  const data = loadAppData(window.localStorage);
  const activeProfile = getActiveProfile(data);

  if (!activeProfile) {
    return null;
  }

  const next = awardModuleProgress(data, activeProfile.id, 'letters', { stars, stickers });
  saveAppData(next, window.localStorage);
  return getActiveProfile(next);
}

export default function LettersPage() {
  const initialState = getInitialLettersState();
  const [ready] = useState(initialState.ready);
  const [profileName, setProfileName] = useState(initialState.profileName);
  const [profileAge] = useState(initialState.profileAge);
  const [level, setLevel] = useState(initialState.level);
  const [totalStars, setTotalStars] = useState(initialState.totalStars);
  const [mode, setMode] = useState<'hunt' | 'build'>('hunt');
  const [huntStep, setHuntStep] = useState(0);
  const [buildStep, setBuildStep] = useState(0);
  const [huntFeedback, setHuntFeedback] = useState<string | null>(null);
  const [buildFeedback, setBuildFeedback] = useState<string | null>(null);
  const [buildAttempt, setBuildAttempt] = useState('');
  const [availableLetters, setAvailableLetters] = useState<string[]>(initialState.availableLetters);
  const [roundWins, setRoundWins] = useState(0);

  const huntChallenge = useMemo(() => createLetterHuntChallenge(profileAge, huntStep), [profileAge, huntStep]);
  const buildChallenge = useMemo(() => createBuildWordChallenge(profileAge, buildStep), [profileAge, buildStep]);

  function syncProfileMeta() {
    const data = loadAppData(window.localStorage);
    const profile = getActiveProfile(data);
    if (!profile) {
      return;
    }

    setProfileName(profile.name);
    setLevel(profile.progress.letters.level);
    setTotalStars(profile.progress.letters.stars);
  }

  function advanceBuildRound(nextStep: number) {
    const nextChallenge = createBuildWordChallenge(profileAge, nextStep);
    setBuildStep(nextStep);
    setBuildAttempt('');
    setAvailableLetters(nextChallenge.scrambledLetters);
  }

  function handleLetterHunt(answer: string) {
    if (isLetterHuntCorrect(huntChallenge, answer)) {
      const reward = createLettersReward(true);
      saveLettersRound(reward.stars, reward.stickers);
      setHuntFeedback('Riktig! Du fant riktig bokstav.');
      setRoundWins((current) => current + 1);
      setHuntStep((current) => current + 1);
      syncProfileMeta();
      return;
    }

    setHuntFeedback(`Nesten. ${huntChallenge.hint}`);
  }

  function handlePickBuildLetter(letter: string, index: number) {
    setBuildAttempt((current) => appendLetter(current, letter));
    setAvailableLetters((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  function handleResetBuildAttempt() {
    setAvailableLetters(buildChallenge.scrambledLetters);
    setBuildAttempt('');
    setBuildFeedback(null);
  }

  function handleCheckBuildWord() {
    if (isBuildWordCorrect(buildChallenge, buildAttempt)) {
      const reward = createLettersReward(buildAttempt.length === buildChallenge.word.length);
      saveLettersRound(reward.stars, reward.stickers);
      setBuildFeedback('Supert! Ordet ble riktig.');
      setRoundWins((current) => current + 1);
      advanceBuildRound(buildStep + 1);
      syncProfileMeta();
      return;
    }

    setBuildFeedback(`Prøv igjen. ${buildChallenge.hint}`);
  }

  if (!ready) {
    return (
      <Screen>
        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <p className="text-lg font-semibold text-slate-700">Laster bokstavlek …</p>
          </Card>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">Bokstaver</p>
          <h1 className="text-3xl font-black text-slate-900">Hei, {profileName}!</h1>
          <p className="mt-1 text-slate-600">To spillmodi, store trykkflater og lagret progresjon.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <RewardBadge icon="⭐" label="Stjerner" value={totalStars} />
          <RewardBadge icon="🏆" label="Runder" value={roundWins} />
        </div>
      </header>

      <main className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-pink-100 via-white to-orange-100">
            <SectionTitle title="Velg bokstavlek" detail={`Nivå ${level}`} />
            <div className="mt-4 grid gap-3">
              <PillButton className={mode === 'hunt' ? 'bg-pink-500 text-white' : 'bg-slate-100 text-slate-900'} onClick={() => setMode('hunt')}>
                Bokstavjakt
              </PillButton>
              <PillButton className={mode === 'build' ? 'bg-pink-500 text-white' : 'bg-slate-100 text-slate-900'} onClick={() => setMode('build')}>
                Bygg ord
              </PillButton>
              <div className="rounded-[1.5rem] bg-white/80 p-4">
                <p className="text-sm font-semibold text-slate-600">Progresjon i bokstaver</p>
                <div className="mt-2">
                  <ProgressBar value={totalStars} max={12} />
                </div>
                <p className="mt-2 text-sm text-slate-600">{totalStars} / 12 stjerner</p>
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle title="Trygg navigasjon" />
            <div className="mt-4 flex flex-wrap gap-2">
              <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-900 px-5 font-semibold text-white" href="/">
                Til hjem
              </Link>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-100 px-5 font-semibold text-slate-900" href="/math">
                Til matte
              </Link>
            </div>
          </Card>
        </div>

        {mode === 'hunt' ? (
          <Card className="bg-gradient-to-br from-pink-50 to-orange-50">
            <SectionTitle title="Bokstavjakt" detail="Trykk på riktig bokstav" />
            <div className="mt-5 rounded-[2rem] bg-white p-5 text-center shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">Oppgave</p>
              <p className="mt-3 text-4xl font-black text-slate-900 sm:text-5xl">{huntChallenge.prompt}</p>
              <p className="mt-3 text-base text-slate-600">Hint: {huntChallenge.hint}</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {huntChallenge.options.map((option) => (
                <button
                  key={option}
                  className="min-h-24 rounded-[2rem] bg-white text-4xl font-black text-slate-900 shadow-sm ring-1 ring-slate-100 transition active:scale-[0.98]"
                  onClick={() => handleLetterHunt(option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
            {huntFeedback ? <p className="mt-4 text-lg font-semibold text-slate-700">{huntFeedback}</p> : null}
          </Card>
        ) : (
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50">
            <SectionTitle title="Bygg ord" detail="Trykk bokstavene i riktig rekkefølge" />
            <div className="mt-5 rounded-[2rem] bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-500">Oppgave</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-18 w-18 items-center justify-center rounded-[1.5rem] bg-amber-100 text-4xl">{buildChallenge.image}</div>
                <div>
                  <p className="text-3xl font-black text-slate-900">Lag ordet {buildChallenge.word}</p>
                  <p className="mt-1 text-slate-600">Hint: {buildChallenge.hint}</p>
                </div>
              </div>
              <div className="mt-5 rounded-[1.5rem] bg-slate-50 p-4 text-center">
                <p className="text-sm font-semibold text-slate-500">Ordet ditt</p>
                <p className="mt-2 min-h-12 text-4xl font-black tracking-[0.3em] text-slate-900">{buildAttempt || '…'}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {availableLetters.map((letter, index) => (
                <button
                  key={`${letter}-${index}`}
                  className="min-h-20 rounded-[1.75rem] bg-white text-3xl font-black text-slate-900 shadow-sm ring-1 ring-slate-100 transition active:scale-[0.98]"
                  onClick={() => handlePickBuildLetter(letter, index)}
                  type="button"
                >
                  {letter}
                </button>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <PillButton className="bg-emerald-500 text-white" onClick={handleCheckBuildWord}>
                Sjekk ord
              </PillButton>
              <PillButton className="bg-slate-100 text-slate-900" onClick={handleResetBuildAttempt}>
                Start på nytt
              </PillButton>
            </div>
            {buildFeedback ? <p className="mt-4 text-lg font-semibold text-slate-700">{buildFeedback}</p> : null}
          </Card>
        )}
      </main>
    </Screen>
  );
}
