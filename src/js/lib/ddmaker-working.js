// MSDropdown - dd.js
// author: Marghoob Suleman - https://www.marghoobsuleman.com/
// Updated: 17 Aug, 2021
// Version: 4.0
// Revision: 1
// web: www.marghoobsuleman.com
/*
// msDropdown is free web component: you can redistribute it and/or modify
// it under the terms of the either the MIT License or the Gnu General Public License (GPL) Version 2
*/

/***
 * Let define some private vars
 */
let tabIndex = -1;
export default class ddMaker {

    constructor(ele, settings) {

        let defaultSettings = {
            byJson: {
                data: null, selectedIndex: 0, name: null,
                size: 0, multiple: false, width: 250
                },
            mainCSS: 'ms-dd pr',
            rowHeight: null,
            visibleRows: null,
            showIcon: true,
            zIndex: 9999,
            event:'click',
            style: '',
            childWidth:null,
            childHeight:null,
            enableCheckbox:false, //this needs to multiple or it will set element to multiple
            checkboxNameSuffix:'_mscheck',
            append:null,
            prepend:null,
            showPlusItemCounter:true,
            enableAutoFilter:true,
            showListCounter:false,
            on: {create: null,open: null,close: null,add: null,remove: null,change: null,blur: null,click: null,dblclick: null,mousemove: null,mouseover: null,mouseout: null,focus: null,mousedown: null,mouseup: null}
        };

        this.ele = ele;
        //merge with data settings
        this._settings = {...defaultSettings, ...settings};
        this._css = {};
        this._onDocumentClick = null; this._onDocumentKeyDown = null; this._onDocumentKeyUp = null;
        this._isOpen = false;
        this._DOWN_ARROW = 40; this._UP_ARROW = 38; this._LEFT_ARROW=37; this._RIGHT_ARROW=39;
        this._ESCAPE = 27; this._ENTER = 13; this._ALPHABETS_START = 47; this._SHIFT=16;
        this._CONTROL = 17; this._MAC_CONTROL = 91; this._BACKSPACE=8; this._DELETE=46;
        this._shiftHolded = false; this._controlHolded = false;
        this._isFirstTime = true; this._cacheEle = {};
        this._isMouseDown = false; this._itemsArr = [];

        this._css = {dd:this._settings.mainCSS,
            wrapperDisabled:'disabled',
            headerA:"ms-list-option option-selected",
            header: 'ms-dd-header',
            arrow: 'ms-dd-arrow',
            arrowDown: 'ms-dd-pointer-down',
            arrowUp: 'ms-dd-pointer-up',
            headerCounter:'ms-header-counter',
            listOfItems: 'ms-options',
            item: 'ms-list-option',
            itemSpan:'ib-middle',
            itemLabel:'ms-dd-label',
            itemImage:'ms-dd-option-image',
            itemDesc: 'ms-dd-desc',
            spanLabel:'ms-dd-label',
            itemSelected: 'option-selected',
            itemDisabled:'disabled',
            optgroup: "optgroup"
        };
        //init
        this._wrapper = {};
        this._createByJson();
        this._checkDataSettings();
        this._isList = (this.ele.size>1 || this.ele.multiple==true) ? true : false;
        if (this._isList || this._settings.enableCheckbox === true) {
            this._isMultiple = this.ele.multiple = true;
        }
        this._init();

    }

    /**
     * Init
     * @private
     */
    _init() {

        this._makeLayout();

        this._updateUiAndValueByIndex(this.selectedIndex);

        if(this.ele.size > 1) {
            this._makeUiAsList(true, this.ele.size);
            this._scrollToItem();
        }

        //adjust child width
        if(this._settings.childWidth !== null) {
            this._wrapper.listOfItems.style.width = this._settings.childWidth;
        }
        //hide original
        this._showHideOriginal(false);
    }

    /**
     * Show hide Original
     * @param isShow
     * @private
     */
    _showHideOriginal(isShow=true) {
        if(isShow) {
            this._show(this.ele);
        } else {
            this._hide(this.ele);
        }

    }

    /**
     * Check data settings.
     * Read from select data-* attributes
     * @private
     */
    _checkDataSettings() {
        let dataSet = this._getDataSet(this.ele);
        let settings = this._settings;
        settings.mainCSS = dataSet.maincss || settings.mainCSS;
        settings.showIcon = dataSet.showicon || settings.showIcon;
        settings.event = dataSet.event || settings.event;
        settings.jsonTitle = dataSet.jsontitle || settings.jsonTitle;
        settings.childWidth = dataSet.childwidth || settings.childWidth;
        settings.childHeight = dataSet.childheight || settings.childHeight;
        settings.enableCheckbox = dataSet.enablecheckbox || settings.enableCheckbox;
        settings.checkboxNameSuffix = dataSet.checkboxnamesuffix || settings.checkboxNameSuffix;
        settings.append = dataSet.append || settings.append;
        settings.prepend = dataSet.prepend || settings.prepend;
        settings.enableAutoFilter = dataSet.enableautofilter || settings.enableAutoFilter;
        settings.visibleRows = dataSet.visiblerows || settings.visibleRows;
        settings.showPlusItemCounter = dataSet.showplusitemcounter || settings.showPlusItemCounter;

        //make it boolean
        settings.enableAutoFilter = (settings.enableAutoFilter.toString() === "true");
        settings.showPlusItemCounter = (settings.showPlusItemCounter.toString() === "true");
        settings.enableCheckbox = (settings.enableCheckbox.toString() === "true");
        settings.showIcon = (settings.showIcon.toString() === "true");


        this._settings = {...this._settings, ...settings};

    }

