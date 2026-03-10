import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Superlearn',
  description: 'Trygg og leken læring for barn på mobil og iPad.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="no">
      <body className={`${nunito.variable} bg-[var(--color-surface)] text-slate-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
