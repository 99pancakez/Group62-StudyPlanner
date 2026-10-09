import type { Course, PlanSelections } from "../types";

export interface CreditThresholdIssue {
  courseId: string;
  courseName: string;
  threshold: number;
  accumulated: number;
  shortfall: number;
}

export interface PlanThresholdIssue extends CreditThresholdIssue {
  semesterNumber: number;
}

export function thresholdIssuesForPlan(
  selectedCourses: PlanSelections | null | undefined,
  transferIds: readonly string[] = [],
  creditById: Record<string, number> = {},
  coursesById: Record<
    string,
    Pick<Course, "id" | "name" | "creditThreshold">
  > = {},
): PlanThresholdIssue[] {
  const issues: PlanThresholdIssue[] = [];
  for (const [key, courses] of Object.entries(selectedCourses ?? {})) {
    const semesterNumber = semesterOrdinal(key);
    if (semesterNumber <= 0) continue;
    const accumulated = accumulatedCreditsBefore(
      selectedCourses,
      semesterNumber,
      transferIds,
      creditById,
    );
    for (const course of courses ?? []) {
      const full = coursesById[course.id];
      if (!full) continue;
      const issue = thresholdIssueFor(full, accumulated);
      if (issue) issues.push({ ...issue, semesterNumber });
    }
  }
  return issues;
}

const semesterOrdinal = (key: string): number =>
  parseInt(key.split(" ")[1], 10) || 0;

export function creditsByCourseId(
  courses: ReadonlyArray<{ id: string; credit: number }>,
): Record<string, number> {
  return Object.fromEntries(courses.map((c) => [c.id, c.credit || 0]));
}

/** Accepts the raw string, the parsed QnA object, or anything else. */
export function parseCreditTransferIds(value: unknown): string[] {
  if (typeof value === "string") {
    return value
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
  }
  if (value && typeof value === "object" && "creditCourses" in value) {
    return parseCreditTransferIds(
      (value as { creditCourses?: unknown }).creditCourses,
    );
  }
  return [];
}

export function completedIdsThrough(
  selectedCourses: PlanSelections | null | undefined,
  semesterNumber: number,
  transferIds: readonly string[] = [],
): string[] {
  const prior = Object.entries(selectedCourses ?? {})
    .filter(([key]) => semesterOrdinal(key) < semesterNumber)
    .flatMap(([, courses]) => courses ?? [])
    .map((c) => c.id);
  return [...new Set([...transferIds, ...prior])];
}

export function accumulatedCreditsBefore(
  selectedCourses: PlanSelections | null | undefined,
  semesterNumber: number,
  transferIds: readonly string[] = [],
  creditById: Record<string, number> = {},
): number {
  const prior = Object.entries(selectedCourses ?? {})
    .filter(([key]) => semesterOrdinal(key) < semesterNumber)
    .flatMap(([, courses]) => courses ?? [])
    .reduce((sum, c) => sum + (c.credit || 0), 0);
  const transferred = transferIds.reduce(
    (sum, id) => sum + (creditById[id] || 0),
    0,
  );
  return prior + transferred;
}

export function thresholdIssueFor(
  course: Pick<Course, "id" | "name" | "creditThreshold">,
  accumulated: number,
): CreditThresholdIssue | null {
  const threshold = course.creditThreshold;
  if (threshold == null || accumulated >= threshold) return null;
  return {
    courseId: course.id,
    courseName: course.name,
    threshold,
    accumulated,
    shortfall: threshold - accumulated,
  };
}
