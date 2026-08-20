import React, { useState, useEffect, useRef } from 'react';
import './CombinationComponent.css';

export default function CombinationComponent({ setCombinationSelections, combinations , onSubTypeSelectionChange, onClearCombination }) {

  const [openCombo, setOpenCombo] = useState(null);
  const [openSub, setOpenSub] = useState(null);
  const [selected, setSelected] = useState({});
  const menuRef = useRef(null);

  const EXCLUDED_SUB_TYPES = [1, 17]; 
  const CS_MINOR_IDS = [5,6,7,8,9,10,11,12]; 
  const CS_OPTION_IDS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,16]; 
  const NONCS_MINOR_IDS = [13,14,15];


  useEffect(() => {
    const stored = localStorage.getItem('combinationSelections');
    if (stored) {
      const parsed = JSON.parse(stored);
      const firstComboId = Object.keys(parsed)[0];
      if (firstComboId) {
        const value = parsed[firstComboId];
        const newSelections = {};
        
        const combo = combinations.find(c => c.id.toString() === firstComboId);
        if (combo) {
          combo.groups.forEach(group => {
            const subTypeId = value[group.label];
            if (subTypeId) {
              const option = group.options.find(opt => opt.sub_type_id === subTypeId);
              if (option) newSelections[group.label] = option.sub_type_name;
            }
          });
          
          if (Object.keys(newSelections).length > 0) {
            setSelected({ [firstComboId]: newSelections });
          }
        }
      }
    }
  }, [combinations]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenCombo(null);
        setOpenSub(null);
      }
    };

    const adjustSubmenuPosition = () => {
      const submenus = menuRef.current?.querySelectorAll('.submenu');
      submenus?.forEach((submenu, index) => {
        const parentRect = submenu.parentElement.getBoundingClientRect();
        const submenuRect = submenu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        submenu.style.zIndex = 101 + index;

        const wouldOverflowRight = parentRect.right + submenuRect.width > viewportWidth;
        if (wouldOverflowRight && parentRect.left >= submenuRect.width) {
          submenu.style.left = 'auto';
          submenu.style.right = '100%';
          submenu.style.marginRight = '4px';
          submenu.style.marginLeft = '0';
        } else {
          submenu.style.left = '100%';
          submenu.style.right = 'auto';
          submenu.style.marginLeft = '4px';
          submenu.style.marginRight = '0';
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', adjustSubmenuPosition);

    if (openCombo || openSub !== null) {
      adjustSubmenuPosition();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', adjustSubmenuPosition);
    };
  }, [openCombo, openSub]);

  const getRequiredSelections = (comboId) => {
    const combo = combinations.find(c => c.id.toString() === comboId);
    return combo ? combo.groups.length : 0;
  };

  const handleSelect = (comboId, subTypeName, groupLabel, subTypeId) => {
    // Base selections
    const newComboSelections = {
      ...(selected[comboId] || {}),
      [groupLabel]: subTypeName
    };
  
    // Combination 3: CS Minor → select one manually, others auto-select
    if (comboId === '3') {
      const manuallyChosen = subTypeId || -1;
  
      const autoSelectedIds = CS_OPTION_IDS.filter(id =>
        id !== manuallyChosen && !EXCLUDED_SUB_TYPES.includes(id)
      );
  
      const allGroupOptions = combinations
        .find(c => c.id.toString() === comboId)
        ?.groups.flatMap(g => g.options) || [];
  
      autoSelectedIds.forEach(id => {
        const option = allGroupOptions.find(o => o.sub_type_id === id);
        if (option) {
          newComboSelections[`AutoGroup-${id}`] = option.sub_type_name;
        }
      });
  
      const finalSelections = { [comboId]: newComboSelections };
      setSelected(finalSelections);
  
      const storedCombo = {};
      Object.entries(newComboSelections).forEach(([label, name]) => {
        const opt = allGroupOptions.find(o => o.sub_type_name === name);
        if (opt) storedCombo[label] = opt.sub_type_id;
      });
  
      const updatedStorage = { [comboId]: storedCombo };
      localStorage.setItem('combinationSelections', JSON.stringify(updatedStorage));
      window.dispatchEvent(new Event('combinationUpdated'));
      setCombinationSelections(updatedStorage);
      setOpenCombo(null);
      setOpenSub(null);
      return;
    }
  
    // Combination 4: Auto-select all sub-types except Core/Program
    if (comboId === '4') {
      const autoSelectedIds = [
        ...new Set(
          combinations
            .find(c => c.id.toString() === comboId)
            ?.groups.flatMap(g => g.options.map(o => o.sub_type_id)) || []
        )
      ].filter(id => !EXCLUDED_SUB_TYPES.includes(id));
  
      const allGroupOptions = combinations
        .find(c => c.id.toString() === comboId)
        ?.groups.flatMap(g => g.options) || [];
  
      const autoSelections = {};
  
      autoSelectedIds.forEach(id => {
        const option = allGroupOptions.find(o => o.sub_type_id === id);
        if (option) {
          autoSelections[`AutoGroup-${id}`] = option.sub_type_name;
        }
      });
  
      const finalSelections = { [comboId]: autoSelections };
      setSelected(finalSelections);
  
      const storedCombo = {};
      Object.entries(autoSelections).forEach(([label, name]) => {
        const opt = allGroupOptions.find(o => o.sub_type_name === name);
        if (opt) storedCombo[label] = opt.sub_type_id;
      });
  
      const updatedStorage = { [comboId]: storedCombo };
      localStorage.setItem('combinationSelections', JSON.stringify(updatedStorage));
      window.dispatchEvent(new Event('combinationUpdated'));
      setCombinationSelections(updatedStorage);
      setOpenCombo(null);
      setOpenSub(null);
      return;
    }
  
    // Default (Combo 1 or 2)
    const newState = {
      ...selected,
      [comboId]: newComboSelections
    };
    setSelected(newState);
  
    const storedSelections = JSON.parse(localStorage.getItem('combinationSelections') || '{}');
    const storedCombo = storedSelections[comboId] || {};
    const updatedStoredCombo = {
      ...storedCombo,
      [groupLabel]: subTypeId
    };

    if (onSubTypeSelectionChange && subTypeId && groupLabel) {
      onSubTypeSelectionChange({ subTypeId, groupLabel });
    }
  
    const updatedStorage = {
      ...storedSelections,
      [comboId]: updatedStoredCombo
    };
  
    localStorage.setItem('combinationSelections', JSON.stringify(updatedStorage));
    window.dispatchEvent(new Event('combinationUpdated'));
    setCombinationSelections(updatedStorage);
  
    if (Object.keys(newComboSelections).length === getRequiredSelections(comboId)) {
      setOpenCombo(null);
      setOpenSub(null);
    }
  };
  
  const handleComboHover = (comboId) => {
    setOpenCombo(comboId);
    setOpenSub(null);
  };

  const handleSubHover = (index) => {
    setOpenSub(index);
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    setSelected({});
    localStorage.removeItem('combinationSelections');
    localStorage.removeItem('subTypeGroupMap');
    setCombinationSelections({});
    setOpenCombo(null);
    setOpenSub(null);
  
    // Clear all semester selections except core courses
    const currentSelections = JSON.parse(localStorage.getItem('semesterSelections') || '{}');
    const newSelections = {};
  
    Object.keys(currentSelections).forEach(semester => {
      newSelections[semester] = currentSelections[semester].filter(
        course => course.sub_type_ids?.includes(1)
      );
    });
  
    localStorage.setItem('semesterSelections', JSON.stringify(newSelections));
    window.dispatchEvent(new CustomEvent('clearNonCoreCourses', { detail: { newSelections } }));
  
    // ✅ Clear subTypeGroupMap in parent too
    if (onClearCombination) {
      onClearCombination();
    }
  };
  

  if (combinations.length === 0) {
    return <div className="combination-wrapper">Loading combinations...</div>;
  }

  return (
    <div className="combination-wrapper" ref={menuRef}>
      <div className="menu-root">
        <div
          className="select-trigger"
          onClick={() => setOpenCombo(openCombo ? null : 'root')}
          aria-label="Combination"
        >
          {Object.keys(selected).length > 0 ? (
            <div className="selected-combination-display">
              <span>Selected: {combinations.find(c => c.id.toString() === Object.keys(selected)[0])?.name}</span>
              <button className="clear-button" onClick={clearSelection}>×</button>
            </div>
          ) : (
            'Please choose a combination:'
          )}
        </div>
        {openCombo && (
          <div className="menu-level fade-in">
            {combinations.map((combo) => (
              <div
                key={combo.id}
                className={`menu-item ${selected[combo.id.toString()] ? 'active-combo' : ''}`}
                onMouseEnter={() => handleComboHover(combo.id.toString())}
                onClick={() => {
                  if (combo.id.toString() === '4') {
                    handleSelect('4', '', '', null);
                  }
                }}
                
              >
                <div className="combo-header">
                  <span>{combo.name}</span>
                </div>
                {selected[combo.id.toString()] && (
                  <span className="selected-indicator">✓</span>
                )}
                {openCombo === combo.id.toString() && (
                  <div className="menu-level submenu fade-in">
                    {combo.groups
                      .filter(group => combo.id.toString() !== '3' || group.options.some(opt => CS_MINOR_IDS.includes(opt.sub_type_id)))
                      .map((group, i) => (
                      <div
                        key={group.label}
                        className={`menu-item ${selected[combo.id.toString()]?.[group.label] ? 'active-group' : ''}`}
                        onMouseEnter={() => handleSubHover(i)}
                      >
                        <div className="group-header">
                          <span>{group.label}</span>
                          <span className="group-credit"> ({group.credit} credits)</span>
                        </div>
                        {selected[combo.id.toString()]?.[group.label] && (
                          <span className="selected-sub-indicator">✓</span>
                        )}
                        {openSub === i && (
                          <div className="menu-level submenu fade-in">
                            {group.options.map((opt) => (
                              <div
                                key={opt.sub_type_id}
                                className={`menu-item selectable ${
                                  selected[combo.id.toString()]?.[group.label] === opt.sub_type_name 
                                    ? 'selected' 
                                    : ''
                                }`}
                                onClick={() => handleSelect(
                                  combo.id.toString(),
                                  opt.sub_type_name,
                                  group.label,
                                  opt.sub_type_id
                                )}
                              >
                                <input
                                  type="radio"
                                  className="selectable-radio"
                                  checked={
                                    selected[combo.id.toString()] &&
                                    selected[combo.id.toString()][group.label] === opt.sub_type_name
                                  }
                                  readOnly
                                />
                                {opt.sub_type_name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}