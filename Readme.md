<img src="./dist/images/ms-dropdown.jpg?v=4.0" />

### Help
- [Marghoob Suleman's Website](https://www.marghoobsuleman.com/)
- [Image Dropdown Home](https://www.marghoobsuleman.com/image-dropdown)
- [Image Dropdown Help Document](https://www.marghoobsuleman.com/image-dropdown/help)

### v4.0.3 update: 13 Oct, 2021
- Fixed bootstrap modal issue 

### v4.0.2 update: 21 Sep, 2021
- Safari blue border on focus removed
- selectedIndex can be set as an array if "&lt;select&gt;" is multiple.
  - Example: element.msDropdown.selectedIndex = [1, 4]; 
- imagePosition:'right' is added. Default value is left.
- showFilterAlways functionality is added. 
- Little bit code refactoring

### v4.0.1 update: 15 Sep, 2021
- Fixed List zIndex issue

### v4.0 update: 09 Sep, 2021
- Written in ES6 (class) Style 
- Remove jQuery dependency
- Performance improvement
- Reactive properties
- 'required' attributes works too
- 'required' message can be customized. Default is 'Please select an item from this list'
- Works better than original dropdown, i guess :) 

### v3.5.2 updates: 13 July, 2013
- height bug fixed.
- multiple indexes can be set via object. 
ie.  var oDropdown = $("#element").msDropdown().data("dd");
oDropdown.set("selectedIndex", [1,4]);
- checkbox selection is fixed when setting index via object.
- css .arrow class is changed to .ddArrow (it was too common)

### v3.5.1 updates: 
- (used for my personal project - did not get the chance to update - Sorry!)

### v3.5 updates: 3 June, 2013
- conflict edit in source js file fixed
- autofilter is now configurable - it can be enable/disable by setting params or data-enableautofilter="true" attribute.
- next/previous bug fixed when autofilter is on.
- Bug fixed when item opens upward after autofilter.


### v3.4 updates: 31 May, 2013
- refresh method is back. you can refresh your dropdown to update the UI and value with the original dropdown or by the msdropdown object. 
  i.e: $("#dropdownid").msDropdown().data("dd").refresh(); //or
	document.getElementById("dropdownid").refresh();
- removed underscore from the all the variables and methods name - for the sake of jslint
- reverseMode - reverseMode settings param is true... When you update your original dropdown it will update the msdropdown UI and value. This is usefull when you use knockoutjs or other library
- Now you can set open direction to always down by settings params in settings or data {openDirection:"alwaysdown"}

### v3.3 updates: 02 Feb, 2013
- $.browser - jQuery 1.9 version fixed
- Keyboard navigation issue has been fixed
- destory is now destroy - oops typo error

### v3.2 updates: 26 Nov, 2012
- All setting parameters can passed throught element's data- attributes. ie. data-maincss="blue"
- zIndex bug fixed for list and dropdown if both on the same page.
- Added setIndexByValue method. However same can be done by - handler.set("value", value)
- Added "append" and "prepend" in setting params. append is used to append the element to the childdiv and prepend do as the name suggest. 
- Added one more help file for objected oriented approach.

### v3.1.1 updates:
- chrome onchange bug fixed
- zindex bug fixed for msie 
- add method bug fixed for msie 

### v3.1 updates:
- Child width can be alter
- New multiple is introduced. Its multiple but with the checkbox.
- <strong>Bonus:</strong> elementname<strong>_mscheck</strong> will be posted along with the form post/get. i.e. if element name is &quot;tech&quot; checkbox *tech_mscheck[]* is created. However you can set the suffix using 'checkboxNameSuffix' parameter.

### v3.0 updates:
<ul>
  <li>Written from scratch</li>
  <li>Improved performance and UI</li>
  <li>Improved auto filter experience</li>
  <li>Added data- support in attributes for image, description, title, imagecss, text and value</li>
  <li>Event can be bind/unbind through object</li>
  <li>Organized folder structure</li>
  <li>Old style (with title attribute) is also working.</li>
  <li>Country dropdown with flags as a bonus</li>
</ul>
<strong>v2.38 updates:<br />
</strong>
<ul>
  <li>document keydown/keyup method unbind</li>
  <li>added json support in title. {image:'', title:''}</li>
  <li>onchange bug on onclose</li>
  <li>CSS style declaration problem</li>
  <li>jQuery 1.7.1 compatibility issue</li>
  <li>IE8 sprite</li>
</ul>
<strong>v2.37.5 updates:<br />
</strong>
<ul>
  <li>Fixed an ie6 error.</li>
</ul>
<strong>v2.37 updates:<br />
</strong>
<ul>
  <li>values are updated properly when it opens upwards</li>
  <li>Now works with jQuery 1.6.1.</li>
  <li>Improved performance</li>
  <li>Added quick selection. Filter options on key press</li>
</ul>
<strong>v2.36 updates:<br />
</strong>
<ul>
  <li>Onchange bug has been fixed. Finally :)</li>
  <li>No more id is required.</li>
</ul>
<strong>v2.35 updates:<br />
</strong>
<ul>
  <li>Now works in FF4.</li>
  <li>Onchange bug has been fixed.</li>
  <li>DropUp when your dropdown is showing at bottom of the page. </li>
  <li>Some minor ui changes</li>
</ul>
<strong>v2.3 updates:<br />
</strong>
<ul>
  <li>CSS sprite chrome bug has been fixed.</li>
</ul>

<p><strong>License</strong></p>
You may use msDropDown under the terms of either the MIT License or 
the Gnu General Public License (GPL) Version 2.

The MIT License is recommended for most projects. 
It is simple and easy to understand, and it places almost no restrictions on what you can do with msDropDown.

If the GPL suits your project better, you are also free to use msDropDown under that license.

You don't have to do anything special to choose one license or the other, and you don't have to notify anyone which license you are using. 
