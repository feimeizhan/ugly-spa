# ugly-spa
A very "ugly"(I would say simple:-) Single-Page Application JavaScript framework **without** any other library.

# Usage
## html setup
```html
<body onhashchange='spa_utils.changeUrl(document.getElementById("container"));'>
    <div id='container'>
        ... content ...
    </div>
</body>
```
The method [onhashchange](https://www.w3schools.com/jsref/event_onhashchange.asp) will be invoked when change the anchor part(link address with #) of url.  
For example:
```html
<a href="#test"></a> 
```
## data structure
```json
{
   "html":"",
   "priorityScripts":[],
   "scripts":[],
   "links":[] 
}
```
1. html: html page content.For example:
```html
<div>
    <div>
        ...
    </div>
</div>
```
2. priorityScripts: priority download script,and it's array contain the address of script.For example:["http://test.js"]
3. scripts: like priorityScripts,but load after priorityScripts finished loading.
4. links: css address.For example:["http://test.css"]
# TODO
1. History URL route
2. Avoid loading CSS and JavaScript repeatedly
3. Make handler to be more universal
# Reference

