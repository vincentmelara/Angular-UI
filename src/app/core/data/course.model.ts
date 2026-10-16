export type CourseStatus = 'on-track' | 'at-risk' | 'overdue' | 'completed';

export interface Course {
  id: string;
  title: string;
  category: string;
  enrolled: number;
  completion: number; // 0–100
  dueDate: string; // ISO date
  status: CourseStatus;
}

export interface Deadline {
  id: string;
  title: string;
  course: string;
  dueDate: string;
}
