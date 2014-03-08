/*!
 * nil's hidden lab
 * http://lab.dotnil.org/
 *
 * Copyright 2010, Jake Chen
 * licensed under the MIT licenses.
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
(function($) {

    var _handles = {
        anchor: { x: 0, y: 0 },
        object: { x: 0, y: 0, width: 0, height: 0 }
    };

    $.fn.handles = function(options) {
        var defaults = {
            handles: "tl t tr l r bl b br",
            size: "5px",
            color: ""
        };
        var options = $.extend(defaults, options);

        _handles.bind();

        return this.each(function() {
            var $p = $(this);

            _handles.init($p, options.handles.split(" "), options.size);

            // object itself
            $p.mousedown(function(event) {
                $(".handle").hide();
                $(".top").removeClass("top");
                $p.find(".handle").show();
                $p.addClass("active");
                $p.addClass("top");

                _handles.anchor.x = event.pageX;
                _handles.anchor.y = event.pageY;
                _handles.object.x = parseInt($p.css("left"), 10);
                _handles.object.y = parseInt($p.css("top"), 10);
            });
        });
    };

    _handles.bind = function() {
        // deactivate
        $(document).mouseup(function() {
            $(".active").removeClass("active");
        });

        // mouse move
        $(document).mousemove(function(event) {
            var $active = $(".active");

            if (! $active.hasClass("handle")) {
                $active.css({ left: (_handles.object.x + event.pageX - _handles.anchor.x) + "px",
                              top: (_handles.object.y + event.pageY - _handles.anchor.y) + "px" });
            } else {
                var $h = $(".handle.active");

                if ($h.length > 0) {
                    var offsetX = event.pageX - _handles.anchor.x;
                    var offsetY = event.pageY - _handles.anchor.y;

                    _handles.draw($h, offsetX, offsetY)
                    event.stopPropagation();
                }
            }
        });

        // handles
        $(".handle").live("mousedown", function(event) {
            var $h = $(this);
            var $p = $h.parent();

            $h.addClass("active");

            _handles.anchor.x = event.pageX;
            _handles.anchor.y = event.pageY;
            _handles.object.x = parseInt($p.css("left"), 10);
            _handles.object.y = parseInt($p.css("top"), 10);
            _handles.object.width = parseInt($p.css("width"), 10);
            _handles.object.height = parseInt($p.css("height"), 10);

            return false;
        });
    };

    _handles.draw = function($h, offsetX, offsetY) {
        var $p = $h.parent();
        var tile = _handles.object; // the tile

        if ($h.hasClass("tl")) {
            $p.css({ left: (tile.x + offsetX) + "px",
                     top: (tile.y + offsetY ) + "px",
                     width: ( tile.width - offsetX ) + "px",
                     height: ( tile.height - offsetY) + "px" });

        } else if ($h.hasClass("t")) {
            $p.css({ top: (tile.y + offsetY ) + "px",
                     height: ( tile.height - offsetY) + "px" });

        } else if ($h.hasClass("tr")) {
            $p.css({ top: (tile.y + offsetY ) + "px",
                     width: ( tile.width + offsetX ) + "px",
                     height: ( tile.height - offsetY) + "px" });

        } else if ($h.hasClass("l")) {
            $p.css({ left: (tile.x + offsetX) + "px",
                     width: (tile.width - offsetX ) + "px" });

        } else if ($h.hasClass("r")) {
            $p.css({ width: (tile.width + offsetX ) + "px" });


        } else if ($h.hasClass("bl")) {
            $p.css({ left: (tile.x + offsetX) + "px",
                     width: ( tile.width - offsetX ) + "px",
                     height: ( tile.height + offsetY) + "px" });

        } else if ($h.hasClass("b")) {
            $p.css({ height: ( tile.height + offsetY) + "px" });

        } else if ($h.hasClass("br")) {
            $p.css({ width: ( tile.width + offsetX ) + "px",
                     height: ( tile.height + offsetY) + "px" });
        }
    };

    _handles.init = function($p, handles, size) {
        var offset = parseInt(size, 10) / 2; // 10px -> 5

        for (var i = 0; i < handles.length; i++) {
            var $handle = $("<div class='handle'/>");

            $handle.hide().addClass(handles[i]);
            $handle.css({ width: size, height: size });

            switch (handles[i]) {
            case "tl":
                $handle.css({ left: "-" + offset + "px", top: "-" + offset + "px" });
                break;
            case "t":
                $handle.css({ left: "50%", top: "-" + offset + "px" });
                break;
            case "tr":
                $handle.css({ right: "-" + offset + "px", top: "-" + offset + "px" });
                break;
            case "l":
                $handle.css({ left: "-" + offset + "px", top: "50%" });
                break;
            case "r":
                $handle.css({ right: "-" + offset + "px", top: "50%" });
                break;
            case "bl":
                $handle.css({ left: "-" + offset + "px", bottom: "-" + offset + "px" });
                break;
            case "b":
                $handle.css({ left: "50%", bottom: "-" + offset + "px" });
                break;
            case "br":
                $handle.css({ right: "-" + offset + "px", bottom: "-" + offset + "px" });
                break;
            };
            $p.append( $handle );
        }
    };

})(jQuery);
