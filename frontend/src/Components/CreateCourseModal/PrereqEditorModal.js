import React from "react";
import Select from "react-select";

const PrereqEditorModal = ({
  requisites,
  setRequisites,
  onClose,
  allCourseCodes = [],
  onSave,
}) => {
  const options = (Array.isArray(allCourseCodes) ? allCourseCodes : [])
    .filter((c) => typeof c === "string" && c.trim() !== "")
    .map((code) => ({ label: code, value: code }));

  const summaryOf = (relation) => {
    const groups = requisites
      .filter((g) => g.relation === relation)
      .map((g) => g.courses.filter((c) => c.trim()))
      .filter((g) => g.length > 0);
    return groups.map((g) => `(${g.join(" OR ")})`).join(" AND ") || "None";
  };

  const updateGroup = (idx, patch) => {
    const updated = [...requisites];
    updated[idx] = { ...updated[idx], ...patch };
    setRequisites(updated);
  };

  const cleanAndSave = async () => {
    const cleaned = requisites
      .map((g) => ({
        relation: g.relation === "corequisite" ? "corequisite" : "prerequisite",
        courses: (g.courses || []).map((c) => c.trim()).filter(Boolean),
      }))
      .filter((g) => g.courses.length > 0);
    if (onSave) await onSave(cleaned);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Requisites</h2>
        <div className="prereq-groups">
          {requisites.map((group, idx) => (
            <div key={idx} className="or-group">
              <select
                value={group.relation || "prerequisite"}
                onChange={(e) => updateGroup(idx, { relation: e.target.value })}
              >
                <option value="prerequisite">Prerequisite</option>
                <option value="corequisite">Corequisite</option>
              </select>
              {(group.courses || []).map((code, i) => (
                <div key={i} className="course-input">
                  <div className="course-input-wrapper">
                    <Select
                      menuPlacement="auto"
                      value={code ? { label: code, value: code } : null}
                      options={options}
                      onChange={(sel) =>
                        updateGroup(idx, {
                          courses: group.courses.map((c, j) =>
                            j === i ? (sel ? sel.value : "") : c,
                          ),
                        })
                      }
                      placeholder={`Course ${i + 1}`}
                      className="course-select"
                      isClearable
                    />
                    <button
                      className="close-course-button"
                      onClick={() => {
                        const updated = [...requisites];
                        const courses = updated[idx].courses.slice();
                        courses.splice(i, 1);
                        if (!courses.length) updated.splice(idx, 1);
                        if (!updated.length)
                          updated.push({
                            relation: "prerequisite",
                            courses: [""],
                          });
                        setRequisites(updated);
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              <button
                className="or-button"
                onClick={() =>
                  updateGroup(idx, { courses: [...group.courses, ""] })
                }
              >
                +OR
              </button>
              <button
                className="remove-group-button"
                onClick={() => {
                  const updated = requisites.slice();
                  updated.splice(idx, 1);
                  if (!updated.length)
                    updated.push({ relation: "prerequisite", courses: [""] });
                  setRequisites(updated);
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="and-button-container">
            <button
              className="and-button"
              onClick={() =>
                setRequisites([
                  ...requisites,
                  { relation: "prerequisite", courses: [""] },
                ])
              }
            >
              +AND
            </button>
          </div>
        </div>
        <div className="summary-box">
          Prerequisites: {summaryOf("prerequisite")}
          <br />
          Corequisites: {summaryOf("corequisite")}
        </div>
        <div className="modal-actions">
          <button onClick={cleanAndSave}>✅ Save</button>
          <button onClick={onClose}>❌ Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PrereqEditorModal;
