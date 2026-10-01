import React from "react";

export default function CorequisiteWarningModal({
  issues,
  courseNameById,
  codeById,
  onClose,
  onContinue,
}) {
  return (
    <div className="coreq-modal-overlay">
      <div
        className="coreq-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="coreq-modal-title"
      >
        <h2 id="coreq-modal-title">Corequisite warnings</h2>
        <p className="coreq-modal-lead">
          The following planned courses are missing a corequisite, which should
          be planned in the same semester or an earlier one. You can still save
          your plan anyway.
        </p>
        <ul className="coreq-modal-list">
          {issues.map((issue) => {
            const names = issue.missingIds
              .map((id) => {
                const code = codeById[id];
                const name = courseNameById[id] || id;
                return code ? `${code} — ${name}` : `${name} (${id})`;
              })
              .join(", ");
            return (
              <li key={`${issue.courseId}-${issue.semesterNumber}`}>
                <span
                  className="coreq-warning-icon"
                  role="img"
                  aria-label="warning"
                >
                  ⚠️
                </span>
                <span>
                  {issue.courseName} is missing corequisite: {names}.
                </span>
              </li>
            );
          })}
        </ul>
        <div className="coreq-modal-actions">
          <button className="coreq-modal-btn secondary" onClick={onClose}>
            Go Back
          </button>
          <button className="coreq-modal-btn primary" onClick={onContinue}>
            Continue Anyway
          </button>
        </div>
      </div>
    </div>
  );
}
