"use strict";

/* istanbul ignore next  */
var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join("\n");
  };
}();
/* istanbul ignore next  */


function apply(style, index, remove, obj) {
  var css = remove ? "" : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

var singletonData = {
  singleton: null,
  singletonCounter: 0
};
/* istanbul ignore next  */

function domAPI(options) {
  // eslint-disable-next-line no-undef,no-use-before-define
  var styleIndex = singletonData.singletonCounter++;
  var style = // eslint-disable-next-line no-undef,no-use-before-define
  singletonData.singleton || ( // eslint-disable-next-line no-undef,no-use-before-define
  singletonData.singleton = options.insertStyleElement(options));
  return {
    update: function update(obj) {
      apply(style, styleIndex, false, obj);
    },
    remove: function remove(obj) {
      apply(style, styleIndex, true, obj);
    }
  };
}

module.exports = domAPI;