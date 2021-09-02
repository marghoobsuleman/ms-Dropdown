import WebComponent from "./lib/dd-webcomponent";
import MsDropdown from './lib/dd';
window.MsDropdown = MsDropdown;


(function () {
    let selects = document.querySelectorAll("select[is='ms-dropdown']");
    let total = selects.length;
    for(let i=0;i<total;i++) {
        let current = selects[i];
        if(!current.msDropdown) {
            let msdd = new MsDropdown(current);
            current.addEventListener("change", ()=> {
                msdd.selectedIndex = this.selectedIndex;
            });
            current.msDropdown = msdd;
        }
    }
})();
