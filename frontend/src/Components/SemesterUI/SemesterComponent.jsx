import { useState, useEffect, useMemo, useRef } from "react";
import "./SemesterComponent.css";
import {
  EXPLORER_API_BASE_URL,
  CREDITS,
  SUB_TYPE,
  SUB_TYPE_MAP,
  LOCALS,
} from "../../constants";
import { isPrereqMet } from "../../utils/courseCategoriser";
import logger from "../../log";
import { getCoreqIssues, requisiteLabelString } from "../../utils/requisites";
import CorequisiteWarning from "./CorequisiteWarning";
import {
  availabilityIdForSemester,
  termLabel,
  isSummerTerm,
} from "../../utils/term";
import { selectionIssuesFor } from "../../utils/selectionIssues";
import {
  accumulatedCreditsBefore,
  creditsByCourseId,
  thresholdIssueFor,
} from "../../utils/creditThreshold";
import ConfirmDialog from "../common/ConfirmDialog";
import Button from "../common/Button";
import StatusPill from "../common/StatusPill";
import {
  completedCourseIdsThrough,
  parseCreditTransferIds,
  semesterStatus,
} from "../../utils/planStatus";
import CourseDropdown from "../common/CourseDropdown";

function SelectionIssueList({
  course,
  issues,
  prerequisites,
  coreqMap,
  codeById,
}) {
  const code = codeById?.[course.id] ?? course.id;
  const fallback = (ids) => ids.map((id) => codeById?.[id] ?? id).join(" or ");
  const rows = [];
  if (issues.prereqIds.length)
    rows.push(
      `${code} requires ${requisiteLabelString(prerequisites?.[course.id], codeById) ?? fallback(issues.prereqIds)}.`,
    );
  if (issues.coreqIds.length)
    rows.push(
      `${code} must be taken with ${requisiteLabelString(coreqMap?.[course.id], codeById) ?? fallback(issues.coreqIds)}.`,
    );
  if (issues.threshold)
    rows.push(
      `${code} needs ${issues.threshold.shortfall} more credits (${issues.threshold.accumulated} of ${issues.threshold.threshold} accumulated).`,
    );
  return (
    <ul className="selection-issues">
      {rows.map((r) => (
        <li key={r}>{r}</li>
      ))}
    </ul>
  );
}

