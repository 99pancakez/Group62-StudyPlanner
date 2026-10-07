export interface Semester {
  semester_id: number;
}

export interface Course {
  id: string;
  name: string;
  credit: number;
  sub_type_ids?: number[];
  selected_sub_type_ids?: number;
  year?: number;
  semesters?: Semester[];
  prereqString?: string;
  creditThreshold?: number | null;
}

export interface PlannedCourse {
  id: string;
  name?: string;
  credit: number;
}

export type PlanSelections = Record<string, PlannedCourse[]>;

export type RequisiteMap = Record<string, string | null>;
