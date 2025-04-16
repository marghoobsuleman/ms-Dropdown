import MsDropdown, { MsDropdownOptions } from '../../js/lib/dd';
declare global {
    interface HTMLElement {
        msDropdown?: MsDropdown;
        hasEventListener?: (event: string) => boolean;
    }
}
interface MsDropdownBootstrapOptions extends MsDropdownOptions {
    className?: string;
}
declare class MsDropdownBootstrap {
    private element;
    private options;
    private dropdown;
    constructor(element: HTMLElement, options?: MsDropdownBootstrapOptions);
    private _addBootstrapEventHandlers;
    refresh(): void;
    destroy(): void;
    static init(selector?: string, options?: MsDropdownBootstrapOptions): MsDropdownBootstrap[];
}
declare global {
    interface Window {
        bootstrap?: any;
    }
}
export default MsDropdownBootstrap;
