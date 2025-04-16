declare module 'ms-dropdown' {
  export interface MsDropdownOptions {
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
  
  export interface MsDropdownElement extends HTMLSelectElement {
    msDropdown?: MsDropdown;
  }
  
  export default class MsDropdown {
    constructor(element: string | HTMLSelectElement, settings?: MsDropdownOptions);
    value: string | string[];
    refresh(): void;
    destroy(): void;
    static make(element: string | HTMLSelectElement, settings?: MsDropdownOptions): MsDropdown;
  }
}
