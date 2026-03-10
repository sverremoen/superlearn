import type { PropsWithChildren, ReactNode } from 'react';

export function Screen({ children }: PropsWithChildren) {
  return <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-4 sm:px-6 lg:px-8">{children}</div>;
}

export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <div className={`rounded-[2rem] bg-white p-5 shadow-lg ring-1 ring-slate-100 ${className}`}>{children}</div>;
}

export function PillButton({
  children,
  className = '',
  ...props
}: PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={`inline-flex min-h-12 items-center justify-center rounded-full px-5 text-base font-semibold transition active:scale-[0.98] disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SectionTitle({ title, detail }: { title: string; detail?: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      </div>
      {detail ? <div className="text-sm text-slate-500">{detail}</div> : null}
    </div>
  );
}

export function ProgressBar({ value, max }: { value: number; max: number }) {
  const percentage = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-sky-100">
      <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-violet-400" style={{ width: `${percentage}%` }} />
    </div>
  );
}

export function RewardBadge({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900 ring-1 ring-amber-200">
      <span aria-hidden>{icon}</span>
      <span>
        {label}: {value}
      </span>
    </div>
  );
}
