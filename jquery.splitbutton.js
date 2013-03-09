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
            mode: "split",   // 'split' | 'list' 
            // Events:
            blur: $.noop,    // dropdown-menu option lost focus
//            blur: function(event, ui){
//                alert("b" + event);
//            },
            click: $.noop,   // default-button clicked
            close: $.noop,   // dropdown-menu closed
            focus: $.noop,   // dropdown-menu option focused
            init: $.noop,    // control was initialized
            open: $.noop,    // dropdown-menu opened
            select: $.noop   // dropdown-menu option selected
        },
        _create: function () {
            var self = this;
            // `this.element` is the default-button
            if(this.options.mode === "list"){
                this.element.button({
                    text: false,
                    icons: {
                        secondary: "ui-icon-triangle-1-s"
                    }
                }).click($.proxy(this._openMenu, this));
            }else{
                // Append a dropdown-button and wrap both in a new div tag
                // that will be converted into a buttonset
                this.element.wrap($("<span>"));
                
                this.element.after(
                    $("<button>...</button>").button({
                        text: false, 
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
            $(this.options.menu)
                .hide()
                .addClass("ui-splitbutton-menu")
                .menu({
                    blur: function(event, ui){
                        self._trigger("blur", event, ui);
                    },
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
            this._trigger("init");
        },
        /** Close dropdown. */
        _closeMenu: function(){
            $(this.options.menu).fadeOut();
            this._trigger("close");
        },
        /** Open dropdown. */
        _openMenu: function(event){
            // Click hander for dropdown-button: open dropdown-menu
            this._trigger("open", event);
            $(this.options.menu)
                .css({
                    position: "absolute",
                    minWidth: this.element.width()
                })
                .slideDown("fast")
                // TDOD: position should be applied after animation finished
                .position({
                    my: "left top", 
                    at: "left bottom", 
                    of: this.element, 
                    collision: "fit"
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