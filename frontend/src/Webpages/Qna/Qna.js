import { useState } from 'react';
import './qna.css';
import { useNavigate } from 'react-router-dom';
import { INTAKE_OPTIONS, INTAKE_TO_SEMESTER_ID, LOCALS, PROGRAM_CODE } from '../../constants';

const programOptions = [PROGRAM_CODE];


function Qna() {
  const [step, setStep] = useState(0);
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const navigate = useNavigate();

  const getInitialAnswers = () => {
    try {
      const saved = localStorage.getItem(LOCALS.qnaResponses);
      if (!saved) return { program: '', intakeSemester: '', semester_id: '' };
      const parsed = JSON.parse(saved);
      return {
        program: programOptions.includes(parsed.program) ? parsed.program : '',
        intakeSemester: INTAKE_OPTIONS.includes(parsed.intakeSemester) ? parsed.intakeSemester : '',
        semester_id: parsed.intakeSemester ? String(INTAKE_TO_SEMESTER_ID[parsed.intakeSemester]) : ''
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
      options: INTAKE_OPTIONS,
      stateKey: 'intakeSemester'
    }
  ];

  const handleChange = (e, key) => {
    const value = e.target.value;
    setAnswers((prev) => {
      const updated = {
        ...prev,
        [key]: value,
        ...(key === 'intakeSemester' ? { semester_id: INTAKE_TO_SEMESTER_ID[value] || '' } : {})
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
    localStorage.removeItem(LOCALS.semesterSelections);
    localStorage.removeItem(LOCALS.studyPlanState);
    localStorage.removeItem(LOCALS.combinationSelections);
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
