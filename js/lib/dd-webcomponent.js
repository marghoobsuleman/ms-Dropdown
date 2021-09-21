import MsDropdown from "./dd";

class dd extends HTMLSelectElement {

    constructor(element, settings) {
        super();
    }


    connectedCallback() {
        if(!this.msDropdown) {
            this.msDropdown = new MsDropdown(this);
        }
        try {
            this.addEventListener("change", (evt)=> {if(!this.multiple) {
                this.msDropdown.selectedIndex = this.selectedIndex;
            } else {
                this.msDropdown.refresh();
            }
            });

        } catch (e) {
            console.log(e.message);
        }


    }

    disconnectedCallback() {
        //console.log('disconnectedCallback');
    }

    adoptedCallback() {
        //console.log('adoptedCallback', this);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(this.msDropdown) {
            if(name.indexOf("data-") !== -1) {
                name = name.replace("data-", "");
                let nameStr = name.toLowerCase().split('-');
                for (let i = 1; i < nameStr.length; i++) {
                    nameStr[i] = nameStr[i].charAt(0).toUpperCase() + nameStr[i].substring(1);
                }
                this.msDropdown.setSettingAttribute(nameStr.join(""), newValue, true); //update settings and refresh
            } else {
                //this.msDropdown[name] = newValue;
            }

        }

    }

    static get observedAttributes() { return [
        'data-main-css',
        'data-show-icon',
        'data-event',
        'data-child-width',
        'data-child-height',
        'data-enable-checkbox',
        'data-checkbox-name-suffix',
        'data-enable-auto-filter',
        'data-visible-rows',
        'data-show-plus-item-counter',
        'data-error-message',
        'data-show-filter-always',
        'data-show-list-counter',
        'data-image-position'
    ];
    }

}

customElements.define('ms-dropdown', dd, {extends:'select'});