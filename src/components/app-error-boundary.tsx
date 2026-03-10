'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  onReset?: () => void;
};

type State = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AppErrorBoundary', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] p-4">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 text-center shadow-lg ring-4 ring-rose-100">
            <div className="text-5xl">🛟</div>
            <h1 className="mt-4 text-2xl font-bold text-slate-900">Oi! Vi prøver igjen.</h1>
            <p className="mt-2 text-base text-slate-600">
              Noe gikk galt i appen. Trykk under for å starte trygt på nytt.
            </p>
            <button
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-rose-500 px-5 text-lg font-semibold text-white"
              onClick={this.handleReset}
              type="button"
            >
              Last inn på nytt
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
