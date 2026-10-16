import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

export type StatTone = 'primary' | 'tertiary' | 'success' | 'danger';

/** KPI tile. Reusable presentational component — inputs only, no services. */
@Component({
  selector: 'app-stat-card',
  imports: [MatCardModule, MatIconModule],
  template: `
    <mat-card appearance="outlined" class="stat">
      <span class="icon" [attr.data-tone]="tone()">
        <mat-icon>{{ icon() }}</mat-icon>
      </span>
      <div class="body">
        <span class="label">{{ label() }}</span>
        <span class="value">{{ value() }}</span>
        @if (hint()) {
          <span class="hint">{{ hint() }}</span>
        }
      </div>
    </mat-card>
  `,
  styleUrl: './stat-card.scss',
})
export class StatCard {
  readonly label = input.required<string>();
  readonly value = input.required<string | number | null>();
  readonly icon = input.required<string>();
  readonly hint = input<string>();
  readonly tone = input<StatTone>('primary');
}
