/**
 * ms-Dropdown TypeScript Example
 * 
 * This file demonstrates how to use ms-Dropdown with TypeScript.
 * To run this example:
 * 1. Compile with TypeScript: tsc index.ts
 * 2. Include the compiled JavaScript in your HTML
 */

import MsDropdown, { MsDropdownOptions, MsDropdownElement } from '../../src/js/lib/dd';

// Example 1: Basic Usage
function basicExample(): void {
  // Define options with type safety
  const options: MsDropdownOptions = {
    showFilterAlways: true,
    visibleRows: 5,
    imagePosition: 'left'
  };

  // Create a dropdown with type checking
  const dropdown = new MsDropdown('#basicDropdown', options);

  // Type-safe property access
  const value: string = dropdown.value;
  console.log(`Selected value: ${value}`);

  // Type-safe method calls
  dropdown.refresh();
}

// Example 2: Multiple Selection
function multipleSelectionExample(): void {
  const multiOptions: MsDropdownOptions = {
    enableCheckbox: true,
    showFilterAlways: true
  };

  const multiDropdown = new MsDropdown('#multipleDropdown', multiOptions);
  
  // Get selected values (will be an array for multiple selection)
  const selectedValues = multiDropdown.value;
  console.log('Selected values:', selectedValues);
  
  // Set selected indexes for multiple selection
  const selectElement = document.getElementById('multipleDropdown') as HTMLSelectElement;
  if (selectElement && selectElement.msDropdown) {
    selectElement.msDropdown.selectedIndex = [0, 2]; // Select first and third options
  }
}

// Example 3: Creating from JSON
function createFromJsonExample(): void {
  // Type-safe JSON data
  interface DropdownItem {
    text: string;
    value: string;
    image?: string;
    description?: string;
    title?: string;
    className?: string;
  }

  const jsonData: DropdownItem[] = [
    { text: 'Facebook', value: 'fb', image: '../../dist/images/icons/icon_email.gif' },
    { text: 'Twitter', value: 'tw', image: '../../dist/images/icons/icon_faq.gif' },
    { text: 'LinkedIn', value: 'li', image: '../../dist/images/icons/icon_games.gif' }
  ];

  // Create dropdown from JSON with type safety
  MsDropdown.make('#jsonDropdown', {
    byJson: {
      data: jsonData,
      selectedIndex: 0
    }
  });
}

// Example 4: Adding Options Dynamically
function addOptionExample(): void {
  const dropdown = new MsDropdown('#dynamicDropdown');
  
  // Add a new option with type checking
  dropdown.add({
    text: 'New Option',
    value: 'new',
    image: '../../dist/images/icons/icon_search.gif',
    description: 'This is a new option'
  });
}

// Example 5: Custom Extension with TypeScript
class CustomDropdown extends MsDropdown {
  private customTheme: string;
  
  constructor(element: string | MsDropdownElement, options: MsDropdownOptions & { customTheme?: string } = {}) {
    super(element, options);
    this.customTheme = options.customTheme || 'default';
    this.applyCustomTheme();
  }
  
  private applyCustomTheme(): void {
    console.log(`Applied custom theme: ${this.customTheme}`);
    // Implementation would go here
  }
  
  // Override refresh method
  public refresh(): void {
    console.log('Custom refresh called');
    super.refresh();
  }
  
  // Add new methods
  public setTheme(theme: string): void {
    this.customTheme = theme;
    this.applyCustomTheme();
    this.refresh();
  }
}

// Usage of custom extension
function customExtensionExample(): void {
  const customDropdown = new CustomDropdown('#customDropdown', {
    customTheme: 'dark',
    showFilterAlways: true
  });
  
  customDropdown.setTheme('light');
}

// Initialize all examples
document.addEventListener('DOMContentLoaded', () => {
  basicExample();
  multipleSelectionExample();
  createFromJsonExample();
  addOptionExample();
  customExtensionExample();
});
