/**
 * ms-Dropdown Vue TypeScript Integration
 * This file provides TypeScript support for the Vue component
 */

import MsDropdownVue from './MsDropdown.vue';

// Export component types
export interface MsDropdownOption {
  text: string;
  value: string;
  image?: string;
  description?: string;
  title?: string;
  className?: string;
  imageCss?: string;
}

export interface MsDropdownProps {
  options: MsDropdownOption[];
  modelValue?: string | number | string[];
  name?: string;
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
  required?: boolean;
  imagePosition?: string;
  showFilterAlways?: boolean;
}

// Export the Vue component
export default MsDropdownVue;
