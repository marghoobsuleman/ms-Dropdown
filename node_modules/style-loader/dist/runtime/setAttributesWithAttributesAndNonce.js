"use strict";

/* istanbul ignore next  */
function setAttributesWithoutAttributes(style, attributes) {
  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });
}

module.exports = setAttributesWithoutAttributes;