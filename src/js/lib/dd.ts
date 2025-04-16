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

import ddMaker from "./ddmaker";

// Define interfaces for TypeScript
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
  private _ddMaker: any;

  constructor(ele: string | MsDropdownElement, settings?: MsDropdownOptions) {
    if (typeof ele === "string") {
      document.querySelectorAll(ele).forEach((current) => {
        new MsDropdown(current as MsDropdownElement, settings);
      });
    } else {
      ele.msDropdown = this;
      this._ddMaker = new ddMaker(ele, settings);
    }
  }
  /*****************  Public methods and props ***********/

  /**
   * Set setting attributes
   * @param key
   * @param value
   * @param shouldRefresh
   */
  setSettingAttribute(key: string, value: any, shouldRefresh: boolean = false): void {
    this._ddMaker.setSettingAttribute(key, value);
    if (shouldRefresh) {
      this._ddMaker.refresh();
    }
  }
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
  add(obj: HTMLOptionElement | Record<string, any> | string, index?: number): void {
    this._ddMaker.add(obj, index);
  }

  /**
   * Remove an item from select
   * @param index {int}
   */
  remove(index: number): any {
    return this._ddMaker.remove(index);
  }

  /**
   * Move to next index
   */
  next(): void {
    this._ddMaker.next();
  }

  /**
   * Move to previous index
   */
  previous(): void {
    this._ddMaker.previous();
  }

  /**
   * Open this dropdown
   */
  open(): void {
    this._ddMaker.open(null, false);
  }

  /**
   * Close this dropdown
   */
  close(): void {
    this._ddMaker.close(null);
  }

  /**
   * Return named item element with data
   * @param name {string}
   * @param withData
   */
  namedItem(name: string, withData: boolean = false): any {
    return this._ddMaker.namedItem(name, withData);
  }

  /**
   * Get data by index
   * @param index {int}
   * @param withData
   */
  item(index: number, withData: boolean = false): any {
    return this._ddMaker.item(index, withData);
  }

  /**
   * Show hide or get status of visibility
   * @param isShow
   * @return {boolean}
   */
  visible(isShow: boolean | null = null): boolean {
    return this._ddMaker.visible(isShow);
  }

  /**
   * Calculate item height and set child height
   * @param numberOfRows {int}
   */
  showRows(numberOfRows: number): void {
    this._ddMaker.showRows(numberOfRows);
  }

  /**
   * Alias of showRows
   * @param numberOfRows {int}
   */
  visibleRows(numberOfRows: number): void {
    this._ddMaker.showRows(numberOfRows);
  }

  /**
   * Add event listener with support for options
   * @param {string} type - Event type
   * @param {Function} fn - Event handler
   * @param {Object} [options] - Event options
   * @param {boolean} [options.once] - Remove handler after first execution
   * @param {boolean} [options.passive] - Indicates if handler will call preventDefault
   * @param {boolean} [options.capture] - Use capture phase instead of bubbling
   */
  on(type: string, fn: EventListenerOrEventListenerObject, options: EventOptions = {}): void {
    this._ddMaker.on(type, fn, options);
  }

  /**
   * Remove event listener
   * @param {string} type - Event type
   * @param {Function} fn - Event handler to remove
   */
  off(type: string, fn: EventListenerOrEventListenerObject): void {
    this._ddMaker.off(type, fn);
  }

  /**
   * Add one-time event listener
   * @param {string} type - Event type
   * @param {Function} fn - Event handler
   * @param {Object} [options] - Additional event options (passive, capture)
   */
  once(type: string, fn: EventListenerOrEventListenerObject, options: EventOptions = {}): void {
    this.on(type, fn, { ...options, once: true });
  }

  /**
   * update ui and value
   */
  updateUiAndValue(): void {
    this._ddMaker.updateUiAndValue();
  }

  /**
   * Remake msDropdown
   */
  refresh(): void {
    this._ddMaker.refresh();
  }

  /**
   * Remove msDropdown
   */
  destroy(): void {
    this._ddMaker.destroy();
  }

  /**
   * Get selected index
   * @return {int}
   */
  get selectedIndex(): number {
    return this._ddMaker.selectedIndex;
  }

  /**
   * Set Index
   * @param index {int}
   */
  set selectedIndex(index: number) {
    this._ddMaker.selectedIndex = index;
  }

  /**
   * Get options
   * @return {HTMLOptionElement}
   */
  get options(): HTMLOptionsCollection {
    return this._ddMaker.options;
  }

  /**
   * Set options length
   * @param option {int | HTMLOptionElement}
   */
  set options(option: any) {
    this._ddMaker.options = option;
  }

  /**
   * get options UI
   * @return {NodeList}
   */
  get optionsUI(): NodeList {
    return this._ddMaker.optionsUI;
  }

  /**
   * Get length
   * @return {int}
   */
  get length(): number {
    return this._ddMaker.length;
  }

  /**
   * Set length
   * @param size {int}
   */
  set length(size: number) {
    this._ddMaker.length = size;
  }

  /**
   * Get value
   * @return {string | any}
   */
  get value(): string | string[] {
    return this._ddMaker.value;
  }

  /**
   * Set value
   * @param val {string | any}
   */
  set value(val: string | string[]) {
    this._ddMaker.value = val;
  }

  /**
   * get selected text
   * @return {string}
   */
  get selectedText(): string {
    return this._ddMaker.selectedText;
  }

  /**
   * Check if this is disabled
   * @return {boolean}
   */
  get disabled(): boolean {
    return this._ddMaker.disabled;
  }

  /**
   * Set disabled
   * @param val {boolean}
   */
  set disabled(val: boolean) {
    this._ddMaker.disabled = val;
  }

  /**
   * Get form name if this is inside a form
   * @return {string}
   */
  get form(): HTMLFormElement | null {
    return this._ddMaker.form;
  }

  /**
   * Get multiple
   * @return {boolean}
   */
  get multiple(): boolean {
    return this._ddMaker.multiple;
  }

  /**
   * Set multiple
   * @param val {boolean}
   */
  set multiple(val: boolean) {
    this._ddMaker.multiple = val;
  }

  /**
   * Get the name
   * @return {string}
   */
  get name(): string {
    return this._ddMaker.name;
  }

  /**
   * Set the name
   * @param val {string}
   */
  set name(val: string) {
    this._ddMaker.name = val;
  }

  /**
   * Get required
   * @return {boolean}
   */
  get required(): boolean {
    return this._ddMaker.required;
  }

  /**
   * Set required
   * @param val {boolean}
   */
  set required(val: boolean) {
    this._ddMaker.required = val;
  }

  /**
   * return the size/height of the dropdown
   * @return {int}
   */
  get size(): number {
    return this._ddMaker.size;
  }

  /**
   * Change the height of the element
   * @param val {int}
   */
  set size(val: number) {
    this._ddMaker.size = val;
  }

  /**
   * Get selected option
   * @return {HTMLOptionElement}
   */
  get selectedOptions(): HTMLCollectionOf<HTMLOptionElement> {
    return this._ddMaker.selectedOptions;
  }

  /**
   * Get element children
   * @return {HTMLCollection}
   */
  get children(): HTMLCollection {
    return this._ddMaker.children;
  }

  /**
   * Get selected ui data
   * @return {object | {data: *, ui: *, index: *, option: *}}
   */
  get uiData(): any {
    return this._ddMaker.uiData;
  }

  /**
   * Make dropdown
   * @param ele
   * @param settings
   */
  static make(ele: string | MsDropdownElement, settings?: MsDropdownOptions): MsDropdown | undefined {
    if (!(ele as MsDropdownElement).msDropdown) {
      try {
        const ddSelect = new MsDropdown(ele, settings);
        (ele as MsDropdownElement).addEventListener("change", () => {
          if (!(ele as MsDropdownElement).multiple) {
            (ele as MsDropdownElement).msDropdown!.selectedIndex = (ele as MsDropdownElement).selectedIndex;
          } else {
            (ele as MsDropdownElement).msDropdown!.refresh();
          }
        });
        return ddSelect;
      } catch (e: any) {
        console.log(e.message);
      }
    }
    return undefined;
  }

  /**
   * Get version
   * @return {string}
   */
  static get version(): string {
    return "4.0.4";
  }

  /**
   * Get author
   * @return {string}
   */
  static get author(): string {
    return "Marghoob Suleman";
  }
}
