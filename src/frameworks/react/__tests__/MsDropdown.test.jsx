import React from 'react';
import { render, fireEvent, cleanup, act } from '@testing-library/react';
import MsDropdown from '../MsDropdown';

// Mock the base MsDropdown class
jest.mock('../../../js/lib/dd', () => ({
  __esModule: true,
  default: class MockMsDropdown {
    constructor(element, settings) {
      this.element = element;
      this.settings = settings;
      this.destroy = jest.fn();
      this.refresh = jest.fn();
      element.msDropdown = this;
    }
  }
}));

describe('MsDropdown React Component', () => {
  const defaultProps = {
    options: [
      { text: 'Facebook', value: 'fb', image: 'fb.gif' },
      { text: 'Twitter', value: 'tw', image: 'tw.gif' }
    ],
    name: 'social',
  };

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<MsDropdown {...defaultProps} />);
    expect(container.querySelector('select')).toBeTruthy();
  });

  it('renders all options correctly', () => {
    const { container } = render(<MsDropdown {...defaultProps} />);
    const options = container.querySelectorAll('option');
    expect(options).toHaveLength(defaultProps.options.length);
    options.forEach((option, index) => {
      expect(option.value).toBe(defaultProps.options[index].value);
      expect(option.textContent).toBe(defaultProps.options[index].text);
    });
  });

  it('handles value changes correctly', () => {
    const onChange = jest.fn();
    const { container } = render(<MsDropdown {...defaultProps} onChange={onChange} />);
    const select = container.querySelector('select');
    
    act(() => {
      fireEvent.change(select, { target: { value: 'tw' } });
    });

    expect(onChange).toHaveBeenCalled();
    expect(select.value).toBe('tw');
  });

  it('respects disabled prop', () => {
    const { container } = render(<MsDropdown {...defaultProps} disabled />);
    expect(container.querySelector('select')).toBeDisabled();
  });

  it('handles multiple selection', () => {
    const { container } = render(<MsDropdown {...defaultProps} multiple />);
    const select = container.querySelector('select');
    expect(select.multiple).toBe(true);
  });

  it('applies custom className', () => {
    const className = 'custom-class';
    const { container } = render(<MsDropdown {...defaultProps} className={className} />);
    expect(container.querySelector('select')).toHaveClass(className);
  });

  it('handles required attribute', () => {
    const { container } = render(<MsDropdown {...defaultProps} required />);
    expect(container.querySelector('select')).toBeRequired();
  });

  it('cleans up on unmount', () => {
    const { unmount, container } = render(<MsDropdown {...defaultProps} />);
    const select = container.querySelector('select');
    const destroySpy = jest.spyOn(select.msDropdown, 'destroy');
    
    unmount();
    
    expect(destroySpy).toHaveBeenCalled();
  });
});