    /**
     * Create by json
     * @private
     */
    _createByJson() {
        if (this._settings.byJson.data) {
            try {
                let json = this._settings.byJson;
                //this._settings.byJson.data = settings.byJson.data;
                //change element
                let obj = {};
                obj.name = json.name || this.ele.id || "";
                if (json.size>0) {
                    obj.size = json.size;
                }
                if(json.multiple) {
                    obj.multiple = json.multiple;
                }

                let oSelect = this._createEle("select", obj);
                let total = json.data.length;
                for(let i=0;i<total;i++) {
                    let current = json.data[i];
                    let opt = new Option(current.text, current.value);
                    for(let p in current) {
                        if (current.hasOwnProperty(p) && p.toLowerCase() !== 'text') {
                            let key = `data-${p}`;
                            opt.setAttribute(key, current[p]);
                        }
                    }
                    oSelect.options[i] = opt;
                }
                //add this
                this.ele.appendChild(oSelect);

                oSelect.selectedIndex = json.selectedIndex;
                if(json.width) {
                    this.ele.style.width = json.width+'px';
                }

                //now change element for the base ele
                this.ele = oSelect;

            } catch(e) {
                throw "There is an error in json data.";
            }
        }
    }
    /**
     * Scroll to item
     * @param item
     * @param behavior
     */
    _scrollToItem(item, behavior='smooth') {
        item = item || this.uiData.ui;
        if(item) {
            item = item.length > 1 ? item[0] : item;
            this._scrollToIfNeeded(item);
        }
    }

    /**
     * Show filter box
     * @param isShow
     * @private
     */
    _showHideFilterBox(isShow=true) {
        if(isShow) {
            this._show(this._wrapper.filterHolder);
            this._wrapper.filterInput.focus();
            this._hide(this._wrapper.headerA);
        } else {
            this._wrapper.filterInput.value = "";
            this._hide(this._wrapper.filterHolder);
            this._show(this._wrapper.headerA);
        }

    }

    /**
     * Apply filters
     * @param e
     * @private
     */
    _applyFilters(e) {
        let sText = this._wrapper.filterInput.value;
        if (sText.length === 0) {
            this._show(this._wrapper.headerA);
            this._makeChildren();
        } else {
            this._hide(this._wrapper.headerA);
            //hide all
            let options = [...this.options];
            let filterOptions = options.filter(function(item) {
                return item.disabled === false && item.text.toLowerCase().indexOf(sText.toLowerCase()) >= 0;
            });
            this._makeChildren(filterOptions);
        }

    }

    /**
     * Make filter box
     * @return {any}
     * @private
     */
    _makeFilterBox() {
        let div = this._createEle("div", {className:'ms-filter-box'})
        let input = this._createEle("input",   {name:'_text_filter'});
        div.appendChild(input);
        this._wrapper.filterInput = input;
        this._wrapper.filterHolder = div;

        this._bindEvents(input, "keyup", (evt)=> {
            if(evt.keyCode >= this._ALPHABETS_START || evt.keyCode === this._BACKSPACE || evt.keyCode === this._DELETE) {
                this._applyFilters(evt);
                evt.preventDefault();
                evt.stopPropagation();
            }

        });

        return div;
    }

    /**
     * Make header
     * @return {any}
     * @private
     */
    _makeHeader() {
        let css = this._css;
        let divHeader = this._createEle("div", {className:css.header});
        let headerA = this._createEle("a", {className:css.headerA});
        //headerA.innerHTML = ``;
        let arrow = this._createEle("span", {className:css.arrow + ' '+css.arrowDown});
        divHeader.appendChild(headerA);
        divHeader.appendChild(arrow);
        this._wrapper.header = divHeader;
        this._wrapper.headerA = headerA;
        this._wrapper.arrow = arrow;
        return divHeader;
    }

