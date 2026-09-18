

export const isPrereqMet = (prereqString, completedCourses) => {
  if (!prereqString || prereqString === "null") return true;
  const andGroups = prereqString
    .split(" AND ")
    .map((group) => group.trim());
  return andGroups.every((group) => {
    const orCourses = group.split(" OR ").map((id) => id.trim());
    return orCourses.some((courseId) =>
      completedCourses.includes(courseId)
    );
  });
};


