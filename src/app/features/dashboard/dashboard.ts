import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AuthService } from '../../core/auth/auth.service';
import { Course, CourseStatus } from '../../core/data/course.model';
import { LearningDataService } from '../../core/data/learning-data.service';
import { ConfirmDialog, ConfirmDialogData } from '../../shared/ui/confirm-dialog';
import { StatCard } from '../../shared/ui/stat-card/stat-card';

/** Maps status → label + Layer-3 variant classes. Templates never pick colors. */
const STATUS_UI: Record<CourseStatus, { label: string; chip: string; progress: string }> = {
  'on-track': { label: 'On track', chip: 'chip-info', progress: '' },
  'at-risk': { label: 'At risk', chip: 'chip-warning', progress: 'progress-warning' },
  overdue: { label: 'Overdue', chip: 'chip-danger', progress: 'progress-danger' },
  completed: { label: 'Completed', chip: 'chip-success', progress: 'progress-success' },
};

@Component({
  selector: 'app-dashboard',
  imports: [
    DatePipe,
    DecimalPipe,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    StatCard,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly data = inject(LearningDataService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly user = inject(AuthService).user;
  protected readonly stats = this.data.stats;
  protected readonly deadlines = this.data.deadlines;
  protected ui(course: Course) {
    return STATUS_UI[course.status];
  }

  protected readonly columns = ['title', 'category', 'enrolled', 'completion', 'dueDate', 'status', 'actions'];
  protected readonly categories = ['All', 'Compliance', 'Security', 'Engineering', 'Design', 'Professional'];

  protected readonly search = signal('');
  protected readonly category = signal('All');

  protected readonly dataSource = new MatTableDataSource<Course>([]);
  private readonly sort = viewChild.required(MatSort);
  private readonly paginator = viewChild.required(MatPaginator);

  constructor() {
    this.dataSource.filterPredicate = (course, raw) => {
      const { q, cat } = JSON.parse(raw) as { q: string; cat: string };
      const matchesText = !q || course.title.toLowerCase().includes(q) || course.id.toLowerCase().includes(q);
      const matchesCat = cat === 'All' || course.category === cat;
      return matchesText && matchesCat;
    };

    // Keep table in sync with the data store.
    effect(() => {
      this.dataSource.data = this.data.courses();
    });

    // Re-filter when search or category changes.
    effect(() => {
      this.dataSource.filter = JSON.stringify({ q: this.search().trim().toLowerCase(), cat: this.category() });
      this.dataSource.paginator?.firstPage();
    });

    // Wire sort + paginator once the view exists.
    effect(() => {
      this.dataSource.sort = this.sort();
      this.dataSource.paginator = this.paginator();
    });
  }

  archive(course: Course): void {
    this.dialog
      .open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
        data: {
          title: 'Archive course?',
          message: `"${course.title}" will be removed from active training for ${course.enrolled} learners.`,
          confirmLabel: 'Archive',
          destructive: true,
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.data.archive(course.id);
        this.snackBar.open(`Archived ${course.title}`, 'Dismiss', { duration: 3000 });
      });
  }
}
