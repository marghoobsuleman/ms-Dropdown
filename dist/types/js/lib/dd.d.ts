/**
 * MSDropdown - dd.ts
 * @author: Marghoob Suleman
 * @website: https://www.marghoobsuleman.com/
 * @version: 4.0.4
 * @revision: 7
 * @date: 11th Apr 2025
 * msDropdown is free web component: you can redistribute it and/or modify
 * it under the terms of the either the MIT License or the Gnu General Public License (GPL) Version 2
 */
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
export interface EventOptions {
    once?: boolean;
    passive?: boolean;
    capture?: boolean;
}
export default class MsDropdown {
    private _ddMaker;
    constructor(ele: string | MsDropdownElement, settings?: MsDropdownOptions);
    /*****************  Public methods and props ***********/
    /**
     * Set setting attributes
     * @param key
     * @param value
     * @param shouldRefresh
     */
    setSettingAttribute(key: string, value: any, shouldRefresh?: boolean): void;
    /**
     * Add an item to select
     * Object can be pass as below
     * new Option("Label", "value") or
     * {text:"Label", value:"value"}
     * or Label as string
     * or full object ie {text:"", value:"", description:'', image:'', className:'' title:'', imageCss:''}
     * @param obj {option | object}
     * @param index {int}
     */
    add(obj: HTMLOptionElement | Record<string, any> | string, index?: number): void;
    /**
     * Remove an item from select
     * @param index {int}
     */
    remove(index: number): any;
    /**
     * Move to next index
     */
    next(): void;
    /**
     * Move to previous index
     */
    previous(): void;
    /**
     * Open this dropdown
     */
    open(): void;
    /**
     * Close this dropdown
     */
    close(): void;
    /**
     * Return named item element with data
     * @param name {string}
     * @param withData
     */
    namedItem(name: string, withData?: boolean): any;
    /**
     * Get data by index
     * @param index {int}
     * @param withData
     */
    item(index: number, withData?: boolean): any;
    /**
     * Show hide or get status of visibility
     * @param isShow
     * @return {boolean}
     */
    visible(isShow?: boolean | null): boolean;
    /**
     * Calculate item height and set child height
     * @param numberOfRows {int}
     */
    showRows(numberOfRows: number): void;
    /**
     * Alias of showRows
     * @param numberOfRows {int}
     */
    visibleRows(numberOfRows: number): void;
    /**
     * Add event listener with support for options
     * @param {string} type - Event type
     * @param {Function} fn - Event handler
     * @param {Object} [options] - Event options
     * @param {boolean} [options.once] - Remove handler after first execution
     * @param {boolean} [options.passive] - Indicates if handler will call preventDefault
     * @param {boolean} [options.capture] - Use capture phase instead of bubbling
     */
    on(type: string, fn: EventListenerOrEventListenerObject, options?: EventOptions): void;
    /**
     * Remove event listener
     * @param {string} type - Event type
     * @param {Function} fn - Event handler to remove
     */
    off(type: string, fn: EventListenerOrEventListenerObject): void;
    /**
     * Add one-time event listener
     * @param {string} type - Event type
     * @param {Function} fn - Event handler
     * @param {Object} [options] - Additional event options (passive, capture)
     */
    once(type: string, fn: EventListenerOrEventListenerObject, options?: EventOptions): void;
    /**
     * update ui and value
     */
    updateUiAndValue(): void;
    /**
     * Remake msDropdown
     */
    refresh(): void;
    /**
     * Remove msDropdown
     */
    destroy(): void;
    /**
     * Get selected index
     * @return {int}
     */
    get selectedIndex(): number;
    /**
     * Set Index
     * @param index {int}
     */
    set selectedIndex(index: number);
    /**
     * Get options
     * @return {HTMLOptionElement}
     */
    get options(): HTMLOptionsCollection;
    /**
     * Set options length
     * @param option {int | HTMLOptionElement}
     */
    set options(option: any);
    /**
     * get options UI
     * @return {NodeList}
     */
    get optionsUI(): NodeList;
    /**
     * Get length
     * @return {int}
     */
    get length(): number;
    /**
     * Set length
     * @param size {int}
     */
    set length(size: number);
    /**
     * Get value
     * @return {string | any}
     */
    get value(): string | string[];
    /**
     * Set value
     * @param val {string | any}
     */
    set value(val: string | string[]);
    /**
     * get selected text
     * @return {string}
     */
    get selectedText(): string;
    /**
     * Check if this is disabled
     * @return {boolean}
     */
    get disabled(): boolean;
    /**
     * Set disabled
     * @param val {boolean}
     */
    set disabled(val: boolean);
    /**
     * Get form name if this is inside a form
     * @return {string}
     */
    get form(): HTMLFormElement | null;
    /**
     * Get multiple
     * @return {boolean}
     */
    get multiple(): boolean;
    /**
     * Set multiple
     * @param val {boolean}
     */
    set multiple(val: boolean);
    /**
     * Get the name
     * @return {string}
     */
    get name(): string;
    /**
     * Set the name
     * @param val {string}
     */
    set name(val: string);
    /**
     * Get required
     * @return {boolean}
     */
    get required(): boolean;
    /**
     * Set required
     * @param val {boolean}
     */
    set required(val: boolean);
    /**
     * return the size/height of the dropdown
     * @return {int}
     */
    get size(): number;
    /**
     * Change the height of the element
     * @param val {int}
     */
    set size(val: number);
    /**
     * Get selected option
     * @return {HTMLOptionElement}
     */
    get selectedOptions(): HTMLCollectionOf<HTMLOptionElement>;
    /**
     * Get element children
     * @return {HTMLCollection}
     */
    get children(): HTMLCollection;
    /**
     * Get selected ui data
     * @return {object | {data: *, ui: *, index: *, option: *}}
     */
    get uiData(): any;
    /**
     * Make dropdown
     * @param ele
     * @param settings
     */
    static make(ele: string | MsDropdownElement, settings?: MsDropdownOptions): MsDropdown | undefined;
    /**
     * Get version
     * @return {string}
     */
    static get version(): string;
    /**
     * Get author
     * @return {string}
     */
    static get author(): string;
}
