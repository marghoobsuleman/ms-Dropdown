import MsDropdown from "./dd";

class dd extends HTMLSelectElement {

    constructor(element, settings) {
        super();
        this.msDropdown = new MsDropdown(this);
    }


    connectedCallback() {
        try {
            this.addEventListener("change", (evt)=> {
                if(!this.multiple) {
                    this.msDropdown.selectedIndex = this.selectedIndex;
                } else {
                    this.msDropdown.refresh();
                }
              //
            });

        } catch (e) {
            console.log(e.message);
        }


    }

    disconnectedCallback() {
        //console.log('disconnectedCallback');
    }

    adoptedCallback() {
        //console.log('adoptedCallback');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        //console.log('attributes changed.' , name, oldValue, newValue);
    }

    static get observedAttributes() { return [
        'data-maincss',
        'data-showicon',
        'data-usesprite',
        'data-event',
        'data-jsontitle',
        'data-childwidth',
        'data-childheight',
        'data-enablecheckbox',
        'data-checkboxnamesuffix',
        'data-append',
        'data-prepend',
        'data-enableautofilter',
        'data-visiblerows'
    ];
    }

}

customElements.define('ms-dropdown', dd, {extends:'select'});