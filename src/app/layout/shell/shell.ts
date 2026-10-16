import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/auth/auth.service';
import { ThemeService } from '../../core/theme/theme.service';

interface NavItem {
  label: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly theme = inject(ThemeService);

  protected readonly user = this.auth.user;
  protected readonly initials = computed(() =>
    (this.user()?.name ?? '?')
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
  );

  protected readonly isHandset = toSignal(
    inject(BreakpointObserver)
      .observe('(max-width: 959px)')
      .pipe(map((r) => r.matches)),
    { initialValue: false },
  );

  // Only "Dashboard" is routed in the scaffold; the rest are placeholders.
  protected readonly nav: NavItem[] = [
    { label: 'Dashboard', icon: 'space_dashboard', path: '/dashboard' },
    { label: 'Courses', icon: 'menu_book', path: '/courses' },
    { label: 'Learners', icon: 'groups', path: '/learners' },
    { label: 'Assignments', icon: 'assignment', path: '/assignments' },
    { label: 'Reports', icon: 'monitoring', path: '/reports' },
  ];

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