    /**
     * Make children
     * @param byOption
     * @return {*}
     * @private
     */
    _makeChildren(byOption=null) {
        let css = this._css;
        let isCheckbox = (this._settings.enableCheckbox.toString() === "true");
        let ul;
        //use old one holder if required
        if(!this._wrapper.listOfItems) {
            ul = this._createEle("ul", {className:css.listOfItems, zIndex: this._settings.zIndex});
            this._wrapper.listOfItems = ul;
        } else {
            ul = this._wrapper.listOfItems;
        }
        ul.innerHTML = ""; //clear old one
        let options = (byOption ===null) ? this.options : byOption;
        let optLen = options.length;
        for (let i=0;i<optLen;i++) {
            let opt = this._parseOption(options[i]);
            let isSelected = opt.selected;
            let isDisabled = opt.disabled;
            //{image, title, description, value, text, className, imagecss, index, selected, disabled}
            let itemObj = {
                label: {
                    text:opt.text,
                    css:css.itemLabel
                },
                img: {
                    src:opt.image,
                    css:css.itemImage
                },
                desc: {
                    text:opt.description,
                    css:css.itemDesc
                },
                isDisabled:isDisabled,
                isCheckbox:isCheckbox,
                value:opt.value,
                title:opt.title,
                imageCss:`${opt.imagecss} ${opt.className}`,
                counter:i+1
            };

            let li = this._createRow(itemObj);
            if(opt.className !== '') {
                li.className = li.className + " "+opt.className;
            }
            if(opt.internalStyle !== '') {
                li.style = opt.internalStyle;
            }

            li.index = opt.index;


            ul.appendChild(li);

            if(isSelected) {
                this._setSelectedByItem(li, true);
            }
            if(!isDisabled) {
                this._bindEvents(li, "mouseup", (evt)=> {
                    this._isMouseDown = false;
                    if(!isCheckbox || evt.target.nodeName !== "INPUT") {
                        if(!this._isList) {
                            this.close(evt);
                        }
                    }
                });

                this._bindEvents(li, "mousedown", (evt)=> {
                    this._isMouseDown = true;
                    if(!isCheckbox || evt.target.nodeName !== "INPUT") {
                        if(this._shiftHolded && this._isMultiple) {
                            //multiple select if shift is pressed
                            let oldIndex = this.selectedIndex;
                            let newIndex = li.index;
                            this._setSelectedByIndexFromTo(oldIndex, newIndex);
                        } else if(this._controlHolded && this._isMultiple) {
                            //select another one without resetting
                            this._setSelectedByItem(li, false, false);
                        } else {
                            //normal click
                            this._setSelectedByItem(li);
                        }
                    } else {
                        //this is checkbox - make it toggle
                        this._setSelectedByItemToggle(li._refCheckbox, li);
                    }
                });

                this._bindEvents(li, "mouseover", (evt)=> {

                    if(this._isMouseDown && this._isMultiple) {
                        this._setSelectedByItem(li, false, false);
                    }

                });

            }

        }
        if(this._settings.childHeight !== null) {
            ul.style.maxHeight = this._settings.childHeight+'px';
        }
        return ul;
    }

    /**
     * Make Layout
     * @return {any}
     * @private
     */
    _makeLayout() {
        tabIndex = (this.ele.tabIndex===0) ? tabIndex+1 : this.ele.tabIndex+1;
        this.ele.tabIndex = -1;
        let css = this._css;
        let wrapper = this._createEle("div", {tabIndex:tabIndex, className:css.dd});

        //Make header
        let divHeader = this._makeHeader();

        let filterBox = this._makeFilterBox();
        divHeader.appendChild(filterBox);
        this._showHideFilterBox(false);

        //make options
        let childHolder = this._createEle("div", {className:"ms-options"});
        let ul = this._makeChildren();
        wrapper.appendChild(divHeader);

        //wrapper.appendChild(filterBox);
        wrapper.appendChild(ul);
        wrapper.appendChild(childHolder);

        this._wrapper.holder = wrapper;



        //add in document
        this._insertAfter(wrapper, this.ele);

        //hide children
        this._hide(ul);

        this._bindEvents(divHeader, this._settings.event, ()=> {
            this.open();
        });

        if(this.disabled) {
            wrapper.classList.add(css.wrapperDisabled);
        }

        let style = this._getInternalStyle(this.ele);
        wrapper.setAttribute("style", style);

        //clear
        let div = this._createEle("div", {style:"clear:both"});
        wrapper.appendChild(div);

        this._bindEvents(this._wrapper.holder, "focus", (evt) => {
            if(this._isList) {
                this._bindDocumentEvents(null, false, true);
            }
        });
        this._bindEvents(this._wrapper.holder, "blur", (evt) => {
            if(this._isList) {
                this._unbindDocumentEvents();
            }
        });

        return wrapper;
    }

    /**
     * Create a row
     * @param obj
     * @param withLi
     * @return {any}
     */
    _createRow(obj, withLi=false) {

        let labelText = obj.label;
        let desc = obj.desc;
        let imgSrc = obj.imgSrc;

        let li = this._createEle("li", {className:this._css.item});
        if(obj.isCheckbox) {
            let checkbox = this._createEle("input", {type:"checkbox", disabled:obj.isDisabled, "checked":false, value:obj.value, name:this.name+this._settings.checkboxNameSuffix+"[]"})
            li.appendChild(checkbox);
            li._refCheckbox = checkbox;
        }

        let itemSpan = this._createEle("span", {className:this._css.itemSpan});

        let text = (this._settings.showListCounter === true) ? `<span class='ms-list-counter'>${obj.counter}</span> ${obj.label.text}` : obj.label.text;

        let textSpan = this._createEle("span", {className:obj.label.css}, text);

        if(obj.img.src != null) {
            let img = this._createEle("img", {className:obj.img.css, src:obj.img.src});
            li.appendChild(img);
        }

        if(obj.img.src === null && obj.imageCss.replace(/\s/g, '') !== '') {
            let imgSpan = this._createEle("span", {className:obj.img.css+' '+obj.imageCss}, "&nbsp;");
            li.appendChild(imgSpan);
        }

        itemSpan.appendChild(textSpan);
        li.appendChild(itemSpan);

        if(obj.desc.text != null) {
            let spanDesc = this._createEle("span", {className:obj.desc.css}, obj.desc.text);
            itemSpan.appendChild(spanDesc);
        }
        if(obj.isDisabled) {
            li.classList.add(this._css.itemDisabled);
        }

        if(obj.title !== '') {
            li.title = obj.title;
        }
        return li;
    }

