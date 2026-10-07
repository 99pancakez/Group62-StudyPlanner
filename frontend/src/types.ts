export interface Semester {
  semester_id: number;
  semester_name?: string;
}

export interface Course {
  id: string;
  name: string;
  code?: string;
  credit: number;
  sub_type_ids?: number[];
  selected_sub_type_id?: number;
  year?: number;
  semesters?: Semester[];
  prereqString?: string;
}

export type PlanSelections = Record<string, Course[]>;

export type RequisiteMap = Record<string, string | null>;

export interface PrerequisiteIssue {
  courseId: string;
  courseName: string;
  missingIds: string[];
}

export interface CorequisiteIssue {
  semesterNumber: number;
  courseId: string;
  courseName: string;
  missingIds: string[];
}

export interface CreditProgressEntry {
  earned: number;
  required: number;
  percentage: number;
  min: number | null;
  max: number | null;
  over: boolean;
}

export type CreditProgress = Record<string, CreditProgressEntry>;

export interface CombinationGroupBreakdown {
  label: string;
  target: number;
  subTypeIds: number[];
}
