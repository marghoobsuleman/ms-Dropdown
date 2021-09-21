/**
 * MSDropdown - ddmaker.js
 * @author: Marghoob Suleman
 * @website: https://www.marghoobsuleman.com/
 * @version: 4.0.2
 * @revision: 5
 * @date: 21st Sep 2021
 * msDropdown is free web component: you can redistribute it and/or modify
 * it under the terms of the either the MIT License or the Gnu General Public License (GPL) Version 2
 */

let _oldC = null;
export default class ddMaker {

    constructor(ele, settings) {
        let defaultSettings = {
            byJson: {
                data: null, selectedIndex: 0, name: null,
                size: 0, multiple: false, width: 250
                },
            mainCss: 'ms-dd',
            rowHeight: null,
            visibleRows: null,
            showIcon: true,
            zIndex: 9999,
            event:'click',
            style: '',
            childWidth:null,
            childHeight:null,
            enableCheckbox:false, //this needs to be multiple or it will set the element to multiple
            checkboxNameSuffix:'_mscheck',
            showPlusItemCounter:true,
            enableAutoFilter:true,
            showFilterAlways:false,
            showListCounter:false,
            imagePosition:'left',
            errorMessage:'Please select an item from this list',
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
        this._CONTROL = 17; this._MAC_CONTROL = 91; this._BACKSPACE=8; this._DELETE=46; this._SPACE=32;
        this._shiftHolded = false; this._controlHolded = false;
        this._isFirstTime = true; this._cacheEle = {};
        this._isMouseDown = false; this._itemsArr = [];
        
        this._css = {dd:this._settings.mainCss+ " ms-pr",
            wrapperDisabled:'disabled',
            headerA:"ms-list-option option-selected",
            header: 'ms-dd-header',
            headerMiddleContent: 'ms-header-middle-content',
            arrow: 'ms-dd-arrow',
            arrowDown: 'ms-dd-pointer-down',
            arrowUp: 'ms-dd-pointer-up',
            headerCounter:'ms-header-counter',
            listOfItems: 'ms-options',
            itemContent:'ms-dd-option-content',
            item: 'ms-list-option',
            itemSpan:'ms-middle',
            itemSpanOpt:'ms-optgroup-padding',
            itemLabel:'ms-dd-label',
            itemImage:'ms-dd-option-image',
            itemDesc: 'ms-dd-desc',
            itemSelected: 'option-selected',
            itemDisabled:'disabled',
            itemEnabled:'enabled',
            optgroup: "ms-optgroup",
            listCounter:'ms-list-counter',
            valueInput:'ms-value-input',
            checkbox:'ms-checkbox',
            imageRight:'ico-align-right'
        };

        //init
        this._wrapper = {};
        this._createByJson();
        this._checkDataSettings();
        this._isList = (this.ele.size>1);
        this._isMultiple =  this.ele.multiple;

        this._enableCheckbox = this._settings.enableCheckbox;

        if (this._isList || this._enableCheckbox.toString() === "true") {
            this._isMultiple = this.ele.multiple = true;
        }

        this._isFilterApplied = false;
        this._nexPrevCounter = 0;

        this._init();

    }

    /**
     * Init
     * @private
     */
    _init() {
        //console.log(this.name, this.selectedIndex)
        this._makeLayout();

        //console.log(this.name, this.selectedIndex)
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


        if(this._settings.showFilterAlways.toString() === "true") {
            this._settings.enableAutoFilter = true;
            this._showHideFilterBox(true);
        }

        if(this.ele.autofocus) {
            this._wrapper.holder.focus();
            this._wrapper.filterInput.focus();
        } else {
            this._wrapper.filterInput.blur();
        }

        this.updateUiAndValue();

        this._fireLocalEventIfExist("create");
        this._fireEventIfExist("onCreate");
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
        settings.mainCss = dataSet?.mainCss || settings.mainCss;
        settings.showIcon = dataSet?.showIcon || settings.showIcon;
        settings.event = dataSet?.event || settings.event;
        settings.childWidth = dataSet?.childWidth || settings.childWidth;
        settings.childHeight = dataSet?.childHeight || settings.childHeight;
        settings.enableCheckbox = dataSet?.enableCheckbox || settings.enableCheckbox;
        settings.checkboxNameSuffix = dataSet?.checkboxNameSuffix || settings.checkboxNameSuffix;
        /*settings.append = dataSet.append || settings.append;
        settings.prepend = dataSet.prepend || settings.prepend;*/
        settings.enableAutoFilter = dataSet?.enableAutoFilter || settings.enableAutoFilter;
        settings.visibleRows = dataSet?.visibleRows || settings.visibleRows;
        settings.showPlusItemCounter = dataSet?.showPlusItemCounter || settings.showPlusItemCounter;
        settings.errorMessage = dataSet?.errorMessage || settings.errorMessage;
        settings.showFilterAlways = dataSet?.showFilterAlways || settings.showFilterAlways;
        settings.showListCounter = dataSet?.showListCounter || settings.showListCounter;
        settings.imagePosition = dataSet?.imagePosition || settings.imagePosition;

        this._settings = {...this._settings, ...settings};

    }

    /**
     * Set setting attribute
     * @param key
     * @param value
     */
    setSettingAttribute(key, value) {
        this._settings[key] = value;
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
                    if(current.disabled) {
                        opt.disabled = true;
                    }
                    for(let p in current) {
                        if (current.hasOwnProperty(p) && p.toLowerCase() !== 'text') {
                            let key = `data-${p}`;
                            key = key.replace(/([A-Z])/g, "-$1").toLowerCase(); //replace caps letter with -letter
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
            if(this._settings.showFilterAlways.toString() === "false") {
                this._hide(this._wrapper.headerA);
            }
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
            this._isFilterApplied = false;
        } else {

            if(this._settings.showFilterAlways.toString() === "false") {
                this._hide(this._wrapper.headerA);
            }
            if(!this._isOpen) {
                this.open(null);
            }

            //hide all
            let options = [...this.options];
            let filterOptions = options.filter(function(item) {
                return item.nodeName !== "OPTGROUP" && item.disabled === false && item.text.toLowerCase().indexOf(sText.toLowerCase()) >= 0;
            });
            this._makeChildren(filterOptions);
            this._isFilterApplied = true;
            this._nexPrevCounter = -1;
            this._scrollToIfNeeded(null, 0);
        }

    }

    /**
     * Make filter box
     * @return {any}
     * @private
     */
    _makeFilterBox() {
        let div = this._createEle("div", {className:'ms-filter-box'})
        let input = this._createEle("input", {type:"text"});
        div.appendChild(input);
        this._wrapper.filterInput = input;
        this._wrapper.filterHolder = div;

        this._bindEvents(input, "input", (evt)=> {
            this._applyFilters(evt);
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
        let headerContent = this._createEle("span", {className:css.headerMiddleContent});
        let arrow = this._createEle("span", {className:css.arrow + ' '+css.arrowDown});
        headerA.appendChild(arrow);
        headerA.appendChild(headerContent);
        divHeader.appendChild(headerA);
        this._wrapper.header = divHeader;
        this._wrapper.headerA = headerA;
        this._wrapper.headerContent = headerContent;
        this._wrapper.arrow = arrow;

        if(this._settings.imagePosition !== "left") {
            headerA.classList.add(css.imageRight);
        }

        this._bindEvents(divHeader, this._settings.event, (evt)=> {
            this.open(evt);
        });

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
        let isCheckbox = (this._enableCheckbox.toString() === "true");
        let ul, $this=this;

        /**
         * Make Object
         * @param opts
         * @param counter
         * @return {{opt: *, itemObj: *}}
         * @private
         */
        let _makeObject = function (opts, counter) {
            let opt = {};
            opt = $this._parseOption(opts);
            //{image, title, description, value, text, className, imageCss, index, selected, disabled}
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
                isDisabled:(opts.disabled || false),
                isSelected:(opts.selected || false),
                isCheckbox:isCheckbox,
                value:opt.value,
                title:opt.title,
                imageCss:`${opt.imageCss} ${opt.className}`,
                counter:counter+1,
                isOptGroup: (opts.nodeName === "OPTGROUP"),
                innerSpanCss:css.itemContent
            };
            return {opt, itemObj};
        };

        /**
         * Bind events
         * @param li
         * @param itemObj
         */
        let bindEvents = function (li, itemObj) {
            if(!itemObj.isDisabled) {
                $this._bindEvents(li, "mouseup", (evt)=> {

                    $this._isMouseDown = false;
                    if(!isCheckbox || evt.target.nodeName !== "INPUT") {
                        if(!$this._isList) {
                            $this.close(evt);
                        }
                    }
                });

                $this._bindEvents(li, "mousedown", (evt)=> {
                    $this._isMouseDown = true;

                    if(!isCheckbox || evt.target.nodeName !== "INPUT") {
                        if($this._shiftHolded && $this._isMultiple) {
                            //multiple select if shift is pressed
                            let oldIndex = $this.selectedIndex;
                            let newIndex = li.index;
                            $this._setSelectedByIndexFromTo(oldIndex, newIndex);
                        } else if($this._controlHolded && $this._isMultiple) {
                            //select another one without resetting
                            $this._setSelectedByItem(li, false, false);
                        } else {
                            //normal click
                            $this._setSelectedByItem(li);
                        }
                    } else {
                        //this is checkbox - make it toggle
                        $this._setSelectedByItemToggle(li._refCheckbox, li);
                    }
                });

                $this._bindEvents(li, "mouseover", (evt)=> {

                    if($this._isMouseDown && $this._isMultiple) {
                        $this._setSelectedByItem(li, false, false);
                    }

                });
            }
        };

        
        //use old one holder if required
        if(!this._wrapper.listOfItems) {
            ul = this._createEle("ul", {className:css.listOfItems, zIndex: this._settings.zIndex});
            this._wrapper.listOfItems = ul;
        } else {
            ul = this._wrapper.listOfItems;
        }
        ul.innerHTML = ""; //clear old one
        let options = (byOption === null) ? this.ele.children : byOption;
        let optLen = options.length;
        for (let i=0;i<optLen;i++) {
            let current = options[i];
            let parseObj = _makeObject(current, i);
            let opt = parseObj.opt;
            let itemObj = parseObj.itemObj;
            let li = this._createRow(itemObj);

            if(opt.className !== '') {
                li.className = li.className + " "+opt.className;
            }
            if(opt.internalStyle !== '') {
                li.style = opt.internalStyle;
            }

            li.index = opt.index;
            li.setAttribute("data-ms-index", opt.index);
                if(itemObj.isOptGroup) {
                //let make children of optgroup
                let c_options = current.children;
                let c_optLen = c_options.length;
                let ul2 = this._createEle("ul");
                for (let j=0;j<c_optLen;j++) {
                    let c_current = c_options[j];
                    let c_parseObj = _makeObject(c_current, j);
                    let c_opt = c_parseObj.opt;
                    let c_itemObj = c_parseObj.itemObj;
                    let c_li = this._createRow(c_itemObj);

                    if(c_opt.className !== '') {
                        c_li.className = c_li.className + " "+c_opt.className;
                    }
                    if(c_opt.internalStyle !== '') {
                        c_li.style = c_opt.internalStyle;
                    }

                    c_li.index = c_opt.index;
                    c_li.setAttribute("data-ms-index", c_opt.index);
                    if(c_itemObj.isSelected) {
                        this._setSelectedByItem(c_li, true);
                    }
                    bindEvents(c_li, c_itemObj);

                    if(this._settings.imagePosition !== "left") {
                        c_li.classList.add(css.imageRight);
                    }
                    ul2.appendChild(c_li);
                }
                li.appendChild(ul2);
            }
            if(!itemObj.isOptGroup) {
                bindEvents(li, itemObj);
            }
            if(this._settings.imagePosition !== "left") {
                li.classList.add(css.imageRight);
            }
            ul.appendChild(li);

            if(itemObj.isSelected) {
                this._setSelectedByItem(li, true);
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
        this.ele.tabIndex = -1;
        let css = this._css;

        let wrapper = this._createEle("div", {tabIndex:0, className:css.dd});

        let name = this.ele.name;
        let isRequired = this.ele.required;

        let valueBox = this._createEle("input", {tabIndex:-1, name:name, type:"text", className:this._css.valueInput, required:isRequired});
        wrapper.appendChild(valueBox);
        this.ele.required = false;
        this.ele.name = "";

        //This is for multiple select
        let moreValueBox = this._createEle("div", {className:"more", style:"display:none"});
        wrapper.appendChild(moreValueBox);

        this._wrapper.valueBox = valueBox;
        this._wrapper.moreValueBox = moreValueBox;


        //Make header
        let divHeader = this._makeHeader();

        //Filter box
        let filterBox = this._makeFilterBox();
        divHeader.appendChild(filterBox);
        this._showHideFilterBox(false);

        //make options
        let ul = this._makeChildren();
        wrapper.appendChild(divHeader);
        wrapper.appendChild(ul);

        this._wrapper.holder = wrapper;


        //add in document
        this._insertAfter(wrapper, this.ele);

        //hide children
        this._hide(ul);

        if(this.disabled) {
            wrapper.classList.add(css.wrapperDisabled);
        }

        let style = this._getInternalStyle(this.ele);
        wrapper.setAttribute("style", style);

        if(this._settings.byJson.data !== null) {
            wrapper.setAttribute("style", `width:${this._settings.byJson.width}px`);
        }


        //clear
        let div = this._createEle("div", {style:"clear:both"});
        wrapper.appendChild(div);

        this._bindEvents(this._wrapper.holder, "focus", (evt) => {
            if(this._isList) {
                this._bindDocumentEvents(null, false, true);
            } else {
                if(_oldC) {
                    _oldC.close(null);
                    _oldC = null;
                }
                this._bindDocumentEvents(null, true, true);
                _oldC = this;
            }
            this._fireLocalEventIfExist("focus");
            this._fireEventIfExist("focus");
        });

        this._bindEvents(this._wrapper.holder, "blur", (evt) => {
            if(this._isList) {
                this._unbindDocumentEvents();
            }
            this._fireLocalEventIfExist("blur");
            this._fireEventIfExist("blur");
        });

        this._bindEvents(this._wrapper.holder, "dblclick", (evt) => {
            this._fireLocalEventIfExist("blur");
            this._fireEventIfExist("blur");
        });

        //For custom message on required
        this._bindEvents(valueBox, "invalid", (evt)=> {
            evt.target.setCustomValidity("");
            if (!evt.target.validity.valid) {
                evt.target.setCustomValidity(this._settings.errorMessage);
            }
        });

        this._bindEvents(valueBox, "input", (evt)=> {
            evt.target.setCustomValidity("");
        });

        let events = ["click", "dblclick", "mousemove", "mouseover", "mouseout", "mousedown", "mouseup"];
        for (let i=0,len=events.length;i<len;i++) {
            let evtName = events[i];
            this._bindEvents(this._wrapper.holder, evtName, (evt) => {
                this._fireLocalEventIfExist(evtName);
                this._fireEventIfExist(evtName);
            });

        }

        return wrapper;
    }

    /**
     * Create a row
     * @param obj
     * @return {any}
     */
    _createRow(obj) {

        let itemCss = (obj.isOptGroup) ? this._css.optgroup : this._css.item;

        let li = this._createEle("li", {className:itemCss});
       if(obj.isCheckbox && !obj.isOptGroup) {
            let checkbox = this._createEle("input", {tabIndex:-1, className:this._css.checkbox,type:"checkbox", disabled:obj.isDisabled, "checked":false, value:obj.value, name:this._wrapper.valueBox.name+this._settings.checkboxNameSuffix+"[]"})
            li.appendChild(checkbox);
            li._refCheckbox = checkbox;
        }

        let optTxtCss = (obj.isOptGroup) ? " "+this._css.itemSpanOpt : "";

        let itemSpan = this._createEle("span", {className:this._css.itemSpan+optTxtCss});

        let text = (this._settings.showListCounter.toString() === "true") ? `<span class='${this._css.listCounter}'>${obj.counter}</span> ${obj.label.text}` : obj.label.text;

        let textSpan = this._createEle("span", {className:obj.label.css}, text);

        let itemInnerSpan = this._createEle("span", {className:obj.innerSpanCss});
        itemInnerSpan.appendChild(textSpan);

        if(obj.img.src !== null) {
            let img = this._createEle("img", {className:obj.img.css, src:obj.img.src});
            itemSpan.appendChild(img);
        }

        if(obj.img.src === null && obj.imageCss.replace(/\s/g, '') !== '') {
            let imgSpan = this._createEle("span", {className:obj.img.css+' '+obj.imageCss}, "&nbsp;");
            itemSpan.appendChild(imgSpan);
        }

        if(obj.desc.text !== null) {
            let spanDesc = this._createEle("span", {className:obj.desc.css}, obj.desc.text);
            itemInnerSpan.appendChild(spanDesc);
        }

        itemSpan.appendChild(itemInnerSpan);



        li.appendChild(itemSpan);
        
        if(obj.isDisabled) {
            li.classList.add(this._css.itemDisabled);
        } else if(!obj.isOptGroup) {
            li.classList.add(this._css.itemEnabled);
        }

        if(obj.title !== '') {
            li.title = obj.title;
        }
        return li;
    }

    /**
     * Parse option
     * @param opt
     * @return {{image: *, description: *, index: *, className: *, disabled: *, text: *, imageCss: *, title: *, internalStyle: *, value: *, selected: *}}
     * @private
     */
    _parseOption(opt) {

        let image = null, title ='', description='', value='', text='', className='', imageCss = '', index=-1, selected, disabled, internalStyle;
        if (opt !== undefined) {
            let optionType = opt.nodeName;
            let dataSet = opt.dataset;
            if(optionType === "OPTGROUP") {
                text = opt.label;
            } else {
                text = opt.text;
                value = opt.value || text;
            }
            index = opt.index;
            selected = opt.selected;
            disabled = opt.disabled;

            className = opt.className || "";
            title = dataSet.title || '';
            description = dataSet.description || '';
            image = dataSet.image || image;
            imageCss = dataSet.imageCss || '';
            internalStyle = this._getInternalStyle(opt);

        }

        return {image, title, description, value, text, className, imageCss, index, selected, disabled, internalStyle};

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
            if(this._isMultiple && this._enableCheckbox.toString() === "true") {
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
     * @param checkbox
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
        this.updateUiAndValue();
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
                //this.selectedIndex = index;
            } else {
                //it could be multiple
                this.ele.options[index].selected = true;
            }
            ele?.classList?.add(this._css.itemSelected);
            this.updateUiAndValue();
        }
        if(this._enableCheckbox.toString() === "true") {
            if(ele?._refCheckbox) {
                ele._refCheckbox.checked = true;
            }
        }
        if(this._isFirstTime === false) {
            this._fireLocalEventIfExist("change");
            this._fireEventIfExist("change");
        }
        this._isFirstTime = false;
    }

    /**
     * Set selected by an select option item
     * @param option
     * @param dontThink
     * @private
     */
    _setSelectedByOptionItem(option, dontThink=false) {
        let index = option.index;
        let dataAndUI = this._getDataAndUI(index);
        this._setSelectedByItem(dataAndUI.ui, dontThink);
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

        this._wrapper.headerContent.innerHTML = (innerHTML !== null) ? innerHTML : text || dataAndUI?.ui?.innerHTML || "&nbsp;";

        let contentHolder = this._getEle("."+this._css.itemLabel, this._wrapper.headerContent);
        if(this._settings.showPlusItemCounter.toString() === "true" && dataAndUI.ui.length > 1) {
            contentHolder.innerHTML = contentHolder.innerHTML +  `<span class="${this._css.headerCounter}">&nbsp; (+${dataAndUI.ui.length-1})</span>`;
        }

        if(this._settings.showIcon.toString() === "false") {
            let img = this._getEle("img", this._wrapper.headerContent);
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
        let options = this._getAllEle(`ul li.${this._css.item}`, this._wrapper.holder);
        let total = options.length;
        for(let i=0;i<total;i++) {
            let current = options[i];
            if(current.index === index) {
                return options[i];
            }
        }
        return null;
    }

    /**
     * Get data and value
     * @param byIndex
     * @return {{data: *, ui: *, index: *, option: *, multiple:boolean}}
     * @private
     */
    _getDataAndUI(byIndex=null) {

        let ele = this.ele;
        let data, ui, option=null, index=-1;
        let obj, $this=this;
        let isArray = false;
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
                isArray = true;
            } else {
                obj = getByIndex(ui[0]?.index || this.selectedIndex);
                option = obj.option || null;
                data = obj.data || null;
                index = obj.index || -1;
                ui = obj.ui || null;
            }
        }


        return {data, ui, index, option, isArray};
    }

    /**
     * Is Array
     * @param obj
     * @return {boolean}
     * @private
     */
    _isArray = function(obj) {
        return (Object.prototype.toString.call(obj) === "[object Array]");
    };

    /**
     * Update Header UI by data
     * @param byData
     *
     */
    updateUiAndValue(byData=null) {
        let dataAndUI = (byData === null) ? this.uiData : byData;
        this._updateHeaderUI(dataAndUI);
        let valueBox = this._wrapper.valueBox;
        valueBox.value = this.ele.value;

        //this is multiple
        if(this._isMultiple && valueBox.name.substr(valueBox.name.length-2, valueBox.name.length) === "[]") {
            this._wrapper.moreValueBox.innerHTML = "";
            for (let i=1;i<dataAndUI.data.length;i++) {
                let valueBoxM = this._createEle("input", {type:"hidden", name:valueBox.name, value:dataAndUI.data[i].value});
                this._wrapper.moreValueBox.appendChild(valueBoxM);
            }
        }
    }

    /**
     * Update Ui by index
     * @param index
     * @private
     */
    _updateUiAndValueByIndex(index) {
        let dataAndUI = this._getDataAndUI(index);
        //this._updateHeaderUI(dataAndUI);
        this.updateUiAndValue(dataAndUI);
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
        return (where === null) ? document.querySelector(ele) : where.querySelector(ele);
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
        return (ele.style === undefined) ? "" : ele.style.cssText;
    }

    /**
     * Toggle show
     * @param ele
     * @private
     */
    _toggleShow(ele) {
        ele.style.display = (ele.style.display === "none" || ele.style.display === "") ? "inherit" : "none";
    }

    /**
     * Show an element
     * @param ele
     * @private
     */
    _show(ele, dispaly="block") {
        ele.style.display = dispaly;
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
            if(key === k) {
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
            let li = this._getEle("li[data-ms-index='0']", this._wrapper.listOfItems);
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
            //make ui as list
            //update height
            this._hide(this._wrapper.header);
            this.open(null, true);
            this._adjustChildHeight(row);
            this._wrapper.listOfItems.style.position = "relative";
            this._wrapper.listOfItems.style.display = "inline-block";
            this._wrapper.listOfItems.style.zIndex = 0;
            this._wrapper.holder.style.zIndex = 0;
            this._isList = true;
        } else {
            //reset to dropdown
            this._show(this._wrapper.header);
            this._wrapper.listOfItems.style.height = null;
            this._wrapper.listOfItems.style.position = "absolute";
            this._wrapper.listOfItems.style.zIndex = this._settings.zIndex;
            this._wrapper.holder.style.zIndex = 0;
            this._isList = false;
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
                case this._SPACE:
                    this._show(this._wrapper.listOfItems);
                    this._isOpen = true;
                    break;
                default:
                    if (evt.keyCode >= this._ALPHABETS_START && this._isList === false && this._settings.enableAutoFilter.toString() === "true") {
                        this._showHideFilterBox(true);
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
        if(this._onDocumentClick !== null) {
            this._unbindEvents(document, "mouseup", this._onDocumentClick);
        }
        if(this._onDocumentKeyDown !== null) {
            this._unbindEvents(document, "keydown", this._onDocumentKeyDown);
        }
        if(this._onDocumentKeyUp !== null) {
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

    /**
     * Fire event that is bind on settings
     * @param evt_n
     * @private
     */
    _fireLocalEventIfExist(evt_n, data=null) {
        if (typeof this._settings.on[evt_n] === "function") {
            let dataAndUI = (data===null) ? this._getDataAndUI() : data;
            let fn = this._settings.on[evt_n];
            try {
                fn(dataAndUI);
            } catch (e) {
                console.error(e.message);
            }

        }
    }

    /**
     * Fire event if exist
     * @param evt_n
     * @return {boolean}
     * @private
     */
    _fireEventIfExist(evt_n) {
        //data event
        if(this.ele.dataset[evt_n]) {
            let fn = new Function(this.ele.dataset[evt_n]);
            try {
                fn();
            } catch (e) {
                console.error(e.message);
            }
        }

        //check if original has some
        if (this._has_handler(evt_n).hasEvent) {
            if (this._has_handler(evt_n).byElement) {
                try {
                    this.ele[evt_n]();
                } catch (e) {
                    try {
                        this.ele["on" + evt_n]();
                    }catch (e2) {
                        
                    }
                }

            } else if (this._has_handler(evt_n).byJQuery) {
                switch (evt_n) {
                    case "keydown":
                    case "keyup":
                            //key down/up will check later
                        break;
                    default:
                        try {
                            if(typeof jQuery !== "undefined") {
                                jQuery(this.ele).triggerHandler(evt_n);
                            }
                        } catch (e) {
                            //silence is bliss
                        }

                        break;
                }
            }
            return false;
        }
    }

    /**
     * Has any event
     * @param name
     * @return {{byJQuery: boolean, hasEvent: boolean, byElement: boolean}}
     * @private
     */
    _has_handler(name) {
        //True if a handler has been added in the html.
        let evt = {byElement: false, local:false, byJQuery: false, hasEvent: false};

        if (this._settings.on[name] !== null) {
            evt.hasEvent = true;
            evt.local = true;
        }

        //console.log(name)
        try {
            //console.log(obj.prop("on" + name) + " "+name);
            if (this._getProp(this.ele, "on" + name) !== null) {
                evt.hasEvent = true;
                evt.byElement = true;
            }
        } catch(e) {
            //console.log(e.message);
        }
        // True if a handler has been added using jQuery.
        if(typeof jQuery !== "undefined") {
            let obj = jQuery(this.ele);
            let evs;
            if (typeof jQuery?._data === "function") { //1.8
                evs = jQuery?._data(this.ele, "events");
            } else {
                evs = obj.data("events");
            }
            if (evs && evs[name]) {
                evt.hasEvent = true;
                evt.byJQuery = true;
            }
        }
        return evt;
    }

    /*****************  Public methods and props *********** /
     /**
     * Add an item to select
     * Object can be pass as below
     * new Option("Label", "value") or
     * {text:"Label", value:"value"}
     * or Label as string
     * or full object ie {text:"", value:"", description:'', image:'', className:'' title:'', imageCss:''}
     * @param obj
     * @param index
     */

    add(obj, index=null) {
        //
        let text, value, title, image, description, imageCss;
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
            imageCss = obj.imageCss || '';
            description = obj.description || '';
            opt = new Option(text, value);
            opt.setAttribute("data-description", description);
            opt.setAttribute("data-image", image);
            opt.setAttribute("data-title", title);
            opt.setAttribute("data-image-css", imageCss);
        }
        this.ele.add(opt, index);
        this._makeChildren();
        this._fireLocalEventIfExist("add");
    }

    /**
     * Remove an item from select
     * @param index
     */
    remove(index) {
        let uiAndData = this._getDataAndUI(index);
        this.ele.remove(index);
        this._makeChildren();
        this._fireLocalEventIfExist("remove", uiAndData);
        return uiAndData;
    }

    /**
     * Move to next index
     */
    next() {
        let $this = this;
        let allOptions = this.optionsUI;
        let totalOpt = allOptions.length;
        let counterStart;
        if(this._isFilterApplied) {
            counterStart = this._nexPrevCounter;
        } else {
            counterStart = this.selectedIndex;
        }

        let _getNextElem = function() {
            let i = counterStart;
            for(i;i<totalOpt;i++) {
                let next = i+1;
                next = next >= totalOpt ? totalOpt-1 : next;
                $this._nexPrevCounter++;
                if(!allOptions[next].classList.contains($this._css.itemDisabled)) {
                    return allOptions[next];
                }
            }
            return null;
        };

        if(totalOpt > 0) {
            let nextEle = _getNextElem();
            if(nextEle) {
                this._setSelectedByItem(nextEle, false, true);
                this._scrollToIfNeeded(nextEle);
            }
        }

    }

    /**
     * Move to previous index
     */
    previous() {
        let $this = this;
        let allOptions = this.optionsUI;//$this._getAllEle(`li.${$this._css.item}`, $this._wrapper.listOfItems);
        let totalOpt = allOptions.length;
        let counterStart;
        if(this._isFilterApplied) {
            counterStart = this._nexPrevCounter;
        } else {
            counterStart = this.selectedIndex;
        }
        let _getPreviousElem = function(ele) {
            let i = counterStart;
            for(i;i>0;i--) {
                let next = i-1;
                next = next >= 0 ? next: 0;
                $this._nexPrevCounter--;
                if(!allOptions[next].classList.contains($this._css.itemDisabled)) {
                    return allOptions[next];
                }
            }
            return null;
        };

        if(allOptions.length > 0) {
            let prevEle = _getPreviousElem();
            if(prevEle) {
                this._setSelectedByItem(prevEle, false, true);
                this._scrollToIfNeeded(prevEle, null,"previous");
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

            this._fireLocalEventIfExist("open");

        } else {
            this.close(null);
        }
    }

    /**
     * Close this dropdown
     * @param evt
     */
    close(evt) {
        let isList = this._isList;
        let isDisable = false; // clicking on disabled list - it can be true based on below statement

        if(evt !== null) {
            evt.stopImmediatePropagation();
            let li = evt.target.closest('li');
            isDisable = (li !== null) ? li.classList.contains("disabled") : false;
        }

        if (this.disabled || isList || isDisable) {
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
        this._isFilterApplied = false;
        this._wrapper.filterInput.value = "";
        this._wrapper.filterInput.blur();
        if(this._settings.showFilterAlways.toString() === "false") {
            this._showHideFilterBox(false);
        }
        this._applyFilters()
        this._unbindDocumentEvents();

        this._updateHeaderUI();

        //reset list if required
        if(this.ele.length !== this._getAllEle(`li.${this._css.item}`, this._wrapper.listOfItems).length) {
            this._makeChildren();
            this.updateUiAndValue();
        }

        this._fireLocalEventIfExist("close");

    }

    /**
     * Return named item element with data
     * @param name
     * @param withData
     */
    namedItem(name, withData=false) {
        let obj = null;
        let ele = this.ele.querySelector(`option[name='${name}']`);
        if(ele && withData) {
            obj = {};
            let data = this._parseOption(ele);
            obj.option = ele;
            obj.data = data;
        } else {
            obj = ele;
        }
        return obj;
    }

    /**
     * Get data by index
     * @param index
     * @param withData
     */
    item(index, withData=false) {
        let obj = null;
        let ele = this.ele.options[index];
        if(ele && withData) {
            obj = {};
            let data = this._parseOption(ele);
            obj.option = ele;
            obj.data = data;
        } else {
            obj = ele;
        }
        return obj;
    }

    /**
     * Show hide or get status of visibility
     * @param isShow
     * @return {boolean}
     */
    visible(isShow=null) {

        if(isShow === true) {
            this._show(this._wrapper.holder, "inline-block");
        } else if(isShow === false) {
            this._hide(this._wrapper.holder);
        }
        if(isShow === null) {
            return (this._wrapper.holder.style.display !== "none");
        }
    }

    /**
     * Calculate item height and set child height
     * @param numberOfRows
     */
    showRows(numberOfRows) {
        this._settings.visibleRows = (numberOfRows > this.length) ? this.length : numberOfRows;
        this._adjustChildHeight();
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
       //this._bindEvents(this.ele, type, fn);
        this._settings.on[type] = fn;
    }

    /**
     * Remove event listener
     * @param type
     * @param fn
     */
    off(type, fn) {
        //this._unbindEvents(this.ele, type, fn);
        this._settings.on[type] = null;
    };

    /**
     * Remake Everything
     */
    refresh() {
        this._makeChildren();
        this.updateUiAndValue();
    }

    /**
     * Destroy UI
     */
    destroy() {
        //show original
        this._show(this.ele);
        this.ele.required = this._wrapper.valueBox.required;
        this.ele.name = this._wrapper.valueBox.name;
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
        let $this = this;
        let selectNow = function (ind) {
            $this.ele.selectedIndex = ind;
            if(ind === -1) {
                //blank
                $this._updateHeaderUI(null, "");
                $this._removeOldSelected();
            } else {
                $this._setSelectedByOptionItem($this.ele.options[ind]);
            }
        };
        
        if(index < this.length && !this._isArray(index)) {
            selectNow(index);
        } else {
            if(this._isMultiple  && this._isArray(index)) {
                for (let i=0,len=index.length;i<len;i++) {
                    if(index[i] < this.length && index[i] !== -1) {
                        this._setSelectedByOptionItem(this.ele.options[index[i]], i>0);
                    }
                }
                this._updateHeaderUI(null);
            } else {
                selectNow(index);
            }
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
     * @param option
     */
    set options(option) {

        if(option instanceof HTMLOptionElement) {
            this.ele.add(option);
            this._makeChildren();
            this.updateUiAndValue();
        } else if (typeof option === "number") {
            this.ele.length = option;
            this._makeChildren();
            this.updateUiAndValue();
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
        return this._cacheEle["allItems"] = this._getAllEle(`li.${this._css.item}`, this._wrapper.listOfItems);
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
        this.updateUiAndValue();
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
        this.selectedIndex = this.ele.selectedIndex;
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
            this._enableCheckbox = this._settings.enableCheckbox;
        } else {
            this.ele.removeAttribute('multiple');
        }
        this._isMultiple = val;
        //reset if this is not multiple
        if(!val) {
            this.selectedIndex = this.ele.selectedIndex;
            this._enableCheckbox = false;
        }
        this._makeChildren();
    }

    /**
     * Get the name
     * @return {*}
     */
    get name() {
        if(this._wrapper?.valueBox) {
            return this._wrapper.valueBox.name || "";
        }
        return this.ele.name;
    }

    /**
     * Set the name
     * @param val
     */
    set name(val) {

        if(this._wrapper?.valueBox) {
            this._wrapper.valueBox.name = val;
        } else {
            this.ele.name = val;
        }


    }

    /**
     * Get required
     * @return {*}
     */
    get required() {
        return this._wrapper.valueBox.required;
    }

    /**
     * Set required
     * @param val
     */
    set required(val) {
        if (val) {
            this._wrapper.valueBox.setAttribute('required', true);
            //update now
        } else {
            this._wrapper.valueBox.removeAttribute('required');
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
        let selectedOptions = null;
        if(this.selectedIndex >=0 ) {
            selectedOptions = this.ele.options[this.selectedIndex];
            if(this.multiple) {
                selectedOptions = [];
                let options = this.options;
                let total = options.length;
                for (let i=0; i<total; i++) {
                    if(options[i].selected) {
                        selectedOptions.push(options[i])
                    }
                }
                selectedOptions = selectedOptions.length === 1 ? selectedOptions[0] : selectedOptions;
            }
        }
        return selectedOptions;
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
        return "4.0.2";
    }

}

