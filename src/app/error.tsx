'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="no">
      <body className="bg-[var(--color-surface)]">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 text-center shadow-lg">
            <div className="text-5xl">🌈</div>
            <h1 className="mt-4 text-2xl font-bold text-slate-900">Noe gikk galt</h1>
            <p className="mt-2 text-slate-600">Appen prøver å holde deg trygg. Du kan laste visningen på nytt.</p>
            <button className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-violet-500 px-5 font-semibold text-white" onClick={reset} type="button">
              Prøv igjen
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
