import type { Course, PlanSelections, RequisiteMap } from "../types";
import { missingRequisites } from "./requisites";
import {
  accumulatedCreditsBefore,
  completedIdsThrough,
  thresholdIssueFor,
  type CreditThresholdIssue,
} from "./creditThreshold";

export interface SelectionIssues {
  prereqIds: string[];
  coreqIds: string[];
  threshold: CreditThresholdIssue | null;
  hasIssues: boolean;
}

export interface SelectionIssueContext {
  selectedCourses: PlanSelections;
  semesterNumber: number;
  prerequisites?: RequisiteMap;
  coreqMap?: RequisiteMap;
  transferIds?: readonly string[];
  creditById?: Record<string, number>;
}

export function selectionIssuesFor(
  course: Course,
  {
    selectedCourses,
    semesterNumber,
    prerequisites,
    coreqMap,
    transferIds = [],
    creditById = {},
  }: SelectionIssueContext,
): SelectionIssues {
  const completed = completedIdsThrough(
    selectedCourses,
    semesterNumber,
    transferIds,
  );
  const prereqIds = missingRequisites(prerequisites?.[course.id], completed);

  const sameTermIds = (selectedCourses[`Semester ${semesterNumber}`] ?? []).map(
    (c) => c.id,
  );
  const plannedThroughTerm = [
    ...new Set([...completed, ...sameTermIds, course.id]),
  ];
  const coreqIds = missingRequisites(coreqMap?.[course.id], plannedThroughTerm);

  const threshold = thresholdIssueFor(
    course,
    accumulatedCreditsBefore(
      selectedCourses,
      semesterNumber,
      transferIds,
      creditById,
    ),
  );

  return {
    prereqIds,
    coreqIds,
    threshold,
    hasIssues:
      prereqIds.length > 0 || coreqIds.length > 0 || threshold !== null,
  };
}
