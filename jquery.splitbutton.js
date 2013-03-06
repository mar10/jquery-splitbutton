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
    $.widget("ui.splitbutton", {
        options: {
            menu: null,      // selector
            mode: "split",   // 'split' | '' 
            // Events:
            click: $.noop,   // default-button clicked
            select: $.noop,  // dropdown-menu option selected
            focus: $.noop,   // dropdown-menu option focused
            init: $.noop,    // Control was initialized
            open: $.noop,    // dropdown-menu opened
            close: $.noop    // dropdown-menu closed
        },
        _create: function () {
            var self = this;
            // `this.element` is the default-button
            // Now append a dropdown-button and wrap both in a new div tag
            // that will be converted into a buttonset
            this.element.wrap($("<div>"));
            
            this.element.after($("<button>...</button>").button({
                text: false, 
                icons: {
                    primary: "ui-icon-triangle-1-s"
                }
            }).click(function(event){
                // Click hander for dropdown-button: open dropdown-menu
                self._trigger("open", event);
                $(self.options.menu)
                    .css({
                        position: "absolute",
                        minWidth: self.element.width()
                    })
                    .slideDown("fast")
                    .position({
                        my: "left top", 
                        at: "left bottom", 
                        of: self.element, 
                        collision: "fit"
                    });
            }));
            // Convert both buttons into a buttonset
            this.element.parent().buttonset();
            this.element.click(function(event){
                self._trigger("click", event);
            });
            // Register global event handlers that close the dropdown-menu
            $(document).bind("keydown.splitbutton", function(event){
                if( event.which === $.ui.keyCode.ESCAPE ){
                    self._closeMenu();
                }
            }).bind("mousedown.splitbutton", function(event){
                // Close menu when clicked outside menu
                if( $(event.target).closest(".ui-menu-item").length === 0 ){
                    self._closeMenu();
                }
            });
            
            // Create - but hide - dropdown-menu
            $(this.options.menu)
                .hide()
                .addClass("ui-splitbutton-menu")
                .menu({
                    focus: function(event, ui){
                        self._trigger("focus", event, ui);
                    },
                    select: function(event, ui){
//                        var menuId = ui.item.find(">a").attr("href");
                        if( self._trigger("select", event, ui) !== false ){
                            self._closeMenu();
                        }
                    }
                });
            this._trigger("init");
        },
        /** Close dropdown. */
        _closeMenu: function(){
            $(this.options.menu).fadeOut();
            this._trigger("close");
        },
        /**
         * Handle $().configurator("option", ...) calls. 
         */
        _setOption: function(key, value){
            $.Widget.prototype._setOption.apply(this, arguments);
            // TODO: redraw, if required
        }
    });
} (jQuery));