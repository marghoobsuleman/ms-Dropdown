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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import ddMaker from "./ddmaker";
var MsDropdown = /** @class */ (function () {
    function MsDropdown(ele, settings) {
        if (typeof ele === "string") {
            document.querySelectorAll(ele).forEach(function (current) {
                new MsDropdown(current, settings);
            });
        }
        else {
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
    MsDropdown.prototype.setSettingAttribute = function (key, value, shouldRefresh) {
        if (shouldRefresh === void 0) { shouldRefresh = false; }
        this._ddMaker.setSettingAttribute(key, value);
        if (shouldRefresh) {
            this._ddMaker.refresh();
        }
    };
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
    MsDropdown.prototype.add = function (obj, index) {
        this._ddMaker.add(obj, index);
    };
    /**
     * Remove an item from select
     * @param index {int}
     */
    MsDropdown.prototype.remove = function (index) {
        return this._ddMaker.remove(index);
    };
    /**
     * Move to next index
     */
    MsDropdown.prototype.next = function () {
        this._ddMaker.next();
    };
    /**
     * Move to previous index
     */
    MsDropdown.prototype.previous = function () {
        this._ddMaker.previous();
    };
    /**
     * Open this dropdown
     */
    MsDropdown.prototype.open = function () {
        this._ddMaker.open(null, false);
    };
    /**
     * Close this dropdown
     */
    MsDropdown.prototype.close = function () {
        this._ddMaker.close(null);
    };
    /**
     * Return named item element with data
     * @param name {string}
     * @param withData
     */
    MsDropdown.prototype.namedItem = function (name, withData) {
        if (withData === void 0) { withData = false; }
        return this._ddMaker.namedItem(name, withData);
    };
    /**
     * Get data by index
     * @param index {int}
     * @param withData
     */
    MsDropdown.prototype.item = function (index, withData) {
        if (withData === void 0) { withData = false; }
        return this._ddMaker.item(index, withData);
    };
    /**
     * Show hide or get status of visibility
     * @param isShow
     * @return {boolean}
     */
    MsDropdown.prototype.visible = function (isShow) {
        if (isShow === void 0) { isShow = null; }
        return this._ddMaker.visible(isShow);
    };
    /**
     * Calculate item height and set child height
     * @param numberOfRows {int}
     */
    MsDropdown.prototype.showRows = function (numberOfRows) {
        this._ddMaker.showRows(numberOfRows);
    };
    /**
     * Alias of showRows
     * @param numberOfRows {int}
     */
    MsDropdown.prototype.visibleRows = function (numberOfRows) {
        this._ddMaker.showRows(numberOfRows);
    };
    /**
     * Add event listener with support for options
     * @param {string} type - Event type
     * @param {Function} fn - Event handler
     * @param {Object} [options] - Event options
     * @param {boolean} [options.once] - Remove handler after first execution
     * @param {boolean} [options.passive] - Indicates if handler will call preventDefault
     * @param {boolean} [options.capture] - Use capture phase instead of bubbling
     */
    MsDropdown.prototype.on = function (type, fn, options) {
        if (options === void 0) { options = {}; }
        this._ddMaker.on(type, fn, options);
    };
    /**
     * Remove event listener
     * @param {string} type - Event type
     * @param {Function} fn - Event handler to remove
     */
    MsDropdown.prototype.off = function (type, fn) {
        this._ddMaker.off(type, fn);
    };
    /**
     * Add one-time event listener
     * @param {string} type - Event type
     * @param {Function} fn - Event handler
     * @param {Object} [options] - Additional event options (passive, capture)
     */
    MsDropdown.prototype.once = function (type, fn, options) {
        if (options === void 0) { options = {}; }
        this.on(type, fn, __assign(__assign({}, options), { once: true }));
    };
    /**
     * update ui and value
     */
    MsDropdown.prototype.updateUiAndValue = function () {
        this._ddMaker.updateUiAndValue();
    };
    /**
     * Remake msDropdown
     */
    MsDropdown.prototype.refresh = function () {
        this._ddMaker.refresh();
    };
    /**
     * Remove msDropdown
     */
    MsDropdown.prototype.destroy = function () {
        this._ddMaker.destroy();
    };
    Object.defineProperty(MsDropdown.prototype, "selectedIndex", {
        /**
         * Get selected index
         * @return {int}
         */
        get: function () {
            return this._ddMaker.selectedIndex;
        },
        /**
         * Set Index
         * @param index {int}
         */
        set: function (index) {
            this._ddMaker.selectedIndex = index;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MsDropdown.prototype, "options", {
        /**
         * Get options
         * @return {HTMLOptionElement}
         */
        get: function () {
            return this._ddMaker.options;
        },
        /**
         * Set options length
         * @param option {int | HTMLOptionElement}
         */
        set: function (option) {
            this._ddMaker.options = option;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MsDropdown.prototype, "optionsUI", {
        /**
         * get options UI
         * @return {NodeList}
         */
        get: function () {
            return this._ddMaker.optionsUI;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MsDropdown.prototype, "length", {
        /**
         * Get length
         * @return {int}
         */
        get: function () {
            return this._ddMaker.length;
        },
        /**
         * Set length
         * @param size {int}
         */
        set: function (size) {
            this._ddMaker.length = size;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MsDropdown.prototype, "value", {
        /**
         * Get value
         * @return {string | any}
         */
        get: function () {
            return this._ddMaker.value;
        },
        /**
         * Set value
         * @param val {string | any}
         */
        set: function (val) {
            this._ddMaker.value = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MsDropdown.prototype, "selectedText", {
        /**
         * get selected text
         * @return {string}
         */
        get: function () {
            return this._ddMaker.selectedText;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MsDropdown.prototype, "disabled", {
        /**
         * Check if this is disabled
         * @return {boolean}
         */
        get: function () {
            return this._ddMaker.disabled;
        },
        /**
         * Set disabled
         * @param val {boolean}
         */
        set: function (val) {
            this._ddMaker.disabled = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MsDropdown.prototype, "form", {
        /**
         * Get form name if this is inside a form
         * @return {string}
         */
        get: function () {
            return this._ddMaker.form;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MsDropdown.prototype, "multiple", {
        /**
         * Get multiple
         * @return {boolean}
         */
        get: function () {
            return this._ddMaker.multiple;
        },
        /**
         * Set multiple
         * @param val {boolean}
         */
        set: function (val) {
            this._ddMaker.multiple = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MsDropdown.prototype, "name", {
        /**
         * Get the name
         * @return {string}
         */
        get: function () {
            return this._ddMaker.name;
        },
        /**
         * Set the name
         * @param val {string}
         */
        set: function (val) {
            this._ddMaker.name = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MsDropdown.prototype, "required", {
        /**
         * Get required
         * @return {boolean}
         */
        get: function () {
            return this._ddMaker.required;
        },
        /**
         * Set required
         * @param val {boolean}
         */
        set: function (val) {
            this._ddMaker.required = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MsDropdown.prototype, "size", {
        /**
         * return the size/height of the dropdown
         * @return {int}
         */
        get: function () {
            return this._ddMaker.size;
        },
        /**
         * Change the height of the element
         * @param val {int}
         */
        set: function (val) {
            this._ddMaker.size = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MsDropdown.prototype, "selectedOptions", {
        /**
         * Get selected option
         * @return {HTMLOptionElement}
         */
        get: function () {
            return this._ddMaker.selectedOptions;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MsDropdown.prototype, "children", {
        /**
         * Get element children
         * @return {HTMLCollection}
         */
        get: function () {
            return this._ddMaker.children;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MsDropdown.prototype, "uiData", {
        /**
         * Get selected ui data
         * @return {object | {data: *, ui: *, index: *, option: *}}
         */
        get: function () {
            return this._ddMaker.uiData;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Make dropdown
     * @param ele
     * @param settings
     */
    MsDropdown.make = function (ele, settings) {
        if (!ele.msDropdown) {
            try {
                var ddSelect = new MsDropdown(ele, settings);
                ele.addEventListener("change", function () {
                    if (!ele.multiple) {
                        ele.msDropdown.selectedIndex = ele.selectedIndex;
                    }
                    else {
                        ele.msDropdown.refresh();
                    }
                });
                return ddSelect;
            }
            catch (e) {
                console.log(e.message);
            }
        }
        return undefined;
    };
    Object.defineProperty(MsDropdown, "version", {
        /**
         * Get version
         * @return {string}
         */
        get: function () {
            return "4.0.4";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MsDropdown, "author", {
        /**
         * Get author
         * @return {string}
         */
        get: function () {
            return "Marghoob Suleman";
        },
        enumerable: false,
        configurable: true
    });
    return MsDropdown;
}());
export default MsDropdown;
//# sourceMappingURL=dd.js.map