'use client';

import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { errored: boolean; }

export default class SequenceErrorBoundary extends Component<Props, State> {
  state: State = { errored: false };

  static getDerivedStateFromError(): State {
    return { errored: true };
  }

  componentDidCatch() {
    // Signal the parent sequence runner so it can show Retry / Skip.
    try {
      window.parent.postMessage(
        { type: 'yor:slide-error' },
        window.location.origin,
      );
    } catch { /* cross-origin guard */ }
  }

  render() {
    if (this.state.errored) return null; // parent overlay handles the UI
    return this.props.children;
  }
}
