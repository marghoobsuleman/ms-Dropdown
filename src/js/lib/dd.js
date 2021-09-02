/**
 * MSDropdown - dd.js
 * @author: Marghoob Suleman
 * @website: https://www.marghoobsuleman.com/
 * @version: 4.0
 * @revision: 1
 * msDropdown is free web component: you can redistribute it and/or modify
 * it under the terms of the either the MIT License or the Gnu General Public License (GPL) Version 2
 */

/***
 * Let define some private vars and methods
 */
import ddMaker from "./ddmaker";

export default class MsDropdown {

    constructor(ele, settings) {
        this._ddMaker = new ddMaker(ele, settings);
    }

    /*****************  Public methods and props *********** /
    /**
     * Add an item to select
     * Object can be pass as below
     * new Option("Label", "value") or
     * {text:"Label", value:"value"}
     * or Label as string
     * or full object ie {text:"", value:"", description:'', image:'', className:'' title:''}
     * @param obj
     *
     */

    add(obj, index) {
        this._ddMaker.add(obj, index);
    }

    /**
     * Remove an item from select
     * @param index
     */
    remove(index) {
        this._ddMaker.remove(index);
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
    open(evt, justOpen=false) {
        this._ddMaker.open(evt, justOpen);
    }

    /**
     * Close this dropdown
     * @param arg
     */
    close(evt=null) {
        this._ddMaker.close(evt);
    }

    /**
     * Return named item element with data
     * @param name
     */
    namedItem(name) {
        return this._ddMaker.namedItem(name);
    }

    /**
     * Get data by index
     * @param index
     */
    item(index) {
        return this._ddMaker.item(index);
    }

    /**
     * Show hide or get status of visibility
     * @param isShow
     * @return {boolean}
     */
    visible(isShow=null) {
        this._ddMaker.visible(isShow);
    }

    /**
     * Calculate item height and set child height
     * @param numberOfRows
     */
    showRows(numberOfRows) {

    }

    /**
     * Alias of showRows
     * @param numberOfRows
     */
    visibleRows(numberOfRows) {
        this._ddMaker.showRows(numberOfRows);
    }

    /**
     * Add event listener
     * @param type
     * @param fn
     */
    on(type, fn) {
        this._ddMaker._bindEvents(this.ele, type, fn);
    }

    /**
     * Remove event listener
     * @param type
     * @param fn
     */
    off(type, fn) {
        this._ddMaker._unbindEvents(this.ele, type, fn);
    };

    /*** Props ***/
    /**
     * Get selected index
     * @return {*}
     */
    get selectedIndex() {
        return this._ddMaker.selectedIndex;
    }

    /**
     * Set Index
     * @param index
     */
    set selectedIndex(index) {
        this._ddMaker.selectedIndex = index;
    }

    /**
     * Get options
     * @return {*}
     */
    get options() {
        return this._ddMaker.options;
    }

    /**
     * Set options length
     * @param len
     */
    set options(option) {
        this._ddMaker.options = option;
    }

    /**
     * get options UI
     * @return {any}
     */
    get optionsUI() {
        return this._ddMaker.optionsUI;
    }

    /**
     * Get length
     * @return {*}
     */
    get length() {
        return this._ddMaker.length;
    }

    /**
     * Set length
     * @param size
     */
    set length(size) {
        this._ddMaker.length = size;
    }


    /**
     * Get value
     * @return {*}
     */
    get value() {
        return this._ddMaker.value;
    }

    /**
     * Set value
     * @param val
     */
    set value(val) {
        this._ddMaker.value = val;
    }

    /**
     * get selected text
     * @return {string}
     */
    get selectedText() {
        return this._ddMaker.selectedIndex;
    }

    /**
     * Check if this is disabled
     * @return {boolean | * | Function}
     */
    get disabled() {
        return this._ddMaker.disabled;
    }

    /**
     * Set disabled
     * @param val
     */
    set disabled(val) {
        this._ddMaker.disabled = val;
    }

    /**
     * Get form name if this is inside a form
     * @return {*}
     */
    get form() {
        return this._ddMaker.form;
    }


    /**
     * Get multiple
     * @return {*}
     */
    get multiple() {
        return this._ddMaker.multiple;
    }

    /**
     * Set multiple
     * @param val
     */
    set multiple(val) {
        this._ddMaker.multiple = val;
    }

    /**
     * Get the name
     * @return {*}
     */
    get name() {
        return this._ddMaker.name;
    }

    /**
     * Set the name
     * @param val
     */
    set name(val) {
        this._ddMaker.name = val;
    }

    /**
     * Get required
     * @return {*}
     */
    get required() {
        return this._ddMaker.required;
    }

    /**
     * Set required
     * @param val
     */
    set required(val) {
        this._ddMaker.required = val;
    }

    /**
     * return the size/height of the dropdown
     * @return {*}
     */
    get size() {
        return this._ddMaker.size;
    }

    /**
     * Change the height of the element
     * @param val
     */
    set size(val) {
        this._ddMaker.size = val;
    }


    /**
     * Get selected option
     * @return {null}
     */
    get selectedOptions() {
        return this._ddMaker.selectedOptions;
    }

    /**
     * Get element children
     * @return {*}
     */
    get children() {
        return this._ddMaker.children;
    }

    /**
     * Get selected ui data
     * @return {{data: *, ui: *, index: *, option: *}}
     */
    get uiData() {
        return this._ddMaker.uiData;
    }

    /**
     * update ui and value
     */
    updateUiAndValue() {
        this._ddMaker._updateUiAndValue();
    }

    /**
     * Remake msDrodpwn
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



    /**
     * Get version
     * @return {string}
     */
    get version() {
        return "4.0.0";
    }

}

