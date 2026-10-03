import { useState, useEffect } from "react";
import StatusPill from "../../Components/common/StatusPill";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import CombinationComponent from "../../Components/Combination/CombinationComponent";
import SemesterComponent from "../../Components/SemesterUI/SemesterComponent";
import "./StudyPlan.css";
import {
  API_BASE_URL,
  EXPLORER_API_BASE_URL,
  COMBINATIONS,
  CREDITS,
  EXCLUDED_SUB_TYPES,
  LOCALS,
  PROGRAM_CODE,
  SUB_TYPE,
} from "../../constants";
import ProgressComponent from "../../Components/common/ProgressComponent";
import { getCoreqIssues } from "../../utils/requisites";
import CorequisiteWarningModal from "../../Components/SemesterUI/CorequisiteWarningModal";
import { termLabel, isSummerTerm, yearForSemester } from "../../utils/term";
import Button from "../../Components/common/Button";
import {
  combinationEligibility,
  completedCourseIdsThrough,
  coreqIssuesBySemester,
  parseCreditTransferIds,
  planStatus,
  planStatusSummary,
  semesterStatus,
} from "../../utils/planStatus";
import ConfirmDialog from "../../Components/common/ConfirmDialog";

function CertificateIcon() {
  return (
    <svg
      width="20px"
      height="20px"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      fill="none"
      stroke="#000000"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
    >
      <polyline points="11.25 1.75,2.75 1.75,2.75 13.25,5.25 13.25" />
      <polyline points="8.75 9.75,8.25 14.25,10.50 13.25,12.75 14.25,12.25 9.75" />
      <circle cx="10.5" cy="7.5" r="2.75" />
    </svg>
  );
}

