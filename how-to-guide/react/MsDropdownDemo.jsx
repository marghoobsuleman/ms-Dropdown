import React, { useState } from 'react';
import MsDropdown from '../../src/frameworks/react/MsDropdown';

/**
 * ms-Dropdown React Example Component
 * This component demonstrates various ways to use ms-Dropdown in a React application
 */
const MsDropdownDemo = () => {
  // Basic example state
  const [selected, setSelected] = useState('');
  
  // Multiple selection state
  const [multiSelected, setMultiSelected] = useState([]);
  
  // Custom styling state
  const [themeSelected, setThemeSelected] = useState('light');
  
  // Dynamic options state
  const [fruits, setFruits] = useState([
    { text: 'Apple', value: 'apple', image: '../../dist/images/icons/icon_home.gif' },
    { text: 'Orange', value: 'orange', image: '../../dist/images/icons/icon_cart.gif' }
  ]);
  const [fruitSelected, setFruitSelected] = useState('apple');
  
  // Social media options for basic example
  const socialOptions = [
    { text: 'Facebook', value: 'fb', image: '../../dist/images/icons/icon_email.gif' },
    { text: 'Twitter', value: 'tw', image: '../../dist/images/icons/icon_faq.gif' },
    { text: 'LinkedIn', value: 'li', image: '../../dist/images/icons/icon_games.gif' }
  ];
  
  // Programming languages for multiple selection
  const languageOptions = [
    { text: 'JavaScript', value: 'js', image: '../../dist/images/icons/icon_home.gif' },
    { text: 'TypeScript', value: 'ts', image: '../../dist/images/icons/icon_cart.gif' },
    { text: 'Python', value: 'py', image: '../../dist/images/icons/icon_search.gif' },
    { text: 'Ruby', value: 'rb', image: '../../dist/images/icons/icon_print.gif' }
  ];
  
  // Theme options for custom styling
  const themeOptions = [
    { text: 'Light Theme', value: 'light', image: '../../dist/images/icons/icon_home.gif' },
    { text: 'Dark Theme', value: 'dark', image: '../../dist/images/icons/icon_cart.gif' },
    { text: 'Blue Theme', value: 'blue', image: '../../dist/images/icons/icon_search.gif' }
  ];
  
  // Handler for basic dropdown change
  const handleChange = (e) => {
    setSelected(e.target.value);
    console.log('Selected:', e.target.value);
  };
  
  // Handler for multiple selection change
  const handleMultiChange = (e) => {
    // Get all selected options from the select element
    const selectedValues = Array.from(e.target.selectedOptions).map(option => option.value);
    setMultiSelected(selectedValues);
    console.log('Multiple selected:', selectedValues);
  };
  
  // Handler for theme change
  const handleThemeChange = (e) => {
    setThemeSelected(e.target.value);
    console.log('Theme changed to:', e.target.value);
    
    // You could apply theme changes to your app here
    document.body.className = e.target.value + '-theme';
  };
  
  // Handler for fruit selection
  const handleFruitChange = (e) => {
    setFruitSelected(e.target.value);
  };
  
  // Function to add a new fruit option
  const addFruit = () => {
    const newFruits = [...fruits, {
      text: 'Banana',
      value: 'banana',
      image: '../../dist/images/icons/icon_search.gif'
    }];
    setFruits(newFruits);
  };
  
  return (
    <div className="ms-dropdown-demo">
      <h1>ms-Dropdown React Example</h1>
      
      <div className="example-section">
        <h2>Basic Example</h2>
        <div className="demo-container">
          <MsDropdown
            options={socialOptions}
            value={selected}
            onChange={handleChange}
            showFilterAlways={true}
          />
          <p>Selected value: {selected}</p>
        </div>
        <pre>
          <code>{`
// Basic Example
const [selected, setSelected] = useState('');

const handleChange = (e) => {
  setSelected(e.target.value);
};

<MsDropdown
  options={socialOptions}
  value={selected}
  onChange={handleChange}
  showFilterAlways={true}
/>
          `}</code>
        </pre>
      </div>
      
      <div className="example-section">
        <h2>Multiple Selection</h2>
        <div className="demo-container">
          <MsDropdown
            options={languageOptions}
            value={multiSelected}
            onChange={handleMultiChange}
            multiple={true}
            enableCheckbox={true}
            showFilterAlways={true}
          />
          <p>Selected values: {multiSelected.join(', ')}</p>
        </div>
        <pre>
          <code>{`
// Multiple Selection
const [multiSelected, setMultiSelected] = useState([]);

const handleMultiChange = (e) => {
  const selectedValues = Array.from(e.target.selectedOptions).map(option => option.value);
  setMultiSelected(selectedValues);
};

<MsDropdown
  options={languageOptions}
  value={multiSelected}
  onChange={handleMultiChange}
  multiple={true}
  enableCheckbox={true}
  showFilterAlways={true}
/>
          `}</code>
        </pre>
      </div>
      
      <div className="example-section">
        <h2>Custom Styling</h2>
        <div className="demo-container">
          <MsDropdown
            options={themeOptions}
            value={themeSelected}
            onChange={handleThemeChange}
            imagePosition="right"
            className="custom-dropdown"
          />
        </div>
        <pre>
          <code>{`
// Custom Styling
<MsDropdown
  options={themeOptions}
  value={themeSelected}
  onChange={handleThemeChange}
  imagePosition="right"
  className="custom-dropdown"
/>
          `}</code>
        </pre>
      </div>
      
      <div className="example-section">
        <h2>Dynamic Options</h2>
        <div className="demo-container">
          <MsDropdown
            options={fruits}
            value={fruitSelected}
            onChange={handleFruitChange}
          />
          <button onClick={addFruit}>Add New Fruit</button>
        </div>
        <pre>
          <code>{`
// Dynamic Options
const [fruits, setFruits] = useState([
  { text: 'Apple', value: 'apple', image: '../../dist/images/icons/icon_home.gif' },
  { text: 'Orange', value: 'orange', image: '../../dist/images/icons/icon_cart.gif' }
]);

const addFruit = () => {
  setFruits([...fruits, {
    text: 'Banana',
    value: 'banana',
    image: '../../dist/images/icons/icon_search.gif'
  }]);
};

<MsDropdown
  options={fruits}
  value={fruitSelected}
  onChange={handleFruitChange}
/>
<button onClick={addFruit}>Add New Fruit</button>
          `}</code>
        </pre>
      </div>
      
      <style jsx>{`
        .ms-dropdown-demo {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .example-section {
          margin-bottom: 30px;
          padding: 20px;
          border: 1px solid #eee;
          border-radius: 5px;
        }
        
        h1, h2 {
          color: #333;
        }
        
        .demo-container {
          margin: 20px 0;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 5px;
        }
        
        pre {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          overflow: auto;
        }
        
        code {
          font-family: 'Courier New', Courier, monospace;
        }
        
        button {
          padding: 8px 16px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin: 5px 0;
        }
        
        button:hover {
          background-color: #45a049;
        }
        
        .custom-dropdown {
          border: 2px solid #3498db;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default MsDropdownDemo;