    /**
     * Parse option
     * @param opt
     * @return {{image: *, description: *, index: *, className: *, disabled: *, text: *, imagecss: *, title: *, internalStyle: *, value: *, selected: *}}
     * @private
     */
    _parseOption(opt) {
        let image = null, title ='', description='', value='', text='', className='', imagecss = '', index=-1, selected, disabled, internalStyle;
        if (opt !== undefined) {
            let dataSet = opt.dataset;
            text = opt.text;
            value = opt.value || text;
            index = opt.index;
            selected = opt.selected;
            disabled = opt.disabled;

            className = opt.className || "";
            title = dataSet.title || '';
            description = dataSet.description || '';
            image = dataSet.image || image;
            imagecss = dataSet.imagecss || '';
            internalStyle = this._getInternalStyle(opt);

        }

        return {image, title, description, value, text, className, imagecss, index, selected, disabled, internalStyle};

    }

    /**
     * remove old selected
     * @private
     */
    _removeOldSelected() {
        let oldSelected = this._getAllEle("ul li."+this._css.itemSelected, this._wrapper.holder);

        //remove old selected
        for(let i=0;i<oldSelected.length;i++) {
            oldSelected[i].classList.remove(this._css.itemSelected);
            if(this._isMultiple) {
                oldSelected[i]._refCheckbox.checked = false;
                //this._getEle("input", oldSelected[i]).checked = false;
            }
        }

    }

    /**
     * Select by index a to b
     * @param indexA
     * @param indexB
     * @private
     */
    _setSelectedByIndexFromTo(indexA, indexB) {

        let min = Math.min(indexA, indexB);
        let max = Math.max(indexA, indexB);
        let options = this.optionsUI;

        for(let i=min;i<=max;i++) {

            this._setSelectedByItem(options[i], false, false);
        }
    }
    /**
     * Toggle Select
     * @private
     * @param evt
     * @param li
     */
    _setSelectedByItemToggle(checkbox, li) {
        let isChecked = !checkbox.checked;
        let index = li.index;
        if(isChecked) {
            li.classList.add(this._css.itemSelected);
            this.ele.options[index].selected = true;
        } else {
            li.classList.remove(this._css.itemSelected);
            this.ele.options[index].selected = false;
        }
        this._updateUiAndValue();
    }

    /**
     * Set selected by an item
     * @param ele
     * @param dontThink
     * @param resetOldSelected
     * @private
     */
    _setSelectedByItem(ele, dontThink=false, resetOldSelected=true) {

        if(dontThink && ele) {

            ele.classList.add(this._css.itemSelected);

        } else {
            let index = ele.index;
            if(resetOldSelected === true) {
                this._removeOldSelected();
                this.ele.selectedIndex = index
            } else {
                //it could be multiple
                this.ele.options[index].selected = true;
            }
            ele?.classList?.add(this._css.itemSelected);
            this._updateUiAndValue();
        }
        if(this._settings.enableCheckbox) {
            if(ele?._refCheckbox) {
                ele._refCheckbox.checked = true;
            }
        }
    }

    /**
     * Set selected by an select option item
     * @param option
     * @private
     */
    _setSelectedByOptionItem(option) {
        let index = option.index;
        let dataAndUI = this._getDataAndUI(index);
        this._setSelectedByItem(dataAndUI.ui);
    }

    /**
     * Update header ui
     * @param byData
     * @param innerHTML
     * @private
     */
    _updateHeaderUI(byData=null, innerHTML=null) {

        let dataAndUI = (byData === null) ? this.uiData : byData;

        let text = this._isArray(dataAndUI.index) ? dataAndUI.ui[0].innerHTML : null;
        if(this._settings.showPlusItemCounter && text !== null) {
            text = text +  `<span class="${this._css.headerCounter}">&nbsp; (+${dataAndUI.ui.length-1})</span>`;
        }
        this._wrapper.headerA.innerHTML = (innerHTML !== null) ? innerHTML : text || dataAndUI?.ui?.innerHTML || "&nbsp;";
        if(this._settings.showIcon.toString() === "false") {
            let img = this._getEle("img", this._wrapper.headerA);
            if(img) {
                this._hide(img);
            }
        }

        this._setTitleMinHeight(false);

    }

    /**
     * Find index By index prop
     * @param index
     * @return {null|*}
     * @private
     */
    _findElementByIndexProp(index) {
        let options = this._getAllEle("ul li", this._wrapper.holder);
        let total = options.length;
        for(let i=0;i<total;i++) {
            let current = options[i];
            if(current.index == index) {
                return options[i];
            }
        }
        return null;
    }

