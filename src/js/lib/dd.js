/**
 * MSDropdown - dd.js
 * @author: Marghoob Suleman
 * @website: https://www.marghoobsuleman.com/
 * @version: 4.0.3
 * @revision: 6
 * @date: 5th Sep 2021
 * msDropdown is free web component: you can redistribute it and/or modify
 * it under the terms of the either the MIT License or the Gnu General Public License (GPL) Version 2
 */

import ddMaker from "./ddmaker";

export default class MsDropdown {

    constructor(ele, settings) {
        if(typeof ele === "string") {
            document.querySelectorAll(ele).forEach((current)=> {
                new MsDropdown(current,settings);
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
    setSettingAttribute(key, value, shouldRefresh=false) {
        this._ddMaker.setSettingAttribute(key, value);
        if(shouldRefresh) {
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
    add(obj, index) {
        this._ddMaker.add(obj, index);
    }

    /**
     * Remove an item from select
     * @param index {int}
     */
    remove(index) {
        return this._ddMaker.remove(index);
    }

    /**
     * Move to next index
     */
    next() {
        this._ddMaker.next();
    }


    /**
     * Move to previous index
     */
    previous() {
        this._ddMaker.previous();
    }

    /**
     * Open this dropdown
     */
    open() {
        this._ddMaker.open(null, false);
    }

    /**
     * Close this dropdown
     */
    close() {
        this._ddMaker.close(null);
    }

    /**
     * Return named item element with data
     * @param name {string}
     * @param withData
     */
    namedItem(name, withData=false) {
        return this._ddMaker.namedItem(name, withData);
    }

    /**
     * Get data by index
     * @param index {int}
     * @param withData
     */
    item(index, withData=false) {
        return this._ddMaker.item(index, withData);
    }

    /**
     * Show hide or get status of visibility
     * @param isShow
     * @return {boolean}
     */
    visible(isShow=null) {
        return this._ddMaker.visible(isShow);
    }

    /**
     * Calculate item height and set child height
     * @param numberOfRows {int}
     */
    showRows(numberOfRows) {
        this._ddMaker.showRows(numberOfRows);
    }

    /**
     * Alias of showRows
     * @param numberOfRows {int}
     */
    visibleRows(numberOfRows) {
        this._ddMaker.showRows(numberOfRows);
    }

    /**
     * Add event listener
     * @param type {string}
     * @param fn {function}
     */
    on(type, fn) {
        this._ddMaker.on(type, fn);
    }

    /**
     * Remove event listener
     * @param type {string}
     * @param fn {function}
     */
    off(type, fn) {
        this._ddMaker.off(type, fn);
    };

    /**
     * update ui and value
     */
    updateUiAndValue() {
        this._ddMaker.updateUiAndValue();
    }

    /**
     * Remake msDropdown
     */
    refresh() {
        this._ddMaker.refresh();
    }
    /**
     * Remove msDropdown
     */
    destroy() {
        this._ddMaker.destroy();
    }

    /*** Props ***/
    /**
     * Get selected index
     * @return {int}
     */
    get selectedIndex() {
        return this._ddMaker.selectedIndex;
    }

    /**
     * Set Index
     * @param index {int}
     */
    set selectedIndex(index) {
        this._ddMaker.selectedIndex = index;
    }

    /**
     * Get options
     * @return {HTMLOptionElement}
     */
    get options() {
        return this._ddMaker.options;
    }

    /**
     * Set options length
     * @param option {int | HTMLOptionElement}
     */
    set options(option) {
        this._ddMaker.options = option;
    }

    /**
     * get options UI
     * @return {NodeList}
     */
    get optionsUI() {
        return this._ddMaker.optionsUI;
    }

    /**
     * Get length
     * @return {int}
     */
    get length() {
        return this._ddMaker.length;
    }

    /**
     * Set length
     * @param size {int}
     */
    set length(size) {
        this._ddMaker.length = size;
    }


    /**
     * Get value
     * @return {string | any}
     */
    get value() {
        return this._ddMaker.value;
    }

    /**
     * Set value
     * @param val {string | any}
     */
    set value(val) {
        this._ddMaker.value = val;
    }

    /**
     * get selected text
     * @return {string}
     */
    get selectedText() {
        return this._ddMaker.selectedText;
    }

    /**
     * Check if this is disabled
     * @return {boolean}
     */
    get disabled() {
        return this._ddMaker.disabled;
    }

    /**
     * Set disabled
     * @param val {boolean}
     */
    set disabled(val) {
        this._ddMaker.disabled = val;
    }

    /**
     * Get form name if this is inside a form
     * @return {string}
     */
    get form() {
        return this._ddMaker.form;
    }


    /**
     * Get multiple
     * @return {boolean}
     */
    get multiple() {
        return this._ddMaker.multiple;
    }

    /**
     * Set multiple
     * @param val {boolean}
     */
    set multiple(val) {
        this._ddMaker.multiple = val;
    }

    /**
     * Get the name
     * @return {string}
     */
    get name() {
        return this._ddMaker.name;
    }

    /**
     * Set the name
     * @param val {string}
     */
    set name(val) {
        this._ddMaker.name = val;
    }

    /**
     * Get required
     * @return {boolean}
     */
    get required() {
        return this._ddMaker.required;
    }

    /**
     * Set required
     * @param val {boolean}
     */
    set required(val) {
        this._ddMaker.required = val;
    }

    /**
     * return the size/height of the dropdown
     * @return {int}
     */
    get size() {
        return this._ddMaker.size;
    }

    /**
     * Change the height of the element
     * @param val {int}
     */
    set size(val) {
        this._ddMaker.size = val;
    }


    /**
     * Get selected option
     * @return {HTMLOptionElement}
     */
    get selectedOptions() {
        return this._ddMaker.selectedOptions;
    }

    /**
     * Get element children
     * @return {HTMLCollection}
     */
    get children() {
        return this._ddMaker.children;
    }

    /**
     * Get selected ui data
     * @return {object | {data: *, ui: *, index: *, option: *}}
     */
    get uiData() {
        return this._ddMaker.uiData;
    }


    /**
     * Make dropdown
     * @param ele
     * @param settings
     */
    static make(ele, settings) {
        if(!ele.msDropdown) {
            try {
                let ddSelect = new MsDropdown(ele, settings);
                ele.addEventListener("change", ()=> {
                    if(!ele.multiple) {
                        ele.msDropdown.selectedIndex = current.selectedIndex;
                    } else {
                        ele.msDropdown.refresh();
                    }
                });
                return ddSelect;
            } catch (e) {
                console.log(e.message);
            }
        }
    }

    /**
     * Get version
     * @return {string}
     */
    static get version() {
        return "4.0.3";
    }

    /**
     * Get author
     * @return {string}
     */
    static get author() {
        return "Marghoob Suleman";
    }

}

