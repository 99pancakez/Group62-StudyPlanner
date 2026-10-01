export default function CorequisiteWarning({
  issue,
  courseNameById,
  codeById,
}) {
  const names = issue.missingIds
    .map((id) => {
      const code = codeById[id];
      const name = courseNameById[id] || id;
      return code ? `${code} — ${name}` : `${name} (${id})`;
    })
    .join(", ");

  return (
    <div className="coreq-warning" role="alert">
      <span className="coreq-warning-icon" role="img" aria-label="warning">
        ⚠️
      </span>
      <span className="coreq-warning-text">
        {issue.courseName} needs a corequisite: {names}. Plan it in this
        semester or an earlier one to avoid this warning.
      </span>
    </div>
  );
}
