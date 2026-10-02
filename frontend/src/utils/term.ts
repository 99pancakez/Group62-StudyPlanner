// TODO note for future development, this needs to be increased to 3 for summer semesters
export const TERMS_PER_YEAR = 2;
export const yearForSemester = (n: number) => Math.ceil(n / TERMS_PER_YEAR);
export const termLabel = (n: number, year: number) =>
  `Semester ${n} (Year ${year})`;
export function availabilityIdForIndex(
  index: number,
  startingSemesterId: number,
): number {
  const offset = index % TERMS_PER_YEAR;
  if (startingSemesterId === 1) return offset === 0 ? 1 : 2;
  return offset === 0 ? 2 : 1;
}
