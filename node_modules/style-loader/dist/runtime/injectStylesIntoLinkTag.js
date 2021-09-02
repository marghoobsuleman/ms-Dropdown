"use strict";

module.exports = function (url, options) {
  options = options || {};
  options.attributes = typeof options.attributes === "object" ? options.attributes : {};

  if (typeof options.attributes.nonce === "undefined") {
    var nonce = typeof __webpack_nonce__ !== "undefined" ? __webpack_nonce__ : null;

    if (nonce) {
      options.attributes.nonce = nonce;
    }
  }

  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  Object.keys(options.attributes).forEach(function (key) {
    link.setAttribute(key, options.attributes[key]);
  });
  options.insert(link);
  return function (newUrl) {
    if (typeof newUrl === "string") {
      link.href = newUrl;
    } else {
      link.parentNode.removeChild(link);
    }
  };
};