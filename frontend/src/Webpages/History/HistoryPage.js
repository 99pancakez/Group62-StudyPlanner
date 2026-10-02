import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './history.css';

export default function HistoryPage() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [expandedGroups, setExpandedGroups] = useState({});
  const navigate = useNavigate(); 

  useEffect(() => {
    fetch('http://localhost:3000/history')
      .then(res => res.json())
      .then((data) => {
        setLogs(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, rowsPerPage]);

  const filteredLogs = logs.filter(h =>
    h.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.field_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.old_value?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.new_value?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedMap = new Map();

  for (const log of filteredLogs) {
    const key = `${log.course}_${log.time_stamp}_${log.admin_id}`;
    if (!groupedMap.has(key)) {
      groupedMap.set(key, []);
    }
    groupedMap.get(key).push(log);
  }

  const allGroups = Array.from(groupedMap.values());
  const totalPages = rowsPerPage === 'All' ? 1 : Math.ceil(allGroups.length / rowsPerPage);
  const paginatedGroups = rowsPerPage === 'All'
    ? allGroups
    : allGroups.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const formatFieldName = (snake) => {
    if (!snake) return '';
    return snake
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Admin History</h1>
        <button className="back-button" onClick={() => navigate('/admin')}>
          ← Back to Admin Portal
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search history logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="history-search-input"
        />
      </div>

      <div className="table-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Course Title</th>
              <th>Field</th>
              <th>Old Value</th>
              <th>Updated Value</th>
            </tr>
          </thead>
          <tbody>
            {paginatedGroups.map((group, index) => {
              const first = group[0];
              const groupKey = `${first.course}_${first.time_stamp}`;
              const fieldNames = group.map(log => log.field_name);
              const courseFields = ['course_code', 'course_title', 'web_url', 'course_credit', 'year'];

              const isCreateGroup = courseFields.every(field => fieldNames.includes(field)) &&
                                    group.every(log => log.old_value === '' || log.old_value === null);

              const isDeleteGroup = courseFields.every(field => fieldNames.includes(field)) &&
                                    group.every(log => log.new_value === '' || log.new_value === null);

              if (isCreateGroup || isDeleteGroup) {
                return (
                  <React.Fragment key={groupKey}>
                    <tr className="group-row" onClick={() => setExpandedGroups(prev => ({
                      ...prev,
                      [groupKey]: !prev[groupKey]
                    }))}>
                      <td colSpan="5" style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                        {expandedGroups[groupKey] ? '▼' : '▶'} Course {isCreateGroup ? 'Created' : 'Deleted'}: {first.new_value || first.old_value || 'Unknown'} — {new Date(first.time_stamp).toLocaleString()}
                      </td>
                    </tr>
                    {expandedGroups[groupKey] && group.map((log, i) => (
                      <tr key={`${groupKey}_${i}`} className="nested-log-row">
                        <td>{new Date(log.time_stamp).toLocaleString()}</td>
                        <td>{log.course}</td>
                        <td>{formatFieldName(log.field_name)}</td>
                        <td style={{ whiteSpace: 'pre-wrap' }}>{log.old_value || '-'}</td>
                        <td style={{ whiteSpace: 'pre-wrap' }}>{log.new_value || '-'}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              }

              return group.map((log, i) => (
                <tr key={`${groupKey}_${i}`}>
                  <td>{new Date(log.time_stamp).toLocaleString()}</td>
                  <td>{log.course}</td>
                  <td>{formatFieldName(log.field_name)}</td>
                  <td>{log.old_value || '-'}</td>
                  <td>{log.new_value || '-'}</td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>

      <div className="history-pagination-controls">
        <label>
          Rows per page:
          <select
            value={rowsPerPage}
            onChange={(e) => {
              const value = e.target.value === 'All' ? 'All' : parseInt(e.target.value);
              setRowsPerPage(value);
            }}
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="All">All</option>
          </select>
        </label>

        {rowsPerPage !== 'All' && totalPages > 1 && (
          <div className="page-buttons">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
              ← Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
