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
import MsDropdown from '../../js/lib/dd';
var MsDropdownBootstrap = /** @class */ (function () {
    function MsDropdownBootstrap(element, options) {
        if (options === void 0) { options = {}; }
        this.element = element;
        this.options = __assign(__assign({}, options), { className: "form-select ".concat(options.className || '').trim() });
        // Add Bootstrap classes to the element
        this.element.className = this.options.className;
        // Initialize MsDropdown
        this.dropdown = new MsDropdown(this.element, this.options);
        // Add Bootstrap specific event handlers
        this._addBootstrapEventHandlers();
    }
    MsDropdownBootstrap.prototype._addBootstrapEventHandlers = function () {
        var _this = this;
        // Find the closest Bootstrap modal or tab element
        var modal = this.element.closest('.modal');
        var tab = this.element.closest('[role=tabpanel]');
        // Handle Bootstrap modal events
        if (modal) {
            // Add event listener for Bootstrap modal shown event
            modal.addEventListener('shown.bs.modal', function () {
                _this.dropdown.refresh();
            });
        }
        // Handle Bootstrap tab events
        if (tab) {
            // Add event listener for Bootstrap tab shown event
            tab.addEventListener('shown.bs.tab', function () {
                _this.dropdown.refresh();
            });
        }
    };
    // Proxy methods to underlying MsDropdown instance
    MsDropdownBootstrap.prototype.refresh = function () {
        this.dropdown.refresh();
    };
    MsDropdownBootstrap.prototype.destroy = function () {
        this.dropdown.destroy();
        delete this.element.msDropdown;
    };
    // Static initialization method
    MsDropdownBootstrap.init = function (selector, options) {
        if (selector === void 0) { selector = 'select.ms-dropdown'; }
        if (options === void 0) { options = {}; }
        var elements = document.querySelectorAll(selector);
        return Array.from(elements).map(function (element) { return new MsDropdownBootstrap(element, options); });
    };
    return MsDropdownBootstrap;
}());
if (typeof window.bootstrap !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
        MsDropdownBootstrap.init();
    });
}
export default MsDropdownBootstrap;
//# sourceMappingURL=MsDropdownBootstrap.js.map