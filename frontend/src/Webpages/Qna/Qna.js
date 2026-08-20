// import React, { useState, useEffect } from 'react';
// import './qna.css';
// import { useNavigate } from 'react-router-dom';

// const API_BASE_URL = "http://localhost:3000";

// const programOptions = ['BP094P23'];
// const intakeOptions = ['February (Semester 1)', 'July (Semester 2)'];
// const creditTransferOptions = ['Yes', 'No'];

// const semesterIdMapping = {
//   'February (Semester 1)': 1,
//   'July (Semester 2)': 2
// };

// const colorPalette = [
//   '#FF6F61', '#6B5B95', '#88B04B', '#FF69B4', '#4682B4',
//   '#955251', '#B565A7', '#009B77', '#DD4124', '#45B8AC'
// ];

// function Qna() {
//   const [step, setStep] = useState(0);
//   const nextStep = () => setStep(step + 1);
//   const prevStep = () => setStep(step - 1);
//   const [courses, setCourses] = useState([]);
//   const [suggestions, setSuggestions] = useState([]);
//   const [selectedCourses, setSelectedCourses] = useState([]);
//   const [availableColors, setAvailableColors] = useState([...colorPalette]);
//   const navigate = useNavigate();

//   const getInitialAnswers = () => {
//     try {
//       const saved = localStorage.getItem('qnaResponses');
//       if (!saved) return { program: '', intakeSemester: '', creditTransfer: '', creditCourses: '', semester_id: '' };
//       const parsed = JSON.parse(saved);
//       return {
//         program: programOptions.includes(parsed.program) ? parsed.program : '',
//         intakeSemester: intakeOptions.includes(parsed.intakeSemester) ? parsed.intakeSemester : '',
//         creditTransfer: creditTransferOptions.includes(parsed.creditTransfer) ? parsed.creditTransfer : '',
//         creditCourses: '',
//         semester_id: parsed.intakeSemester ? String(semesterIdMapping[parsed.intakeSemester]) : ''
//       };
//     } catch {
//       return { program: '', intakeSemester: '', creditTransfer: '', creditCourses: '', semester_id: '' };
//     }
//   };

//   const [answers, setAnswers] = useState(getInitialAnswers());

//   useEffect(() => {
//     fetch(`${API_BASE_URL}/qna/courses`)
//       .then(res => res.json())
//       .then((data) => {
//         setCourses(data);
//         const saved = localStorage.getItem('qnaResponses');
//         if (saved) {
//           const parsed = JSON.parse(saved);
//           if (parsed.creditCourses) {
//             const courseIds = [...new Set(parsed.creditCourses.split(', ').filter(id => id))];
//             let tempColors = [...colorPalette];
//             const savedCourses = courseIds.map(id => {
//               const course = data.find(c => c.course_id === id);
//               if (course) {
//                 let color = parsed.courseColors?.[id];
//                 if (!color || !colorPalette.includes(color)) {
//                   const idx = Math.floor(Math.random() * tempColors.length);
//                   color = tempColors[idx];
//                   tempColors.splice(idx, 1);
//                 }
//                 return { ...course, color, course_credit: parsed.courseCredits?.[id] || course.course_credit || 0 };
//               }
//               return null;
//             }).filter(Boolean);
//             setSelectedCourses(savedCourses);
//             setAvailableColors(tempColors);
//           }
//         }
//       })
//       .catch(() => setCourses([]));
//   }, []);

//   const questions = [
//     {
//       label: 'Which program code applies to your degree?',
//       type: 'select',
//       options: programOptions,
//       stateKey: 'program'
//     },
//     {
//       label: 'Which semester will you start in?',
//       type: 'select',
//       options: intakeOptions,
//       stateKey: 'intakeSemester'
//     },
//     {
//       label: 'Will you transfer credits from another institution?',
//       type: 'select',
//       options: creditTransferOptions,
//       stateKey: 'creditTransfer'
//     },
//     {
//       label: 'Which courses would you like to transfer credits for?',
//       type: 'search',
//       stateKey: 'creditCourses'
//     }
//   ];

//   const questionsToShow = questions.filter((q, i) => i !== 3 || answers.creditTransfer === 'Yes');

