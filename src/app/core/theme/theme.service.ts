import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core';

export type ThemeMode = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'learnhub.theme';

/**
 * Light/dark switching. Material's theme uses light-dark(), so all we do is
 * set a class on <html> that changes `color-scheme` (see styles/_theme.scss).
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  readonly mode = signal<ThemeMode>(this.restore());

  constructor() {
    effect(() => {
      const mode = this.mode();
      const root = this.document.documentElement.classList;
      root.toggle('light-theme', mode === 'light');
      root.toggle('dark-theme', mode === 'dark');
      try {
        localStorage.setItem(STORAGE_KEY, mode);
      } catch {
        /* ignore */
      }
    });
  }

  /** Cycles system → light → dark. */
  cycle(): void {
    const order: ThemeMode[] = ['system', 'light', 'dark'];
    this.mode.update((m) => order[(order.indexOf(m) + 1) % order.length]);
  }

  private restore(): ThemeMode {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'light' || saved === 'dark' ? saved : 'system';
    } catch {
      return 'system';
    }
  }
}
