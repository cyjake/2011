/*!
 * nil's hidden lab
 * http://lab.dotnil.org/
 *
 * Copyright 2010, Jake Chen
 * licensed under the MIT licenses.
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

$(document).ready(function() {

    $(".slide:eq(0)").fadeIn().addClass("selected");

    $(".slide").live("click", function(e) {
	    var $target = $(e.target);
	    if ($target.is("div"))
	        control();
    });

    var $toc = $("<ul/>")
    $(".slide").each(function() {
	    var index = $(".slide").index(this);
	    var $li = $("<li/>").append($(this).find("h2").html())
	        .click(function() {
		        $("#toc").slideUp(500, function() {
		            toggle(index);
		        });
	        });
	    $toc.append($li);
    });
    $toc.appendTo("#toc");

    $("#toggle-toc").click(function() {
	    var position = $(this).position();
	    $("#toc").css({
	        "left" : position.left,
	        "top": position.top +24
	    }).slideDown(500);
	    setTimeout(function() { $("#toc").slideUp(); }, 5000);
    });

    $("#control ul a").live("click", function() {
	    var href = $(this).attr("id").substring(5);
	    control(href);

        return false;
    });

    function control(href) {
	    var href = href || "next";
	    var index = $(".slide").index($(".selected")) || 0;
	    var last = $(".slide").index($(".slide:last"));
	    switch(href) {
	    case "first":
	        index = 0;
	        break;
	    case "previous":
	        if (index >0) index -= 1;
	        break;
	    case "play":

	        break;
	    case "next":
	        if (index <last) index += 1;
	        break;
	    case "last":
	        index = last;
	        break;
	    default:
	        break;
	    }
	    toggle(index);
    }

    function toggle(index) {
	    var index = index || 0;
	    $(".selected").fadeOut(500, function() {
	        $(this).removeClass("selected");
	        $(".slide:eq(" +index +")").addClass("selected").fadeIn(500);
	    });
    }
});