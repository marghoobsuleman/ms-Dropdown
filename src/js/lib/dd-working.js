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

export default class MsDropdown {

    #wrapper;
    #css;
    #onDocumentClick;
    #onDocumentKeyDown;
    #settings;
    #isOpen = false;
    #DOWN_ARROW = 40; #UP_ARROW = 38; #LEFT_ARROW=37; #RIGHT_ARROW=39;
    #ESCAPE = 27; #ENTER = 13; #ALPHABETS_START = 47; #SHIFT=16;
    #CONTROL = 17; #BACKSPACE=8; #DELETE=46;
    #shiftHolded = false; #controlHolded = true;
    #isFirstTime = true; #cacheEle = {};

    constructor(ele, settings) {

        let defaultSettings = {
            byJson: {data: null, selectedIndex: 0, name: null, size: 0, multiple: false, width: 250},
            mainCSS: 'ms-dd pr',
            rowHeight: null,
            visibleRows: null,
            showIcon: true,
            zIndex: 9999,
            useSprite: false,
            event:'click',
            openDirection: 'auto', //auto || alwaysUp || alwaysDown
            jsonTitle: true,
            style: '',
            childWidth:null,
            childHeight:null,
            enableCheckbox:false, //this needs to multiple or it will set element to multiple
            checkboxNameSuffix:'_mscheck',
            append:null,
            prepend:null,
            reverseMode:true, //it will update the msdropdown UI/value if you update the original dropdown - will be useful if are using knockout.js or playing with original dropdown
            enableAutoFilter:true,
            on: {create: null,open: null,close: null,add: null,remove: null,change: null,blur: null,click: null,dblclick: null,mousemove: null,mouseover: null,mouseout: null,focus: null,mousedown: null,mouseup: null}
        };

        //merge with data settings
        this.#settings = {...defaultSettings, ...settings};
        this.#css = {dd:this.#settings.mainCSS,
                    wrapperDisabled:'disabled',
                    headerA:"ms-list-option option-selected",
                    header: 'ms-dd-header',
                    arrow: 'ms-dd-arrow',
                    arrowDown: 'ms-dd-pointer-down',
                    arrowUp: 'ms-dd-pointer-up',
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
        this.ele = ele;
        this.#checkDataSettings();
        //init
        this.#wrapper = {};
        this.#init();
    }

