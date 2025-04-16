import MsDropdown from '../../js/lib/dd';

class MsDropdownBootstrap {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      ...options,
      className: `form-select ${options.className || ''}`.trim(),
    };
    
    // Add Bootstrap classes to the element
    this.element.className = this.options.className;

    // Initialize MsDropdown
    this.dropdown = new MsDropdown(this.element, this.options);
    
    // Add Bootstrap specific event handlers
    this._addBootstrapEventHandlers();
  }

  _addBootstrapEventHandlers() {
    // Find the closest Bootstrap modal or tab element
    const modal = this.element.closest('.modal');
    const tab = this.element.closest('[role=tabpanel]');

    // Handle Bootstrap modal events
    if (modal) {
      modal.addEventListener('shown.bs.modal', () => {
        this.dropdown.refresh();
      });
    }

    // Handle Bootstrap tab events
    if (tab) {
      tab.addEventListener('shown.bs.tab', () => {
        this.dropdown.refresh();
      });
    }
  }

  // Proxy methods to underlying MsDropdown instance
  refresh() {
    this.dropdown.refresh();
  }

  destroy() {
    this.dropdown.destroy();
    delete this.element.msDropdown;
  }

  // Static initialization method
  static init(selector = 'select.ms-dropdown', options = {}) {
    const elements = document.querySelectorAll(selector);
    return Array.from(elements).map(element => new MsDropdownBootstrap(element, options));
  }
}

// Auto-initialize when Bootstrap is loaded
if (typeof bootstrap !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    MsDropdownBootstrap.init();
  });
}

export default MsDropdownBootstrap;
