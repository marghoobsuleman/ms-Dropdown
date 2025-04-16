import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MsDropdown from '../MsDropdown';
import '@testing-library/jest-dom';

// Mock the base MsDropdown class
const mockDestroy = jest.fn();
const mockRefresh = jest.fn();
const mockSetValue = jest.fn();

jest.mock('../../../js/lib/dd', () => ({
  __esModule: true,
  default: class MockMsDropdown {
    constructor(element: HTMLElement, settings: any) {
      this.element = element;
      this.settings = settings;
      this.destroy = mockDestroy;
      this.refresh = mockRefresh;
      this._value = '';
    }

    element: HTMLElement;
    settings: any;
    destroy: jest.Mock;
    refresh: jest.Mock;
    _value: string | string[];

    set value(val: string | string[]) {
      this._value = val;
      mockSetValue(val);
    }

    get value(): string | string[] {
      return this._value;
    }
  }
}));

describe('MsDropdown React Component TypeScript Tests', () => {
  const defaultProps = {
    options: [
      { text: 'Facebook', value: 'fb', image: 'fb.gif' },
      { text: 'Twitter', value: 'tw', image: 'tw.gif' }
    ],
    name: 'social'
  };

  beforeEach(() => {
    mockDestroy.mockClear();
    mockRefresh.mockClear();
    mockSetValue.mockClear();
  });

  test('renders without crashing', () => {
    render(<MsDropdown {...defaultProps} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('renders all options correctly', () => {
    render(<MsDropdown {...defaultProps} />);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(defaultProps.options.length);
    
    options.forEach((option, index) => {
      expect(option).toHaveValue(defaultProps.options[index].value);
      expect(option).toHaveTextContent(defaultProps.options[index].text);
      expect(option).toHaveAttribute('data-image', defaultProps.options[index].image);
    });
  });

  test('handles value prop correctly', () => {
    render(<MsDropdown {...defaultProps} value="tw" />);
    expect(mockSetValue).toHaveBeenCalledWith('tw');
  });

  test('handles onChange events', () => {
    const handleChange = jest.fn();
    render(<MsDropdown {...defaultProps} onChange={handleChange} />);
    
    // Simulate a change event
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'tw' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  test('respects disabled prop', () => {
    render(<MsDropdown {...defaultProps} disabled={true} />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  test('handles multiple selection', () => {
    render(<MsDropdown {...defaultProps} multiple={true} />);
    expect(screen.getByRole('listbox')).toHaveAttribute('multiple');
  });

  test('applies custom className', () => {
    const className = 'custom-class';
    render(<MsDropdown {...defaultProps} className={className} />);
    expect(screen.getByRole('combobox')).toHaveClass(className);
  });

  test('cleans up on unmount', () => {
    const { unmount } = render(<MsDropdown {...defaultProps} />);
    unmount();
    expect(mockDestroy).toHaveBeenCalled();
  });
});