//   const handleChange = (e, key) => {
//     const value = e.target.value;
//     setAnswers((prev) => {
//       const updated = {
//         ...prev,
//         [key]: value,
//         ...(key === 'creditTransfer' && value !== 'Yes' ? { creditCourses: '' } : {}),
//         ...(key === 'intakeSemester' ? { semester_id: semesterIdMapping[value] || '' } : {})
//       };
//       localStorage.setItem('qnaResponses', JSON.stringify({
//         ...updated,
//         creditCourses: selectedCourses.map(c => c.course_id).join(', '),
//         courseColors: Object.fromEntries(selectedCourses.map(c => [c.course_id, c.color])),
//         courseCredits: Object.fromEntries(selectedCourses.map(c => [c.course_id, c.course_credit]))
//       }));
//       if (key === 'creditCourses') {
//         const filtered = courses.filter(c =>
//           (c.course_id + c.course_title).toLowerCase().includes(value.toLowerCase()) &&
//           !selectedCourses.find(sel => sel.course_id === c.course_id)
//         );
//         setSuggestions(filtered);
//       }
//       return updated;
//     });
//   };

//   const handleSelectCourse = (course) => {
//     if (selectedCourses.find(c => c.course_id === course.course_id)) return;
//     let colors = [...availableColors];
//     const idx = Math.floor(Math.random() * colors.length);
//     const color = colors.splice(idx, 1)[0];
//     const newCourse = { ...course, color };
//     const updatedCourses = [...selectedCourses, newCourse];
//     setSelectedCourses(updatedCourses);
//     setAvailableColors(colors);
//     setSuggestions([]);
//     setAnswers(prev => ({ ...prev, creditCourses: '' }));
//     localStorage.setItem('qnaResponses', JSON.stringify({
//       ...answers,
//       creditCourses: updatedCourses.map(c => c.course_id).join(', '),
//       courseColors: Object.fromEntries(updatedCourses.map(c => [c.course_id, c.color])),
//       courseCredits: Object.fromEntries(updatedCourses.map(c => [c.course_id, c.course_credit]))
//     }));
//   };

//   const handleRemoveCourse = (id) => {
//     const updated = selectedCourses.filter(c => c.course_id !== id);
//     setSelectedCourses(updated);
//     setAvailableColors([...colorPalette]);
//     setAnswers(prev => ({ ...prev, creditCourses: '' }));
//     localStorage.setItem('qnaResponses', JSON.stringify({
//       ...answers,
//       creditCourses: updated.map(c => c.course_id).join(', '),
//       courseColors: Object.fromEntries(updated.map(c => [c.course_id, c.color])),
//       courseCredits: Object.fromEntries(updated.map(c => [c.course_id, c.course_credit]))
//     }));
//   };

//   const isNextDisabled = () => {
//     const current = questionsToShow[step];
//     return current.stateKey === 'creditCourses'
//       ? selectedCourses.length === 0
//       : !answers[current.stateKey];
//   };

//   const handleSubmit = () => {
//     localStorage.removeItem('semesterSelections');
//     localStorage.removeItem('studyPlanState');
//     localStorage.removeItem('combinationSelections');

//     if (answers.creditTransfer === 'No') {
//       localStorage.removeItem('completedCourses');
//       const saved = localStorage.getItem('qnaResponses');
//       if (saved) {
//         const parsed = JSON.parse(saved);
//         delete parsed.creditCourses;
//         delete parsed.courseColors;
//         delete parsed.courseCredits;
//         localStorage.setItem('qnaResponses', JSON.stringify(parsed));
//       }
//     }

//     navigate('/studyplan');
//   };

  

//   return (
//     <div className='qna-border'>
//       <div className='qna-container'>
//         <div className='progress-bar-container'>
//           <div
//             className='progress-bar-fill'
//             style={{ width: `${(step / questionsToShow.length) * 100}%` }}
//           >
//             <span className='progress-text'>{Math.round((step / questionsToShow.length) * 100)}%</span>
//           </div>
//         </div>

//         <div className='step'>
//           <h2>{questionsToShow[step].label}</h2>

//           {questionsToShow[step].type === 'select' && (
//             <select
//               value={answers[questionsToShow[step].stateKey]}
//               onChange={(e) => handleChange(e, questionsToShow[step].stateKey)}
//             >
//               <option value="">Select an option</option>
//               {questionsToShow[step].options.map((option) => (
//                 <option key={option} value={option}>{option}</option>
//               ))}
//             </select>
//           )}

