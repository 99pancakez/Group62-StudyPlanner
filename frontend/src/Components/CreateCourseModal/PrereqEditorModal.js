import React from 'react';
import Select from 'react-select';


const PrereqEditorModal = ({ prerequisites, setPrerequisites, onClose, allCourseCodes = [], onSave }) => {
  console.log("⚡ allCourseCodes in modal:", allCourseCodes);
  const cleanAndSave = async () => {
    const cleaned = prerequisites
      .map(group => group.map(code => code.trim()).filter(Boolean))
      .filter(group => group.length > 0);

    if (onSave) {
      await onSave(cleaned);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Prerequisites</h2>

        <div className="prereq-groups">
          {prerequisites.map((orGroup, idx) => (
            <div key={idx} className="or-group">
              {orGroup.map((code, i) => (
                <div key={i} className="course-input">
                  <div className="course-input-wrapper">
                    <Select
                      menuPlacement="auto"
                      value={code ? { label: code, value: code } : null}
                      options={allCourseCodes
                        .filter(c => typeof c === 'string' && c.trim() !== '')
                        .map((code) => ({
                          label: code,
                          value: code,
                        }))
                      }
                      onChange={(selectedOption) => {
                        const updated = [...prerequisites];
                        updated[idx][i] = selectedOption ? selectedOption.value : '';
                        setPrerequisites(updated);
                      }}
                      placeholder={`Course ${i + 1}`}
                      className="course-select"
                      isClearable
                    />

                    <button
                      className="close-course-button"
                      onClick={() => {
                        const updated = [...prerequisites];
                        updated[idx].splice(i, 1);
                        if (updated[idx].length === 0) {
                          updated.splice(idx, 1);
                        }
                        if (updated.length === 0) {
                          updated.push(['']);
                        }
                        setPrerequisites(updated);
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              <button
                className="or-button"
                onClick={() => {
                  const updated = [...prerequisites];
                  updated[idx].push('');
                  setPrerequisites(updated);
                }}
              >
                +OR
              </button>
              <button
                className="remove-group-button"
                onClick={() => {
                  const updated = [...prerequisites];
                  updated.splice(idx, 1);
                  if (updated.length === 0) {
                    updated.push(['']);
                  }
                  setPrerequisites(updated);
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="and-button-container">
            <button
              className="and-button"
              onClick={() => setPrerequisites([...prerequisites, ['']])}
            >
              +AND
            </button>
          </div>
        </div>

        <div className="summary-box">
          Summary:{' '}
          {prerequisites.length === 0 || prerequisites.every(group => group.every(code => !code.trim()))
            ? 'None'
            : prerequisites
                .filter(group => group.some(code => code.trim()))
                .map(group => `(${group.filter(code => code.trim()).join(' OR ')})`)
                .join(' AND ')}
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
