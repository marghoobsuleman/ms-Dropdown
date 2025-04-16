import MsDropdown, { MsDropdownOptions } from '../../js/lib/dd';

// Extend HTMLElement to add our custom property
declare global {
  interface HTMLElement {
    msDropdown?: MsDropdown;
    hasEventListener?: (event: string) => boolean;
  }
}

// Define Bootstrap-specific options interface
interface MsDropdownBootstrapOptions extends MsDropdownOptions {
  className?: string;
}

class MsDropdownBootstrap {
  private element: HTMLElement;
  private options: MsDropdownBootstrapOptions;
  private dropdown: MsDropdown;

  constructor(element: HTMLElement, options: MsDropdownBootstrapOptions = {}) {
    this.element = element;
    this.options = {
      ...options,
      className: `form-select ${options.className || ''}`.trim(),
    };
    
    // Add Bootstrap classes to the element
    this.element.className = this.options.className;

    // Initialize MsDropdown
    this.dropdown = new MsDropdown(this.element as any, this.options);
    
    // Add Bootstrap specific event handlers
    this._addBootstrapEventHandlers();
  }

  private _addBootstrapEventHandlers(): void {
    // Find the closest Bootstrap modal or tab element
    const modal = this.element.closest('.modal');
    const tab = this.element.closest('[role=tabpanel]');

    // Handle Bootstrap modal events
    if (modal) {
      // Add event listener for Bootstrap modal shown event
      modal.addEventListener('shown.bs.modal', () => {
        this.dropdown.refresh();
      });
    }

    // Handle Bootstrap tab events
    if (tab) {
      // Add event listener for Bootstrap tab shown event
      tab.addEventListener('shown.bs.tab', () => {
        this.dropdown.refresh();
      });
    }
  }

  // Proxy methods to underlying MsDropdown instance
  public refresh(): void {
    this.dropdown.refresh();
  }

  public destroy(): void {
    this.dropdown.destroy();
    delete this.element.msDropdown;
  }

  // Static initialization method
  static init(selector: string = 'select.ms-dropdown', options: MsDropdownBootstrapOptions = {}): MsDropdownBootstrap[] {
    const elements = document.querySelectorAll(selector);
    return Array.from(elements).map(element => new MsDropdownBootstrap(element as HTMLElement, options));
  }
}

// Auto-initialize when Bootstrap is loaded
declare global {
  interface Window {
    bootstrap?: any;
  }
}

if (typeof window.bootstrap !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    MsDropdownBootstrap.init();
  });
}

export default MsDropdownBootstrap;
