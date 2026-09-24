import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import './styles.css';

const INITIAL_OPTIONS = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  name: `Option ${index + 1}`,
  checked: false
}));

function MultiSelectDropdown() {
  const [options, setOptions] = useState(INITIAL_OPTIONS);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const [submittedData, setSubmittedData] = useState('');

  const dropdownRef = useRef(null);
  const selectedCount = options.filter(opt => opt.checked).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCheckboxChange = (id) => {
    setOptions(prevOptions =>
      prevOptions.map(opt =>
        opt.id === id ? { ...opt, checked: !opt.checked } : opt
      )
    );
  };

  const handleReset = () => {
    setOptions(INITIAL_OPTIONS);
    setError('');
    setSubmittedData('');
  };

  const handleSubmit = () => {
    const selectedNames = options
      .filter(opt => opt.checked)
      .map(opt => opt.name.trim());

    if (selectedNames.length === 0) {
      setError('Please select at least one option.');
      setSubmittedData('');
    } else {
      setError('');
      setSubmittedData(`Selected: ${selectedNames.join(', ')}`);
    }
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <h2 className="dropdown-title">Multiselect Dropdown Menu</h2>

      <label className="dropdown-label" data-testid="label">
        Select Options:
      </label>

      <div className="dropdown-wrapper">
        <button
          className="dropdown-toggle"
          data-testid="dropdown-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDown
            data-testid="dropdown-icon"
            className={`dropdown-icon ${isOpen ? 'rotate' : ''}`}
          />
          <span className="dropdown-button-label">
            {selectedCount === 0 ? 'Choose Options' : `${selectedCount} selected`}
          </span>
        
        </button>

        {isOpen && (
          <ul className="dropdown-menu" data-testid="dropdown-menu">
            <li
              className="dropdown-reset"
              data-testid="reset-button"
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
            >
              Reset Selection
            </li>

            {options.map((val) => (
              <li
                className="dropdown-option"
                key={val.id}
                data-testid={`option-${val.name}`}
                onClick={() => handleCheckboxChange(val.id)}
                style={{ cursor: 'pointer' }}
              >
                <input
                  type="checkbox"
                  checked={val.checked}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => handleCheckboxChange(val.id)}
                />
                <span className="option-label" style={{ marginLeft: '10px' }}>
                  {val.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        className="submit-button"
        data-testid="submit-button"
        onClick={handleSubmit}
      >
        Submit
      </button>

      <div className="result-area">
        {error && (
          <div className="error-message" data-testid="error-message">
            {error}
          </div>
        )}
        {submittedData && (
          <div className="selected-options" data-testid="selected-options">
            {submittedData}
          </div>
        )}
      </div>
    </div>
  );
}

export default MultiSelectDropdown;
