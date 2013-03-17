# jquery-splitbutton [![Build Status](https://travis-ci.org/mar10/jquery-splitbutton.png?branch=master)](https://travis-ci.org/mar10/jquery-splitbutton)

Combine two ui-buttons and one ui-menu.

## Status
Pre-Alpha - not fit for production!

## Demo
[Sample page](http://mar10.github.com/jquery-splitbutton/sample-widget.html)


## Usage

JavsScript:
```js
$("button#split").splitbutton({
    menu: "#splitOptions",
    click: function(event){
        alert("clicked default button");
    },
    select: function(event, ui){
        var menuId = ui.item.find(">a").attr("href");
        alert("select " + menuId);
    }
});
```

Markup:
```html
<button id="split">Default action</button>

<ul id="splitOptions">
    <li><a href="#action1">Action 1</a>
    <li><a href="#action2">Action 2</a>
    <li><a href="#action3">Action 3</a>
    <li><a href="#action4">Action 4</a>
</ul>
```
