import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] p-4">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 text-center shadow-lg">
        <div className="text-5xl">🧭</div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Fant ikke siden</h1>
        <p className="mt-2 text-slate-600">Vi sender deg trygt tilbake til start.</p>
        <Link className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-slate-900 px-5 font-semibold text-white" href="/">
          Gå til startsiden
        </Link>
      </div>
    </div>
  );
}
