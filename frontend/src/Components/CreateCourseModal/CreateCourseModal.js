import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './CreateCourseModal.css'; // Optional styling if needed
import PrereqEditorModal from './PrereqEditorModal'; // Adjust path as needed


const CreateCourseModal = ({ onClose, onCourseCreated, courseTypes, subTypes, programCode }) => {
  const [tab, setTab] = useState(1);
  const [courseId, setCourseId] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [webUrl, setWebUrl] = useState('');
  const [year, setYear] = useState(1);
  const [creditPoints, setCreditPoints] = useState(12);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSubTypes, setSelectedSubTypes] = useState([]);

  const safeCourseTypes = Array.isArray(courseTypes) ? courseTypes : [];
  const safeSubTypes = Array.isArray(subTypes) ? subTypes : [];
  console.log("💡 SubTypes being passed to modal:", subTypes);


  const [semester1, setSemester1] = useState(false);
  const [semester2, setSemester2] = useState(false);
  const [flexTerm, setFlexTerm] = useState(false);

  const [prerequisites, setPrerequisites] = useState([]); // Empty by default
  const [showPrereqModal, setShowPrereqModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [serverErrors, setServerErrors] = useState({});





  const [allCourseCodes, setAllCourseCodes] = useState([]);

  useEffect(() => {
    const fetchCourseCodes = async () => {
      try {
        const res = await fetch("http://localhost:3000/courses/allCourseCodes"); // This must match your actual route path
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          setAllCourseCodes(data.data);
          console.log("✅ allCourseCodes set:", data.data);
        } else {
          console.error("❌ Unexpected course code response:", data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch course codes:", err);
      }
    };

    fetchCourseCodes();
  }, []);





  const groupedSubTypeOptions = selectedTypes.length > 0
    ? selectedTypes.map(type => {
        const seen = new Set();
        const filtered = safeSubTypes.filter(st => {
          const key = `${st.value}-${st.courseType}`; // Differentiate by value + type
          if (!seen.has(key) && st.courseType === type) {
            seen.add(key);
            return true;
          }
          return false;
        }).map(st => ({
          label: st.label,
          value: st.value,
          courseType: st.courseType
        }));

        return {
          label: type,
          options: filtered
        };
      })
    : [];






  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '900px', width: '100%' }}>
        <h2>Create Course</h2>

        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: '16px' }}>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => setTab(n)}
              style={{
                flex: 1,
                padding: '10px',
                background: tab === n ? '#333' : '#eee',
                color: tab === n ? '#fff' : '#000',
                border: '1px solid #ccc'
              }}
            >
              {n === 1 ? 'Course Info' : n === 2 ? 'Availability & Prerequisites' : 'Review & Submit'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ minHeight: '300px' }}>
          {tab === 1 && (
            <div className="form-grid">
              <label>Course ID *
                <input
                  type="text"
                  value={courseId}
                  onChange={e => {
                    setCourseId(e.target.value);
                    setServerErrors(prev => ({ ...prev, courseId: undefined }));
                  }}
                  onBlur={() => {
                    const err = { ...validationErrors };
                    if (!/^\d{6}$/.test(courseId)) err.courseId = "Course ID must be 6 digits (e.g., 012345)";
                    else if (allCourseCodes.some(c => c.course_id === courseId)) err.courseId = "Course ID already exists";
                    else delete err.courseId;
                    setValidationErrors(err);
                  }}
                />
                {(validationErrors.courseId || serverErrors.courseId) && (
                  <div style={{ color: 'red' }}>{validationErrors.courseId || serverErrors.courseId}</div>
                )}
              </label>

              <label>Course Code *
                <input
                  type="text"
                  value={courseCode}
                  onChange={e => {
                    setCourseCode(e.target.value);
                    setServerErrors(prev => ({ ...prev, courseCode: undefined }));
                  }}
                  onBlur={() => {
                    const err = { ...validationErrors };
                    if (!/^[A-Z]{4}\d{4}$/i.test(courseCode)) err.courseCode = "Course Code must be in the format ABCD1234";
                    else if (allCourseCodes.some(c => c.course_code === courseCode)) err.courseCode = "Course Code already exists";
                    else delete err.courseCode;
                    setValidationErrors(err);
                  }}
                />
                {(validationErrors.courseCode || serverErrors.courseCode) && (
                  <div style={{ color: 'red' }}>{validationErrors.courseCode || serverErrors.courseCode}</div>
                )}

              </label>

              <label>Course Title *
                <input
                  type="text"
                  value={courseTitle}
                  onChange={e => setCourseTitle(e.target.value)}
                  onBlur={() => {
                    const err = { ...validationErrors };
                    if (!courseTitle.trim()) err.courseTitle = "Course Title is required";
                    else delete err.courseTitle;
                    setValidationErrors(err);
                  }}
                />
                {validationErrors.courseTitle && <div className="error">{validationErrors.courseTitle}</div>}
              </label>
              <label>Web URL<input type="text" value={webUrl} onChange={e => setWebUrl(e.target.value)} /></label>
              <label>Year *
                <select value={year} onChange={e => setYear(Number(e.target.value))}>
                  {[1, 2, 3, 4, 5].map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </label>
              <label>Credit Points *
                <input type="number" value={creditPoints} onChange={e => setCreditPoints(parseInt(e.target.value))} />
              </label>
              <label>Course Type *
                <Select
                  isMulti
                  value={selectedTypes.map(type => ({ label: type, value: type }))}
                  options={safeCourseTypes.map(t => ({ label: t, value: t }))}
                  onChange={(selected) => {
                    const types = selected.map(item => item.value);
                    setSelectedTypes(types);
                    setSelectedSubTypes(prev =>
                      prev.filter(stVal => {
                        const match = safeSubTypes.find(s => s.value === stVal);
                        return match && types.includes(match.courseType);
                      })
                    );
                  }}

                />
              </label>
              <label>Sub Type *
               <Select
                  isMulti
                  isDisabled={selectedTypes.length === 0}
                  value={selectedSubTypes.map(val => {
                    const match = safeSubTypes.find(st => st.value === val);
                    return match ? { label: match.label, value: match.value, courseType: match.courseType } : null;
                  }).filter(Boolean)}

                  onChange={(selected) => {
                    const unique = Array.from(new Set(selected.map(s => s.value)));
                    setSelectedSubTypes(unique);
                  }}
                  options={groupedSubTypeOptions}
                />




              </label>
            </div>
          )}

          {tab === 2 && (
            <div className="availability-section">
                <label>
                <input type="checkbox" checked={semester1} onChange={() => setSemester1(!semester1)} />
                Semester 1
                </label>
                <label>
                <input type="checkbox" checked={semester2} onChange={() => setSemester2(!semester2)} />
                Semester 2
                </label>
                <label>
                <input type="checkbox" checked={flexTerm} onChange={() => setFlexTerm(!flexTerm)} />
                Flex Term
                </label>

                <div style={{ marginTop: '20px' }}>
                <strong>Pre-requisites</strong>
                <p>
                    {prerequisites.length === 0 || prerequisites.every(g => g.every(code => !code.trim()))
                    ? 'None'
                    : prerequisites.map(group => `(${group.filter(Boolean).join(' OR ')})`).join(' AND ')
                    }
                </p>
                <button onClick={() => setShowPrereqModal(true)}>Edit Pre-requisites</button>
                </div>
            </div>
            )}


          {tab === 3 && (
            <div className="review-summary">
              <h3>Review Course Details</h3>
              <ul>
                <li><strong>Course ID:</strong> {courseId}</li>
                <li><strong>Course Code:</strong> {courseCode}</li>
                <li><strong>Course Title:</strong> {courseTitle}</li>
                <li><strong>Web URL:</strong> {webUrl || 'N/A'}</li>
                <li><strong>Year:</strong> {year}</li>
                <li><strong>Credit Points:</strong> {creditPoints}</li>
                <li><strong>Course Types:</strong> {selectedTypes.join(', ') || 'None'}</li>
                <li><strong>Sub Types:</strong> {selectedSubTypes.join(', ') || 'None'}</li>
                <li><strong>Availability:</strong> {[
                  semester1 ? 'Semester 1' : null,
                  semester2 ? 'Semester 2' : null,
                  flexTerm ? 'Flex Term' : null
                ].filter(Boolean).join(', ') || 'None'}</li>
                <li><strong>Prerequisites:</strong> {
                  prerequisites.length === 0 || prerequisites.every(g => g.every(code => !code.trim()))
                    ? 'None'
                    : prerequisites.map(group => `(${group.filter(Boolean).join(' OR ')})`).join(' AND ')
                }</li>
              </ul>
            </div>
          )}

        </div>

        {/* Actions */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={onClose}>❌ Cancel</button>
          <div>
            {tab > 1 && <button onClick={() => setTab(tab - 1)} style={{ marginRight: '10px' }}>← Back</button>}
            {tab < 3 && (
              <button
                onClick={() => {
                  if (tab === 1) {
                    const err = {};
                    if (!/^\d{6}$/.test(courseId)) err.courseId = "Course ID must be 6 digits (e.g., 012345)";
                    if (!/^[A-Z]{4}\d{4}$/i.test(courseCode)) err.courseCode = "Course Code must be in the format ABCD1234";
                    if (!courseTitle.trim()) err.courseTitle = "Course Title is required";

                    if (Object.keys(err).length > 0) {
                      setValidationErrors(err);
                      return;
                    }
                  }
                  setTab(tab + 1);
                }}
              >
                Next →
              </button>
            )}

            {tab === 3 && (
              <button
                onClick={async () => {
                  const finalErrors = {};
                  if (!/^\d{6}$/.test(courseId)) finalErrors.courseId = "Course ID must be 6 digits (e.g., 012345)";
                  else if (allCourseCodes.some(c => c.course_id === courseId)) finalErrors.courseId = "Course ID already exists";
                  if (!/^[A-Z]{4}\d{4}$/i.test(courseCode)) finalErrors.courseCode = "Course Code must be in the format ABCD1234";
                  else if (allCourseCodes.some(c => c.course_code === courseCode)) finalErrors.courseCode = "Course Code already exists";
                  if (!courseTitle.trim()) finalErrors.courseTitle = "Course Title is required";

                  if (Object.keys(finalErrors).length > 0) {
                    setValidationErrors(finalErrors);
                    return;
                  }

                  const newCourse = {
                    course_id: courseId,
                    course_code: courseCode,
                    course_title: courseTitle,
                    web_url: webUrl || null,
                    year,
                    credit_points: creditPoints,
                    course_type: selectedTypes,
                    sub_type: selectedSubTypes,
                    availability: {
                      semester1,
                      semester2,
                      flexTerm
                    },
                    prerequisites,
                    program_code: programCode 
                  };

                  try {
                    const response = await fetch('http://localhost:3000/courses', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newCourse)
                    });

                    if (!response.ok) {
                      const errorRes = await response.json();
                      const message = errorRes?.message || "Unknown error";

                      // Handle specific known backend messages
                      if (message.includes("Course ID already exists")) {
                        setServerErrors({ courseId: "Course ID already exists" });
                      } else if (message.includes("Course Code already exists")) {
                        setServerErrors({ courseCode: "Course Code already exists" });
                      } else {
                        setServerErrors({ general: message });
                      }

                      setTab(1); // Bring them back to the info tab
                      return;
                    }


                    const savedCourse = await response.json();
                    onCourseCreated(savedCourse.data);  // ✅ only pass the actual course data
                    window.location.reload();           // Optional: if you prefer hard reload
                  } catch (err) {
                    console.error(err);
                    alert("Failed to submit course.");
                  }
                }}

                >
                ✅ Submit
                </button>

            )}
          </div>
        </div>
      </div>
      {showPrereqModal && (
        <PrereqEditorModal
          prerequisites={prerequisites}
          setPrerequisites={setPrerequisites}
          allCourseCodes={allCourseCodes}
          onClose={() => setShowPrereqModal(false)}
          onSave={(updated) => setPrerequisites(updated)}
        />
      )}




    </div>
  );
};

export default CreateCourseModal;