    #init() {
        this.#makeLayout();
        this.#updateHeaderUI();
        if(this.ele.size > 1) {
            this.#makeUiAsList(true, this.ele.size);
            this.#scrollToItem();
        }
        //hide original
        this.#hide(this.ele);
    }

    /**
     * Read from select data-* attributes
     */
    #checkDataSettings() {
            let dataSet = this.#getDataSet(this.ele);
            let settings = this.#settings;
            settings.mainCSS = dataSet.maincss || settings.mainCSS;
            settings.showIcon = dataSet.showicon || settings.showIcon;
            settings.useSprite = dataSet.usesprite || settings.useSprite;
            settings.event = dataSet.event || settings.event;
            settings.openDirection = dataSet.opendirection || settings.openDirection;
            settings.jsonTitle = dataSet.jsontitle || settings.jsonTitle;
            settings.childWidth = dataSet.childwidth || settings.childWidth;
            settings.childHeight = dataSet.childheight || settings.childHeight;
            settings.enableCheckbox = dataSet.enablecheckbox || settings.enableCheckbox;
            settings.checkboxNameSuffix = dataSet.checkboxnamesuffix || settings.checkboxNameSuffix;
            settings.append = dataSet.append || settings.append;
            settings.prepend = dataSet.prepend || settings.prepend;
            settings.enableAutoFilter = dataSet.enableautofilter || settings.enableAutoFilter;
            settings.enableAutoFilter = settings.enableAutoFilter.toString();
            settings.visibleRows = dataSet.visiblerows || settings.visibleRows;

            this.#settings = {...this.#settings, ...settings};

            //make string
            //settings.disabledOpacity = dataSet.disabledopacity || settings.disabledOpacity;
            //settings.reverseMode = settings.reverseMode.toString();
            //settings.roundedCorner = settings.roundedCorner.toString();
            //
            //settings.animStyle = dataSet.animstyle || settings.animStyle;

    }

    /**
     * Scroll to item
     * @param item
     * @param behavior
     */
    #scrollToItem(item, behavior='smooth') {
        item = item || this.uiData.ui;
        let itemPos = item.getBoundingClientRect();
        let holder = this.#wrapper.listOfItems.getBoundingClientRect();
        this.#wrapper.listOfItems.scrollTop = itemPos.y - (holder.height);
    }

    #showFilterBox() {

    }

    #applyFilters(e) {
        let sText = this.#wrapper.input.value;
        if (sText.length === 0) {
            this.#makeChildren();
        } else {
            //hide all
            let options = [...this.options];
            let filterOptions = options.filter(function(item) {
                return item.text.toLowerCase().indexOf(sText.toLowerCase()) >= 0;
            });
            this.#makeChildren(filterOptions);
        }

    }

    #makeFilterBox() {
        let div = this.#createEle("div")
        let input = this.#createEle("input",   {name:'temp', style:"width:100%"});
        div.appendChild(input);
        this.#wrapper.input = input;

        this.#bindEvents(input, "keyup", (evt)=> {
            this.#applyFilters(evt);
            evt.preventDefault();
            evt.stopPropagation();
        });

        return div;
    }

    /**
     * Make header
     * @return {any}
     */
    #makeHeader() {
        let css = this.#css;
        let divHeader = this.#createEle("div", {className:css.header});
        let headerA = this.#createEle("a", {className:css.headerA});
        //headerA.innerHTML = ``;
        let arrow = this.#createEle("span", {className:css.arrow + ' '+css.arrowDown});
        divHeader.appendChild(headerA);
        divHeader.appendChild(arrow);
        this.#wrapper.header = divHeader;
        this.#wrapper.headerA = headerA;
        this.#wrapper.arrow = arrow;
        return divHeader;
    }

    /**
     * Make children
     * @return {*}
     */
    #makeChildren(byOption=null) {
        let css = this.#css;
        let ul;
        //use old one holder if required
        if(!this.#wrapper.listOfItems) {
            ul = this.#createEle("ul", {className:css.listOfItems});
            this.#wrapper.listOfItems = ul;
        } else {
            ul = this.#wrapper.listOfItems;
        }
        ul.innerHTML = ""; //clear old one
        let options = (byOption ===null) ? this.options : byOption;
        for (let i=0;i<options.length;i++) {
            let opt = options[i];
            let dataSet = this.#getDataSet(opt);
            let isSelected = (opt.selected) ? true : false;
            let isDisabled = (opt.disabled) ? true : false;
            let itemObj = {
                label: {
                    text:opt.text,
                    css:css.itemLabel
                },
                img: {
                    src:dataSet.image,
                    css:css.itemImage
                },
                desc: {
                    text:dataSet.description,
                    css:css.itemDesc
                },
                isDisabled:isDisabled
            };
            let li = this.#createRow(itemObj);

            ul.appendChild(li);

            if(isSelected) {
                this.#setSelectedByItem(li, true);
            }
            if(!isDisabled) {
                this.#bindEvents(li, "click", (evt)=> {
                    this.#setSelectedByItem(li);
                    this.close(evt);
                });
            }

        }
        if(this.#settings.childHeight !== null) {
            ul.style.maxHeight = this.#settings.childHeight+'px';
        }
        return ul;
    }

    /**
     * Make Layout
     * @param cb
     * @return {any}
     */
    #makeLayout(cb) {
        let tabIndex = this.ele.tabIndex;
        this.ele.tabIndex = -1;
        let css = this.#css;
        let wrapper = this.#createEle("div", {tabIndex:tabIndex, className:css.dd});

        //Make header
        let divHeader = this.#makeHeader();

        let filterBox = this.#makeFilterBox();

        //make options
        let childHolder = this.#createEle("div", {className:"ms-options"});
        let ul = this.#makeChildren();
        wrapper.appendChild(divHeader);

        //wrapper.appendChild(filterBox);
        wrapper.appendChild(ul);
        wrapper.appendChild(childHolder);

        this.#wrapper.holder = wrapper;



        //add in document
        this.#insertAfter(wrapper, this.ele);

        //hide children
        this.#hide(ul);

        this.#bindEvents(divHeader, this.#settings.event, ()=> {
            this.open();
        });

        if(this.disabled) {
            wrapper.classList.add(css.wrapperDisabled);
        }

        let style = this.#getInternalStyle(this.ele);
        wrapper.setAttribute("style", style);

        //clear
        let div = this.#createEle("div", {style:"clear:both"});
        wrapper.appendChild(div);

        this.#bindEvents(this.#wrapper.holder, "focus", (evt) => {
            this.#bindDocumentEvents(evt);
        });
        this.#bindEvents(this.#wrapper.holder, "blur", (evt) => {
            this.#unbindDocumentEvents();
            this.close(evt);
        });

        return wrapper;
    }

    /**
     * Create a row
     * @param obj
     * @param withLi
     * @return {any}
     */
    #createRow(obj, withLi=false) {

        let labelText = obj.label;
        let desc = obj.desc;
        let imgSrc = obj.imgSrc;

        let li = this.#createEle("li", {className:this.#css.item});

        let itemSpan = this.#createEle("span", {className:this.#css.itemSpan});

        let textSpan = this.#createEle("span", {className:obj.label.css}, obj.label.text);

        if(obj.img.src != null) {
            let img = this.#createEle("img", {className:obj.img.css, src:obj.img.src});
            li.appendChild(img);
        }

        itemSpan.appendChild(textSpan);
        li.appendChild(itemSpan);

        if(obj.desc.text != null) {
            let spanDesc = this.#createEle("span", {className:obj.desc.css}, obj.desc.text);
            itemSpan.appendChild(spanDesc);
        }
        if(obj.isDisabled) {
            li.classList.add(this.#css.itemDisabled);
        }
        return li;
    }

    /**
     * Parse option
     * @param opt
     * @return {{image: *, description: *, index: *, className: *, text: *, imagecss: *, title: *, value: *}}
     */
    #parseOption(opt) {

        let image = '', title ='', description='', value='', text='', className='', imagecss = '', index;
        if (opt !== undefined) {
            let dataSet = opt.dataset;
            let attrTitle = dataSet.json || dataSet.title || "";
            //data-title - is now data-json
            if (attrTitle!=="") {
                let reg = /^\{.*\}$/;
                let isJson = reg.test(attrTitle);
                let obj = {};
                let useJsonTitle = this.#settings.jsonTitle;
                if (isJson && useJsonTitle) {
                    obj =  Function(`'use strict'; return (${attrTitle})`)();
                }
                title = (isJson && useJsonTitle) ? obj?.title : title;
                description = (isJson && useJsonTitle) ? obj?.description : description;
                image = (isJson && useJsonTitle) ? obj?.image : attrTitle;
                imagecss = (isJson && useJsonTitle) ? obj?.imagecss : imagecss;
            }

            text = opt.text || '';
            value = opt.value || '';
            index = opt.index;
            className = opt.className || "";

            //ignore title attribute if playing with data tags
            title = dataSet.title || title;
            description = dataSet.description || description;
            image = dataSet.image || image;
            imagecss = dataSet.imagecss || imagecss;
        }

        return {image, title, description, value, text, className, imagecss, index};

    }

    /**
     * remove old selected
     */
    #removeOldSelected() {
        let oldSelected = this.#getAllEle("ul li."+this.#css.itemSelected, this.#wrapper.holder);

        //remove old selected
        for(let i=0;i<oldSelected.length;i++) {
            oldSelected[i].classList.remove(this.#css.itemSelected);
        }

    }

    /**
     * Set selected by an item
     * @param ele
     * @param dontThink
     */
    #setSelectedByItem(ele, dontThink=false) {

        if(dontThink && ele) {

            ele.classList.add(this.#css.itemSelected);

        } else {

            this.#removeOldSelected();

            //handle something
            if(this.ele.multiple) {

            } else {

                this.ele.selectedIndex = this.#getIndex(ele);
                ele.classList.add(this.#css.itemSelected);
            }

            this.#updateUiAndValue();
        }
    }

    /**
     * Set selected by an select option item
     * @param option
     */
    #setSelectedByOptionItem(option) {
        let index = option.index;
        let dataAndUI = this.#getDataAndUI(index);
        this.#setSelectedByItem(dataAndUI.ui);
    }

    /**
     * Update header ui
     * @param byData
     * @param innerHTML
     */
    #updateHeaderUI(byData=null, innerHTML=null) {
        let dataAndUI = (byData === null) ? this.uiData : byData;
        this.#wrapper.headerA.innerHTML = (innerHTML !==null) ? innerHTML : dataAndUI.ui.innerHTML;
    }

    /**
     * Get data and value
     * @param byIndex
     * @return {{data: *, ui: *, index: *, option: *}}
     */
    #getDataAndUI(byIndex=null) {

        let ele = this.ele;
        let data, ui, option=null, index=-1;
        let selectedIndex = (byIndex === null) ?  ele.selectedIndex : byIndex;

         if (selectedIndex >= 0) {
            ui = this.#getAllEle("ul li." + this.#css.itemSelected, this.#wrapper.holder);
            // if this is multiple
            if (ui.length > 1) {
                let d = [], op = [], ind = [];
                for (let i = 0; i < ui.length; i++) {
                    let oi = this.#getIndex(ui[i]);
                    d.push(oi); //getData is missing
                    op.push(ele.options[oi]);
                }
                data = d;
                option = op;
                index = d;
            } else {
                option = ele.options[selectedIndex];
                data = this.#parseOption(option);
                index = selectedIndex;
                ui = this.#getAllEle("ul li", this.#wrapper.holder)[index];
            }
        }

        return {data, ui, index, option};
    }

    /**
     * Update Header UI by data
     * @param byData
     */
    #updateUiAndValue(byData=null) {
        let dataAndUI = (byData === null) ? this.uiData : byData;
        this.#updateHeaderUI(dataAndUI);
    }

    /**
     * Update Ui by index
     * @param index
     */
    #updateUiAndValueByIndex(index) {
        let dataAndUI = this.#getDataAndUI(index);
        this.#updateHeaderUI(dataAndUI);
    }

    /****  Elements and Helpers ****/
    /**
     * Create an element
     * @param nm
     * @param attr
     * @param html
     * @return {any}
     */
    #createEle(nm, attr, html) {
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
     */
    #getEle(ele, where=null) {
        return (where===null) ? document.querySelector(ele) : where.querySelector(ele);
    }

    /**
     * Get all elements
     * @param ele
     * @param where
     * @return {any}
     */
    #getAllEle(ele, where=null) {
        return where === null ? document.querySelectorAll(ele) : where.querySelectorAll(ele);
    }

    /**
     * Get internal style of an element
     * @param ele
     * @return {string|*}
     */
    #getInternalStyle(ele) {
        return (ele.style === undefined) ? "" : ele.style.cssText;;
    }

    #toggleShow(ele) {
        ele.style.display = (ele.style.display === "none" || ele.style.display==="") ? "inherit" : "none";
    }

    /**
     * Show an element
     * @param ele
     */
    #show(ele) {
        ele.style.display = "inherit";
    }

    /**
     * Hide an element
     * @param ele
     */
    #hide(ele) {
        ele.style.display = "none";
    }

    /**
     * Insert an element after an element
     * @param ele
     * @param targetEle
     * @return {*}
     */
    #insertAfter(ele, targetEle) {
        return targetEle.parentNode.insertBefore(ele, targetEle.nextSibling);
    }

    /**
     * Not using for now
     * Insert an element before a target element
     * @param ele
     * @param targetEle
     * @return {*}
     */
    #insertBefore(ele, targetEle) {
        return targetEle.insertBefore(ele, targetEle);
    }

    /**
     * get index of a li
     * @param li
     * @return {number}
     */
    #getIndex(li) {
        let LIs = this.#wrapper.holder.querySelectorAll("ul li");
        return [...LIs].indexOf(li);
    }

    /**
     * Get properties or a property - not in used
     * @param ele
     * @param key
     * @return {null|*}
     */
    #getProp(ele, key) {
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
     */
    #getDataSet(ele, key=null) {
        return (key === null) ? ele.dataset : ele.dataset[key] || null;
    }

    /**
     * Bind an event
     * @param ele
     * @param type
     * @param cb
     */
    #bindEvents(ele, type, cb) {
        ele.addEventListener(type, cb);
    }

    /**
     * Remove events
     * @param ele
     * @param type
     * @param fn
     */
    #unbindEvents(ele, type, fn) {
        ele.removeEventListener(type, fn);
    }

    #adjustChildHeight(row=null) {
        row = (row === null) ? this.#settings.visibleRows : row;
        if(row !== null) {
            let li = this.#getEle("li", this.#wrapper.listOfItems);
            let size = (this.#settings.rowHeight !== null) ? this.#settings.rowHeight : li.clientHeight;
            this.#wrapper.listOfItems.style.height = (row * size)+'px';
        }

    }

    #setTitleMinHeight() {
        let lis = this.#getAllEle("li", this.#wrapper.listOfItems);
        let max = 0;
        let len = lis.length;
        for(let i=0;i<len;i++) {
            let current = lis[i];
            max = (current.clientHeight > max) ? current.clientHeight : max;
        }

        this.#wrapper.header.style.minHeight = max+"px";
    }


    #makeUiAsList(val, row) {
        if(val === true) {
            //update height
            this.#hide(this.#wrapper.header);
            this.open(null, true);
            this.#adjustChildHeight(row);
            this.#wrapper.listOfItems.style.position = "relative";
        } else {
            this.#show(this.#wrapper.header);
            this.#wrapper.listOfItems.style.height = null;
            this.#wrapper.listOfItems.style.position = "absolute";
            this.close(null);
        }
    }

    #bindDocumentEvents(evt) {
        this.#onDocumentClick = (evt) => {
            //is outside?
            let box = this.#wrapper.listOfItems.getBoundingClientRect();
            let headerBox = this.#wrapper.header.getBoundingClientRect();
            let mouseX = evt.clientX;
            let mouseY = evt.clientY;
            let areaX = box.left + box.width;
            let areaY = (headerBox.top + box.height+headerBox.height);

            if(mouseX < box.left || mouseX > areaX || mouseY < headerBox.y || mouseY > areaY) {
                this.close(evt);
            }
        };
        let isList = false; //temp

        this.#onDocumentKeyDown = (evt) => {
            switch (evt.keyCode) {
                case this.#DOWN_ARROW:
                case this.#RIGHT_ARROW:
                    evt.preventDefault();
                    evt.stopPropagation();
                    this.#show(this.#wrapper.listOfItems);
                    this.#isOpen = true;
                    this.next();
                    break;
                case this.#UP_ARROW:
                case this.#LEFT_ARROW:
                    evt.preventDefault();
                    evt.stopPropagation();
                    this.previous();
                    break;
                case this.#ESCAPE:
                case this.#ENTER:
                    evt.preventDefault();
                    evt.stopPropagation();
                    this.close(null);
                    break;
                case this.#SHIFT:
                    this.#shiftHolded = true;
                    break;
                case this.#CONTROL:
                    this.#controlHolded = true;
                    break;
                default:
                    if (evt.keyCode >= this.#ALPHABETS_START && isList === false) {
                        this.#showFilterBox();
                    }
                    break;
            }
        };
        this.#bindEvents(document, "mouseup", this.#onDocumentClick);
        this.#bindEvents(document, "keydown", this.#onDocumentKeyDown);
    }

    #unbindDocumentEvents() {
        //remove events
        this.#unbindEvents(document, "mouseup", this.#onDocumentClick);
        this.#unbindEvents(document, "keydown", this.#onDocumentKeyDown);
    }

    #scrollToIfNeeded(item=null, pos=null, goingWhere="next") {
        let child = this.#wrapper.listOfItems;
        let childBound = child.getBoundingClientRect();
        if(item === null && pos !== null) {
            child.scrollTop = pos;
        }
        //if scroll is needed
        item = (item !== undefined) ? item : this.#getEle( "li." + this.#css.itemSelected);
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

        /*if (parseInt(($(items[index]).position().top + $(items[index]).height())) <= 0) {
            var top = ($("#" + childid).scrollTop() - $("#" + childid).height()) - $(items[index]).height();
            $("#" + childid).animate({scrollTop: top}, 500);
        }*/

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

    add(obj) {
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
        this.ele.add(opt);
        this.#makeChildren();
    }

    /**
     * Remove an item from select
     * @param index
     */
    remove(index) {
        this.ele.remove(index);
        this.#makeChildren();
    }

    /**
     * Move to next index
     */
    next() {

        let css = this.#css;
        let items = this.optionsUI;
        let index = this.selectedIndex;
        if ((index < items.length - 1)) {
            index = getNext(index);
            if (index < items.length) { //check again - hack for last disabled
                this.selectedIndex = index;
                this.#scrollToIfNeeded(items[index]);
            }
        }

        function getNext(ind) {
            ind = ind + 1;
            if (ind > items.length) {
                return ind;
            }
            if (items[ind].classList.contains(css.itemDisabled) !== true) {
                return ind;
            }
            return ind = getNext(ind);
        }
    }

    /**
     * Move to previous index
     */
    previous() {

        let css = this.#css;
        let items = this.optionsUI;
        let index = this.selectedIndex;

        if (index >= 0) {
            index = getPrev(index);
            if (index >= 0) { //check again - hack for disabled
                this.selectedIndex = index;
                this.#scrollToIfNeeded(items[index], null, "previous");
            }
        }

        function getPrev(ind) {
            ind = ind - 1;
            if (ind < 0) {
                return ind;
            }
            if (items[ind].classList.contains(css.itemDisabled) !== true) {
                return ind;
            }
            return ind = getPrev(ind);
        }
    }

    /**
     * Open this dropdown
     */
    open(evt, justOpen=false) {

        if (this.disabled) {
            return;
        }
        if(!this.#isOpen) {
            this.#isOpen = true;
            this.#show(this.#wrapper.listOfItems);

            //don't bind event if just opening - useful when making as list
            if(justOpen === false) {
                this.#bindDocumentEvents(evt);

            }
            //Change arrow
            this.#wrapper.arrow.classList.remove(this.#css.arrowDown);
            this.#wrapper.arrow.classList.add(this.#css.arrowUp);
            this.#adjustChildHeight();

            if(this.#isFirstTime) {
                //set min height for title - to fix fluctuation
                this.#isFirstTime = false;
                this.#setTitleMinHeight()
            }
            this.#scrollToItem();

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
        this.#scrollToIfNeeded(null, 0);
        this.#hide(this.#wrapper.listOfItems);
        this.#wrapper.arrow.classList.add(this.#css.arrowDown);
        this.#wrapper.arrow.classList.remove(this.#css.arrowUp);
        this.#isOpen = false;


        this.#unbindDocumentEvents();

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
            this.#show(this.#wrapper);
        } else if(isShow === false) {
            this.#hide(this.#wrapper);
        }
        if(isShow === null) {
            return this.#wrapper.style.display === "none";
        }
    }

    /**
     * Calculate item height and set child height
     * @param numberOfRows
     */
    showRows(numberOfRows) {

    }

    /**
     * Alias of showRows
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
        this.#bindEvents(this.ele, type, fn);
    }

    /**
     * Remove event listener
     * @param type
     * @param fn
     */
    off(type, fn) {
        this.#unbindEvents(this.ele, type, fn);
    };

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
            this.#updateHeaderUI(null, "");
            this.#removeOldSelected();
        } else {
            this.#setSelectedByOptionItem(this.ele.options[index]);
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
            this.#makeChildren();
            this.#updateUiAndValue();
        } else if (typeof option === "number") {
            this.ele.length = option;
            this.#makeChildren();
            this.#updateUiAndValue();
        }
    }

    /**
     * get options UI
     * @return {any}
     */
    get optionsUI() {
        if(this.#cacheEle["allItems"]) {
            return this.#cacheEle["allItems"];
        }
        return this.#cacheEle["allItems"] = this.#getAllEle("li", this.#wrapper.listOfItems);
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
        this.#makeChildren();
        this.#updateUiAndValue();
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
        this.#updateUiAndValue();
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
            this.#wrapper.holder.classList.add(this.#css.wrapperDisabled);
        } else {
            this.ele.removeAttribute('disabled');
            this.#wrapper.holder.classList.remove(this.#css.wrapperDisabled);
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
        }
    }

    /**
     * Get the name
     * @return {*}
     */
    get name() {
        return this.ele.name;
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
        this.#makeUiAsList(val > 1, val);
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
        return this.#getDataAndUI(this.selectedIndex);
    }

    /**
     * Get version
     * @return {string}
     */
    get version() {
        return "4.0.0";
    }

}