    /**
     * Get data and value
     * @param byIndex
     * @return {{data: *, ui: *, index: *, option: *}}
     * @private
     */
    _getDataAndUI(byIndex=null) {

        let ele = this.ele;
        let data, ui, option=null, index=-1;
        let obj, $this=this;
        let getByIndex = function(byIndex) {
            let option = ele.options[byIndex];
            let data = $this._parseOption(option);
            let index = byIndex;
            let ui = $this._findElementByIndexProp(index);
            return {option, data, index, ui};
        };

        if(byIndex !== null) {
            obj = getByIndex(byIndex);
            option = obj.option;
            data = obj.data;
            index = obj.index;
            ui = obj.ui;
        } else {
            ui = this._getAllEle("ul li." + this._css.itemSelected, this._wrapper.holder);
            // if this is multiple
            if (ui.length > 1) {
                let data_a = [], opt_a = [], ind_a = [], ui_a = [];
                for (let i = 0; i < ui.length; i++) {
                    obj = getByIndex(ui[i].index);
                    data_a.push(obj.data);
                    opt_a.push(obj.option);
                    ind_a.push(obj.index);
                    ui_a.push(obj.ui);
                }
                data = data_a;
                option = opt_a;
                index = ind_a;
                ui = ui_a;
            } else {
                obj = getByIndex(ui[0]?.index);
                option = obj.option || null;
                data = obj.data || null;
                index = obj.index || -1;
                ui = obj.ui || null;
            }
        }


        return {data, ui, index, option};
    }

    /**
     * Is Array
     * @param obj
     * @return {boolean}
     * @private
     */
    _isArray = function(obj) {
        return (Object.prototype.toString.call(obj)=="[object Array]") ? true : false;
    };

    /**
     * Update Header UI by data
     * @param byData
     * @private
     */
    _updateUiAndValue(byData=null) {
        let dataAndUI = (byData === null) ? this.uiData : byData;
        this._updateHeaderUI(dataAndUI);
    }

    /**
     * Update Ui by index
     * @param index
     * @private
     */
    _updateUiAndValueByIndex(index) {
        let dataAndUI = this._getDataAndUI(index);
        this._updateHeaderUI(dataAndUI);
    }

    /****  Elements and Helpers ****/
    /**
     * Create an element
     * @param nm
     * @param attr
     * @param html
     * @return {any}
     * @private
     */
    _createEle(nm, attr, html) {
        let tag = document.createElement(nm);
        if (attr) {
            for(let i in attr) {
                if(i === "style") {
                    tag.style.cssText = attr[i];
                } else {
                    tag[i]  = attr[i];
                }
            }
        }
        if (html) {
            tag.innerHTML = html;
        }
        return tag;
    }

    /**
     * Get one element
     * @param ele
     * @param where
     * @return {*}
     * @private
     */
    _getEle(ele, where=null) {
        return (where===null) ? document.querySelector(ele) : where.querySelector(ele);
    }

    /**
     * Get all elements
     * @param ele
     * @param where
     * @return {any}
     * @private
     */
    _getAllEle(ele, where=null) {
        return where === null ? document.querySelectorAll(ele) : where.querySelectorAll(ele);
    }

    /**
     * Get internal style of an element
     * @param ele
     * @return {string|*}
     * @private
     */
    _getInternalStyle(ele) {
        return (ele.style === undefined) ? "" : ele.style.cssText;;
    }

    /**
     * Toggle show
     * @param ele
     * @private
     */
    _toggleShow(ele) {
        ele.style.display = (ele.style.display === "none" || ele.style.display==="") ? "inherit" : "none";
    }

    /**
     * Show an element
     * @param ele
     * @private
     */
    _show(ele) {
        ele.style.display = "inherit";
    }

    /**
     * Hide an element
     * @param ele
     * @private
     */
    _hide(ele) {
        ele.style.display = "none";
    }

    /**
     * Insert an element after an element
     * @param ele
     * @param targetEle
     * @return {*}
     * @private
     */
    _insertAfter(ele, targetEle) {
        return targetEle.parentNode.insertBefore(ele, targetEle.nextSibling);
    }

    /**
     * Not using for now
     * Insert an element before a target element
     * @param ele
     * @param targetEle
     * @return {*}
     * @private
     */
    _insertBefore(ele, targetEle) {
        return targetEle.insertBefore(ele, targetEle);
    }

    /**
     * get index of a li - not in used
     * @param li
     * @return {number}
     * @private
     */
    _getIndex(li) {
        let LIs = this._getAllEle("ul li",this._wrapper.holder);
        return [...LIs].indexOf(li);
    }

    /**
     * Get properties or a property - not in used
     * @param ele
     * @param key
     * @return {null|*}
     * @private
     */
    _getProp(ele, key) {
        let obj = {};
        for (let i = 0; i < ele.attributes.length; i++) {
            let k = ele.attributes[i].nodeName;
            let v = ele.attributes[i].nodeValue;
            if(key == k) {
                return v;
            }
            obj[k] = v;
        }
        return (typeof key === "undefined") ? obj : null;
    }

    /**
     * Get dataset
     * @param ele
     * @param key
     * @return {*|null}
     * @private
     */
    _getDataSet(ele, key=null) {
        return (key === null) ? ele.dataset : ele.dataset[key] || null;
    }

    /**
     * Bind an event
     * @param ele
     * @param type
     * @param cb
     * @private
     */
    _bindEvents(ele, type, cb) {
        ele.addEventListener(type, cb);
    }

    /**
     * Remove events
     * @param ele
     * @param type
     * @param fn
     * @private
     */
    _unbindEvents(ele, type, fn) {
        ele.removeEventListener(type, fn);
    }

