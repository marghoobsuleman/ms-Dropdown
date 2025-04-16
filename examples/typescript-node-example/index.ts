/**
 * ms-Dropdown TypeScript Node.js Example
 * 
 * This example demonstrates how to use ms-Dropdown in a TypeScript Node.js project.
 * Note: This is for demonstration purposes only, as ms-Dropdown is primarily a browser library.
 */

import MsDropdown, { MsDropdownOptions } from '../../src/js/lib/dd';

// Define a mock document and window for Node.js environment
// In a real project, you would use jsdom or a similar library
global.document = {
  createElement: () => ({}),
  querySelector: () => ({
    appendChild: () => {},
    addEventListener: () => {}
  }),
  querySelectorAll: () => []
} as any;

global.window = {
  getComputedStyle: () => ({})
} as any;

// Example usage with TypeScript
function createDropdown(): void {
  try {
    // Define options with type safety
    const options: MsDropdownOptions = {
      showFilterAlways: true,
      visibleRows: 5,
      imagePosition: 'left'
    };

    // Create a dropdown with type checking
    const dropdown = new MsDropdown('#exampleDropdown', options);

    // Type-safe property access
    console.log(`Selected index: ${dropdown.selectedIndex}`);

    // Add a new option with type checking
    dropdown.add({
      text: 'New Option',
      value: 'new',
      image: 'path/to/image.png',
      description: 'This is a new option'
    });

    // Type-safe method calls
    dropdown.refresh();

    console.log('Dropdown created successfully!');
  } catch (error) {
    console.error('Error creating dropdown:', error);
  }
}

// Example of creating a dropdown from JSON data
function createDropdownFromJson(): void {
  try {
    // Type-safe JSON data
    const jsonData = [
      { text: 'Facebook', value: 'fb', image: './images/fb.gif' },
      { text: 'Twitter', value: 'tw', image: './images/tw.gif' },
      { text: 'LinkedIn', value: 'li', image: './images/in.gif' }
    ];

    // Create dropdown from JSON
    MsDropdown.make('#jsonDropdown', {
      byJson: {
        data: jsonData,
        selectedIndex: 0
      }
    });

    console.log('JSON dropdown created successfully!');
  } catch (error) {
    console.error('Error creating JSON dropdown:', error);
  }
}

// Run examples
createDropdown();
createDropdownFromJson();

// Example of TypeScript interfaces for custom extensions
interface CustomDropdownOptions extends MsDropdownOptions {
  customTheme?: string;
  animationSpeed?: number;
}

class CustomDropdown extends MsDropdown {
  private customOptions: CustomDropdownOptions;

  constructor(element: string | HTMLSelectElement, options: CustomDropdownOptions = {}) {
    super(element, options);
    this.customOptions = options;
    this.applyCustomTheme();
  }

  private applyCustomTheme(): void {
    if (this.customOptions.customTheme) {
      console.log(`Applied custom theme: ${this.customOptions.customTheme}`);
    }
  }

  public setAnimationSpeed(speed: number): void {
    this.customOptions.animationSpeed = speed;
    console.log(`Animation speed set to: ${speed}ms`);
  }
}

// Usage of custom extension
const customDropdown = new CustomDropdown('#customDropdown', {
  customTheme: 'dark',
  animationSpeed: 300,
  showFilterAlways: true
});

customDropdown.setAnimationSpeed(500);
