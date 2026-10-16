import { Injectable, computed, signal } from '@angular/core';

export interface User {
  name: string;
  email: string;
  role: string;
}

const STORAGE_KEY = 'learnhub.user';

/**
 * Mock auth. Swap login()/logout() for real API calls later —
 * components only depend on `user`, `isAuthenticated`, and these two methods.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<User | null>(this.restore());

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  async login(email: string, _password: string): Promise<void> {
    // Simulate network latency.
    await new Promise((resolve) => setTimeout(resolve, 600));

    const name = email
      .split('@')[0]
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    const user: User = { name, email, role: 'Training Coordinator' };
    this._user.set(user);
    this.persist(user);
  }

  logout(): void {
    this._user.set(null);
    this.persist(null);
  }

  private restore(): User | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  private persist(user: User | null): void {
    try {
      if (user) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable — session stays in memory only */
    }
  }
}