    /**
     * Adjust child height
     * @param row
     * @private
     */
    _adjustChildHeight(row=null) {
        row = (row === null) ? parseInt(this._settings.visibleRows) : row;
        if(row !== null) {
            let li = this._getEle("li", this._wrapper.listOfItems);
            let size = (this._settings.rowHeight !== null) ? this._settings.rowHeight : li.clientHeight;
            this._wrapper.listOfItems.style.height = (row * size)+'px';
        }

    }

    /**
     * Set max height
     * @param autoHeightByMax
     * @private
     */
    _setTitleMinHeight(autoHeightByMax=true) {
        let max = 0;
        if(autoHeightByMax === true) {
            let lis = this._getAllEle("li", this._wrapper.listOfItems);
            let len = lis.length;
            for(let i=0;i<len;i++) {
                let current = lis[i];
                max = (current.clientHeight > max) ? current.clientHeight : max;
            }
        } else {
            //this is after selection
            max = this._wrapper.headerA.clientHeight;
        }

        this._wrapper.header.style.minHeight = max+"px";
    }


    /**
     * Make Ui as list
     * @param val
     * @param row
     * @private
     */
    _makeUiAsList(val, row) {
        if(val === true) {
            //update height
            this._hide(this._wrapper.header);
            this.open(null, true);
            this._adjustChildHeight(row);
            this._wrapper.listOfItems.style.position = "relative";
            this._wrapper.listOfItems.style.display = "inline-block";
        } else {
            this._show(this._wrapper.header);
            this._wrapper.listOfItems.style.height = null;
            this._wrapper.listOfItems.style.position = "absolute";
            this.close(null);
        }
    }

    /**
     * Bind document events
     * @param evt
     * @private
     */
    _bindDocumentEvents(evt, documentClick=true, documentKeyDown=true) {

        this._unbindDocumentEvents();

        this._onDocumentClick = (evt) => {
            //is outside?
            let box = this._wrapper.listOfItems.getBoundingClientRect();
            let headerBox = this._wrapper.header.getBoundingClientRect();
            let areaX = box.left + box.width;
            let areaY = (headerBox.top + box.height+headerBox.height);

            if(evt.clientX < box.left || evt.clientX > areaX || evt.clientY < headerBox.y || evt.clientY > areaY) {
                this.close(evt);
            }
        };

        this._onDocumentKeyDown = (evt) => {

            switch (evt.keyCode) {
                case this._DOWN_ARROW:
                case this._RIGHT_ARROW:
                    evt.preventDefault();
                    evt.stopPropagation();
                    this._show(this._wrapper.listOfItems);
                    this._isOpen = true;
                    this.next();
                    break;
                case this._UP_ARROW:
                case this._LEFT_ARROW:
                    evt.preventDefault();
                    evt.stopPropagation();
                    this.previous();
                    break;
                case this._ESCAPE:
                case this._ENTER:
                    evt.preventDefault();
                    evt.stopPropagation();
                    this.close(null);
                    break;
                case this._SHIFT:
                    this._shiftHolded = true;

                    break;
                case this._CONTROL:
                case this._MAC_CONTROL:

                    this._controlHolded = true;
                    break;
                default:
                    if (evt.keyCode >= this._ALPHABETS_START && this._isList === false) {
                        this._showHideFilterBox(true);
                        //this._applyFilters();
                    }
                    this._shiftHolded = false;
                    this._controlHolded = false;
                    break;
            }
        };

        this._onDocumentKeyUp = (evt) => {
            this._shiftHolded = false;
            this._controlHolded = false;
        };

        if(documentClick === true) {
            this._bindEvents(document, "mouseup", this._onDocumentClick);
        }

        if(documentKeyDown === true) {
            this._bindEvents(document, "keydown", this._onDocumentKeyDown);
            this._bindEvents(document, "keyup", this._onDocumentKeyUp);

        }

    }

    /**
     * Unbind document events
     * @private
     */
    _unbindDocumentEvents() {
        //remove events
        if(this._onDocumentClick != null) {
            this._unbindEvents(document, "mouseup", this._onDocumentClick);
        }
        if(this._onDocumentKeyDown != null) {
            this._unbindEvents(document, "keydown", this._onDocumentKeyDown);
        }
        if(this._onDocumentKeyUp != null) {
            this._unbindEvents(document, "keyup", this._onDocumentKeyUp);
        }


        this._onDocumentClick = null;
        this._onDocumentKeyDown = null;
        this._onDocumentKeyUp = null;
    }

    /**
     * Scroll if needed
     * @param item
     * @param pos
     * @param goingWhere
     * @private
     */
    _scrollToIfNeeded(item=null, pos=null, goingWhere="next") {
        let child = this._wrapper.listOfItems;
        let childBound = child.getBoundingClientRect();
        if(item === null && pos !== null) {
            child.scrollTop = pos;
        }
        //if scroll is needed
        item = (item !== undefined) ? item : this._getEle( "li." + this._css.itemSelected);
        if (item) {
            let itemPos = item.offsetTop;
            let ch = child.clientHeight;
            let itemHeight = (item.clientHeight); //for next

            if ((itemPos+itemHeight) - child.scrollTop > ch && goingWhere==='next') {
                child.scrollTop = (itemPos+itemHeight) - ch;
            } else if((itemPos - child.scrollTop) < 0   && goingWhere==='previous') {
                child.scrollTop = (itemPos);
            }
        }
    }