//           {questionsToShow[step].type === 'search' && (
//             <div className="search-container">
//               <input
//                 type="text"
//                 value={answers.creditCourses}
//                 onChange={(e) => handleChange(e, 'creditCourses')}
//                 placeholder="Search for courses (e.g. 053543 or Engineering Mathematics)"
//                 className="search-input"
//                 aria-autocomplete="list"
//                 aria-controls="suggestions-list"
//               />
//               {suggestions.length > 0 ? (
//                 <ul className="suggestions-list" id="suggestions-list" role="listbox">
//                   {suggestions.map((course) => (
//                     <li
//                       key={course.course_id}
//                       onClick={() => handleSelectCourse(course)}
//                       className="suggestion-item"
//                       role="option"
//                       aria-selected={false}
//                     >
//                       <span>{course.course_id} - {course.course_title}</span>
//                       <span>{course.course_credit} credits</span>
//                     </li>
//                   ))}
//                 </ul>
//               ) : answers.creditCourses ? (
//                 <p className="no-results">No matching courses found.</p>
//               ) : null}
//               <div className="selected-courses">
//                 {selectedCourses.map((course) => (
//                   <span
//                     key={course.course_id}
//                     className="course-tag"
//                     style={{ backgroundColor: course.color }}
//                   >
//                     <span
//                       className="remove-course"
//                       onClick={() => handleRemoveCourse(course.course_id)}
//                     >
//                       ✕
//                     </span>
//                     {course.course_title} ({course.course_credit} credits)
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         <div className='navigation-buttons'>
//           <button
//             onClick={prevStep}
//             className='nav-button back-button'
//             disabled={step === 0}
//             aria-disabled={step === 0}
//           >
//             Back
//           </button>
//           {step < questionsToShow.length - 1 ? (
//             <button
//               onClick={nextStep}
//               className='nav-button next-button'
//               disabled={isNextDisabled()}
//             >
//               Next
//             </button>
//           ) : (
//             <button
//               className='nav-button next-button'
//               disabled={isNextDisabled()}
//               onClick={handleSubmit}
//             >
//               Submit
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Qna;

import React, { useState, useEffect } from 'react';
import './qna.css';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = "http://localhost:3000";

const programOptions = ['BP094P23'];
const intakeOptions = ['February (Semester 1)', 'July (Semester 2)'];

const semesterIdMapping = {
  'February (Semester 1)': 1,
  'July (Semester 2)': 2
};

function Qna() {
  const [step, setStep] = useState(0);
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const navigate = useNavigate();

  const getInitialAnswers = () => {
    try {
      const saved = localStorage.getItem('qnaResponses');
      if (!saved) return { program: '', intakeSemester: '', semester_id: '' };
      const parsed = JSON.parse(saved);
      return {
        program: programOptions.includes(parsed.program) ? parsed.program : '',
        intakeSemester: intakeOptions.includes(parsed.intakeSemester) ? parsed.intakeSemester : '',
        semester_id: parsed.intakeSemester ? String(semesterIdMapping[parsed.intakeSemester]) : ''
      };
    } catch {
      return { program: '', intakeSemester: '', semester_id: '' };
    }
  };

  const [answers, setAnswers] = useState(getInitialAnswers());

  const questions = [
    {
      label: 'Which program code applies to your degree?',
      type: 'select',
      options: programOptions,
      stateKey: 'program'
    },
    {
      label: 'Which semester will you start in?',
      type: 'select',
      options: intakeOptions,
      stateKey: 'intakeSemester'
    }
  ];

  const handleChange = (e, key) => {
    const value = e.target.value;
    setAnswers((prev) => {
      const updated = {
        ...prev,
        [key]: value,
        ...(key === 'intakeSemester' ? { semester_id: semesterIdMapping[value] || '' } : {})
      };
      localStorage.setItem('qnaResponses', JSON.stringify(updated));
      return updated;
    });
  };

  const isNextDisabled = () => {
    const current = questions[step];
    return !answers[current.stateKey];
  };

  const handleSubmit = () => {
    localStorage.removeItem('semesterSelections');
    localStorage.removeItem('studyPlanState');
    localStorage.removeItem('combinationSelections');
    navigate('/studyplan');
  };

  return (
    <div className='qna-border'>
      <div className='qna-container'>
        <div className='progress-bar-container'>
          <div
            className='progress-bar-fill'
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          >
            <span className='progress-text'>{Math.round(((step + 1) / questions.length) * 100)}%</span>
          </div>
        </div>

        <div className='step'>
          <h2>{questions[step].label}</h2>

          {questions[step].type === 'select' && (
            <select
              value={answers[questions[step].stateKey]}
              onChange={(e) => handleChange(e, questions[step].stateKey)}
            >
              <option value="">Select an option</option>
              {questions[step].options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          )}
        </div>

        <div className='navigation-buttons'>
          <button
            onClick={prevStep}
            className='nav-button back-button'
            disabled={step === 0}
            aria-disabled={step === 0}
          >
            Back
          </button>
          {step < questions.length - 1 ? (
            <button
              onClick={nextStep}
              className='nav-button next-button'
              disabled={isNextDisabled()}
            >
              Next
            </button>
          ) : (
            <button
              className='nav-button next-button'
              disabled={isNextDisabled()}
              onClick={handleSubmit}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Qna;