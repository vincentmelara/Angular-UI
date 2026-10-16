import { Injectable, computed, signal } from '@angular/core';
import { Course, Deadline } from './course.model';

/**
 * Mock data store. Replace the signal seeds with HttpClient / resource()
 * calls when a backend exists — consumers only read the signals.
 */
@Injectable({ providedIn: 'root' })
export class LearningDataService {
  private readonly _courses = signal<Course[]>([
    { id: 'C-101', title: 'Secure Coding Fundamentals', category: 'Security', enrolled: 142, completion: 87, dueDate: '2026-11-01', status: 'on-track' },
    { id: 'C-102', title: 'Insider Threat Awareness', category: 'Compliance', enrolled: 310, completion: 64, dueDate: '2026-10-24', status: 'at-risk' },
    { id: 'C-103', title: 'Angular Material Deep Dive', category: 'Engineering', enrolled: 38, completion: 52, dueDate: '2026-12-05', status: 'on-track' },
    { id: 'C-104', title: 'CUI Handling & Marking', category: 'Compliance', enrolled: 275, completion: 41, dueDate: '2026-10-10', status: 'overdue' },
    { id: 'C-105', title: 'Accessible UI Design', category: 'Design', enrolled: 56, completion: 100, dueDate: '2026-09-30', status: 'completed' },
    { id: 'C-106', title: 'Leadership Essentials', category: 'Professional', enrolled: 24, completion: 73, dueDate: '2026-11-15', status: 'on-track' },
    { id: 'C-107', title: 'Export Control (ITAR) Basics', category: 'Compliance', enrolled: 198, completion: 58, dueDate: '2026-10-28', status: 'at-risk' },
    { id: 'C-108', title: 'RxJS to Signals Migration', category: 'Engineering', enrolled: 31, completion: 22, dueDate: '2026-12-20', status: 'on-track' },
    { id: 'C-109', title: 'Ethics & Business Conduct', category: 'Compliance', enrolled: 410, completion: 100, dueDate: '2026-09-15', status: 'completed' },
    { id: 'C-110', title: 'Cloud Security Posture', category: 'Security', enrolled: 67, completion: 35, dueDate: '2026-10-12', status: 'overdue' },
    { id: 'C-111', title: 'Design Tokens in Practice', category: 'Design', enrolled: 19, completion: 90, dueDate: '2026-11-08', status: 'on-track' },
    { id: 'C-112', title: 'Phishing Simulation Review', category: 'Security', enrolled: 355, completion: 79, dueDate: '2026-10-31', status: 'on-track' },
  ]);

  private readonly _deadlines = signal<Deadline[]>([
    { id: 'D-1', title: 'Module 4 quiz', course: 'Insider Threat Awareness', dueDate: '2026-10-17' },
    { id: 'D-2', title: 'Final assessment', course: 'Export Control (ITAR) Basics', dueDate: '2026-10-22' },
    { id: 'D-3', title: 'Lab: component tokens', course: 'Angular Material Deep Dive', dueDate: '2026-10-25' },
    { id: 'D-4', title: 'Attestation signature', course: 'Phishing Simulation Review', dueDate: '2026-10-29' },
  ]);

  readonly courses = this._courses.asReadonly();
  readonly deadlines = this._deadlines.asReadonly();

  readonly stats = computed(() => {
    const courses = this._courses();
    const active = courses.filter((c) => c.status !== 'completed');
    const learners = courses.reduce((sum, c) => sum + c.enrolled, 0);
    const avgCompletion = Math.round(courses.reduce((sum, c) => sum + c.completion, 0) / courses.length);
    const overdue = courses.filter((c) => c.status === 'overdue').length;
    return { activeCourses: active.length, learners, avgCompletion, overdue };
  });

  archive(id: string): void {
    this._courses.update((list) => list.filter((c) => c.id !== id));
  }
}
