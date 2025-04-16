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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useEffect, useRef } from 'react';
import MsDropdown from '../../js/lib/dd';
var MsDropdownReact = function (_a) {
    var _b = _a.options, options = _b === void 0 ? [] : _b, value = _a.value, onChange = _a.onChange, name = _a.name, className = _a.className, disabled = _a.disabled, multiple = _a.multiple, required = _a.required, _c = _a.imagePosition, imagePosition = _c === void 0 ? 'left' : _c, _d = _a.showFilterAlways, showFilterAlways = _d === void 0 ? false : _d, props = __rest(_a, ["options", "value", "onChange", "name", "className", "disabled", "multiple", "required", "imagePosition", "showFilterAlways"]);
    var selectRef = useRef(null);
    var dropdownRef = useRef(null);
    useEffect(function () {
        if (selectRef.current && !dropdownRef.current) {
            var msDropdownOptions = __assign({ imagePosition: imagePosition, showFilterAlways: showFilterAlways }, props);
            dropdownRef.current = new MsDropdown(selectRef.current, msDropdownOptions);
        }
        return function () {
            if (dropdownRef.current) {
                dropdownRef.current.destroy();
            }
        };
    }, []);
    useEffect(function () {
        if (dropdownRef.current && value !== undefined) {
            dropdownRef.current.value = value;
        }
    }, [value]);
    var handleChange = function (event) {
        if (onChange) {
            onChange(event);
        }
    };
    return (React.createElement("select", __assign({ ref: selectRef, name: name, className: className, disabled: disabled, multiple: multiple, required: required, onChange: handleChange }, props), options.map(function (option) { return (React.createElement("option", { key: option.value, value: option.value, "data-image": option.image, "data-description": option.description, className: option.className, title: option.title, style: option.imageCss ? { '--ms-image-css': option.imageCss } : undefined }, option.text)); })));
};
export default MsDropdownReact;
//# sourceMappingURL=MsDropdown.js.map