/*!
 * nil's hidden lab
 * http://lab.dotnil.org/
 *
 * Copyright 2010, Jake Chen
 * licensed under the MIT licenses.
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

var undefined, douji = {
    version: 0.1,
    books: {},
    cache: {},
    dom: {}                     // jQuery objects cached.
};

douji.init = function() {

    douji.dom.form = $("form");
    douji.dom.keyword = douji.dom.form.find("input[name=keyword]");
    douji.dom.feedback = douji.dom.form.find("#feedback");
    douji.dom.books = $("#books");
    douji.dom.bookmenu = $("body > .book-menu");

    douji.dom.keyword.val( douji.dom.keyword.attr("placeholder") );

    douji.dom.keyword.focus( function() {
        var $this = douji.dom.keyword;

        if ( $this.hasClass("virgin") ) {
            $this.val("");
            $this.removeClass("virgin");
        }
    }).blur( function() {
        var keyword = douji.dom.keyword.val();
        var $this = douji.dom.keyword;

        if (/^\s*$/.test( keyword )) {
            $this.val( $this.attr("placeholder") );
            $this.addClass("virgin");
        }
    });

    douji.dom.bookmenu.find("#delete a").click( function() {
        if ( douji.current ) {
            douji.checkout( douji.current );
        }
        return false;
    });

    // init the books cache.
    douji.cache.books = {};
};

douji.register = function($book) {

    var $menu = $book.find(".book-menu");

	$book.hide().prependTo( douji.dom.books ).fadeIn();

    $book.hover( function() {
        $menu.show();
        douji.current = $book;
    }, function() {
        $menu.hide();
    });

    douji.books[ $book.attr("id") ] = $book;
    douji.rehash();
};

douji.checkout = function($book) {

    douji.cache.books[ $book.attr("id") ] =  $book;

    $book.fadeOut(500, function() {
        delete douji.books[ $book.attr("id") ];
        $book.remove();
        douji.rehash();
    });
};

douji.feedback = function(msg) {
    var $msg = $("<div class='message'>").html( msg );

	douji.dom.feedback.append($msg).show().fadeOut(2000, function() {
        douji.dom.feedback.html("");
    });
};

douji.hash = function() {
    var hash = window.location.hash;

    if (hash == "" || hash == "#") {
        return;
    }
    hash = hash.substring(1).replace(/,/g, " ");
    douji.dom.keyword.val(hash);
    douji.dom.keyword.removeClass("virgin");
    douji.dom.form.submit();
};

douji.rehash = function() {
    var books = [];

    for (var b in douji.books) {
        books.push(b);
    }
    window.location.hash = "#" + books.join(",");
};

douji.fetch = function(douban_id) {
    // see if its been added already.
    if ( douji.books.hasOwnProperty(douban_id) ) {
        douji.dom.books.find("li#" + douban_id).animate({
            opacity: 0.2
        }, 500, function() {
            $(this).animate({ opacity: 1 });
        });
        return;
    }
    if ( douji.cache.books.hasOwnProperty(douban_id) ) {
        douji.register( douji.cache.books[cached_id] );
        return;
    }
    DOUBAN.getBook({
	    id: douban_id,
	    callback: douji.format
    });
};

douji.format = function(b) {
	var $book = $("<li class='book'>"),
     	subj = DOUBAN.parseSubject(b),
        douban_id = subj.id.substring(subj.id.lastIndexOf('/')+1, subj.id.length),
        $menu = douji.dom.bookmenu.clone(true);

    $book.html( tmpl("book_template", { link: subj.link.alternate,
                                        cover: subj.link.image,
                                        title: subj.title ? subj.title : "",
                                        author: subj.attribute.author.join(" / "),
                                        price: subj.attribute.price.join(" / "),
                                        publisher: subj.attribute.publisher.join(" / "),
                                        summary: subj.summary ? subj.summary : ""
                                      }) );

    $menu.find("#at-douban a").attr("href", "http://www.douban.com/subject/" + douban_id);
    $book.append($menu).attr("id", douban_id);

    douji.register($book);
};

$(document).ready(function(){
    DOUBAN.apikey = '080d41711d924ad81827c45358b6e088';

    douji.init();

    douji.dom.form.submit(function() {
	    var list = douji.dom.keyword.val();
	    var ids = list.split(/\s+/);
        var wrong_ids = [];

        if ( douji.dom.keyword.hasClass("virgin") || list == "") { // nothing to search
            douji.feedback("type book ISBN or subject ID to add please.");
            return false;
        }
	    for (var i = 0; i < ids.length; i++) {
	        var douban_id = ids[i];
	        var doubanp = /^\d{7}$/;
	        var isbnp = /^\d{12}(?:\d|X)$/;

	        if (isbnp.test(douban_id)) {
		        DOUBAN.searchBooks({
		            keyword: douban_id,
		            callback: function(b){
			            var subj = DOUBAN.parseSubjects(b).entries;
			            var douban_id = subj[0].id;

			            douban_id = douban_id.substring(douban_id.lastIndexOf('/')+1, douban_id.length);
                        douji.fetch(douban_id);
		            }
		        });
	        } else if (doubanp.test(douban_id)) {
                douji.fetch(douban_id);
	        } else {
                wrong_ids.push(douban_id);
	        }
	    }
        if (wrong_ids.length > 0) {
            douji.feedback( wrong_ids.join("/") + " will be discarded.");
        }
	    return false;
    });

    douji.hash();
});

// http://ejohn.org/blog/javascript-micro-templating/
// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
  var cache = {};

  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :

      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");

    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();
