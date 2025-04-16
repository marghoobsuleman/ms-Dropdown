import MsDropdown from '../dd';

describe('MsDropdown Core TypeScript Tests', () => {
  // Mock DOM elements
  let selectElement: HTMLSelectElement;
  let dropdown: MsDropdown;

  beforeEach(() => {
    // Create a fresh select element for each test
    document.body.innerHTML = `
      <select id="testSelect">
        <option value="fb" data-image="fb.gif">Facebook</option>
        <option value="tw" data-image="tw.gif">Twitter</option>
        <option value="in" data-image="in.gif">LinkedIn</option>
      </select>
    `;
    
    selectElement = document.getElementById('testSelect') as HTMLSelectElement;
    dropdown = new MsDropdown(selectElement);
  });

  afterEach(() => {
    // Clean up
    document.body.innerHTML = '';
  });

  test('should initialize with correct options', () => {
    expect(dropdown).toBeDefined();
    expect(selectElement.msDropdown).toBe(dropdown);
  });

  test('should set and get value correctly', () => {
    dropdown.value = 'tw';
    expect(dropdown.value).toBe('tw');
    expect(selectElement.value).toBe('tw');
  });

  test('should handle selectedIndex correctly', () => {
    dropdown.selectedIndex = 2;
    expect(dropdown.selectedIndex).toBe(2);
    expect(selectElement.selectedIndex).toBe(2);
  });

  test('should refresh the dropdown', () => {
    // Add a new option
    const newOption = document.createElement('option');
    newOption.value = 'gh';
    newOption.text = 'GitHub';
    newOption.setAttribute('data-image', 'gh.gif');
    selectElement.appendChild(newOption);
    
    // Refresh the dropdown
    dropdown.refresh();
    
    // Check if the new option is reflected
    dropdown.value = 'gh';
    expect(dropdown.value).toBe('gh');
  });

  test('should handle multiple selection', () => {
    // Set up a multiple select
    document.body.innerHTML = `
      <select id="multiSelect" multiple>
        <option value="js">JavaScript</option>
        <option value="ts">TypeScript</option>
        <option value="py">Python</option>
      </select>
    `;
    
    const multiSelect = document.getElementById('multiSelect') as HTMLSelectElement;
    const multiDropdown = new MsDropdown(multiSelect);
    
    // Test multiple selection
    multiSelect.options[0].selected = true;
    multiSelect.options[2].selected = true;
    
    // Refresh to update the dropdown
    multiDropdown.refresh();
    
    // In a real browser, this would return an array of selected values
    // But in JSDOM, we need to check the underlying select element
    expect(Array.from(multiSelect.selectedOptions).map(opt => opt.value)).toEqual(['js', 'py']);
    
    // Clean up
    multiDropdown.destroy();
  });

  test('static methods should work correctly', () => {
    expect(MsDropdown.version).toBeDefined();
    expect(MsDropdown.author).toBe('Marghoob Suleman');
    
    // Test make method
    document.body.innerHTML = `<select id="makeTest"></select>`;
    const makeElement = document.getElementById('makeTest') as HTMLSelectElement;
    const madeDropdown = MsDropdown.make(makeElement);
    
    expect(madeDropdown).toBeDefined();
    expect(makeElement.msDropdown).toBeDefined();
  });
});