function SemesterComponent({
  semesterYear,
  semesterNumber,
  onNextSemester,
  selectedCourses,
  setSelectedCourses,
  onRemoveSemester,
}) {
  const [courses, setCourses] = useState([]);
  const [prerequisites, setPrerequisites] = useState({});
  const [visibleCourses, setInitialAvailableCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [categorizedAvailableCourses, setCategorizedAvailableCourses] =
    useState({});
  const [categorizedRecommendedCourses, setCategorizedRecommendedCourses] =
    useState({});
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [coreqMap, setCoreqMap] = useState({});
  const [pendingSelection, setPendingSelection] = useState(null);
  const addCourseButtonRef = useRef(null);

  // Function to categorize courses based on selected courses
  const updateCategorizedCourses = (
    allCourses,
    prereqMap,
    selectedCourses,
    calculatedSemesterId,
    selectedSubTypeIds,
  ) => {
    // Step 1: Load credit transfers from QnA
    const qnaData = localStorage.getItem(LOCALS.qnaResponses);
    const completedCourses = completedCourseIdsThrough(
      selectedCourses,
      semesterNumber,
      parseCreditTransferIds(JSON.parse(qnaData || "{}").creditCourses),
    );

    const semesterCourses = allCourses.filter((course) =>
      course.semesters.some((sem) => sem.semester_id === calculatedSemesterId),
    );
    const subTypeFiltered = semesterCourses.filter((course) =>
      selectedSubTypeIds.some((subTypeId) =>
        course.sub_type_ids.includes(subTypeId),
      ),
    );
    const availableAfterCreditTransfer = subTypeFiltered.filter(
      (course) => !completedCourses.includes(course.id),
    );
    const availableAfterPrereqs = availableAfterCreditTransfer.filter(
      (course) => {
        const prereqString = prereqMap[course.id];
        return isPrereqMet(prereqString, completedCourses);
      },
    );

    setInitialAvailableCourses(availableAfterCreditTransfer);

    let recommended = [];
    const maxYear = Math.max(
      ...availableAfterCreditTransfer.map((c) => c.year),
      1,
    );
    let totalCredits = 0;
    for (
      let year = 1;
      year <= maxYear && totalCredits < CREDITS.SEMESTER_LOAD;
      year++
    ) {
      const yearCourses = availableAfterPrereqs.filter(
        (course) => course.year === year,
      );
      totalCredits += yearCourses.reduce(
        (sum, course) => sum + course.credit,
        0,
      );
      recommended.push(...yearCourses);
    }
    setRecommendedCourses(recommended);

    logger.log("initialAvailableCourses:", availableAfterPrereqs);
    logger.log("recommendedCourses:", recommended);

    // Get IDs of all selected courses across *all semesters*
    const allSelectedCourseIds = Object.values(selectedCourses).flatMap(
      (courses) => courses.map((c) => c.id),
    );

    // Then filter
    const availableFiltered = availableAfterCreditTransfer.filter(
      (course) => !allSelectedCourseIds.includes(course.id),
    );

    const categorizedAvailable = {};

    // Check if a Program Course (17) is already selected
    const isProgramCourseSelected = Object.values(selectedCourses)
      .flat()
      .some(
        (course) => course.selected_sub_type_id === SUB_TYPE.PROGRAM_COURSE,
      );

    availableFiltered.forEach((course) => {
      // Skip if already selected
      if (allSelectedCourseIds.includes(course.id)) return;

      // Always show Core
      if (course.sub_type_ids.includes(SUB_TYPE.CORE)) {
        categorizedAvailable["Core"] = categorizedAvailable["Core"] || [];
        categorizedAvailable["Core"].push(course);
      }

      // Show Program Course only if one hasn't been selected yet
      if (
        course.sub_type_ids.includes(SUB_TYPE.PROGRAM_COURSE) &&
        !isProgramCourseSelected
      ) {
        categorizedAvailable["Program Course"] =
          categorizedAvailable["Program Course"] || [];
        categorizedAvailable["Program Course"].push(course);
      }

      // Show other combo-based sub_type_ids (excluding 1 and 17)
      course.sub_type_ids.forEach((subTypeId) => {
        if (
          selectedSubTypeIds.includes(subTypeId) &&
          subTypeId !== SUB_TYPE.CORE &&
          subTypeId !== SUB_TYPE.PROGRAM_COURSE
        ) {
          const subTypeName =
            SUB_TYPE_MAP[subTypeId] || `Unknown Sub-Type (${subTypeId})`;
          categorizedAvailable[subTypeName] =
            categorizedAvailable[subTypeName] || [];
          if (
            !categorizedAvailable[subTypeName].some((c) => c.id === course.id)
          ) {
            categorizedAvailable[subTypeName].push(course);
          }
        }
      });
    });

    setCategorizedAvailableCourses(categorizedAvailable);

    const recommendedFiltered = recommended.filter(
      (course) => !allSelectedCourseIds.includes(course.id),
    );

    const categorizedRecommended = {};

    // Same check for already selected Program Course
    recommendedFiltered.forEach((course) => {
      if (course.sub_type_ids.includes(SUB_TYPE.CORE)) {
        categorizedRecommended["Core"] = categorizedRecommended["Core"] || [];
        categorizedRecommended["Core"].push(course);
      }

      if (
        course.sub_type_ids.includes(SUB_TYPE.PROGRAM_COURSE) &&
        !isProgramCourseSelected
      ) {
        categorizedRecommended["Program Course"] =
          categorizedRecommended["Program Course"] || [];
        categorizedRecommended["Program Course"].push(course);
      }

      course.sub_type_ids.forEach((subTypeId) => {
        if (
          selectedSubTypeIds.includes(subTypeId) &&
          subTypeId !== SUB_TYPE.CORE &&
          subTypeId !== SUB_TYPE.PROGRAM_COURSE
        ) {
          const subTypeName =
            SUB_TYPE_MAP[subTypeId] || `Unknown Sub-Type (${subTypeId})`;
          categorizedRecommended[subTypeName] =
            categorizedRecommended[subTypeName] || [];
          if (
            !categorizedRecommended[subTypeName].some((c) => c.id === course.id)
          ) {
            categorizedRecommended[subTypeName].push(course);
          }
        }
      });
    });

    setCategorizedRecommendedCourses(categorizedRecommended);

    logger.log("categorizedRecommendedCourses:", categorizedRecommendedCourses);
    logger.log("categorizedAvailableCourses:", categorizedAvailableCourses);
  };

  useEffect(() => {
    setIsLoading(true);
    setFetchError(null);

    const storedData = localStorage.getItem(LOCALS.qnaResponses);
    let startingSemesterId = 1;
    if (storedData) {
      const studyPlan = JSON.parse(storedData);
      startingSemesterId = parseInt(studyPlan.semester_id, 10) || 1;
    }

    const calculatedSemesterId = availabilityIdForSemester(
      semesterNumber,
      startingSemesterId,
    );

    let selectedSubTypeIds = [1, SUB_TYPE.PROGRAM_COURSE];
    const combinationData = localStorage.getItem(LOCALS.combinationSelections);
    if (combinationData) {
      try {
        const parsed = JSON.parse(combinationData);
        Object.values(parsed).forEach((category) => {
          Object.values(category).forEach((subTypeId) => {
            if (
              typeof subTypeId === "number" &&
              !selectedSubTypeIds.includes(subTypeId)
            ) {
              selectedSubTypeIds.push(subTypeId);
            }
          });
        });
      } catch (error) {
        console.error("Error parsing combinationSelections:", error);
      }
    }

    // Fetch data only if courses or prerequisites are not already loaded
    if (courses.length === 0 || Object.keys(prerequisites).length === 0) {
      Promise.all([
        fetch(`${EXPLORER_API_BASE_URL}/available-courses`).then((res) => {
          if (!res.ok) throw new Error("Failed to fetch courses");
          return res.json();
        }),
        fetch(`${EXPLORER_API_BASE_URL}/all-courses-with-prerequisites`).then(
          (res) => {
            if (!res.ok) throw new Error("Failed to fetch prerequisites");
            return res.json();
          },
        ),
      ])
        .then(([courseData, prereqData]) => {
          logger.log("Fetched courseData:", courseData);
          logger.log("Fetched prereqData:", prereqData);
          const newCourses = courseData.map((c) => ({
            id: c.course_id,
            code: c.course_code,
            name: c.course_title,
            credit: c.course_credit,
            creditThreshold: c.credit_threshold ?? null,
            year: c.year,
            semesters: c.semesters,
            sub_type_ids: c.sub_type_ids || [],
          }));
          setCourses(newCourses);

          const nextCoreqMap = {};
          const prereqMap = {};
          prereqData.forEach((p) => {
            nextCoreqMap[p.course_id] = p.corequisites || null;
            prereqMap[p.course_id] = p.prerequisites || null;
          });

          setCoreqMap(nextCoreqMap);
          setPrerequisites(prereqMap);

          updateCategorizedCourses(
            newCourses,
            prereqMap,
            selectedCourses,
            calculatedSemesterId,
            selectedSubTypeIds,
          );
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setFetchError(error.message);
          setIsLoading(false);
        });
    } else {
      // If data is already fetched, just update the categorized courses
      updateCategorizedCourses(
        courses,
        prerequisites,
        selectedCourses,
        calculatedSemesterId,
        selectedSubTypeIds,
      );
      setIsLoading(false);
    }
  }, [semesterNumber, selectedCourses]);

  useEffect(() => {
    const handleCombinationUpdate = () => {
      // This will force the component to re-render and re-fetch courses
      setSelectedCourses((prev) => ({ ...prev }));
    };
    window.addEventListener("combinationUpdated", handleCombinationUpdate);
    return () => {
      window.removeEventListener("combinationUpdated", handleCombinationUpdate);
    };
  }, []);
  const handleAddCourse = () => {
    setShowAddCourse(true);
  };

  const addCourse = (course, selectedSubTypeId) => {
    const semesterIdKey = `Semester ${semesterNumber}`;
    setSelectedCourses((prev) => {
      const currentCourses = prev[semesterIdKey] || [];
      if (currentCourses.some((c) => c.id === course.id)) return prev;
      const updated = {
        ...prev,
        [semesterIdKey]: [
          ...currentCourses,
          {
            id: course.id,
            name: course.name,
            credit: course.credit,
            sub_type_ids: course.sub_type_ids,
            selected_sub_type_id: selectedSubTypeId,
          },
        ],
      };
      localStorage.setItem(LOCALS.semesterSelections, JSON.stringify(updated));
      return updated;
    });
    setShowAddCourse(false);
  };

  const handleSelectCourse = (course, selectedSubTypeId) => {
    const issues = selectionIssuesFor(course, {
      selectedCourses,
      semesterNumber,
      prerequisites,
      coreqMap,
      transferIds,
      creditById,
    });
    if (issues.hasIssues) {
      setPendingSelection({ course, subTypeId: selectedSubTypeId, issues });
      return;
    }
    addCourse(course, selectedSubTypeId);
  };

  const handleRemoveCourse = (courseId) => {
    const semesterIdKey = `Semester ${semesterNumber}`;
    setSelectedCourses((prev) => {
      const updated = {
        ...prev,
        [semesterIdKey]: (prev[semesterIdKey] || []).filter(
          (c) => c.id !== courseId,
        ),
      };
      localStorage.setItem(LOCALS.semesterSelections, JSON.stringify(updated));
      return updated;
    });
  };

  const isEmpty = !selectedCourses[`Semester ${semesterNumber}`]?.length;
  const isSummer = isSummerTerm(semesterNumber);
  const handleNextSemester = () => {
    if (onNextSemester && (!isEmpty || isSummer)) onNextSemester();
  };

  const totalCredits =
    selectedCourses[`Semester ${semesterNumber}`]?.reduce(
      (sum, course) => sum + course.credit,
      0,
    ) || 0;

  const courseNameById = useMemo(
    () => Object.fromEntries(courses.map((c) => [c.id, c.name])),
    [courses],
  );
  const codeById = useMemo(
    () => Object.fromEntries(courses.map((c) => [c.id, c.code])),
    [courses],
  );
  const issues = useMemo(
    () => getCoreqIssues(selectedCourses, coreqMap),
    [selectedCourses, coreqMap],
  );
  const termIssueByCourseId = Object.fromEntries(
    issues
      .filter((i) => i.semesterNumber === semesterNumber)
      .map((i) => [i.courseId, i]),
  );
  const completedCourses = useMemo(
    () =>
      completedCourseIdsThrough(
        selectedCourses,
        semesterNumber,
        parseCreditTransferIds(
          JSON.parse(localStorage.getItem(LOCALS.qnaResponses) || "{}")
            .creditCourses,
        ),
      ),
    [selectedCourses, semesterNumber],
  );
  const courseById = useMemo(
    () => Object.fromEntries(courses.map((c) => [c.id, c])),
    [courses],
  );
  const transferIds = useMemo(
    () =>
      parseCreditTransferIds(
        JSON.parse(localStorage.getItem(LOCALS.qnaResponses) || "{}")
          .creditCourses,
      ),
    [],
  );
  const creditById = useMemo(() => creditsByCourseId(courses), [courses]);

  const semStatus = semesterStatus({
    courses: selectedCourses[`Semester ${semesterNumber}`] ?? [],
    prerequisites,
    completedIds: completedCourses,
    coreqIssues: Object.values(termIssueByCourseId),
  });

  const thresholdIssues = useMemo(() => {
    const accumulated = accumulatedCreditsBefore(
      selectedCourses,
      semesterNumber,
      transferIds,
      creditById,
    );
    return (selectedCourses[`Semester ${semesterNumber}`] ?? [])
      .map((c) => courseById[c.id])
      .filter(Boolean)
      .map((c) => thresholdIssueFor(c, accumulated))
      .filter(Boolean);
  }, [selectedCourses, semesterNumber, transferIds, creditById, courseById]);

  const prereqSummary =
    semStatus.unmet.length === 1
      ? (() => {
          const issue = semStatus.unmet[0];
          const req = requisiteLabelString(
            prerequisites[issue.courseId],
            codeById,
          );
          return req
            ? `${req} required before ${codeById[issue.courseId] ?? issue.courseName}.`
            : `${codeById[issue.courseId] ?? issue.courseName} has unmet prerequisites.`;
        })()
      : `${semStatus.unmet.length} courses have unmet prerequisites: ${semStatus.unmet
          .map((i) => codeById[i.courseId] ?? i.courseName)
          .join(", ")}.`;

  const coreqSummary = semStatus.coreqIssues
    .map((issue) => {
      const missing = issue.missingIds
        .map((id) => codeById[id] ?? id)
        .join(" or ");
      return `${codeById[issue.courseId] ?? issue.courseName} must be taken with ${missing}.`;
    })
    .join(" ");

  if (isLoading) return <div className="loading-msg">Loading courses...</div>;
  if (fetchError) return <div className="error-msg">Error: {fetchError}</div>;

  return (
    <div className={`semester-container${isSummer ? " full-row" : ""}`}>
      <div className="semester-header">
        <h4>{termLabel(semesterNumber, semesterYear)}</h4>
        {onRemoveSemester && isEmpty && (
          <button
            className="remove-semester-btn"
            onClick={onRemoveSemester}
            aria-label="Remove summer semester"
          >
            ×
          </button>
        )}

        <span className="credit-total">Total Credits: {totalCredits}</span>
      </div>

      <div className="semester-status">
        {semStatus.unmet.length > 0 && (
          <StatusPill
            variant="prerequisite"
            heading="Prerequisites not met"
            description={prereqSummary}
            live={false}
          />
        )}
        {semStatus.coreqIssues.length > 0 && (
          <StatusPill
            variant="corequisite"
            heading="Corequisites not met"
            description={coreqSummary}
            live={false}
          />
        )}

        {thresholdIssues.length > 0 && (
          <StatusPill
            variant="eligibility"
            heading="Credit threshold not met"
            description={`${thresholdIssues
              .map(
                (t) =>
                  `${codeById[t.courseId] ?? t.courseName} (needs ${t.shortfall} more)`,
              )
              .join(", ")}.`}
            live={false}
          />
        )}
      </div>
      <div className="course-area">
        {selectedCourses[`Semester ${semesterNumber}`]?.map((course) => (
          <div key={course.id} className="course-tag">
            <div className="dropdown-group">
              <CourseDropdown
                categorizedRecommendedCourses={categorizedRecommendedCourses}
                categorizedAvailableCourses={categorizedAvailableCourses}
                recommendedCourses={recommendedCourses}
                currentCourse={course}
                prerequisites={prerequisites}
                codeById={codeById}
                onSelect={handleSelectCourse}
              />
            </div>
            <div className="prerequisites">
              {requisiteLabelString(prerequisites[course.id], codeById) && (
                <div className="prerequisites">
                  Prerequisites:{" "}
                  {requisiteLabelString(prerequisites[course.id], codeById)}
                </div>
              )}
              {requisiteLabelString(coreqMap[course.id], codeById) && (
                <div className="corequisites">
                  Corequisites:{" "}
                  {requisiteLabelString(coreqMap[course.id], codeById)}
                </div>
              )}
            </div>
            {termIssueByCourseId[course.id] ? (
              <CorequisiteWarning
                issue={termIssueByCourseId[course.id]}
                courseNameById={courseNameById}
                codeById={codeById}
              />
            ) : null}
            <span
              className="remove-btn"
              onClick={() => handleRemoveCourse(course.id)}
            >
              ×
            </span>
          </div>
        ))}
        {showAddCourse && (
          <div className="course-tag">
            <div className="dropdown-group">
              <CourseDropdown
                categorizedRecommendedCourses={categorizedRecommendedCourses}
                categorizedAvailableCourses={categorizedAvailableCourses}
                recommendedCourses={recommendedCourses}
                prerequisites={prerequisites}
                codeById={codeById}
                placeholder="Select a course"
                onSelect={handleSelectCourse}
              />
            </div>
            <div className="remove-btn" onClick={() => setShowAddCourse(false)}>
              ×
            </div>
          </div>
        )}
        {!showAddCourse &&
          (visibleCourses.length > 0 || recommendedCourses.length > 0) && (
            <Button
              ref={addCourseButtonRef}
              variant="secondary"
              iconLeft="+"
              onClick={handleAddCourse}
            >
              Add Course
            </Button>
          )}
      </div>
      {onNextSemester && (
        <button
          className={`next-semester-btn ${isEmpty && !isSummer ? "disabled" : ""}`}
          onClick={handleNextSemester}
          title={
            isEmpty && !isSummer ? "Add at least one course to proceed" : ""
          }
          disabled={isEmpty && !isSummer}
        >
          {isEmpty && isSummer ? "Skip Summer →" : "Move to Next Semester →"}
        </button>
      )}
      {pendingSelection && (
        <ConfirmDialog
          open
          title="Course warnings"
          body={
            <SelectionIssueList
              course={pendingSelection.course}
              issues={pendingSelection.issues}
              prerequisites={prerequisites}
              coreqMap={coreqMap}
              codeById={codeById}
            />
          }
          cancelLabel="Go Back"
          confirmLabel="Continue Anyway"
          tone="primary"
          onConfirm={() => {
            addCourse(pendingSelection.course, pendingSelection.subTypeId);
            setPendingSelection(null);
          }}
          onCancel={() => setPendingSelection(null)}
        />
      )}
    </div>
  );
}

export default SemesterComponent;
