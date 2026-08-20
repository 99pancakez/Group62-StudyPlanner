import React, { useState, useEffect, useRef } from "react";
import "./SemesterComponent.css";

const API_BASE_URL = "http://localhost:3000/explorer";

const SUB_TYPE_MAP = {
  1: "Core",
  2: "Advanced Computer Science",
  3: "Cyber Security",
  4: "Enterprise Systems Development",
  5: "Artificial Intelligence & Machine Learning",
  6: "Blockchain Technologies",
  7: "Cloud Computing",
  8: "Creative Computing",
  9: "Cyber Assurance",
  10: "Data Science",
  11: "Design & Develop for Apple Platform",
  12: "Enterprise Systems Development",
  13: "Bioinformatics",
  14: "Data Analysis",
  15: "Digital Innovation",
  16: "University Elective",
  17: "Program Course",
};

const SUB_TYPE_NAME_TO_ID = Object.entries(SUB_TYPE_MAP).reduce(
  (acc, [id, name]) => {
    acc[name] = parseInt(id);
    return acc;
  },
  {}
);

function SemesterComponent({
  semesterYear,
  semesterNumber,
  onNextSemester,
  selectedCourses,
  setSelectedCourses,
  completedCourses,
}) {
  const [courses, setCourses] = useState([]);
  const [prerequisites, setPrerequisites] = useState({});
  const [initialAvailableCourses, setInitialAvailableCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [categorizedAvailableCourses, setCategorizedAvailableCourses] =
    useState({});
  const [categorizedRecommendedCourses, setCategorizedRecommendedCourses] =
    useState({});
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [semesterId, setSemesterId] = useState(1);
  const menuRef = useRef(null);

  // Function to categorize courses based on selected courses
  const updateCategorizedCourses = (
    allCourses,
    prereqMap,
    selectedCourses,
    calculatedSemesterId,
    selectedSubTypeIds
  ) => {
    const semesterIdKey = `Semester ${semesterNumber}`;

    // Step 1: Load credit transfers from QnA
    const qnaData = localStorage.getItem("qnaResponses");
    let completedCourses = [];
    if (qnaData) {
      const parsedQna = JSON.parse(qnaData);
      if (parsedQna.creditCourses) {
        const creditCourseIds = parsedQna.creditCourses
          .split(", ")
          .filter((id) => id.trim() !== "");
        completedCourses.push(...creditCourseIds);
      }
    }

    // Step 2: Add only courses from prior semesters (not future!)
    const priorSemesterCourseIds = Object.entries(selectedCourses)
      .filter(([key]) => {
        const semNum = parseInt(key.split(" ")[1], 10);
        return semNum < semesterNumber;
      })
      .flatMap(([_, courses]) => courses.map((course) => course.id));

    completedCourses.push(...priorSemesterCourseIds);
    completedCourses = [...new Set(completedCourses)]; // ensure uniqueness

    const semesterCourses = allCourses.filter((course) =>
      course.semesters.some((sem) => sem.semester_id === calculatedSemesterId)
    );
    const subTypeFiltered = semesterCourses.filter((course) =>
      selectedSubTypeIds.some((subTypeId) =>
        course.sub_type_ids.includes(subTypeId)
      )
    );
    const availableAfterCreditTransfer = subTypeFiltered.filter(
      (course) => !completedCourses.includes(course.id)
    );
    const availableAfterPrereqs = availableAfterCreditTransfer.filter(
      (course) => {
        const prereqString = prereqMap[course.id];
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
      }
    );
    setInitialAvailableCourses(availableAfterPrereqs);

    let recommended = [];
    const maxYear = Math.max(...availableAfterPrereqs.map((c) => c.year), 1);
    let totalCredits = 0;
    for (let year = 1; year <= maxYear && totalCredits < 48; year++) {
      const yearCourses = availableAfterPrereqs.filter(
        (course) => course.year === year
      );
      totalCredits += yearCourses.reduce(
        (sum, course) => sum + course.credit,
        0
      );
      recommended.push(...yearCourses);
    }
    setRecommendedCourses(recommended);

    console.log("initialAvailableCourses:", availableAfterPrereqs);
    console.log("recommendedCourses:", recommended);

    // Get IDs of all selected courses across *all semesters*
    const allSelectedCourseIds = Object.values(selectedCourses).flatMap(
      (courses) => courses.map((c) => c.id)
    );

    // Then filter
    const availableFiltered = availableAfterPrereqs.filter(
      (course) => !allSelectedCourseIds.includes(course.id)
    );

    const categorizedAvailable = {};

    // Check if a Program Course (17) is already selected
    const isProgramCourseSelected = Object.values(selectedCourses)
      .flat()
      .some((course) => course.selected_sub_type_id === 17);

    availableFiltered.forEach((course) => {
      // Skip if already selected
      if (allSelectedCourseIds.includes(course.id)) return;

      // Always show Core
      if (course.sub_type_ids.includes(1)) {
        categorizedAvailable["Core"] = categorizedAvailable["Core"] || [];
        categorizedAvailable["Core"].push(course);
      }

      // Show Program Course only if one hasn't been selected yet
      if (course.sub_type_ids.includes(17) && !isProgramCourseSelected) {
        categorizedAvailable["Program Course"] =
          categorizedAvailable["Program Course"] || [];
        categorizedAvailable["Program Course"].push(course);
      }

      // Show other combo-based sub_type_ids (excluding 1 and 17)
      course.sub_type_ids.forEach((subTypeId) => {
        if (
          selectedSubTypeIds.includes(subTypeId) &&
          subTypeId !== 1 &&
          subTypeId !== 17
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
      (course) => !allSelectedCourseIds.includes(course.id)
    );

    const categorizedRecommended = {};

    // Same check for already selected Program Course
    recommendedFiltered.forEach((course) => {
      if (course.sub_type_ids.includes(1)) {
        categorizedRecommended["Core"] = categorizedRecommended["Core"] || [];
        categorizedRecommended["Core"].push(course);
      }

      if (course.sub_type_ids.includes(17) && !isProgramCourseSelected) {
        categorizedRecommended["Program Course"] =
          categorizedRecommended["Program Course"] || [];
        categorizedRecommended["Program Course"].push(course);
      }

      course.sub_type_ids.forEach((subTypeId) => {
        if (
          selectedSubTypeIds.includes(subTypeId) &&
          subTypeId !== 1 &&
          subTypeId !== 17
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

    console.log(
      "categorizedRecommendedCourses:",
      categorizedRecommendedCourses
    );
    console.log("categorizedAvailableCourses:", categorizedAvailableCourses);
  };

  useEffect(() => {
    const semesterIdKey = `Semester ${semesterNumber}`;
    setIsLoading(true);
    setFetchError(null);

    const storedData = localStorage.getItem("qnaResponses");
    let startingSemesterId = 1;
    if (storedData) {
      const studyPlan = JSON.parse(storedData);
      startingSemesterId = parseInt(studyPlan.semester_id, 10) || 1;
    }
    const offset = (semesterNumber - 1) % 2;
    const calculatedSemesterId =
      startingSemesterId === 1 ? (offset === 0 ? 1 : 2) : offset === 0 ? 2 : 1;
    setSemesterId(calculatedSemesterId);

    let selectedSubTypeIds = [1, 17];
    const combinationData = localStorage.getItem("combinationSelections");
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
        fetch(`${API_BASE_URL}/available-courses`).then((res) => {
          if (!res.ok) throw new Error("Failed to fetch courses");
          return res.json();
        }),
        fetch(`${API_BASE_URL}/all-courses-with-prerequisites`).then((res) => {
          if (!res.ok) throw new Error("Failed to fetch prerequisites");
          return res.json();
        }),
      ])
        .then(([courseData, prereqData]) => {
          console.log("Fetched courseData:", courseData);
          console.log("Fetched prereqData:", prereqData);
          const newCourses = courseData.map((c) => ({
            id: c.course_id,
            name: c.course_title,
            credit: c.course_credit,
            year: c.year,
            semesters: c.semesters,
            sub_type_ids: c.sub_type_ids || [],
          }));
          setCourses(newCourses);

          const prereqMap = prereqData.reduce((acc, curr) => {
            acc[curr.course_id] = curr.prerequisites;
            return acc;
          }, {});
          setPrerequisites(prereqMap);

          updateCategorizedCourses(
            newCourses,
            prereqMap,
            selectedCourses,
            calculatedSemesterId,
            selectedSubTypeIds
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
        selectedSubTypeIds
      );
      setIsLoading(false);
    }
  }, [semesterNumber, selectedCourses]); // Added selectedCourses to dependencies

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

  const handleSelectCourse = (course, selectedSubTypeId) => {
    const semesterIdKey = `Semester ${semesterNumber}`;
    setSelectedCourses((prev) => {
      const currentCourses = prev[semesterIdKey] || [];
      if (currentCourses.some((c) => c.id === course.id)) return prev;
      const updatedCourses = [
        ...currentCourses,
        {
          id: course.id,
          name: course.name,
          credit: course.credit,
          sub_type_ids: course.sub_type_ids,
          selected_sub_type_id: selectedSubTypeId,
        },
      ];
      const updated = { ...prev, [semesterIdKey]: updatedCourses };
      localStorage.setItem("semesterSelections", JSON.stringify(updated)); // Persist immediately
      const completed = JSON.parse(
        localStorage.getItem("completedCourses") || "[]"
      );
      completed.push(course.id);
      localStorage.setItem(
        "completedCourses",
        JSON.stringify([...new Set(completed)])
      );
      return updated;
    });
    setShowAddCourse(false);
  };

  const handleRemoveCourse = (courseId) => {
    const semesterIdKey = `Semester ${semesterNumber}`;
    setSelectedCourses((prev) => {
      const currentCourses = prev[semesterIdKey] || [];
      const updatedCourses = currentCourses.filter(
        (course) => course.id !== courseId
      );
      const updated = { ...prev, [semesterIdKey]: updatedCourses };
      // Step 1: Recalculate completed courses
      const updatedCompleted = Object.values(updated).flatMap((courses) =>
        courses.map((c) => c.id)
      );
      localStorage.setItem(
        "completedCourses",
        JSON.stringify([...new Set(updatedCompleted)])
      );
      // Step 2: Remove invalid future selections
      const newState = { ...updated };
      const allCourses = courses; // already fetched
      const prereqMap = prerequisites; // already fetched
      Object.keys(updated).forEach((key) => {
        const semNum = parseInt(key.split(" ")[1]);
        if (semNum > semesterNumber) {
          const futureCourses = updated[key];
          const filtered = futureCourses.filter((course) => {
            const prereqs = prereqMap[course.id];
            if (!prereqs || prereqs === "null") return true;
            const andGroups = prereqs
              .split(" AND ")
              .map((group) => group.trim());
            return andGroups.every((group) => {
              const orCourses = group.split(" OR ").map((id) => id.trim());
              return orCourses.some((prereqId) =>
                updatedCompleted.includes(prereqId)
              );
            });
          });
          if (filtered.length !== futureCourses.length) {
            newState[key] = filtered;
          }
        }
      });
      localStorage.setItem("semesterSelections", JSON.stringify(newState));
      return newState;
    });
  };

  const handleCourseChange = (oldCourseId, newCourse) => {
    const semesterIdKey = `Semester ${semesterNumber}`;
    setSelectedCourses((prev) => {
      const currentCourses = prev[semesterIdKey] || [];
      const updatedCourses = currentCourses.map((course) =>
        course.id === oldCourseId
          ? {
              id: newCourse.id,
              name: newCourse.name,
              credit: newCourse.credit,
              sub_type_ids: course.sub_type_ids,
            }
          : course
      );
      const updated = { ...prev, [semesterIdKey]: updatedCourses };
      localStorage.setItem("semesterSelections", JSON.stringify(updated)); // Persist immediately
      const completed = JSON.parse(
        localStorage.getItem("completedCourses") || "[]"
      );
      const updatedCompleted = completed.filter((id) => id !== oldCourseId);
      updatedCompleted.push(newCourse.id);
      localStorage.setItem(
        "completedCourses",
        JSON.stringify([...new Set(updatedCompleted)])
      );
      return updated;
    });
  };

  const handleNextSemester = () => {
    if (
      onNextSemester &&
      selectedCourses[`Semester ${semesterNumber}`]?.length > 0
    ) {
      onNextSemester();
    }
  };

  const totalCredits =
    selectedCourses[`Semester ${semesterNumber}`]?.reduce(
      (sum, course) => sum + course.credit,
      0
    ) || 0;

  if (isLoading) return <div className="loading-msg">Loading courses...</div>;
  if (fetchError)
    return <div className="error-message">Error: {fetchError}</div>;

  const allAvailableCourses = Object.values(categorizedAvailableCourses).flat();
  const allRecommendedCourses = Object.values(
    categorizedRecommendedCourses
  ).flat();

  return (
    <div className="semester-container" ref={menuRef}>
      <div className="semester-header">
        <h4>
          Semester {semesterNumber} (Year {semesterYear})
        </h4>
        <span className="credit-total">
          Total Credits: {totalCredits}{" "}
          {totalCredits === 48 && (
            <span className="normal-load">✅ Normal Load</span>
          )}
          {totalCredits < 48 && (
            <span
              className="underload clickable-warning"
              title="Click to see why underloading needs approval 🦥"
              onClick={() =>
                alert(
                  `🦥 Not in a rush, huh?\n\n` +
                    `You're currently underloading with ${totalCredits} credits.\n` +
                    `Students are normally expected to take 48 credits per semester.\n\n` +
                    `To take fewer, you'll need approval from your Program Manager.`
                )
              }
            >
              ⚠️ Underloading
            </span>
          )}
          {totalCredits > 48 && (
            <span
              className="overload clickable-warning"
              title="Click to see why overloading needs approval 🦘"
              onClick={() =>
                alert(
                  `🦘 That’s quite a leap!\n\n` +
                    `You're currently overloading with ${totalCredits} credits.\n` +
                    `Students are normally expected to take 48 credits per semester.\n\n` +
                    `To take more, you'll need approval from your Program Manager.`
                )
              }
            >
              ⚠️ Overloading
            </span>
          )}
        </span>
      </div>
      <div className="course-area">
        {selectedCourses[`Semester ${semesterNumber}`]?.map((course) => (
          <div key={course.id} className="course-tag">
            <div className="dropdown-group">
              <select
                value=""
                onChange={(e) => {
                  const { id, subTypeId } = JSON.parse(e.target.value);
                  const selectedCourse =
                    allAvailableCourses.find((c) => c.id === id) ||
                    allRecommendedCourses.find((c) => c.id === id);
                  if (selectedCourse) {
                    handleSelectCourse(selectedCourse, subTypeId);
                  }
                }}
                className="course-select"
              >
                <option value={course.id}>
                  {course.id} - {course.name} ({course.credit} credits)
                </option>
                {Object.entries(categorizedRecommendedCourses).length > 0 &&
                  Object.entries(categorizedRecommendedCourses)
                    .sort(([a], [b]) =>
                      a === "Core" ? -1 : b === "Core" ? 1 : a.localeCompare(b)
                    )
                    .map(
                      ([subTypeName, courses]) =>
                        courses.length > 0 && (
                          <optgroup
                            key={`recommended-${subTypeName}`}
                            label={`Recommended Courses - ${subTypeName}`}
                          >
                            {courses
                              .filter((c) => c.id !== course.id)
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
                        )
                    )}
                {Object.entries(categorizedAvailableCourses).length > 0 &&
                  Object.entries(categorizedAvailableCourses)
                    .sort(([a], [b]) =>
                      a === "Core" ? -1 : b === "Core" ? 1 : a.localeCompare(b)
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
                                  c.id !== course.id &&
                                  !recommendedCourses.some((r) => r.id === c.id)
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
                        )
                    )}
              </select>
            </div>
            <div className="prerequisites">
              Prerequisites: {prerequisites[course.id] || "None"}
            </div>
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
              <select
                value=""
                onChange={(e) => {
                  const { id, subTypeId } = JSON.parse(e.target.value);
                  const selectedCourse =
                    allAvailableCourses.find((c) => c.id === id) ||
                    allRecommendedCourses.find((c) => c.id === id);
                  if (selectedCourse) {
                    handleSelectCourse(selectedCourse, subTypeId);
                  }
                }}
                className="course-select"
              >
                <option value="" disabled>
                  Select a course
                </option>
                {Object.entries(categorizedRecommendedCourses).length > 0 &&
                  Object.entries(categorizedRecommendedCourses)
                    .sort(([a], [b]) =>
                      a === "Core" ? -1 : b === "Core" ? 1 : a.localeCompare(b)
                    )
                    .map(
                      ([subTypeName, courses]) =>
                        courses.length > 0 && (
                          <optgroup
                            key={`recommended-${subTypeName}`}
                            label={`Recommended Courses - ${subTypeName}`}
                          >
                            {courses.map((c) => (
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
                                {c.id} - {c.name} ({c.credit} credits){" "}
                                {prerequisites[c.id]
                                  ? `[Prereqs: ${prerequisites[c.id]}]`
                                  : ""}
                              </option>
                            ))}
                          </optgroup>
                        )
                    )}
                {Object.entries(categorizedAvailableCourses).length > 0 &&
                  Object.entries(categorizedAvailableCourses)
                    .sort(([a], [b]) =>
                      a === "Core" ? -1 : b === "Core" ? 1 : a.localeCompare(b)
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
                                  !recommendedCourses.some((r) => r.id === c.id)
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
                                  {c.id} - {c.name} ({c.credit} credits){" "}
                                  {prerequisites[c.id]
                                    ? `[Prereqs: ${prerequisites[c.id]}]`
                                    : ""}
                                </option>
                              ))}
                          </optgroup>
                        )
                    )}
              </select>
            </div>
            <div
              className="remove-btn"
              onClick={() => setShowAddCourse(false)}
            >
              ×
            </div>
          </div>
        )}
        {!showAddCourse &&
          (initialAvailableCourses.length > 0 ||
            recommendedCourses.length > 0) && (
            <button className="add-course-btn" onClick={handleAddCourse}>
              <span>+</span> Add Course
            </button>
          )}
      </div>
      <button
        className={`next-semester-btn ${
          !selectedCourses[`Semester ${semesterNumber}`]?.length
            ? "disabled"
            : ""
        }`}
        onClick={handleNextSemester}
        title={
          !selectedCourses[`Semester ${semesterNumber}`]?.length
            ? "Add at least one course to proceed"
            : ""
        }
        disabled={!selectedCourses[`Semester ${semesterNumber}`]?.length}
      >
        Move to Next Semester →
      </button>
    </div>
  );
}

export default SemesterComponent;
