import { SUB_TYPE_NAME_TO_ID } from "../../constants";
import type { Course } from "../../types";

interface CourseDropdownProps {
  categorizedRecommendedCourses: Record<string, Course[]>;
  categorizedAvailableCourses: Record<string, Course[]>;
  recommendedCourses?: Course[];
  prerequisites?: Record<string, string>;
  currentCourse?: Course;
  placeholder?: string;
  showPrereqs?: boolean;
  onSelect: (course: Course, subTypeId?: number) => void;
}

function CourseDropdown({
  categorizedRecommendedCourses,
  categorizedAvailableCourses,
  recommendedCourses = [],
  prerequisites = {},
  currentCourse,
  placeholder,
  showPrereqs = false,
  onSelect,
}: CourseDropdownProps) {
  const allAvailableCourses = Object.values(categorizedAvailableCourses).flat();
  const allRecommendedCourses = Object.values(
    categorizedRecommendedCourses,
  ).flat();


  return (
    <select
      value=""
      onChange={(e) => {
        const { id, subTypeId } = JSON.parse(e.target.value);
        const selectedCourse =
          allAvailableCourses.find((c) => c.id === id) ||
          allRecommendedCourses.find((c) => c.id === id);
        if (selectedCourse) {
          onSelect(selectedCourse, subTypeId);
        }
      }}
      className="course-select"
    >
      {currentCourse ? (
        <option value="" disabled>
          {currentCourse.id} - {currentCourse.name} ({currentCourse.credit} credits)
        </option>
      ) : placeholder ? (
        <option value="" disabled>{placeholder}</option>
      ) : null}
      {Object.entries(categorizedRecommendedCourses).length > 0 &&
        Object.entries(categorizedRecommendedCourses)
          .sort(([a], [b]) =>
            a === "Core" ? -1 : b === "Core" ? 1 : a.localeCompare(b),
          )
          .map(
            ([subTypeName, courses]) =>
              courses.length > 0 && (
                <optgroup
                  key={`recommended-${subTypeName}`}
                  label={`Recommended Courses - ${subTypeName}`}
                >
                  {courses
                    .filter((c) => c.id !== currentCourse?.id)
                    .map((c) => (
                      <option
                        key={c.id}
                        value={JSON.stringify({
                          id: c.id,
                          subTypeId: SUB_TYPE_NAME_TO_ID[subTypeName],
                        })}
                        className={`sub-type-option sub-type-${subTypeName
                          .toLowerCase()
                          .replace(/[^a-z0-9]/g, "-")}`}
                      >
                        {c.id} - {c.name} ({c.credit} credits)
                      </option>
                    ))}
                </optgroup>
              ),
          )}
      {Object.entries(categorizedAvailableCourses).length > 0 &&
        Object.entries(categorizedAvailableCourses)
          .sort(([a], [b]) =>
            a === "Core" ? -1 : b === "Core" ? 1 : a.localeCompare(b),
          )
          .map(
            ([subTypeName, courses]) =>
              courses.length > 0 && (
                <optgroup
                  key={`available-${subTypeName}`}
                  label={`More Available Courses - ${subTypeName}`}
                >
                  {courses
                    .filter(
                      (c) =>
                        c.id !== currentCourse?.id &&
                        !recommendedCourses.some((r) => r.id === c.id),
                    )
                    .map((c) => (
                      <option
                        key={c.id}
                        value={JSON.stringify({
                          id: c.id,
                          subTypeId: SUB_TYPE_NAME_TO_ID[subTypeName],
                        })}
                        className={`sub-type-option sub-type-${subTypeName
                          .toLowerCase()
                          .replace(/[^a-z0-9]/g, "-")}`}
                      >
                        {c.id} - {c.name} ({c.credit} credits)
                      </option>
                    ))}
                </optgroup>
              ),
          )}
    </select>
  );
}

export default CourseDropdown;