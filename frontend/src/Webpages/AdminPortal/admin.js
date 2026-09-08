import React, { useState, useRef, useEffect } from "react";
import "./admin.css";
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import CreateCourseModal from '../../Components/CreateCourseModal/CreateCourseModal';


const programs = ["BP094P23"];
const columns = [
  "Course Id",
  "Course Code",
  "Course Title",
  "Course Type",
  "Sub Type",
  "Year",
  "Credit Points",
  "Web Url",
  "Semester 1",
  "Semester 2",
  "Flex Term",
  "Pre-requisites"
];

// Define the backend API base URL
const API_BASE_URL = "http://localhost:3000";
const MIN_COLUMN_WIDTH = 100; // Minimum width per column
const DEFAULT_COLUMN_WIDTH = 150; // Default width per column

const AdminPortal = () => {
  const navigate = useNavigate();
  const [selectedProgram, setSelectedProgram] = useState(programs[0]);
  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tableData, setTableData] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [subTypes, setSubTypes] = useState([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  

  const [showSubTypeModal, setShowSubTypeModal] = useState(false);
  const [newSubTypeName, setNewSubTypeName] = useState('');
  const [newSubTypeCourseType, setNewSubTypeCourseType] = useState('');
  const [subTypeTargetRow, setSubTypeTargetRow] = useState(null); // { rowIdx, col }

  const [showRowsMenu, setShowRowsMenu] = useState(false);
  const rowsRef = useRef();

  const [allCourseCodes, setAllCourseCodes] = useState([]);
  const [showPrereqModal, setShowPrereqModal] = useState(false);
  const [structuredPrereqs, setStructuredPrereqs] = useState([]);  // New
  const [activePrereqRowIdx, setActivePrereqRowIdx] = useState(null);  // New
  const [activePrereqCourseId, setActivePrereqCourseId] = useState(null); // NEW


  const [editingCell, setEditingCell] = useState({ row: null, col: null });
  const [tempCellValue, setTempCellValue] = useState("");
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('ascending');
  const [columnWidths, setColumnWidths] = useState(() => {
    // Load from localStorage or use default
    const savedWidths = localStorage.getItem('columnWidths');
    if (savedWidths) {
      return JSON.parse(savedWidths);
    }
    return Object.fromEntries(columns.map(col => [col, DEFAULT_COLUMN_WIDTH]));
  });
  const [clickedButtons, setClickedButtons] = useState({}); // Track clicked state: { [rowIdx-col]: true }

  const filterRef = useRef();
  const columnRef = useRef();
  const resizeRef = useRef(null);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const currentColumn = useRef(null);

  // Save columnWidths to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('columnWidths', JSON.stringify(columnWidths));
  }, [columnWidths]);

  // Ensure columnWidths includes all columns and handles visibility changes
  useEffect(() => {
    setColumnWidths((prev) => {
      const newWidths = { ...prev };
      columns.forEach(col => {
        if (!newWidths[col]) {
          newWidths[col] = DEFAULT_COLUMN_WIDTH;
        }
      });
      // Optional: Remove widths for columns that no longer exist
      Object.keys(newWidths).forEach(col => {
        if (!columns.includes(col)) {
          delete newWidths[col];
        }
      });
      return newWidths;
    });
  }, [visibleColumns]);

  // Fetch course types
  useEffect(() => {
    const fetchCourseTypes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/courses/types`);
        console.log('Course types response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Course types response:', result);
        if (result.success) {
          setCourseTypes(result.data);
          console.log('Set courseTypes:', result.data);
        } else {
          console.error('Failed to fetch course types:', result.message);
        }
      } catch (error) {
        console.error('Error fetching course types:', error.message);
      }
    };

    fetchCourseTypes();
  }, []);

  const fetchSubTypes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/courses/subtypes`);
      const result = await res.json();
      if (result.success) {
        setSubTypes(result.data);
      }
      console.log('📦 subTypes received from backend:', result.data);
    } catch (error) {
      console.error('Error fetching sub types:', error.message);
    }
  };

  useEffect(() => {
    fetchSubTypes(); // valid usage — calling from inside useEffect
  }, []);



  // Fetch courses when selectedProgram changes
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = `${API_BASE_URL}/courses/${selectedProgram}`;
        console.log(`Fetching courses from: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Fetch response:', result);
        if (result.success) {
          setTableData(result.data);
        } else {
          console.error('Failed to fetch courses:', result.message);
          setTableData([]);
          setError(result.message);
        }
      } catch (error) {
        console.error('Error fetching courses:', error.message);
        setTableData([]);
        setError('Failed to load courses. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedProgram !== "__add_new") {
      fetchCourses();
    }
  }, [selectedProgram]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilterMenu(false);
      }
      if (columnRef.current && !columnRef.current.contains(e.target)) {
        setShowColumnMenu(false);
      }
      if (rowsRef.current && !rowsRef.current.contains(e.target)) {
      setShowRowsMenu(false);
    }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleColumn = (column) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const updateCourseField = async (courseId, field, values) => {
  const payload = {};

  if (field === 'Course Type') {
    const uniqueValues = [...new Set(values.map(v => v.value))]; // remove duplicates
    payload.course_type = uniqueValues;
  }
  if (field === 'Sub Type') {
    const uniqueValues = [...new Set(values.map(v => v.value))];
    payload.sub_type = uniqueValues;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!result.success) {
      console.error('Failed to update:', result.message);
      return false;
    } else {
      console.log('Updated successfully:', result.message);
      // Update tableData with the server's response
      setTableData((prev) =>
        prev.map(row =>
          row['Course Id'] === courseId ? { ...row, [field]: payload[field.toLowerCase().replace(' ', '_')] } : row
        )
      );
      return true;
    }
  } catch (err) {
    console.error('Error updating course:', err.message);
    return false;
  }
};



  const handleCellChange = async (courseId, colKey, newValue, originalValue) => {
    console.log('🛠️ Editing cell', { courseId, colKey, newValue });

    if (!courseId) {
      console.warn('⚠️ No courseId provided — skipping update');
      return;
    }

    // Optimistic UI update
    setTableData(prev =>
      prev.map(row =>
        row['Course Id'] === courseId ? { ...row, [colKey]: newValue } : row
      )
    );

    const payload = {};
    if (colKey === 'Course Code') payload.course_code = newValue;
    if (colKey === 'Course Title') payload.course_title = newValue;
    if (colKey === 'Web Url') payload.web_url = newValue;
    if (colKey === 'Course Type') payload.course_type = newValue;
    if (colKey === 'Sub Type') payload.sub_type = [...new Set(newValue)];
    if (colKey === 'Semester 1') payload.semester_1 = newValue;
    if (colKey === 'Semester 2') payload.semester_2 = newValue;
    if (colKey === 'Flex Term') payload.flex_term = newValue;
    if (colKey === 'Pre-requisites') payload.prerequisites = newValue;
    if (colKey === 'Year') payload.year = parseInt(newValue);
    if (colKey === 'Credit Points') payload.credit_points = parseInt(newValue);

    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!result.success) {
        console.error('Failed to update course:', result.message);
        setError(result.message);
        setTableData(prev =>
          prev.map(row =>
            row['Course Id'] === courseId ? { ...row, [colKey]: originalValue } : row
          )
        );
      }
    } catch (err) {
      console.error('Error updating course:', err.message);
      setError('Failed to update course. Please try again.');
      setTableData(prev =>
        prev.map(row =>
          row['Course Id'] === courseId ? { ...row, [colKey]: originalValue } : row
        )
      );
    }
  };



  const handleCellBlur = () => {
    setEditingCell({ row: null, col: null });
  };

  const handleKeyDown = (e, rowIdx, colKey, originalValue, courseId) => {
    if (e.key === "Enter") {
      setEditingCell({ row: null, col: null });
      if (tempCellValue !== originalValue) {
        handleCellChange(courseId, colKey, tempCellValue, originalValue);
      }
    }
  };


  const handleOpenPrereqModal = async (courseId, rowIdx) => {
    try {
      const res = await fetch(`${API_BASE_URL}/courses/${courseId}/prerequisites/structured`);
      const result = await res.json();
      if (result.success) {
        let prereqs = result.data;

        // ✅ Normalize: ensure it's always an array of arrays
        if (Array.isArray(prereqs) && prereqs.every(item => typeof item === "string")) {
          prereqs = [prereqs];
        }

        setStructuredPrereqs(prereqs);
        setActivePrereqRowIdx(rowIdx);
        setActivePrereqCourseId(courseId);
        setShowPrereqModal(true);
      } else {
        alert('Failed to fetch prerequisites');
      }
    } catch (err) {
      console.error('Error fetching prereqs:', err);
      alert('Failed to open prerequisite modal.');
    }
  };


  const toggleRowSelection = (courseId) => {
    setSelectedRows((prev) =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };


  const toggleSelectAll = () => {
    const filteredIds = sortedData.map(row => row['Course Id']);
    if (selectedRows.length === filteredIds.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredIds);
    }
  };


  const deleteSelectedRows = async () => {
    const failed = [];

    for (const courseId of selectedRows) {
      try {
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        if (!result.success) {
          failed.push(courseId);
        }
      } catch (err) {
        console.error(`Delete request failed for ${courseId}:`, err);
        failed.push(courseId);
      }
    }

    // Refresh
    try {
      const refreshed = await fetch(`${API_BASE_URL}/courses/${selectedProgram}`);
      const json = await refreshed.json();
      if (json.success) {
        setTableData(json.data);
      }
    } catch (e) {
      console.error('Failed to refresh after delete', e);
    }

    setSelectedRows([]);

    if (failed.length > 0) {
      alert(`Failed to delete the following course(s): ${failed.join(', ')}`);
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      // Toggle direction if the same column is clicked
      setSortDirection(sortDirection === 'ascending' ? 'descending' : 'ascending');
    } else {
      // Set new sort column and default to ascending
      setSortColumn(column);
      setSortDirection('ascending');
    }
  };

  const handleResizeStart = (e, column) => {
    e.preventDefault();
    startX.current = e.clientX;
    startWidth.current = columnWidths[column];
    currentColumn.current = column;
    resizeRef.current = e.target.parentElement;

    const handleMouseMove = (e) => {
      const delta = e.clientX - startX.current;
      const newWidth = Math.max(MIN_COLUMN_WIDTH, startWidth.current + delta);
      setColumnWidths((prev) => ({
        ...prev,
        [currentColumn.current]: newWidth
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      resizeRef.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleOpenLink = (url, rowIdx, col) => {
    if (url && url.trim() !== '') {
      window.open(url, '_blank', 'noopener,noreferrer');
      setClickedButtons((prev) => ({ ...prev, [`${rowIdx}-${col}`]: true }));
      setTimeout(() => {
        setClickedButtons((prev) => {
          const newState = { ...prev };
          delete newState[`${rowIdx}-${col}`];
          return newState;
        });
      }, 1000);
    }
  };

  const handleCopyText = (text, rowIdx, col) => {
    if (text && text.trim() !== '') {
      navigator.clipboard.writeText(text).then(
        () => {
          console.log('Text copied to clipboard:', text);
          setClickedButtons((prev) => ({ ...prev, [`${rowIdx}-${col}`]: true }));
          setTimeout(() => {
            setClickedButtons((prev) => {
              const newState = { ...prev };
              delete newState[`${rowIdx}-${col}`];
              return newState;
            });
          }, 1000);
        },
        (err) => {
          console.error('Failed to copy text:', err);
        }
      );
    }
  };

  const sortableColumns = [
  'Course Code',
  'Course Title',
  'Course Type',
  'Sub Type',
  'Year',
  'Credit Points',
  'Web Url'
];

const filteredData = tableData.filter(row =>
  visibleColumns.some(col =>
    col.includes('Semester') || col === 'Flex Term' || col === 'Pre-requisites'
      ? false
      : row[col]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  )
);

const sortedData = [...filteredData].sort((a, b) => {
  if (!sortColumn) return 0;
  const valueA = a[sortColumn]?.toString().toLowerCase() || '';
  const valueB = b[sortColumn]?.toString().toLowerCase() || '';
  return sortDirection === 'ascending'
    ? valueA.localeCompare(valueB)
    : valueB.localeCompare(valueA);
});


  useEffect(() => {
    const fetchCourseCodes = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/courses/allCourseCodes`);
        const result = await res.json();
        if (result.success) {
          setAllCourseCodes(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch course codes:', err);
      }
    };

    fetchCourseCodes();
  }, []);


  return (
    <div className="admin-portal">
      <header className="header">
        <div className="header-left">
          <select
            className="program-dropdown"
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
          >
            {programs.map((program) => (
              <option key={program} value={program}>{program}</option>
            ))}
            <option value="__add_new">+ Add a program</option>
          </select>
        </div>
        <div className="header-right">
         <button className="history-button" onClick={() => navigate('/history')}>
           View Admin History
         </button>
        </div>
      </header>

      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 20px' }}>
        <button className="add-course-button" onClick={() => setShowCreateModal(true)}>
          + Add Course
        </button>
      </div>



      <div className="toolbar">
        <input
          type="text"
          className="search-box"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="dropdown-container" ref={columnRef}>
          <button className="dropdown-toggle" onClick={() => setShowColumnMenu((prev) => !prev)}>Columns 🔽</button>
          {showColumnMenu && (
            <ul className="dropdown-menu">
              {columns.map((col) => (
                <li key={col}>
                  <label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(col)}
                      onChange={() => toggleColumn(col)}
                    />
                    {col}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

      <div className="table-container">
        <div className="course-table">
          {isLoading ? (
            <div>Loading courses...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : sortedData.length === 0 ? (
            <div>No courses found</div>
          ) : (
            <>
              <div className="table-header">
                <div
                  className="table-cell header-cell checkbox-cell"
                  style={{ width: '40px' }}
                >
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={
                      sortedData.length > 0 &&
                      sortedData.every(row => selectedRows.includes(row['Course Id']))
                    }
                    indeterminate={
                      sortedData.some(row => selectedRows.includes(row['Course Id'])) &&
                      !sortedData.every(row => selectedRows.includes(row['Course Id']))
                    }

                  />
                </div>
                {visibleColumns.map((col) => (
                  <div
                    key={col}
                    className={`table-cell header-cell ${sortableColumns.includes(col) ? 'sortable' : ''} ${['Semester 1', 'Semester 2', 'Flex Term', 'Pre-requisites', 'Course Code'].includes(col) ? 'center-align-cell' : ''}`}
                    style={{ width: `${columnWidths[col]}px` }}
                    onClick={(e) => {
                      // Only sort if the click wasn't on the resize handle
                      if (!e.target.classList.contains('resize-handle') && sortableColumns.includes(col)) {
                        handleSort(col);
                      }
                    }}
                  >
                    {col}
                    {sortColumn === col && (
                      <span className="sort-indicator">
                        {sortDirection === 'ascending' ? ' 🔼' : ' 🔽'}
                      </span>
                    )}
                    <span
                      className="resize-handle"
                      onMouseDown={(e) => {
                        e.stopPropagation(); // Prevent the click event from bubbling up
                        handleResizeStart(e, col);
                      }}
                    />
                  </div>
                ))}
              </div>

              {sortedData.map((row, rowIdx) => (
                <div key={row['Course Id']} className="table-row">
                  <div
                    className="table-cell checkbox-cell"
                    style={{ width: '40px' }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row['Course Id'])}
                      onChange={() => toggleRowSelection(row['Course Id'])}
                    />


                  </div>
                  {visibleColumns.map((col) => (
                    <div
                      key={col}
                      className={`table-cell ${col === 'Course Code' ? 'course-code-cell' : ''} ${['Semester 1', 'Semester 2', 'Flex Term', 'Pre-requisites', 'Course Code'].includes(col) ? 'center-align-cell' : ''}`}
                      style={{ width: `${columnWidths[col]}px` }}
                      onClick={(e) => {
                        const tag = e.target.tagName;

                        // 🚫 Block edit mode for Pre-requisites column
                        if (col === 'Pre-requisites') {
                          return;
                        }

                        // ✅ Allow editing for other cells unless the click was on a button/icon
                        if (!col.includes('Semester') && col !== 'Flex Term' && !['BUTTON', 'SVG', 'PATH'].includes(tag)) {
                          setEditingCell({ row: rowIdx, col });
                          setTempCellValue(row[col] || "");
                        }
                      }}

                    >
                      {col.includes('Semester') || col === 'Flex Term' ? (
                        <input
                          type="checkbox"
                          checked={row[col]}
                          onChange={(e) => handleCellChange(row['Course Id'], col, e.target.checked, row[col])}
                          disabled={row['Course Id'] === null}
                        />
                      ) : col !== 'Course Id' && editingCell.row === rowIdx && editingCell.col === col ? (
                        col === 'Year' ? (
                          <input
                            type="number"
                            value={tempCellValue}
                            onChange={(e) => setTempCellValue(e.target.value)}
                            onBlur={handleCellBlur}
                            onKeyDown={(e) => handleKeyDown(e, rowIdx, col, row[col], row['Course Id'])}
                            autoFocus
                          />
                        ) : col === 'Course Type' ? (
                          <Select
  isMulti
  menuPlacement="auto"
  menuPortalTarget={document.body} // Render dropdown in body
  value={(Array.isArray(row[col]) ? row[col] : typeof row[col] === 'string' ? [row[col]] : [])
    .filter(Boolean)
    .map(val => ({ label: val, value: val }))}
  options={courseTypes
    .filter((v, i, self) => self.indexOf(v) === i)
    .map(t => ({ label: t, value: t }))}

  onChange={(selectedOptions) => {
  const uniqueOptions = Array.from(new Map(selectedOptions.map(item => [item.label, item])).values());
  const selectedTypes = uniqueOptions.map(o => o.value);

  // Update Course Type
  const updated = [...tableData];
  const actualRowIdx = tableData.findIndex(row => row['Course Id'] === sortedData[rowIdx]['Course Id']);
  updated[actualRowIdx][col] = selectedTypes;

  // Update Sub Type: Keep only sub-types that correspond to the selected course types
  const currentSubTypes = Array.isArray(updated[actualRowIdx]['Sub Type']) ? updated[actualRowIdx]['Sub Type'] : [];
  const validSubTypes = subTypes
    .filter(st => selectedTypes.includes(st.courseType))
    .map(st => st.value);
  updated[actualRowIdx]['Sub Type'] = currentSubTypes.filter(st => validSubTypes.includes(st));

  setTableData(updated);

  if (row['Course Id']) {
    updateCourseField(row['Course Id'], col, uniqueOptions);
    updateCourseField(row['Course Id'], 'Sub Type', updated[actualRowIdx]['Sub Type'].map(val => ({ label: val, value: val })));
  }

  setEditingCell({ row: null, col: null });
}}


  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleKeyDown(e, rowIdx, col, row[col], row['Course Id']);
    }
  }}
  onBlur={() => setEditingCell({ row: null, col: null })}
  autoFocus
  className="multi-select"
/>


                        ) : col === 'Sub Type' ? (
<Select
  isMulti
  menuPlacement="auto"
  menuPortalTarget={document.body} // Render dropdown in body
  value={(Array.isArray(row[col]) ? row[col] : typeof row[col] === 'string' ? [row[col]] : [])
    .filter(Boolean)
    .map(val => ({ label: val, value: val }))}
  options={[
    ...(() => {
      const seen = new Set();
      const selectedTypes = Array.isArray(row['Course Type']) ? row['Course Type'] : [];
      const options = [];

      // Add selected Course Types as non-selectable headers
      selectedTypes.forEach(type => {
        options.push({ 
          label: `${type}`, // Plaintext header
          value: `header-${type}`, // Unique value to prevent selection
          isBold: false,
          isDisabled: true // Mark as non-selectable
        });

        // Add a subtle divider with reduced gap
        options.push({ 
          label: '<hr style="margin: 2px 0; border: 0; border-top: 1px solid #e0e0e0;" />', 
          value: `divider-${type}`, 
          isDivider: true,
          isDisabled: true 
        });

        // Add corresponding subTypes for this Course Type as bold
        subTypes
          .filter(st => st.courseType === type)
          .forEach(st => {
            if (!seen.has(st.value)) {
              seen.add(st.value);
              options.push({ label: `<strong>${st.label}</strong>`, value: st.value, fontSize: 'smaller' });
            }
          });

        // Special case: If Course Type is "University Elective" or "Program Course", add it as a subType
        if (type === "University Elective" || type === "Program Course") {
          if (!seen.has(type)) {
            seen.add(type);
            options.push({ label: `<strong>${type}</strong>`, value: type, fontSize: 'smaller' });
          }
        }
      });

      // Add "+ Create New Sub Type" option
      options.push({ label: '+ Create New Sub Type', value: '__create_new__' });

      return options;
    })(),
  ]}
  isDisabled={!row['Course Type'] || (Array.isArray(row['Course Type']) && row['Course Type'].length === 0)}
  formatOptionLabel={({ label, isBold, fontSize, isDivider }) => (
    <span 
      style={{ 
        display: 'block', // Ensure consistent block layout
        fontSize: fontSize || '14px', // Base font size, smaller for sub-types
        backgroundColor: isBold === false ? '#ffffff' : 'transparent', // White background for headers
        color: isBold === false ? '#000000' : '#333333', // Black for headers, dark grey for sub-types
        padding: isBold === false ? '6px 10px' : '4px 10px', // More padding for headers, less for options
        fontWeight: isBold === false ? 'normal' : 'bold', // Plaintext headers, bold options
        borderRadius: isBold === false ? '4px' : '0', // Slight rounding for headers
        margin: isDivider ? '0' : '1px 0', // Reduced spacing between options
        border: isBold === false ? '1px solid #e0e0e0' : 'none' // Subtle border for headers
      }}
      dangerouslySetInnerHTML={{ __html: isBold !== false || isDivider ? label : label }} 
    />
  )}
  onChange={(selectedOptions) => {
    if (selectedOptions.some(o => o.value === '__create_new__')) {
      setShowSubTypeModal(true);
      setSubTypeTargetRow({ rowIdx, col });
      return;
    }

    // Deduplicate by value (case-insensitive and trimmed)
    const uniqueOptions = Array.from(
      new Map(
        selectedOptions.map(item => [item.value.trim().toLowerCase(), item])
      ).values()
    );

    // Use trimmed, clean values for saving
    const values = uniqueOptions.map(o => o.value.trim());

    const updated = [...tableData];
    updated[rowIdx][col] = values;
    setTableData(updated);

    if (row['Course Id']) {
      updateCourseField(row['Course Id'], col, uniqueOptions);
    }

    setEditingCell({ row: null, col: null });
  }}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleKeyDown(e, rowIdx, col, row[col], row['Course Id']);
    }
  }}
  onBlur={() => setEditingCell({ row: null, col: null })}
  autoFocus
  className="multi-select"
/>



                        ) : (
                          <input
                            value={editingCell.row === rowIdx && editingCell.col === col ? tempCellValue : row[col] || ""}
                            onChange={(e) => setTempCellValue(e.target.value)}
                            onBlur={handleCellBlur}
                            onKeyDown={(e) => handleKeyDown(e, rowIdx, col, row[col], row['Course Id'])}
                            autoFocus
                          />
                        )
                      ) : col === 'Web Url' ? (
                        <div className="url-cell">
                          <span className="url-text">{row[col] || ""}</span>
                          {row[col] && row[col].trim() !== '' && (
                            <button
                              className="link-button"
                              onClick={() => handleOpenLink(row[col], rowIdx, col)}
                              title="Open link in new tab"
                              aria-label="Open link in new tab"
                            >
                              {clickedButtons[`${rowIdx}-${col}`] ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="link-icon success-icon"
                                >
                                  <path d="M5 12h14" />
                                  <path d="M12 5l7 7-7 7" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="link-icon"
                                >
                                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>
                        
                     ) : col === 'Pre-requisites' ? (
                      <button
                        className="prereq-button"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent cell click from triggering edit mode
                          handleOpenPrereqModal(row['Course Id'], rowIdx);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#1a0dab',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          padding: 0
                        }}
                      >
                        {row[col] && row[col] !== '-' ? row[col] : 'Edit'}
                      </button>

                      ) : col === 'Course Code' || col === 'Course Title' ? (
                        <div className="text-cell">
                          <span className="text-content">{row[col] || ""}</span>
                          {row[col] && row[col].trim() !== '' && (
                            <button
                              className="copy-button"
                              onClick={() => handleCopyText(row[col], rowIdx, col)}
                              title="Copy text"
                              aria-label="Copy text to clipboard"
                            >
                              {clickedButtons[`${rowIdx}-${col}`] ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="copy-icon success-icon"
                                >
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="copy-icon"
                                >
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>
                      ) : col === 'Course Id' ? (
                        <div className="text-cell">
                          <span className="text-content course-code-cell">{row[col] || ""}</span>
                          {row[col] && row[col].trim() !== "" && (
                            <button
                              className="copy-button"
                              onClick={() => handleCopyText(row[col], rowIdx, col)}
                              title="Copy Course ID"
                              aria-label="Copy Course ID"
                              style={{ marginLeft: '6px' }}
                            >
                              {clickedButtons[`${rowIdx}-${col}`] ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="green"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="black"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>
                      ) : col === 'Course Type' || col === 'Sub Type' ? (
                        [...new Set(
                          (Array.isArray(row[col])
                            ? row[col]
                            : typeof row[col] === 'string'
                              ? row[col].split(',')
                              : []
                          ).map(t => t.trim())
                        )].join(', ')
                      ) : (
                        row[col] || ""
                      )


                    }</div> 
                  ))}
                </div> 
              ))} 
            </> 
          )}
        </div>
                
        </div>

      {selectedRows.length > 0 && (
        <div className="bulk-actions">
          <div>
            <span>{selectedRows.length} selected</span>
            <button onClick={deleteSelectedRows}>Delete</button>
          </div>
        </div>
      )}

      {showSubTypeModal && (
        <>
          {console.log('✅ SubType modal is being rendered')}
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Create New Sub Type</h2>
              <input
                type="text"
                placeholder="Sub Type Name"
                value={newSubTypeName}
                onChange={(e) => setNewSubTypeName(e.target.value)}
              />
              <select
                value={newSubTypeCourseType}
                onChange={(e) => setNewSubTypeCourseType(e.target.value)}
              >
                <option value="">Select Course Type</option>
                {courseTypes.map(ct => (
                  <option key={ct} value={ct}>{ct}</option>
                ))}
              </select>

              <div className="modal-actions">
                <button
                  onClick={async () => {
                    console.log('🟢 Create button clicked');
                    if (!newSubTypeName || !newSubTypeCourseType) {
                      alert('Both fields are required');
                      return;
                    }

                    try {
                      const res = await fetch(`${API_BASE_URL}/courses/subtypes`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          sub_type_name: newSubTypeName,
                          course_type: newSubTypeCourseType
                        })
                      });
                      const result = await res.json();
                      console.log('Subtype POST result:', result);

                      if (result.success) {
                        await fetchSubTypes(); // refresh list

                        if (subTypeTargetRow) {
                          const { rowIdx, col } = subTypeTargetRow;

                          const currentValues = Array.isArray(tableData[rowIdx][col]) ? tableData[rowIdx][col] : [];
                          const deduped = [...new Set([...currentValues, newSubTypeName])];

                          // Update the table visually
                          setTableData(prev => {
                            const updated = [...prev];
                            updated[rowIdx][col] = deduped;
                            return updated;
                          });

                          // Save to backend
                          handleCellChange(rowIdx, col, deduped, currentValues);
                        }


                        // Close and reset modal
                        setShowSubTypeModal(false);
                        setNewSubTypeName('');
                        setNewSubTypeCourseType('');
                        setSubTypeTargetRow(null);
                      } else {
                        alert('Failed to create: ' + result.message);
                      }
                    } catch (err) {
                      alert('Server error');
                      console.error('Error while creating subtype:', err);
                    }
                  }}
                >

                  ✅ Create
                </button>

                <button
                  onClick={() => {
                    console.log('❌ Cancel button clicked');
                    setShowSubTypeModal(false);
                    setNewSubTypeName('');
                    setNewSubTypeCourseType('');
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}

{showPrereqModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Edit Prerequisites</h2>

      <div className="prereq-groups">
        {structuredPrereqs.map((orGroup, idx) => (
          <div key={idx} className="or-group">
            {orGroup.map((code, i) => (
              <div key={i} className="course-input">
                <div className="course-input-wrapper">
                  <Select
                    menuPlacement="auto"
                    value={code ? { label: code, value: code } : null}
                    options={allCourseCodes.map((code) => ({
                      label: code,
                      value: code,
                    }))}
                    onChange={(selectedOption) => {
                      const updated = [...structuredPrereqs];
                      updated[idx][i] = selectedOption ? selectedOption.value : '';
                      setStructuredPrereqs(updated);
                    }}
                    placeholder={`Course ${i + 1}`}
                    className="course-select"
                    isClearable
                  />
                  <button
                    className="close-course-button"
                    onClick={() => {
                      const updated = [...structuredPrereqs];
                      updated[idx].splice(i, 1);
                      if (updated[idx].length === 0) {
                        updated.splice(idx, 1);
                      }
                      if (updated.length === 0) {
                        updated.push(['']);
                      }
                      setStructuredPrereqs(updated);
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
                const updated = [...structuredPrereqs];
                updated[idx].push('');
                setStructuredPrereqs(updated);
              }}
            >
              +OR
            </button>
            <button
              className="remove-group-button"
              onClick={() => {
                const updated = [...structuredPrereqs];
                updated.splice(idx, 1); // Remove the entire OR group
                if (updated.length === 0) {
                  updated.push(['']); // Ensure at least one OR group remains
                }
                setStructuredPrereqs(updated);
              }}
            >
              Remove
            </button>
          </div>
        ))}
        <div className="and-button-container">
          <button
            className="and-button"
            onClick={() => setStructuredPrereqs([...structuredPrereqs, ['']])}
          >
            +AND
          </button>
        </div>
      </div>

      <div className="summary-box">
        Summary: {structuredPrereqs.length === 0 || structuredPrereqs.every(group => group.every(code => !code.trim()))
          ? 'None'
          : structuredPrereqs
              .filter(group => group.some(code => code.trim()))
              .map(group => `(${group.filter(code => code.trim()).join(' OR ')})`)
              .join(' AND ')}
      </div>

      <div className="modal-actions">
        <button
          onClick={async () => {
            const courseId = activePrereqCourseId; // INSTEAD OF using tableData[activePrereqRowIdx]
            const clean = structuredPrereqs
              .map(group => group.map(code => code.trim()).filter(Boolean))
              .filter(group => group.length > 0);

            try {
              const res = await fetch(`${API_BASE_URL}/courses/${courseId}/prerequisites/structured`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prerequisites: clean }),
              });

              const result = await res.json();
              if (result.success) {
                // ✅ Reload table data from server to reflect updated prereqs
                const refreshed = await fetch(`${API_BASE_URL}/courses/${selectedProgram}`);
                const json = await refreshed.json();
                if (json.success) {
                  setTableData(json.data);
                }

                setShowPrereqModal(false);
                setActivePrereqCourseId(null);
              } else {
                alert(result.message);
              }
            } catch (err) {
              alert('Failed to update prerequisites');
              console.error(err);
            }
          }}
        >
          ✅ Save
        </button>


        <button
          onClick={() => {
            setShowPrereqModal(false);
            setStructuredPrereqs([]);
            setActivePrereqCourseId(null);
          }}
        >
          ❌ Cancel
        </button>
      </div>
    </div>
  </div>
)}


{showCreateModal && (
  <CreateCourseModal
    onClose={() => setShowCreateModal(false)}
    onCourseCreated={async (newCourse) => {
      try {
        const res = await fetch(`${API_BASE_URL}/courses/${selectedProgram}`);
        const json = await res.json();
        if (json.success) {
          setTableData(json.data); // This now includes the real courseId
          console.log('✅ Refreshed tableData with:', json.data.map(c => c['Course Id']));
        }
      } catch (e) {
        console.error('Failed to refresh after course creation', e);
      }
      setShowCreateModal(false);
    }}

    courseTypes={courseTypes}
    subTypes={subTypes}
    programCode={selectedProgram}
  />
)}

    </div>
  );
};

export default AdminPortal;