    /*****************  Public methods and props *********** /
     /**
     * Add an item to select
     * Object can be pass as below
     * new Option("Label", "value") or
     * {text:"Label", value:"value"}
     * or Label as string
     * or full object ie {text:"", value:"", description:'', image:'', className:'' title:''}
     * @param obj
     *
     */

    add(obj, index=null) {
        //
        let text, value, title, image, description, imagecss;
        let opt;
        if(obj instanceof HTMLOptionElement) {
            opt = obj;
        } else if(typeof obj === "string") {
            //passing as string
            text = value = obj;
            opt = new Option(text, value);
        } else if(obj instanceof Object) {
            text = obj.text || '';
            value = obj.value || text;
            title = obj.title || '';
            image = obj.image || '';
            imagecss = obj.imagecss || '';
            description = obj.description || '';
            opt = new Option(text, value);
            opt.setAttribute("data-description", description);
            opt.setAttribute("data-image", image);
            opt.setAttribute("data-title", title);
            opt.setAttribute("data-imagecss", imagecss);
        }
        this.ele.add(opt, index);
        this._makeChildren();
    }

    /**
     * Remove an item from select
     * @param index
     */
    remove(index) {
        this.ele.remove(index);
        this._makeChildren();
    }

    /**
     * Move to next index
     */
    next() {
        let items = this.optionsUI;
        let $this = this;
        let _getNextElem = function(ele) {
            if(ele && ele?.nextElementSibling?.classList.contains($this._css.itemDisabled)) {
                return _getNextElem(ele.nextElementSibling);
            }
            return ele?.nextElementSibling || null;
        };

        if(items.length > 0) {
            let currentSelectedItem = this._getEle(`li.${this._css.itemSelected}`, this._wrapper.listOfItems);
            if(currentSelectedItem) {
                let nextEle = _getNextElem(currentSelectedItem);
                if(nextEle) {
                    this._setSelectedByItem(nextEle, false, true);
                    this._scrollToIfNeeded(nextEle);
                }
            } else {
                this._setSelectedByItem(items[0], false, true);
                this._scrollToIfNeeded(items[0]);
            }
        }

    }

    /**
     * Move to previous index
     */
    previous() {
        let items = this.optionsUI;
        let $this = this;

        let _getPreviousElem = function(ele) {

            if(ele && ele?.previousElementSibling?.classList.contains($this._css.itemDisabled)) {
                return _getPreviousElem(ele.previousElementSibling);
            }
            return ele?.previousElementSibling || null;
        };

        if(items.length > 0) {
            let currentSelectedItem = this._getEle(`li.${this._css.itemSelected}`, this._wrapper.listOfItems);
            if(currentSelectedItem) {
                let prevEle = _getPreviousElem(currentSelectedItem);
                if(prevEle) {
                    this._setSelectedByItem(prevEle, false, true);
                    this._scrollToIfNeeded(prevEle, null,"previous");
                }
            } else {
                this._setSelectedByItem(items[items.length-1], false, true);
                this._scrollToIfNeeded(items[items.length-1], null, "previous");
            }
        }

    }

    /**
     * Open this dropdown
     */
    open(evt, justOpen=false) {

        if (this.disabled) {
            return;
        }
        if(!this._isOpen) {
            this._isOpen = true;
            this._show(this._wrapper.listOfItems);

            //don't bind event if just opening - useful when making as list
            if(justOpen === false) {
                this._bindDocumentEvents(evt);
            }
            //Change arrow
            this._wrapper.arrow.classList.remove(this._css.arrowDown);
            this._wrapper.arrow.classList.add(this._css.arrowUp);
            this._adjustChildHeight();
            this._scrollToItem();

        } else {
            this.close(null);
        }
    }

    /**
     * Close this dropdown
     * @param arg
     */
    close(evt) {
        let isDisable = false;

        if(evt!==null) {
            evt.stopImmediatePropagation();
            let li = evt.target.closest('li');
            isDisable = (li != null) ? li.classList.contains("disabled") : false;
        }

        if (this.disabled || isDisable) {
            return;
        }
        this._scrollToIfNeeded(null, 0);
        this._hide(this._wrapper.listOfItems);
        this._wrapper.arrow.classList.add(this._css.arrowDown);
        this._wrapper.arrow.classList.remove(this._css.arrowUp);

        //reset few things
        this._isOpen = false;
        this._isMouseDown = false;
        this._shiftHolded = false;
        this._controlHolded = false;
        this._showHideFilterBox(false);
        this._unbindDocumentEvents();
        this._updateHeaderUI();

        //reset list if required
        if(this.ele.length !== this._getAllEle(`li.${this._css.item}`, this._wrapper.listOfItems).length) {
            this._makeChildren();
            this._updateUiAndValue();
        }

    }

    /**
     * Return named item element with data
     * @param name
     */
    namedItem(name) {
        return this.ele.querySelector(`option[name='${name}']`);
    }

    /**
     * Get data by index
     * @param index
     */
    item(index) {
        return this.ele.options[index];
    }

    /**
     * Show hide or get status of visibility
     * @param isShow
     * @return {boolean}
     */
    visible(isShow=null) {

        if(isShow === true) {
            this._show(this._wrapper);
        } else if(isShow === false) {
            this._hide(this._wrapper);
        }
        if(isShow === null) {
            return this._wrapper.style.display === "none";
        }
    }

