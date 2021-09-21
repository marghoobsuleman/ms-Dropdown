import WebComponent from "./lib/dd-webcomponent";
import MsDropdown from './lib/dd';
window.MsDropdown = MsDropdown;


(function () {
    let isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 && navigator.userAgent && navigator.userAgent.indexOf('CriOS') == -1 && navigator.userAgent.indexOf('FxiOS') == -1;
    if(isSafari) {
        MsDropdown.make("select[is='ms-dropdown']");
        /**
         * Not a good idea to override this
         * but if you want to use document.createElement("select"); this can be enable for safari.
         * how to use:
         * var select = document.createElement("select", {is:'ms-dropdown'});
         * select.setAttribute("is", "ms-dropdown");
         * select.options[0] = new Option("Hashtag CMS", "https://www.hashtagcms.org"); // add an option
         * select.options[1] = new Option("My Website", "https://www.marghoobsuleman.com"); // add an option
         * document.body.appendChild(select);
         */

        /*
        window.addEventListener("load", ()=> {
            let OriginalAppendChild = Element.prototype.appendChild;
            Element.prototype.appendChild = function() {
                OriginalAppendChild.apply(this, arguments);
                let select = arguments[0];
                if(select.nodeName === "SELECT" && select.getAttribute("is") === "ms-dropdown") {
                    select.msDropdown = new MsDropdown(select);
                }
            };

        })
         */

    }
})();
