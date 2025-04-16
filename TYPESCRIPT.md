# TypeScript Support for ms-Dropdown

ms-Dropdown now includes TypeScript support, providing type definitions and improved developer experience when using the library in TypeScript projects.

## Features

- Full TypeScript definitions for all components
- Type-safe props and options
- Framework-specific TypeScript implementations (React, Vue, Bootstrap)
- Improved IDE support with autocompletion and type checking

## Usage

### Basic Usage

```typescript
import MsDropdown, { MsDropdownOptions } from 'ms-dropdown';

// Define options with type safety
const options: MsDropdownOptions = {
  imagePosition: 'left',
  showFilterAlways: true
};

// Create a dropdown with type checking
const dropdown = new MsDropdown('#mySelect', options);

// Type-safe property access
const value: string = dropdown.value;
```

### React Component

```tsx
import React from 'react';
import MsDropdown, { MsDropdownOptionProps } from 'ms-dropdown/react';

const App: React.FC = () => {
  // Type-safe options
  const options: MsDropdownOptionProps[] = [
    { text: 'Facebook', value: 'fb', image: './images/fb.gif' },
    { text: 'Twitter', value: 'tw', image: './images/tw.gif' }
  ];

  return (
    <MsDropdown
      options={options}
      value="fb"
      onChange={(e) => console.log(e.target.value)}
      imagePosition="left"
      showFilterAlways={false}
    />
  );
};
```

### Bootstrap Integration

```typescript
import MsDropdownBootstrap from 'ms-dropdown/bootstrap';

// Initialize all dropdowns with Bootstrap styling
MsDropdownBootstrap.init('select.form-select');

// Or create a specific instance
const dropdown = new MsDropdownBootstrap(
  document.querySelector('#myBootstrapSelect'),
  { showFilterAlways: true }
);
```

## Type Definitions

### MsDropdownOptions

```typescript
interface MsDropdownOptions {
  byJson?: {
    data: any[];
    selectedIndex?: number;
  };
  mainCss?: string;
  rowHeight?: number;
  visibleRows?: number;
  showFilterAlways?: boolean;
  enableCheckbox?: boolean;
  childWidth?: number;
  enableAutoFilter?: boolean;
  showIcon?: boolean;
  zIndex?: number;
  event?: string;
  childHeight?: number;
  css?: string;
  imagePosition?: string;
}
```

### React Component Props

```typescript
interface MsDropdownOptionProps {
  text: string;
  value: string;
  image?: string;
  description?: string;
  className?: string;
  title?: string;
  imageCss?: string;
}

interface MsDropdownReactProps {
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
```

## Building TypeScript Files

The project includes TypeScript build scripts in package.json:

```bash
# Type check without emitting files
npm run type-check

# Build declaration files only
npm run build:types

# Build TypeScript files
npm run build:ts
```

## Development

When adding new features or modifying existing ones, please update the TypeScript definitions accordingly. This ensures that TypeScript users get the full benefits of type checking and IDE support.

## Browser Support

The TypeScript version maintains the same browser compatibility as the JavaScript version, with no additional runtime dependencies.

---

For more information on using ms-Dropdown, please refer to the main [README.md](./README.md) file.