    /**
     * Calculate item height and set child height - undecided
     * @param numberOfRows
     */
    showRows(numberOfRows) {

    }

    /**
     * Alias of showRows - undecided
     * @param numberOfRows
     */
    visibleRows(numberOfRows) {
        this.showRows(numberOfRows);
    }

    /**
     * Add event listener
     * @param type
     * @param fn
     */
    on(type, fn) {
        this._bindEvents(this.ele, type, fn);
    }

    /**
     * Remove event listener
     * @param type
     * @param fn
     */
    off(type, fn) {
        this._unbindEvents(this.ele, type, fn);
    };

    /**
     * Remake Everything
     */
    refresh() {
        this._makeChildren();
        this._updateUiAndValue();
    }

    /**
     * Destroy UI
     */
    destroy() {
        //show original
        this._show(this.ele);
        this._wrapper.holder.parentNode.removeChild(this._wrapper.holder);
    }


    /*** Props ***/
    /**
     * Get selected index
     * @return {*}
     */
    get selectedIndex() {
        return this.ele.selectedIndex;
    }

    /**
     * Set Index
     * @param index
     */
    set selectedIndex(index) {
        this.ele.selectedIndex = index;
        if(index === -1) {
            //blank
            this._updateHeaderUI(null, "");
            this._removeOldSelected();
        } else {
            this._setSelectedByOptionItem(this.ele.options[index]);
        }
    }

    /**
     * Get options
     * @return {*}
     */
    get options() {
        return this.ele.options;
    }

    /**
     * Set options length
     * @param len
     */
    set options(option) {

        if(option instanceof HTMLOptionElement) {
            this.ele.add(option);
            this._makeChildren();
            this._updateUiAndValue();
        } else if (typeof option === "number") {
            this.ele.length = option;
            this._makeChildren();
            this._updateUiAndValue();
        }
    }

    /**
     * get options UI
     * @return {any}
     */
    get optionsUI() {
        if(this._cacheEle["allItems"]) {
           //return this._cacheEle["allItems"];
        }
        return this._cacheEle["allItems"] = this._getAllEle("li", this._wrapper.listOfItems);
    }

    /**
     * Get length
     * @return {*}
     */
    get length() {
        return this.ele.length;
    }

    /**
     * Set length
     * @param size
     */
    set length(size) {
        this.ele.options.length = size;
        this._makeChildren();
        this._updateUiAndValue();
    }


    /**
     * Get value
     * @return {*}
     */
    get value() {
        return this.ele.value;
    }

    /**
     * Set value
     * @param val
     */
    set value(val) {
        this.ele.value = val;
        this._updateUiAndValue();
    }

    /**
     * get selected text
     * @return {string}
     */
    get selectedText() {
        return ( this.selectedIndex >=0 ) ? this.ele.options[this.selectedIndex].text : ""
    }

    /**
     * Check if this is disabled
     * @return {boolean | * | Function}
     */
    get disabled() {
        return this.ele.hasAttribute('disabled');
    }

    /**
     * Set disabled
     * @param val
     */
    set disabled(val) {
        if (val) {
            this.ele.setAttribute('disabled', '');
            this._wrapper.holder.classList.add(this._css.wrapperDisabled);
        } else {
            this.ele.removeAttribute('disabled');
            this._wrapper.holder.classList.remove(this._css.wrapperDisabled);
        }
    }

    /**
     * Get form name if this is inside a form
     * @return {*}
     */
    get form() {
        return this.ele.form;
    }


    /**
     * Get multiple
     * @return {*}
     */
    get multiple() {
        return this.ele.multiple;
    }

    /**
     * Set multiple
     * @param val
     */
    set multiple(val) {
        if (val) {
            this.ele.setAttribute('multiple', '');
            //update now
        } else {
            this.ele.removeAttribute('multiple');
            this.size = 0;
        }
    }

    /**
     * Get the name
     * @return {*}
     */
    get name() {
        return this.ele.name || "";
    }

    /**
     * Set the name
     * @param val
     */
    set name(val) {
        this.ele.name = val;
    }

    /**
     * Get required
     * @return {*}
     */
    get required() {
        return this.ele.required;
    }

    /**
     * Set required
     * @param val
     */
    set required(val) {
        if (val) {
            this.ele.setAttribute('required', '');
            //update now
        } else {
            this.ele.removeAttribute('required');
        }
    }

    /**
     * return the size/height of the dropdown
     * @return {*}
     */
    get size() {
        return this.ele.size;
    }

    /**
     * Change the height of the element
     * @param val
     */
    set size(val) {
        this.ele.size = val;
        this._makeUiAsList(val > 1, val);
    }


    /**
     * Get selected option
     * @return {null}
     */
    get selectedOptions() {
        return ( this.selectedIndex >=0 ) ? this.ele.options[this.selectedIndex] : null;
    }

    /**
     * Get element children
     * @return {*}
     */
    get children() {
        return this.ele.children;
    }

    /**
     * Get selected ui data
     * @return {{data: *, ui: *, index: *, option: *}}
     */
    get uiData() {
        return this._getDataAndUI();
    }

    /**
     * Get version
     * @return {string}
     */
    get version() {
        return "4.0.0";
    }

}

