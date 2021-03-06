/*******************************************************************************
 * jQuery.splitbutton plugin.
 * 
 * Combine two ui-buttons and one ui-menu.
 * 
 * @see https://github.com/mar10/jquery-splitbutton
 * 
 * Copyright (c) 2013, Martin Wendt (http://wwWendt.de). Licensed MIT.
 */

(function ($) {
    "use strict";
    function getMenuFromEvent(event){
        var menu = $(event.target).closest(":ui-menu"),
            $menu = $(menu);
        return $menu.data("ui-menu") || $menu.data("menu");
    }
    $.widget("ui.splitbutton", {
        options: {
            menu: null,      // selector | jQuery | function | null
            mode: "split",   // 'split' | 'list' 
            // Events:
            blur: $.noop,    // dropdown-menu option lost focus
            click: $.noop,   // default-button clicked
            close: $.noop,   // dropdown-menu closed
            focus: $.noop,   // dropdown-menu option focused
            init: $.noop,    // control was initialized
            open: $.noop,    // dropdown-menu opened
            select: $.noop   // dropdown-menu option selected
        },
        _create: function () {
            var self = this,
                $menu = this._getMenu();
            // `this.element` is the default-button
            if(this.options.mode === "list"){
                this.element.button({
                    icons: {
                        secondary: "ui-icon-triangle-1-s"
                    }
                }).click($.proxy(this._openMenu, this));
            }else{
                // Append a dropdown-button and wrap both in a new div tag
                // that will be converted into a buttonset
                this.element.wrap($("<span>"));
                
                this.element.after(
                    // Note: button must not be empty, otherwise it is too small
                    $("<button>...</button>").button({
                        text: false, 
                        "class": "ui-splitbutton-trigger",
                        icons: {
                            primary: "ui-icon-triangle-1-s"
                        }
                    }).click($.proxy(this._openMenu, this))
                );
                // Convert both buttons into a buttonset
                this.element.parent().buttonset();
            }
            this.element.click(function(event){
                self._trigger("click", event);
            });
            // Create - but hide - dropdown-menu
            $menu
                .hide()
                .addClass("ui-splitbutton-menu")
                // Create a menu instance
                // Note: the menu may be re-used by other splitbutton instances,
                // so we attach the splitbutton widget in _openMenu()
                .menu({
                    blur: function(event, ui){
                        // Get splitbutton widget
                        var widget = getMenuFromEvent(event).controller;

                        if(widget !== null) {
                            widget._trigger("blur", event, ui);
                        } else {
                        // Menu was closed and splitbutton widget detached
                        }
                    },
                    focus: function(event, ui){
                        getMenuFromEvent(event).controller._trigger("focus", event, ui);
                    },
                    select: function(event, ui){
//                        var menuId = ui.item.find(">a").attr("href");
                        var widget = getMenuFromEvent(event).controller;
                        
                        // If we have a sub menu, we don't trigger select
                        if($(ui.item[0].lastElementChild).is("ul.ui-menu")) {
                            return false;
                        }
                        
                        if( widget._trigger("select", event, ui) !== false ){
                            widget._closeMenu.call(widget);
                        }
                    }
                });
            // Register global event handlers that close the dropdown-menu
            $(document).bind("keydown.splitbutton", function(event){
                if( event.which === $.ui.keyCode.ESCAPE ){
                    self._getMenuWidget().controller.element.focus();
                    self._closeMenu();
                }
            }).bind("mousedown.splitbutton", function(event){
                // Close menu when clicked outside menu
                if( $(event.target).closest(".ui-menu-item").length === 0 ){
                    self._closeMenu();
                }
            });
            this._trigger("init");
        },
        /** Return menu jQuery object. */
        _getMenu: function(){
            var $menu = this.options.menu || this.element.data("menu");
            if($.isFunction($menu)){
                $menu = $menu();
            }
            if(typeof $menu === "string"){
                $menu = $($menu);
            }
            return $menu;
        },
        /** Return menu widget instance (works on pre and post jQueryUI 1.9). */
        _getMenuWidget: function(){
            var $menu = this._getMenu();
            return $menu.data("ui-menu") || $menu.data("menu");
        },
        /** Close dropdown. */
        _closeMenu: function(){
            this._getMenu().fadeOut(function() {
                // Resetting position
                $(this).css({
                    top: 0,
                    left: 0
                });
            });
            
            // Trigger blur before splitbutton widget gets detached 
            this._trigger("blur");
            
            this._trigger("close");

            // TODO: setting ui-state-active doesn't work, because .button()
            // plugin removes it on mouseout
//            if(this.options.mode === "list"){
//                this.element.removeClass("ui-state-active");
//            }else{
//                $(this.element).next().removeClass("ui-state-active");
//            }
            // Detach splitbutton widget from menu widget
            this._getMenuWidget().controller = null;
        },
        /** Open dropdown. */
        _openMenu: function(event){
            var $menu = this._getMenu();
            // If menu is visible, we don't need to open it again
            if( $menu.is(":visible") ) {
                // TODO: Doesn't work quite right for multiple splitbuttons
                return;
            }
            // Click handler for dropdown-button: open dropdown-menu
            if( this._trigger("open", event) === false) {
                return;
            }
            // Attach splitbutton widget to the menu widget.
            this._getMenuWidget().controller = this;

            // TODO: setting ui-state-active doesn't work, because .button()
            // plugin removes it on mouseout
//            if(this.options.mode === "list"){
//                this.element.addClass("ui-state-active");
//            }else{
//                $(this.element).next().addClass("ui-state-active");
//            }
            // Calculate minWidth
            var menuPadding = $menu.outerWidth() - $menu.width(),
                minWidth = this.element.outerWidth(true) - menuPadding;
            
            $menu
                .show()
                .css({
                    position: "absolute",
                    minWidth: minWidth,
                    left: 0,
                    top: 0
                })
                .position({
                    my: "left top", 
                    at: "left bottom", 
                    of: this.element, 
                    collision: "fit"
                })
                .hide()
                .slideDown("fast", function(){
                    // Set keyboard focus to first item
                    var $first = $menu.find(".ui-menu-item:first");
                    $menu.menu("focus", null, $first);
                    $menu.focus();
                });
        },
        /**
         * Handle $().splitbutton("option", ...) calls. 
         */
        _setOption: function(key, value){
            $.Widget.prototype._setOption.apply(this, arguments);
            // TODO: redraw, if required
        }
    });
} (jQuery));
