import { CREDITS, EXCLUDED_SUB_TYPES } from "../constants";
import * as requisites from "./requisites";
import type {
  CombinationGroupBreakdown,
  CorequisiteIssue,
  Course,
  CreditProgress,
  PlanSelections,
  PrerequisiteIssue,
  RequisiteMap,
} from "../types";

export const STATUS = {
  VALID: "valid",
  PREREQUISITE: "prerequisite",
  COREQUISITE: "corequisite",
  ELIGIBILITY: "eligibility",
} as const;

export type StatusVariant = (typeof STATUS)[keyof typeof STATUS];
export type CreditState = "normal" | "underload" | "overload";

/** Most severe first. A card or the plan header shows one pill. */
const SEVERITY: readonly StatusVariant[] = [
  STATUS.PREREQUISITE,
  STATUS.COREQUISITE,
  STATUS.ELIGIBILITY,
];

/** EXCLUDED_SUB_TYPES is `as const`, so it needs widening to take a number. */
const excludedFromCombination: readonly number[] = EXCLUDED_SUB_TYPES;

// requisites.js is untyped JS. These pin the contract so TS can check callers.
const parseMissing = requisites.missingRequisites as (
  reqString: string | null | undefined,
  plannedIds: readonly string[],
) => string[];

const findCoreqIssues = requisites.getCoreqIssues as (
  selectedCourses: PlanSelections,
  coreqMap: RequisiteMap,
) => CorequisiteIssue[];

export const mostSevere = (statuses: readonly StatusVariant[]): StatusVariant =>
  SEVERITY.find((status) => statuses.includes(status)) ?? STATUS.VALID;

