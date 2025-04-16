import MsDropdownBootstrap from '../MsDropdownBootstrap';
import '@testing-library/jest-dom';

// Mock the base MsDropdown class
const mockDestroy = jest.fn();
const mockRefresh = jest.fn();

jest.mock('../../../js/lib/dd', () => ({
  __esModule: true,
  default: class MockMsDropdown {
    constructor(element: HTMLElement, settings: any) {
      this.element = element;
      this.settings = settings;
      this.destroy = mockDestroy;
      this.refresh = mockRefresh;
    }

    element: HTMLElement;
    settings: any;
    destroy: jest.Mock;
    refresh: jest.Mock;
  }
}));

describe('MsDropdownBootstrap TypeScript Tests', () => {
  let selectElement: HTMLSelectElement;

  beforeEach(() => {
    // Create a fresh select element for each test
    document.body.innerHTML = `
      <select id="bootstrapSelect" class="form-select">
        <option value="fb">Facebook</option>
        <option value="tw">Twitter</option>
        <option value="in">LinkedIn</option>
      </select>
    `;
    
    selectElement = document.getElementById('bootstrapSelect') as HTMLSelectElement;
    
    // Clear mocks
    mockDestroy.mockClear();
    mockRefresh.mockClear();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should initialize with Bootstrap classes', () => {
    const dropdown = new MsDropdownBootstrap(selectElement);
    expect(selectElement.className).toContain('form-select');
  });

  test('should add custom class names', () => {
    const dropdown = new MsDropdownBootstrap(selectElement, { className: 'custom-class' });
    expect(selectElement.className).toContain('form-select');
    expect(selectElement.className).toContain('custom-class');
  });

  test('should call refresh method', () => {
    const dropdown = new MsDropdownBootstrap(selectElement);
    dropdown.refresh();
    expect(mockRefresh).toHaveBeenCalled();
  });

  test('should call destroy method', () => {
    const dropdown = new MsDropdownBootstrap(selectElement);
    dropdown.destroy();
    expect(mockDestroy).toHaveBeenCalled();
  });

  test('should add Bootstrap modal event listeners', () => {
    // Create a modal container
    document.body.innerHTML = `
      <div class="modal">
        <div class="modal-dialog">
          <div class="modal-content">
            <select id="modalSelect" class="form-select">
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
            </select>
          </div>
        </div>
      </div>
    `;
    
    const modalSelect = document.getElementById('modalSelect') as HTMLSelectElement;
    const modal = document.querySelector('.modal') as HTMLElement;
    
    // Spy on addEventListener
    const addEventListenerSpy = jest.spyOn(modal, 'addEventListener');
    
    // Initialize dropdown
    const dropdown = new MsDropdownBootstrap(modalSelect);
    
    // Check if event listener was added
    expect(addEventListenerSpy).toHaveBeenCalledWith('shown.bs.modal', expect.any(Function));
    
    // Clean up
    addEventListenerSpy.mockRestore();
  });

  test('static init method should initialize multiple dropdowns', () => {
    // Create multiple selects
    document.body.innerHTML = `
      <select class="ms-dropdown form-select" id="select1"></select>
      <select class="ms-dropdown form-select" id="select2"></select>
      <select class="ms-dropdown form-select" id="select3"></select>
    `;
    
    // Initialize all dropdowns
    const dropdowns = MsDropdownBootstrap.init();
    
    // Check if all dropdowns were initialized
    expect(dropdowns.length).toBe(3);
    
    // Each should have the form-select class
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
      expect(select.className).toContain('form-select');
    });
  });
});
