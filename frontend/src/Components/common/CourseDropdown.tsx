import { Fragment, useEffect, useRef, useState } from "react";
import { SUB_TYPE_NAME_TO_ID } from "../../constants";
import { requisiteLabelString } from "../../utils/requisites";
import type { Course, RequisiteMap } from "../../types";
import "./CourseDropdown.css";

interface CourseDropdownProps {
  categorizedRecommendedCourses: Record<string, Course[]>;
  categorizedAvailableCourses: Record<string, Course[]>;
  recommendedCourses?: Course[];
  prerequisites?: RequisiteMap;
  codeById?: Record<string, string>;
  currentCourse?: Course;
  placeholder?: string;
  onSelect: (course: Course, subTypeId?: number) => void;
}

function CourseDropdown({
  categorizedRecommendedCourses,
  categorizedAvailableCourses,
  recommendedCourses = [],
  prerequisites = {},
  codeById = {},
  currentCourse,
  placeholder,
  onSelect,
}: CourseDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const choose = (course: Course, subTypeId?: number) => {
    onSelect(course, subTypeId);
    setOpen(false);
  };

  const renderGroup = (
    map: Record<string, Course[]>,
    kind: "Recommended" | "More Available",
    excludeRecommended: boolean,
  ) =>
    Object.entries(map)
      .sort(([a], [b]) =>
        a === "Core" ? -1 : b === "Core" ? 1 : a.localeCompare(b),
      )
      .map(([subTypeName, courses]) => {
        const rows = courses.filter(
          (c) =>
            c.id !== currentCourse?.id &&
            !(
              excludeRecommended &&
              recommendedCourses.some((r) => r.id === c.id)
            ),
        );
        if (rows.length === 0) return null;
        return (
          <Fragment key={`${kind}-${subTypeName}`}>
            <div className="course-dropdown__group-label">
              {kind} Courses - {subTypeName}
            </div>
            {rows.map((course) => {
              const reqLabel = requisiteLabelString(
                prerequisites[course.id],
                codeById,
              );
              return (
                <div
                  key={course.id}
                  role="option"
                  aria-selected={course.id === currentCourse?.id}
                  className="course-dropdown__option"
                  onClick={() =>
                    choose(course, SUB_TYPE_NAME_TO_ID[subTypeName])
                  }
                >
                  <span className="course-dropdown__code">{course.id}</span>
                  <span className="course-dropdown__title">{course.name}</span>
                  <span className="course-dropdown__credits">
                    {course.credit} credits
                  </span>
                  {reqLabel && (
                    <span className="course-dropdown__requisite">
                      {reqLabel}
                    </span>
                  )}
                </div>
              );
            })}
          </Fragment>
        );
      });

  return (
    <div
      className="course-dropdown"
      ref={rootRef}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      <button
        type="button"
        className="course-dropdown__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {currentCourse ? (
          <>
            <span className="course-dropdown__code">{currentCourse.id}</span>
            <span className="course-dropdown__title">{currentCourse.name}</span>
            <span className="course-dropdown__credits">
              {currentCourse.credit} credits
            </span>
          </>
        ) : (
          <span className="course-dropdown__placeholder">
            {placeholder ?? "Select a course"}
          </span>
        )}
        <span className="course-dropdown__caret" aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <div className="course-dropdown__panel" role="listbox">
          {renderGroup(categorizedRecommendedCourses, "Recommended", false)}
          {renderGroup(categorizedAvailableCourses, "More Available", true)}
        </div>
      )}
    </div>
  );
}

export default CourseDropdown;
