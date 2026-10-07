import "./CourseListbox.css";
import { useState } from "react";
import type { KeyboardEvent } from "react";
import { SUB_TYPE_NAME_TO_ID } from "../../constants";
import type { Course } from "../../types";

interface CourseListboxProps {
  categorizedRecommendedCourses: Record<string, Course[]>;
  categorizedAvailableCourses: Record<string, Course[]>;
  recommendedCourses?: Course[];
  onSelect: (course: Course, subTypeId?: number) => void;
  onCancel: () => void;
  lockedCourses?: Record<string, string>;
}

const sortGroups = (a: string, b: string) =>
  a === "Core" ? -1 : b === "Core" ? 1 : a.localeCompare(b);

const matches = (c: Course, q: string) => {
  const query = q.trim().toLowerCase();
  if (!query) return true;
  return (
    c.name.toLowerCase().includes(query) ||
    (c.code || "").toLowerCase().includes(query)
  );
};

function CourseListbox({
  categorizedRecommendedCourses,
  categorizedAvailableCourses,
  recommendedCourses = [],
  onSelect,
  onCancel,
  lockedCourses,
}: CourseListboxProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const locked = lockedCourses ?? {};
  const recIds = new Set(recommendedCourses.map((c) => c.id));

  const recommendedGroups = Object.entries(categorizedRecommendedCourses)
    .sort(([a], [b]) => sortGroups(a, b))
    .map(([subTypeName, courses]) => ({
      subTypeName,
      courses: courses.filter((c) => matches(c, query)),
    }))
    .filter((g) => g.courses.length > 0);

  const availableGroups = Object.entries(categorizedAvailableCourses)
    .sort(([a], [b]) => sortGroups(a, b))
    .map(([subTypeName, courses]) => ({
      subTypeName,
      courses: courses.filter((c) => matches(c, query) && !recIds.has(c.id)),
    }))
    .filter((g) => g.courses.length > 0);

  const flat = [
    ...recommendedGroups.flatMap((g) =>
      g.courses
        .filter((c) => !locked[c.id])
        .map((c) => ({
          id: c.id,
          course: c,
          subTypeId: SUB_TYPE_NAME_TO_ID[g.subTypeName],
          group: g.subTypeName,
        })),
    ),
    ...availableGroups.flatMap((g) =>
      g.courses
        .filter((c) => !locked[c.id])
        .map((c) => ({
          id: c.id,
          course: c,
          subTypeId: SUB_TYPE_NAME_TO_ID[g.subTypeName],
          group: g.subTypeName,
        })),
    ),
  ];

  const activeId = flat[activeIndex]
    ? `course-option-${flat[activeIndex].id}`
    : undefined;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(flat.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const o = flat[activeIndex];
      if (o) onSelect(o.course, o.subTypeId);
    }
  };

  const renderGroup = (
    label: string,
    g: { subTypeName: string; courses: Course[] },
  ) =>
    g.courses.length === 0 ? null : (
      <div className="course-listbox__group" key={label + g.subTypeName}>
        <div className="course-listbox__group-label">
          {label} - {g.subTypeName}
        </div>
        {g.courses.map((c) => {
          const idx = flat.findIndex((o) => o.id === c.id);
          const isLocked = Boolean(locked[c.id]);

          return (
            <div
              key={c.id}
              id={`course-option-${c.id}`}
              role="option"
              aria-selected={idx === activeIndex}
              aria-disabled={isLocked || undefined}
              className={`course-listbox__option${idx === activeIndex ? " course-listbox__option--active" : ""}${isLocked ? " course-listbox__option--locked" : ""}`}
              onMouseEnter={isLocked ? undefined : () => setActiveIndex(idx)}
              onClick={
                isLocked
                  ? undefined
                  : () => onSelect(c, SUB_TYPE_NAME_TO_ID[g.subTypeName])
              }
            >
              <span className="course-listbox__code">{c.code}</span>
              <span className="course-listbox__title">{c.name}</span>
              <span className="course-listbox__credits">
                {c.credit} credits
              </span>
              {isLocked && locked[c.id] && (
                <span className="course-listbox__lock">
                  Requires {locked[c.id]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );

  return (
    <div className="course-listbox">
      <div className="course-listbox__header">
        <span className="course-listbox__heading">Add a course</span>
        <button
          type="button"
          className="course-listbox__close"
          onClick={onCancel}
          aria-label="Close course picker"
        >
          ×
        </button>
      </div>
      <input
        className="course-listbox__search"
        placeholder="Search courses…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveIndex(0);
        }}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded="true"
        aria-controls="course-listbox-list"
        aria-activedescendant={activeId}
        aria-label="Search courses"
      />
      <div
        id="course-listbox-list"
        className="course-listbox__list"
        role="listbox"
      >
        {recommendedGroups.map((g) => renderGroup("Recommended Courses", g))}
        {availableGroups.map((g) => renderGroup("More Available Courses", g))}
        {flat.length === 0 && (
          <div className="course-listbox__empty">
            No courses match your search.
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseListbox;
