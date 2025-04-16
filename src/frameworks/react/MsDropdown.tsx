import React, { useEffect, useRef } from 'react';
import MsDropdown, { MsDropdownOptions } from '../../js/lib/dd';

// Define interfaces for TypeScript
export interface MsDropdownOptionProps {
  text: string;
  value: string;
  image?: string;
  description?: string;
  className?: string;
  title?: string;
  imageCss?: string;
}

export interface MsDropdownReactProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options?: MsDropdownOptionProps[];
  value?: string | string[];
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
  required?: boolean;
  imagePosition?: string;
  showFilterAlways?: boolean;
}

const MsDropdownReact: React.FC<MsDropdownReactProps> = ({
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
  const selectRef = useRef<HTMLSelectElement>(null);
  const dropdownRef = useRef<MsDropdown | null>(null);

  useEffect(() => {
    if (selectRef.current && !dropdownRef.current) {
      const msDropdownOptions: MsDropdownOptions = {
        imagePosition,
        showFilterAlways,
        ...props
      };
      
      dropdownRef.current = new MsDropdown(selectRef.current, msDropdownOptions);
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

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
          style={option.imageCss ? { '--ms-image-css': option.imageCss } as React.CSSProperties : undefined}
        >
          {option.text}
        </option>
      ))}
    </select>
  );
};

export default MsDropdownReact;
