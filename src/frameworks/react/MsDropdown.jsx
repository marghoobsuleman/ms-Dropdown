import React, { useEffect, useRef } from 'react';
import MsDropdown from '../../js/lib/dd';

const MsDropdownReact = ({
  options = [],
  value,
  onChange,
  name,
  className,
  disabled,
  multiple,
  required,
  imagePosition = 'left',
  showFilterAlways = false,
  ...props
}) => {
  const selectRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (selectRef.current && !dropdownRef.current) {
      dropdownRef.current = new MsDropdown(selectRef.current, {
        imagePosition,
        showFilterAlways,
        ...props
      });
    }
    return () => {
      if (dropdownRef.current) {
        dropdownRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (dropdownRef.current && value !== undefined) {
      dropdownRef.current.value = value;
    }
  }, [value]);

  const handleChange = (event) => {
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <select
      ref={selectRef}
      name={name}
      className={className}
      disabled={disabled}
      multiple={multiple}
      required={required}
      onChange={handleChange}
      {...props}
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          data-image={option.image}
          data-description={option.description}
          className={option.className}
          title={option.title}
          style={option.imageCss ? { '--ms-image-css': option.imageCss } : undefined}
        >
          {option.text}
        </option>
      ))}
    </select>
  );
};

export default MsDropdownReact;
