
export const API_BASE_URL = "http://localhost:3000";

export const CREDITS = {
  SEMESTER_LOAD: 48,
  CORE_TOTAL: 180,
  PROGRAM_COURSE_TOTAL: 12,
  TOTAL_DEGREE: 288,
  COMBO4_CS_OPTION_MIN: 48,
  COMBO4_CS_OPTION_MAX: 96,
  COMBO4_ELECTIVE_MIN: 0,
  COMBO4_ELECTIVE_MAX: 48,
};

export const SUB_TYPE = { CORE: 1, UNIVERSITY_ELECTIVE: 16, PROGRAM_COURSE: 17 };

export const COMBINATIONS = { SELECT_MINOR: '3', SELECT_ALL: '4' };

export const EXCLUDED_SUB_TYPES = [SUB_TYPE.CORE, SUB_TYPE.PROGRAM_COURSE];

export const SUB_TYPE_NAME_TO_ID = Object.entries(SUB_TYPE_MAP).reduce(
  (acc, [id, name]) => {
    acc[name] = parseInt(id);
    return acc;
  },
  {}
);


export const PROGRAM_CODE = 'BP094P23';

export const INTAKE_OPTIONS = ['February (Semester 1)', 'July (Semester 2)'];

export const INTAKE_TO_SEMESTER_ID = {
  'February (Semester 1)': 1,
  'July (Semester 2)': 2
};


/**
* Global constant to standardise accesing localStorage
*/
export const LOCALS = {
  studyPlanState: 'studyPlanState',
  semesterSelections: 'semesterSelections',
  completedCourses: 'completedCourses',
  combinationSelections: 'combinationSelections',
  subTypeGroupMap: 'subTypeGroupMap',
  qnaResponses: 'qnaResponses',
};


export const SUB_TYPE_MAP = {
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
