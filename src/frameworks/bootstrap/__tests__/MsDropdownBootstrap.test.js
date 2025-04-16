import MsDropdownBootstrap from '../MsDropdownBootstrap';

describe('MsDropdownBootstrap', () => {
  let element;
  
  beforeEach(() => {
    element = document.createElement('select');
    element.className = 'ms-dropdown form-select';
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
    jest.clearAllMocks();
  });

  it('initializes without crashing', () => {
    const dropdown = new MsDropdownBootstrap(element);
    expect(dropdown).toBeTruthy();
    expect(dropdown.element).toBe(element);
  });

  it('adds Bootstrap classes correctly', () => {
    const dropdown = new MsDropdownBootstrap(element);
    expect(element.classList.contains('form-select')).toBe(true);
  });

  it('handles custom options', () => {
    const options = {
      className: 'custom-class',
      imagePosition: 'right'
    };
    const dropdown = new MsDropdownBootstrap(element, options);
    expect(element.classList.contains('custom-class')).toBe(true);
  });

  it('initializes multiple elements with static init method', () => {
    // Create multiple elements
    const element2 = document.createElement('select');
    element2.className = 'ms-dropdown form-select';
    document.body.appendChild(element2);

    const dropdowns = MsDropdownBootstrap.init();
    expect(dropdowns).toHaveLength(2);
    expect(dropdowns[0]).toBeInstanceOf(MsDropdownBootstrap);
    expect(dropdowns[1]).toBeInstanceOf(MsDropdownBootstrap);

    document.body.removeChild(element2);
  });

  it('handles Bootstrap modal events', () => {
    const dropdown = new MsDropdownBootstrap(element);
    const refreshSpy = jest.spyOn(dropdown.dropdown, 'refresh');

    // Simulate Bootstrap modal shown event
    dropdown.dropdown.refresh();

    expect(refreshSpy).toHaveBeenCalled();
  });

  it('handles Bootstrap tab events', () => {
    const dropdown = new MsDropdownBootstrap(element);
    const refreshSpy = jest.spyOn(dropdown.dropdown, 'refresh');

    // Simulate Bootstrap tab shown event
    dropdown.dropdown.refresh();

    expect(refreshSpy).toHaveBeenCalled();
  });

  it('cleans up properly on destroy', () => {
    const dropdown = new MsDropdownBootstrap(element);
    const originalDropdown = element.msDropdown;
    
    dropdown.destroy();
    
    expect(element.msDropdown).not.toBe(originalDropdown);
    expect(element.msDropdown).toBeUndefined();
  });

  it('refreshes correctly', () => {
    const dropdown = new MsDropdownBootstrap(element);
    const refreshSpy = jest.spyOn(dropdown.dropdown, 'refresh');
    
    dropdown.refresh();
    
    expect(refreshSpy).toHaveBeenCalled();
  });
});
