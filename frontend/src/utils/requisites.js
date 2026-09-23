// retreive requisite requirements by splitting on the and/or predicates
const andGroups = (s) => s.split(" AND ").map((g) => g.trim());
const orCourses = (g) => g.split(" OR ").map((id) => id.trim());

export function isRequisiteMet(reqString, plannedIds) {
  if (!reqString || reqString === "null") return true;
  return andGroups(reqString).every((group) =>
    orCourses(group).some((id) => plannedIds.includes(id)),
  );
}

export function missingRequisites(reqString, plannedIds) {
  if (!reqString || reqString === "null") return [];
  const missing = [];
  for (const group of andGroups(reqString)) {
    const alternatives = orCourses(group);
    if (!alternatives.some((id) => plannedIds.includes(id))) {
      missing.push(...alternatives);
    }
  }
  return missing;
}

export function requisiteLabelString(reqString, codeById) {
  if (!reqString || reqString === "null") return null;
  return reqString
    .split(" AND ")
    .map((group) => {
      const codes = group
        .split(" OR ")
        .map((id) => id.trim())
        .map((id) => codeById?.[id] || id);
      return codes.length > 1 ? `(${codes.join(" OR ")})` : codes[0];
    })
    .join(" AND ");
}

export function getCoreqIssues(selectedCourses, coreqMap) {
  const issues = [];
  const sortedTerms = Object.keys(selectedCourses)
    .map((key) => ({
      key,
      number: parseInt(key.split(" ")[1], 10) || 0,
    }))
    .sort((a, b) => a.number - b.number);

  const plannedUpTo = [];
  for (const term of sortedTerms) {
    for (const course of selectedCourses[term.key] || []) {
      plannedUpTo.push(course.id);
    }
    for (const course of selectedCourses[term.key] || []) {
      const coreq = coreqMap[course.id];
      if (!coreq || coreq === "null") continue;
      const missing = missingRequisites(coreq, plannedUpTo);
      if (missing.length > 0) {
        issues.push({
          semesterNumber: term.number,
          courseId: course.id,
          courseName: course.name,
          missingIds: missing,
        });
      }
    }
  }
  return issues;
}