function StudyPlan() {
  const [semesterCount, setSemesterCount] = useState(() => {
    try {
      const storedData = localStorage.getItem(LOCALS.studyPlanState);
      return storedData ? JSON.parse(storedData).semesterCount : 1;
    } catch (e) {
      return 1;
    }
  });

  const [selectedCourses, setSelectedCourses] = useState(() => {
    const storedSelections = localStorage.getItem(LOCALS.semesterSelections);
    return storedSelections ? JSON.parse(storedSelections) : {};
  });

  const [coreCredits, setCoreCredits] = useState(0);
  const [majorMinorBreakdown, setMajorMinorBreakdown] = useState([]);
  const [creditProgress, setCreditProgress] = useState({});
  const [combinations, setCombinations] = useState([]);
  const [combinationSelections, setCombinationSelections] = useState(() => {
    const stored = localStorage.getItem(LOCALS.combinationSelections);
    return stored ? JSON.parse(stored) : {};
  });

  const [subTypeGroupMap, setSubTypeGroupMap] = useState({});
  const [comboResetSignal, setComboResetSignal] = useState(0);
  const [confirmClearAllOpen, setConfirmClearAllOpen] = useState(false);
  const [warningIssues, setWarningIssues] = useState(null);
  const [requisites, setRequisites] = useState({
    coreqMap: {},
    courseNameById: {},
    codeById: {},
  });
  const creditTransferIds = parseCreditTransferIds(
    JSON.parse(localStorage.getItem(LOCALS.qnaResponses) || "{}").creditCourses,
  );

  const semesterStatuses = Array.from({ length: semesterCount }, (_, i) => {
    const n = i + 1;
    const courses = selectedCourses[`Semester ${n}`] ?? [];
    return semesterStatus({
      courses,
      prerequisites: requisites.prereqMap,
      completedIds: completedCourseIdsThrough(
        selectedCourses,
        n,
        creditTransferIds,
      ),
      coreqIssues:
        coreqIssuesBySemester(selectedCourses, requisites.coreqMap)[n] ?? [],
      totalCredits: courses.reduce((sum, c) => sum + c.credit, 0),
    });
  });

  const comboResult = combinationEligibility({
    creditProgress,
    selectedCourses,
    subTypeGroupMap,
    breakdown: majorMinorBreakdown,
  });

  const planVariant = planStatus([comboResult, ...semesterStatuses]);
  const planSummary = planStatusSummary(
    planVariant,
    semesterStatuses,
    comboResult,
  );

  const handleClearCombinationAndMap = () => {
    setCombinationSelections({});
    setSubTypeGroupMap({});
    localStorage.removeItem(LOCALS.combinationSelections);
    localStorage.removeItem(LOCALS.subTypeGroupMap);
  };

  const handleClearAll = () => {
    setSemesterCount(1);
    setSelectedCourses({});
    handleClearCombinationAndMap();
    setMajorMinorBreakdown([]);
    setCreditProgress({});
    setCoreCredits(0);
    setComboResetSignal((n) => n + 1);

    localStorage.removeItem(LOCALS.studyPlanState);
    localStorage.removeItem(LOCALS.semesterSelections);
  };
  const calculateProgramCourseCredits = (selectedCourses) => {
    return Object.values(selectedCourses)
      .flat()
      .filter(
        (course) => course.selected_sub_type_id === SUB_TYPE.PROGRAM_COURSE,
      )
      .reduce((sum, course) => sum + (course.credit || 0), 0);
  };

  const calculateTotalCredits = () => {
    const comboCredits = Object.values(creditProgress).reduce(
      (sum, p) => sum + p.earned,
      0,
    );
    const programCourseCredits = calculateProgramCourseCredits(selectedCourses);
    return coreCredits + comboCredits + programCourseCredits;
  };

  const handleSubTypeSelectionChange = ({ subTypeId, groupLabel }) => {
    const updatedMap = {
      ...subTypeGroupMap,
      [subTypeId]: groupLabel,
    };
    setSubTypeGroupMap(updatedMap);
    localStorage.setItem(LOCALS.subTypeGroupMap, JSON.stringify(updatedMap));
  };

  // Fetch combinations on mount
  useEffect(() => {
    const fetchCombinations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/combinations`);
        const data = await response.json();
        setCombinations(data);
      } catch (error) {
        console.error("Error fetching combinations:", error);
      }
    };
    fetchCombinations();
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(`${EXPLORER_API_BASE_URL}/available-courses`).then((r) => r.json()),
      fetch(`${EXPLORER_API_BASE_URL}/all-courses-with-prerequisites`).then(
        (r) => r.json(),
      ),
    ])
      .then(([available, prereqData]) => {
        if (cancelled) return;
        const codeById = {};
        const courseNameById = {};
        available.forEach((c) => {
          codeById[c.course_id] = c.course_code;
          courseNameById[c.course_id] = c.course_title;
        });
        const coreqMap = {};
        const prereqMap = {};
        prereqData.forEach((p) => {
          coreqMap[p.course_id] = p.corequisites || null;
          prereqMap[p.course_id] = p.prerequisites || null;
        });
        setRequisites({ coreqMap, prereqMap, courseNameById, codeById });
      })
      .catch((err) => console.error("Failed to load requisites:", err));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const savedMap = localStorage.getItem(LOCALS.subTypeGroupMap);
    if (savedMap) {
      setSubTypeGroupMap(JSON.parse(savedMap));
    }
  }, []);

  useEffect(() => {
    const coreCourses = Object.values(selectedCourses)
      .flat()
      .filter((course) => course.selected_sub_type_id === SUB_TYPE.CORE);
    const newCoreCredits = coreCourses.reduce(
      (sum, course) => sum + (course.credit || 0),
      0,
    );
    setCoreCredits(newCoreCredits);
  }, [selectedCourses]);

  useEffect(() => {
    if (
      Object.keys(combinationSelections).length > 0 &&
      combinations.length > 0
    ) {
      const comboId = Object.keys(combinationSelections)[0];
      const currentCombo = combinations.find(
        (c) => c.id.toString() === comboId,
      );

      if (currentCombo) {
        const progressMap = {};
        const breakdownList = {};

        currentCombo.groups.forEach((group) => {
          const label = group.label;
          const lowerLabel = label.toLowerCase();

          // Default required
          let required = group.credit;
          const isCombo4 = comboId === COMBINATIONS.SELECT_ALL;

          let min = null;
          let max = null;

          if (isCombo4) {
            if (lowerLabel.includes("cs option")) {
              min = CREDITS.COMBO4_CS_OPTION_MIN;
              max = CREDITS.COMBO4_CS_OPTION_MAX;
            } else if (lowerLabel.includes("elective")) {
              min = CREDITS.COMBO4_ELECTIVE_MIN;
              max = CREDITS.COMBO4_ELECTIVE_MAX;
            }
          }

          progressMap[label] = {
            earned: 0,
            required,
            percentage: 0,
            min,
            max,
          };

          breakdownList[label] = {
            label,
            target: required,
            subTypeIds: group.options.map((opt) => opt.sub_type_id),
          };
        });

        const seenCourseIds = new Set();

        if (comboId === COMBINATIONS.SELECT_MINOR) {
          const csMinorGroup = Object.keys(progressMap).find((label) =>
            label.toLowerCase().includes("cs minor"),
          );
          const csOptionGroup = Object.keys(progressMap).find((label) =>
            label.toLowerCase().includes("cs option"),
          );

          const csMinorSubTypeIds =
            breakdownList[csMinorGroup]?.subTypeIds || [];
          const selectedMinorSubTypeId = csMinorSubTypeIds.find((id) => {
            return Object.values(selectedCourses)
              .flat()
              .some((course) => course.selected_sub_type_id === id);
          });

          const updatedMap = { ...subTypeGroupMap };

          if (selectedMinorSubTypeId && !updatedMap[selectedMinorSubTypeId]) {
            updatedMap[selectedMinorSubTypeId] = csMinorGroup;
            setSubTypeGroupMap(updatedMap);
            localStorage.setItem(
              LOCALS.subTypeGroupMap,
              JSON.stringify(updatedMap),
            );
          }

          Object.values(selectedCourses)
            .flat()
            .forEach((course) => {
              const selectedId = course.selected_sub_type_id;
              if (!selectedId || seenCourseIds.has(course.id)) return;

              if (selectedId === selectedMinorSubTypeId) {
                progressMap[csMinorGroup].earned += course.credit || 0;
              } else if (!EXCLUDED_SUB_TYPES.includes(selectedId)) {
                progressMap[csOptionGroup].earned += course.credit || 0;
              }

              seenCourseIds.add(course.id);
            });
        } else {
          Object.values(selectedCourses)
            .flat()
            .forEach((course) => {
              const selectedId = course.selected_sub_type_id;
              if (!selectedId || seenCourseIds.has(course.id)) return;

              if (comboId === COMBINATIONS.SELECT_ALL) {
                const electiveGroup = Object.keys(progressMap).find((label) =>
                  label.toLowerCase().includes("elective"),
                );
                const csOptionGroup = Object.keys(progressMap).find((label) =>
                  label.toLowerCase().includes("cs option"),
                );

                if (
                  selectedId === SUB_TYPE.UNIVERSITY_ELECTIVE &&
                  electiveGroup
                ) {
                  progressMap[electiveGroup].earned += course.credit || 0;
                } else if (
                  selectedId !== SUB_TYPE.CORE &&
                  selectedId !== SUB_TYPE.PROGRAM_COURSE &&
                  csOptionGroup
                ) {
                  progressMap[csOptionGroup].earned += course.credit || 0;
                }
                seenCourseIds.add(course.id);
              } else {
                const assignedGroup = subTypeGroupMap[selectedId];

                if (assignedGroup && progressMap[assignedGroup]) {
                  progressMap[assignedGroup].earned += course.credit || 0;
                } else {
                  for (const label in breakdownList) {
                    const subTypeIds = breakdownList[label].subTypeIds;
                    if (subTypeIds.includes(selectedId)) {
                      progressMap[label].earned += course.credit || 0;
                      break;
                    }
                  }
                }
                seenCourseIds.add(course.id);
              }
            });
        }

        for (const label in progressMap) {
          const entry = progressMap[label];
          entry.percentage = Math.min(
            100,
            (entry.earned / entry.required) * 100,
          );
          entry.over = entry.earned > (entry.max ?? entry.required);
        }

        setCreditProgress(progressMap);
        setMajorMinorBreakdown(Object.values(breakdownList));
      }
    } else {
      setCreditProgress({});
      setMajorMinorBreakdown([]);
    }
  }, [selectedCourses, combinationSelections, combinations, subTypeGroupMap]);

  useEffect(() => {
    const handleClearNonCoreCourses = (event) => {
      setSelectedCourses(event.detail.newSelections);
    };

    window.addEventListener("clearNonCoreCourses", handleClearNonCoreCourses);
    return () => {
      window.removeEventListener(
        "clearNonCoreCourses",
        handleClearNonCoreCourses,
      );
    };
  }, []);

  const handleNextSemester = () => {
    const newCount = semesterCount + 1;
    setSemesterCount(newCount);
    localStorage.setItem(
      LOCALS.studyPlanState,
      JSON.stringify({
        semesterCount: newCount,
      }),
    );
  };

  const handleRemoveSemester = (semesterNumber) => {
    setSelectedCourses((prev) => {
      const next = { ...prev };
      delete next[`Semester ${semesterNumber}`];
      localStorage.setItem(LOCALS.semesterSelections, JSON.stringify(next));
      return next;
    });
    setSemesterCount((prev) => {
      const newCount = prev - 1;
      localStorage.setItem(
        LOCALS.studyPlanState,
        JSON.stringify({ semesterCount: newCount }),
      );
      return newCount;
    });
  };

  const renderSemesters = () => {
    return Array.from({ length: semesterCount }, (_, index) => {
      const semesterNumber = index + 1;
      const semesterYear = yearForSemester(semesterNumber);
      return (
        <SemesterComponent
          key={semesterNumber}
          semesterNumber={semesterNumber}
          semesterYear={semesterYear}
          onNextSemester={
            semesterNumber === semesterCount ? handleNextSemester : null
          }
          selectedCourses={selectedCourses}
          setSelectedCourses={setSelectedCourses}
          onRemoveSemester={
            semesterNumber === semesterCount && isSummerTerm(semesterNumber)
              ? () => handleRemoveSemester(semesterNumber)
              : undefined
          }
        />
      );
    });
  };

  const handleDownloadPDF = () => {
    const issues = getCoreqIssues(selectedCourses, requisites.coreqMap);
    if (issues.length > 0) {
      setWarningIssues(issues);
      return;
    }
    genPdf();
  };

  const genPdf = () => {
    const doc = new jsPDF();
    const selections = JSON.parse(
      localStorage.getItem(LOCALS.semesterSelections) || "{}",
    );

    let overallTotal = 0;
    let yOffset = 20;

    doc.setFontSize(14);
    doc.text("Study Plan Report", 14, 10);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 16);

    Object.keys(selections).forEach((semesterKey) => {
      const courses = selections[semesterKey];
      const rows = courses.map((course) => [
        course.id,
        course.name,
        course.credit,
      ]);

      const semesterTotal = courses.reduce(
        (sum, course) => sum + (course.credit || 0),
        0,
      );
      overallTotal += semesterTotal;

      doc.text(`${semesterKey}`, 14, yOffset);
      yOffset += 4;

      autoTable(doc, {
        startY: yOffset,
        head: [["Course ID", "Course Name", "Credit"]],
        body: rows,
        theme: "grid",
        styles: { fontSize: 10 },
      });

      // Use doc.lastAutoTable to get finalY safely
      if (doc.lastAutoTable && doc.lastAutoTable.finalY) {
        yOffset = doc.lastAutoTable.finalY + 6;
      } else {
        yOffset += 20; // fallback
      }

      const n = parseInt(semesterKey.split(" ")[1], 10);
      doc.text(termLabel(n, yearForSemester(n)), 14, yOffset);
      yOffset += 10;
    });

    doc.text(`Overall Total Credits: ${overallTotal}`, 14, yOffset);
    doc.save("study-plan.pdf");
  };

  const handleOpenOfficialProgramPdf = () => {
    window.open(
      `${API_BASE_URL}/courses/download-courses/${PROGRAM_CODE}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const totalCredits = calculateTotalCredits();
  const totalPercentage = Math.min(
    100,
    (totalCredits / CREDITS.TOTAL_DEGREE) * 100,
  );

  return (
    <div className="study-plan">
      <header className="study-plan__header">
        <div className="study-plan__header-inner">
          <h1 className="study-plan__title">
            <span className="study-plan__title-pill">RMIT</span>
            <span className="study-plan__title-text">UNIVERSITY</span>
          </h1>
          <div className="study-plan__toolbar">
            <span className="study-plan__brand-tag">RMIT Course Planner</span>
          </div>
        </div>
      </header>
      <div className="study-plan-layout">
        <a
          className="study-plan__program-link"
          href={`${API_BASE_URL}/courses/download-courses/${PROGRAM_CODE}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <CertificateIcon />
          Download Official Program Course List (PDF)
        </a>

        <div className="top-row">
          <div className="combination-box">
            <CombinationComponent
              setCombinationSelections={setCombinationSelections}
              combinations={combinations}
              onSubTypeSelectionChange={handleSubTypeSelectionChange}
              onClearCombination={handleClearCombinationAndMap}
            />
          </div>

          <div className="scorecard-box">
            <div className="scorecard-box__grid">
              <div className="scorecard-box__total">
                <span className="scorecard-box__eyebrow">
                  Credit Breakdown Progress
                </span>
                <span className="scorecard-box__cp">
                  {totalCredits} / {CREDITS.TOTAL_DEGREE} CP
                </span>
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-label="Total credit progress"
                  aria-valuenow={Math.round(totalPercentage)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="progress-fill"
                    style={{ width: `${totalPercentage}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="scorecard-box__breakdown">
              {/* Core */}
              <ProgressComponent
                label="Core"
                valueText={`${coreCredits}/${CREDITS.CORE_TOTAL}`}
                percentage={(coreCredits / CREDITS.CORE_TOTAL) * 100}
              />

              {/* Program Course */}
              <ProgressComponent
                label="Program Course"
                valueText={`${calculateProgramCourseCredits(selectedCourses)}/${CREDITS.PROGRAM_COURSE_TOTAL}`}
                percentage={
                  (calculateProgramCourseCredits(selectedCourses) /
                    CREDITS.PROGRAM_COURSE_TOTAL) *
                  100
                }
              />

              {/* Combo breakdowns */}
              {majorMinorBreakdown.map((item, index) => {
                const progress = creditProgress[item.label] || {
                  earned: 0,
                  required: item.target,
                  percentage: 0,
                  min: null,
                  max: null,
                  over: false,
                };
                return (
                  <ProgressComponent
                    key={index}
                    label={item.label}
                    valueText={`${progress.earned}/${
                      progress.min != null && progress.max != null
                        ? `${progress.min}-${progress.max}`
                        : (progress.required ?? "N/A")
                    }`}
                    percentage={progress.percentage}
                    over={progress.over}
                    warning="Exceeds maximum allowed credits"
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="semester-box">
          <div className="study-plan-container">{renderSemesters()}</div>
        </div>

        {warningIssues && (
          <CorequisiteWarningModal
            issues={warningIssues}
            courseNameById={requisites.courseNameById}
            codeById={requisites.codeById}
            onClose={() => setWarningIssues(null)}
            onContinue={() => {
              setWarningIssues(null);
              genPdf();
            }}
          />
        )}
        <ConfirmDialog
          open={confirmClearAllOpen}
          title="Clear study plan"
          body="This removes every semester, course, and your selected combination from this browser. Your questionnaire answers are kept."
          confirmLabel="Clear all"
          tone="destructive"
          onConfirm={() => {
            handleClearAll();
            setConfirmClearAllOpen(false);
          }}
          onCancel={() => setConfirmClearAllOpen(false)}
        />
      </div>
      <footer className="study-plan__footer">
        <div className="study-plan__footer-actions">
          <div className="study-plan__footer-inner">
            <Button
              variant="outline"
              onClick={() => setConfirmClearAllOpen(true)}
            >
              Clear all
            </Button>
            <Button variant="dark" onClick={handleDownloadPDF}>
              Download study plan
            </Button>
          </div>
        </div>
        <div className="study-plan__footer-legal">
          <div className="study-plan__footer-inner">
            <span>
              © 2026 RMIT StudyPlanner Project Group. Prepared for client review
              &amp; Sprint 1 validation
            </span>
            <span className="study-plan__footer-brand">RMIT UNIVERSITY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default StudyPlan;
