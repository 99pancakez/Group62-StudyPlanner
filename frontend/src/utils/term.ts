// Number of terms in one academic year.
// 3 = Semester 1, Semester 2, Summer Term, which map to
// availability.semester_id 1, 2 and 3 in the database.
export const TERMS_PER_YEAR = 3;

export const SUMMER_TERM_INDEX = 3;
export const SUMMER_LABEL = "Summer Semester";

/** Academic year (1-based) for a semester ordinal (1-based). */
export const yearForSemester = (n: number): number =>
  Math.floor((n - 1) / TERMS_PER_YEAR) + 1;

/** Position within the academic year: 1, 2 or 3. */
export const termIndexInYear = (n: number): number =>
  ((n - 1) % TERMS_PER_YEAR) + 1;

/** True when the semester ordinal lands on the Summer Term. */
export const isSummerTerm = (n: number): boolean =>
  termIndexInYear(n) === SUMMER_TERM_INDEX;

/**
 * Maps a semester availability.semester_id.
 * February intake starts at availability 1, July intake at 2;
 */
export const availabilityIdForSemester = (
  semesterOrdinal: number,
  startingSemesterId: number,
): number =>
  ((startingSemesterId - 1 + semesterOrdinal - 1) % TERMS_PER_YEAR) + 1;

/** Header label, e.g. "Semester 1 (Year 1)" / "Summer Semester (Year 1)". */
export const termLabel = (semesterOrdinal: number, year: number): string =>
  isSummerTerm(semesterOrdinal)
    ? `${SUMMER_LABEL} (Year ${year})`
    : `Semester ${termIndexInYear(semesterOrdinal)} (Year ${year})`;
