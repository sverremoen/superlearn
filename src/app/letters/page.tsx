import Link from 'next/link';
import { Card, Screen } from '@/components/ui';

export default function LettersPage() {
  return (
    <Screen>
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-2xl bg-gradient-to-br from-pink-100 to-orange-100">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-600">Bokstaver</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Klar for bokstavlek</h1>
          <p className="mt-3 text-slate-700">Dette er en trygg plassholder for FASE A. Selve bokstavspillet kommer i neste fase.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-900 px-5 font-semibold text-white" href="/">
              Til hjem
            </Link>
          </div>
        </Card>
      </div>
    </Screen>
  );
}
