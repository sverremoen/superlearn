'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Card, PillButton, ProgressBar, RewardBadge, Screen, SectionTitle } from '@/components/ui';
import { createMathReward, createCountChallenge, createSumChallenge, isMathAnswerCorrect } from '@/lib/math-game';
import { awardModuleProgress, getActiveProfile } from '@/lib/profile-store';
import { loadAppData, saveAppData } from '@/lib/storage';

function getInitialMathState() {
  if (typeof window === 'undefined') {
    return {
      ready: false,
      profileName: 'Barnet',
      profileAge: 6,
      level: 1,
      totalStars: 0,
    };
  }

  const data = loadAppData(window.localStorage);
  const profile = getActiveProfile(data);

  return {
    ready: true,
    profileName: profile?.name ?? 'Barnet',
    profileAge: profile?.age ?? 6,
    level: profile?.progress.math.level ?? 1,
    totalStars: profile?.progress.math.stars ?? 0,
  };
}

function saveMathRound(stars: number, stickers: number) {
  const data = loadAppData(window.localStorage);
  const activeProfile = getActiveProfile(data);

  if (!activeProfile) {
    return null;
  }

  const next = awardModuleProgress(data, activeProfile.id, 'math', { stars, stickers });
  saveAppData(next, window.localStorage);
  return getActiveProfile(next);
}

export default function MathPage() {
  const initialState = getInitialMathState();
  const [ready] = useState(initialState.ready);
  const [profileName] = useState(initialState.profileName);
  const [profileAge] = useState(initialState.profileAge);
  const [level, setLevel] = useState(initialState.level);
  const [totalStars, setTotalStars] = useState(initialState.totalStars);
  const [mode, setMode] = useState<'count' | 'sum'>('count');
  const [countStep, setCountStep] = useState(0);
  const [sumStep, setSumStep] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [roundWins, setRoundWins] = useState(0);

  const countChallenge = useMemo(() => createCountChallenge(profileAge, countStep), [profileAge, countStep]);
  const sumChallenge = useMemo(() => createSumChallenge(profileAge, sumStep), [profileAge, sumStep]);

  function syncProfileMeta() {
    const data = loadAppData(window.localStorage);
    const profile = getActiveProfile(data);
    if (!profile) {
      return;
    }

    setLevel(profile.progress.math.level);
    setTotalStars(profile.progress.math.stars);
  }

  function handleCountAnswer(choice: number) {
    if (isMathAnswerCorrect(countChallenge.count, choice)) {
      const reward = createMathReward(true);
      saveMathRound(reward.stars, reward.stickers);
      setFeedback('Riktig! Du telte helt riktig.');
      setRoundWins((current) => current + 1);
      setCountStep((current) => current + 1);
      syncProfileMeta();
      return;
    }

    setFeedback(`Prøv igjen. ${countChallenge.hint}`);
  }

  function handleSumAnswer(choice: number) {
    if (isMathAnswerCorrect(sumChallenge.answer, choice)) {
      const reward = createMathReward(true);
      saveMathRound(reward.stars, reward.stickers);
      setFeedback('Bra jobbet! Regnestykket stemte.');
      setRoundWins((current) => current + 1);
      setSumStep((current) => current + 1);
      syncProfileMeta();
      return;
    }

    setFeedback(`Nesten. ${sumChallenge.hint}`);
  }

  if (!ready) {
    return (
      <Screen>
        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <p className="text-lg font-semibold text-slate-700">Laster mattelek …</p>
          </Card>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-500">Matte</p>
          <h1 className="text-3xl font-black text-slate-900">Hei, {profileName}!</h1>
          <p className="mt-1 text-slate-600">To enkle mattespill med tydelige valg og lagret progresjon.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <RewardBadge icon="⭐" label="Stjerner" value={totalStars} />
          <RewardBadge icon="🏆" label="Runder" value={roundWins} />
        </div>
      </header>

      <main className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-sky-100 via-white to-cyan-100">
            <SectionTitle title="Velg mattespill" detail={`Nivå ${level}`} />
            <div className="mt-4 grid gap-3">
              <PillButton className={mode === 'count' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-900'} onClick={() => setMode('count')}>
                Tell og velg
              </PillButton>
              <PillButton className={mode === 'sum' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-900'} onClick={() => setMode('sum')}>
                Pluss og minus
              </PillButton>
              <div className="rounded-[1.5rem] bg-white/80 p-4">
                <p className="text-sm font-semibold text-slate-600">Progresjon i matte</p>
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
              <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-100 px-5 font-semibold text-slate-900" href="/letters">
                Til bokstaver
              </Link>
            </div>
          </Card>
        </div>

        {mode === 'count' ? (
          <Card className="bg-gradient-to-br from-sky-50 to-cyan-50">
            <SectionTitle title="Tell og velg" detail="Tell figurene og velg riktig tall" />
            <div className="mt-5 rounded-[2rem] bg-white p-5 text-center shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-500">Oppgave</p>
              <p className="mt-3 text-3xl font-black text-slate-900">{countChallenge.prompt}</p>
              <p className="mt-4 break-words text-4xl leading-relaxed sm:text-5xl">{countChallenge.visual.split('').join(' ')}</p>
              <p className="mt-3 text-base text-slate-600">Hint: {countChallenge.hint}</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {countChallenge.choices.map((choice) => (
                <button
                  key={choice}
                  className="min-h-24 rounded-[2rem] bg-white text-4xl font-black text-slate-900 shadow-sm ring-1 ring-slate-100 transition active:scale-[0.98]"
                  onClick={() => handleCountAnswer(choice)}
                  type="button"
                >
                  {choice}
                </button>
              ))}
            </div>
          </Card>
        ) : (
          <Card className="bg-gradient-to-br from-cyan-50 to-teal-50">
            <SectionTitle title="Pluss og minus" detail="Velg svaret som passer" />
            <div className="mt-5 rounded-[2rem] bg-white p-5 text-center shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">Oppgave</p>
              <p className="mt-3 text-5xl font-black text-slate-900 sm:text-6xl">{sumChallenge.prompt}</p>
              <p className="mt-3 text-base text-slate-600">Hint: {sumChallenge.hint}</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {sumChallenge.choices.map((choice) => (
                <button
                  key={choice}
                  className="min-h-24 rounded-[2rem] bg-white text-4xl font-black text-slate-900 shadow-sm ring-1 ring-slate-100 transition active:scale-[0.98]"
                  onClick={() => handleSumAnswer(choice)}
                  type="button"
                >
                  {choice}
                </button>
              ))}
            </div>
          </Card>
        )}
      </main>

      {feedback ? (
        <Card className="mt-4 bg-white/90">
          <p className="text-lg font-semibold text-slate-700">{feedback}</p>
        </Card>
      ) : null}
    </Screen>
  );
}