export function parseCreditTransferIds(value: unknown): string[] {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

export function completedCourseIdsThrough(
  selectedCourses: PlanSelections,
  semesterNumber: number,
  creditTransferIds: readonly string[] = [],
): string[] {
  const fromPriorTerms = Object.entries(selectedCourses)
    .filter(([key]) => parseInt(key.split(" ")[1], 10) < semesterNumber)
    .flatMap(([, courses]) => (courses ?? []).map((course) => course.id));

  return [...new Set([...creditTransferIds, ...fromPriorTerms])];
}

export function unmetPrerequisitesFor(
  courses: readonly Course[],
  prerequisites: RequisiteMap,
  completedIds: readonly string[],
): PrerequisiteIssue[] {
  return courses
    .map((course) => ({
      courseId: course.id,
      courseName: course.name,
      missingIds: parseMissing(prerequisites?.[course.id], completedIds),
    }))
    .filter((issue) => issue.missingIds.length > 0);
}

export function coreqIssuesBySemester(
  selectedCourses: PlanSelections,
  coreqMap: RequisiteMap,
): Record<number, CorequisiteIssue[]> {
  const grouped: Record<number, CorequisiteIssue[]> = {};
  for (const issue of findCoreqIssues(selectedCourses, coreqMap)) {
    if (!grouped[issue.semesterNumber]) grouped[issue.semesterNumber] = [];
    grouped[issue.semesterNumber].push(issue);
  }
  return grouped;
}

export const creditEligibility = (totalCredits: number): CreditState => {
  if (totalCredits > CREDITS.SEMESTER_LOAD) return "overload";
  if (totalCredits < CREDITS.SEMESTER_LOAD) return "underload";
  return "normal";
};

export interface SemesterStatusInput {
  courses: readonly Course[];
  prerequisites: RequisiteMap;
  completedIds: readonly string[];
  coreqIssues?: readonly CorequisiteIssue[];
  totalCredits: number;
}

export interface SemesterStatusResult {
  variant: StatusVariant;
  unmet: PrerequisiteIssue[];
  coreqIssues: CorequisiteIssue[];
  creditState: CreditState;
}

export function semesterStatus({
  courses,
  prerequisites,
  completedIds,
  coreqIssues = [],
  totalCredits,
}: SemesterStatusInput): SemesterStatusResult {
  const unmet = unmetPrerequisitesFor(courses, prerequisites, completedIds);
  const creditState = creditEligibility(totalCredits);
  const hasCourses = courses.length > 0;

  return {
    variant: mostSevere([
      ...(coreqIssues.length > 0 ? [STATUS.COREQUISITE] : []),
      ...(unmet.length > 0 ? [STATUS.PREREQUISITE] : []),
      ...(hasCourses && creditState !== "normal" ? [STATUS.ELIGIBILITY] : []),
    ]),
    unmet,
    coreqIssues: [...coreqIssues],
    creditState,
  };
}

export const isAssignedToCombination = (
  course: Course,
  subTypeGroupMap: Readonly<Record<string, string>>,
  breakdown: readonly CombinationGroupBreakdown[],
): boolean => {
  const subTypeId = course.selected_sub_type_id;
  if (!subTypeId) return false;
  const assigned = subTypeGroupMap?.[subTypeId];
  if (assigned && breakdown.some((group) => group.label === assigned)) {
    return true;
  }
  return breakdown.some((group) => group.subTypeIds.includes(subTypeId));
};

export interface CombinationEligibilityInput {
  creditProgress?: CreditProgress;
  selectedCourses?: PlanSelections;
  subTypeGroupMap?: Readonly<Record<string, string>>;
  breakdown?: readonly CombinationGroupBreakdown[];
}

export interface CombinationEligibilityResult {
  variant: StatusVariant;
  overLabels: string[];
  unassigned: Course[];
}

export function combinationEligibility({
  creditProgress = {},
  selectedCourses = {},
  subTypeGroupMap = {},
  breakdown = [],
}: CombinationEligibilityInput): CombinationEligibilityResult {
  if (breakdown.length === 0) {
    return { variant: STATUS.VALID, overLabels: [], unassigned: [] };
  }

  const overLabels = Object.entries(creditProgress)
    .filter(([, progress]) => progress.over)
    .map(([label]) => label);

  const unassigned = Object.values(selectedCourses)
    .flat()
    .filter(
      (course) =>
        !excludedFromCombination.includes(course.selected_sub_type_id ?? -1),
    )
    .filter(
      (course) => !isAssignedToCombination(course, subTypeGroupMap, breakdown),
    );

  return {
    variant:
      overLabels.length > 0 || unassigned.length > 0
        ? STATUS.ELIGIBILITY
        : STATUS.VALID,
    overLabels,
    unassigned,
  };
}

export const planStatus = (
  results: readonly { variant: StatusVariant }[],
): StatusVariant => mostSevere(results.map((result) => result.variant));

export interface PlanStatusSummary {
  variant: StatusVariant;
  heading: string;
  description: string;
}

const SEMESTER_LIST = (numbers: readonly number[]): string => {
  const sorted = [...new Set(numbers)].sort((a, b) => a - b);
  if (sorted.length === 1) return `Semester ${sorted[0]}`;
  const last = sorted.pop() as number;
  return `${sorted.map((n) => `Semester ${n}`).join(", ")} and Semester ${last}`;
};

export function planStatusSummary(
  variant: StatusVariant,
  semesterStatuses: readonly SemesterStatusResult[],
  combo: CombinationEligibilityResult,
): PlanStatusSummary | null {
  if (variant === STATUS.VALID) return null;

  const semestersWhere = (
    predicate: (s: SemesterStatusResult) => boolean,
  ): number[] =>
    semesterStatuses
      .map((s, i) => (predicate(s) ? i + 1 : null))
      .filter((n): n is number => n !== null);

  if (variant === STATUS.PREREQUISITE) {
    const semesters = semestersWhere((s) => s.unmet.length > 0);
    return {
      variant,
      heading: "Prerequisites not met",
      description: `${SEMESTER_LIST(semesters)} ${
        semesters.length === 1 ? "has" : "have"
      } courses with unmet prerequisites.`,
    };
  }

  if (variant === STATUS.COREQUISITE) {
    const semesters = semestersWhere((s) => s.coreqIssues.length > 0);
    return {
      variant,
      heading: "Corequisites not met",
      description: `${SEMESTER_LIST(semesters)} ${
        semesters.length === 1 ? "is" : "are"
      } missing required corequisites.`,
    };
  }

  const parts: string[] = [];

  const creditSemesters = semestersWhere((s) => s.creditState !== "normal");
  if (creditSemesters.length > 0) {
    parts.push(
      `${SEMESTER_LIST(creditSemesters)} ${
        creditSemesters.length === 1 ? "is" : "are"
      } not at ${CREDITS.SEMESTER_LOAD} credits.`,
    );
  }
  if (combo.overLabels.length > 0) {
    parts.push(
      `Combination credit limits exceeded for ${combo.overLabels.join(", ")}.`,
    );
  }
  if (combo.unassigned.length > 0) {
    parts.push(
      `${combo.unassigned.length} ${
        combo.unassigned.length === 1 ? "course is" : "courses are"
      } not assigned to a combination.`,
    );
  }

  return {
    variant,
    heading: "Combination or credit issues",
    description: parts.join(" "),
  };
}
