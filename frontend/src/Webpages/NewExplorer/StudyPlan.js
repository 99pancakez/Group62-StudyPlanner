import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import CombinationComponent from '../../Components/Combination/CombinationComponent';
import SemesterComponent from '../../Components/SemesterUI/SemesterComponent';
import './StudyPlan.css';

function StudyPlan() {
  const [semesterCount, setSemesterCount] = useState(() => {
    try {
      const storedData = localStorage.getItem('studyPlanState');
      return storedData ? JSON.parse(storedData).semesterCount : 1;
    } catch (e) {
      return 1;
    }
  });

  const [selectedCourses, setSelectedCourses] = useState(() => {
    const storedSelections = localStorage.getItem('semesterSelections');
    return storedSelections ? JSON.parse(storedSelections) : {};
  });

  const [completedCourses, setCompletedCourses] = useState(() => {
    const storedCompleted = localStorage.getItem('completedCourses');
    return storedCompleted ? JSON.parse(storedCompleted) : [];
  });

  const [coreCredits, setCoreCredits] = useState(0);
  const [majorMinorBreakdown, setMajorMinorBreakdown] = useState([]);
  const [creditProgress, setCreditProgress] = useState({});
  const [combinations, setCombinations] = useState([]);
  const [combinationSelections, setCombinationSelections] = useState(() => {
    const stored = localStorage.getItem('combinationSelections');
    return stored ? JSON.parse(stored) : {};
  });

  const [subTypeGroupMap, setSubTypeGroupMap] = useState({});

  const handleClearCombinationAndMap = () => {
    setCombinationSelections({});
    setSubTypeGroupMap({});
    localStorage.removeItem('combinationSelections');
    localStorage.removeItem('subTypeGroupMap');
  };
  

    const calculateProgramCourseCredits = (selectedCourses) => {
      return Object.values(selectedCourses)
        .flat()
        .filter(course => course.selected_sub_type_id === 17)
        .reduce((sum, course) => sum + (course.credit || 0), 0);
    };

    const calculateTotalCredits = () => {
      const comboCredits = Object.values(creditProgress).reduce((sum, p) => sum + p.earned, 0);
      const programCourseCredits = calculateProgramCourseCredits(selectedCourses);
      return coreCredits + comboCredits + programCourseCredits;
    };

    const handleSubTypeSelectionChange = ({ subTypeId, groupLabel }) => {
      const updatedMap = {
        ...subTypeGroupMap,
        [subTypeId]: groupLabel
      };
      setSubTypeGroupMap(updatedMap);
      localStorage.setItem('subTypeGroupMap', JSON.stringify(updatedMap));
    };
    
    
  // Fetch combinations on mount
  useEffect(() => {
    const fetchCombinations = async () => {
      try {
        const response = await fetch('http://localhost:3000/combinations');
        const data = await response.json();
        setCombinations(data);
      } catch (error) {
        console.error("Error fetching combinations:", error);
      }
    };
    fetchCombinations();
  }, []);

  useEffect(() => {
    const savedMap = localStorage.getItem('subTypeGroupMap');
    if (savedMap) {
      setSubTypeGroupMap(JSON.parse(savedMap));
    }
  }, []);
  

  
  useEffect(() => {
    const allSelectedCourseIds = Object.values(selectedCourses)
      .flatMap(courses => courses.map(course => course.id))
      .filter(id => id !== null && id !== undefined);

    const qnaData = localStorage.getItem('qnaResponses');
    if (qnaData) {
      const parsedQna = JSON.parse(qnaData);
      if (parsedQna.creditCourses) {
        const creditCourseIds = parsedQna.creditCourses
          .split(', ')
          .filter(id => id.trim() !== '');
        allSelectedCourseIds.push(...creditCourseIds);
      }
    }

    setCompletedCourses([...new Set(allSelectedCourseIds)]);

    const coreCourses = Object.values(selectedCourses)
      .flat()
      .filter(course => course.selected_sub_type_id === 1)
      const newCoreCredits = coreCourses.reduce((sum, course) => sum + (course.credit || 0), 0);
      setCoreCredits(newCoreCredits);
    }, [selectedCourses]);

    useEffect(() => {
      if (Object.keys(combinationSelections).length > 0 && combinations.length > 0) {
        const comboId = Object.keys(combinationSelections)[0];
        const currentCombo = combinations.find(c => c.id.toString() === comboId);
  
        if (currentCombo) {
          const progressMap = {};
          const breakdownList = {};
  
          currentCombo.groups.forEach(group => {
            const label = group.label;
            const lowerLabel = label.toLowerCase();
          
            // Default required
            let required = group.credit;
            const isCombo4 = comboId === '4';
          
            let min = null;
            let max = null;
          
            if (isCombo4) {
              if (lowerLabel.includes('cs option')) {
                min = 48;
                max = 96;
              } else if (lowerLabel.includes('elective')) {
                min = 0;
                max = 48;
              }
            }
          
            progressMap[label] = {
              earned: 0,
              required,
              percentage: 0,
              min,
              max
            };
          
            breakdownList[label] = {
              label,
              target: required,
              subTypeIds: group.options.map(opt => opt.sub_type_id)
            };
          });
          
  
          const seenCourseIds = new Set();
  
          if (comboId === '3') {
            const csMinorGroup = Object.keys(progressMap).find(label => label.toLowerCase().includes('cs minor'));
            const csOptionGroup = Object.keys(progressMap).find(label => label.toLowerCase().includes('cs option'));
  
            const csMinorSubTypeIds = breakdownList[csMinorGroup]?.subTypeIds || [];
            const selectedMinorSubTypeId = csMinorSubTypeIds.find(id => {
              return Object.values(selectedCourses).flat().some(course => course.selected_sub_type_id === id);
            });
  
            const updatedMap = { ...subTypeGroupMap };
  
            if (selectedMinorSubTypeId && !updatedMap[selectedMinorSubTypeId]) {
              updatedMap[selectedMinorSubTypeId] = csMinorGroup;
              setSubTypeGroupMap(updatedMap);
              localStorage.setItem('subTypeGroupMap', JSON.stringify(updatedMap));
            }
  
            Object.values(selectedCourses)
              .flat()
              .forEach(course => {
                const selectedId = course.selected_sub_type_id;
                if (!selectedId || seenCourseIds.has(course.id)) return;
  
                if (selectedId === selectedMinorSubTypeId) {
                  progressMap[csMinorGroup].earned += course.credit || 0;
                } else if (selectedId !== 1 && selectedId !== 17) {
                  progressMap[csOptionGroup].earned += course.credit || 0;
                }
  
                seenCourseIds.add(course.id);
              });
          } else {
            Object.values(selectedCourses)
              .flat()
              .forEach(course => {
                const selectedId = course.selected_sub_type_id;
                if (!selectedId || seenCourseIds.has(course.id)) return;
  
                if (comboId === '4') {
                  const electiveGroup = Object.keys(progressMap).find(label => label.toLowerCase().includes('elective'));
                  const csOptionGroup = Object.keys(progressMap).find(label => label.toLowerCase().includes('cs option'));
  
                  if (selectedId === 16 && electiveGroup) {
                    progressMap[electiveGroup].earned += course.credit || 0;
                  } else if (selectedId !== 1 && selectedId !== 17 && csOptionGroup) {
                    progressMap[csOptionGroup].earned += course.credit || 0;
                  }
                  seenCourseIds.add(course.id);
                } 
                
                else {
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
            entry.percentage = Math.min(100, (entry.earned / entry.required) * 100);
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
  
    window.addEventListener('clearNonCoreCourses', handleClearNonCoreCourses);
    return () => {
      window.removeEventListener('clearNonCoreCourses', handleClearNonCoreCourses);
    };
  }, []);


    const handleNextSemester = () => {
    const newCount = semesterCount + 1;
    setSemesterCount(newCount);
    localStorage.setItem('studyPlanState', JSON.stringify({
      semesterCount: newCount
    }));
  };

  const renderSemesters = () => {
    return Array.from({ length: semesterCount }, (_, index) => {
      const semesterNumber = index + 1;
      const semesterYear = Math.ceil(semesterNumber / 2);
      return (
        <SemesterComponent
          key={semesterNumber}
          semesterNumber={semesterNumber}
          semesterYear={semesterYear}
          onNextSemester={semesterNumber === semesterCount ? handleNextSemester : null}
          selectedCourses={selectedCourses}
          setSelectedCourses={setSelectedCourses}
          completedCourses={completedCourses}
        />
      );
    });
  };

  const totalCredits = Object.values(creditProgress).reduce((sum, p) => sum + p.earned, 0) + coreCredits;


  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const selections = JSON.parse(localStorage.getItem('semesterSelections') || '{}');
  
    let overallTotal = 0;
    let yOffset = 20;
  
    doc.setFontSize(14);
    doc.text('Study Plan Report', 14, 10);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 16);
  
    Object.keys(selections).forEach((semesterKey) => {
      const courses = selections[semesterKey];
      const rows = courses.map(course => [
        course.id,
        course.name,
        course.credit
      ]);
  
      const semesterTotal = courses.reduce((sum, course) => sum + (course.credit || 0), 0);
      overallTotal += semesterTotal;
  
      doc.text(`${semesterKey}`, 14, yOffset);
      yOffset += 4;
  
      autoTable(doc, {
        startY: yOffset,
        head: [['Course ID', 'Course Name', 'Credit']],
        body: rows,
        theme: 'grid',
        styles: { fontSize: 10 }
      });
  
      // Use doc.lastAutoTable to get finalY safely
      if (doc.lastAutoTable && doc.lastAutoTable.finalY) {
        yOffset = doc.lastAutoTable.finalY + 6;
      } else {
        yOffset += 20; // fallback
      }
  
      doc.text(`Total: ${semesterTotal} credits`, 14, yOffset);
      yOffset += 10;
    });
  
    doc.text(`Overall Total Credits: ${overallTotal}`, 14, yOffset);
    doc.save('study-plan.pdf');
  };
  
  return (

    
    <div className="study-plan-layout">

     <div className="top-banner">
  <button
    className="download-link"
    onClick={() => {
      window.open('http://localhost:3000/courses/download-courses/BP094P23', '_blank');
    }}
  >
    📄 Download Official Program Course List (PDF)
  </button>
</div>


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
        <div className="credit-breakdown">
  <h4>Credit Breakdown</h4>

  {/* Core */}
  <div className="progress-item">
    <div className="progress-label">
      <span>Core : </span>
      <span>{coreCredits}/180</span>
    </div>
    <div className="progress-bar">
      <div 
        className="progress-fill" 
        style={{ width: `${(coreCredits / 180) * 100}%` }}
      />
    </div>
  </div>

  {/* Program Course */}
  <div className="progress-item">
    <div className="progress-label">
      <span>Program Course : </span>
      <span>{calculateProgramCourseCredits(selectedCourses)}/12</span>
    </div>
    <div className="progress-bar">
      <div 
        className="progress-fill" 
        style={{ width: `${(calculateProgramCourseCredits(selectedCourses) / 12) * 100}%` }}
      />
    </div>
  </div>

  {/* Combo breakdowns */}
  {majorMinorBreakdown.map((item, index) => {
    const progress = creditProgress[item.label] || { earned: 0, required: item.target };
    return (
      <div key={index} className="progress-item">
        <div className="progress-label">
          <span>{item.label} : </span>
          <span>
  {progress.earned}/
  {(progress.min != null && progress.max != null)
    ? `${progress.min}-${progress.max}`
    : (progress.required ?? 'N/A')}
</span>

            {progress.over && (
              <div className="credit-warning">
                ⚠️ Exceeds maximum allowed credits
              </div>
            )}

        </div>
        <div className="progress-bar">
        <div 
            className="progress-fill" 
            style={{ 
              width: `${progress.percentage}%`,
              backgroundColor: progress.over ? 'red' : undefined
            }}
            />
        </div>
      </div>
    );
  })}

  {/* Total */}
  <div className="total-credits">
    <span>Total Credits : </span>
    <span>{calculateTotalCredits()}/288</span>
  </div>
</div>

        </div>
      </div>
      <div className="semester-box">
        <div className="study-plan-container">{renderSemesters()}</div>

        <div className="bottom-right-download">
        <button className="download-btn enhanced" onClick={handleDownloadPDF}>
  <span className="text">Download (PDF)</span>
</button>
</div>
      </div>
    


    </div>
  );
}

export default StudyPlan;