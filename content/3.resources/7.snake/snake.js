/*!
 * nil's hidden lab
 * http://lab.dotnil.org/
 *
 * Copyright 2010, Jake Chen
 * licensed under the MIT licenses.
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

// global namespace
var SNAKE = {
    theme: '#ccc',
    _score: 0,
    speed: 1,
    has_border: false,
    paused: true,
    cube_style: 'circle',
    cube_size: 20,
    prop: {},
    dom: {}
};

var Keyboard = {
    a: 65,
    s: 83,
    d: 68,
    w: 87,
    left: 37,
    up: 38,
    right: 39,
    down: 40
};

SNAKE.score = function() {
    if (arguments.length == 1) {
        SNAKE._score = arguments[0];
        SNAKE.dom.score.html(SNAKE._score);
    }
    return SNAKE._score;
}

SNAKE.cube_styles = (function() {
    function solid(ctx) {
        var x = this.x, y = this.y, size = this.sideLength;

        ctx.save();
        ctx.fillStyle = Color.get();
        ctx.fillRect(x, y, size, size);
        ctx.restore();
    }
    function zebra(ctx) {
        var x = this.x, y = this.y, size = this.sideLength;

        ctx.save();
        ctx.fillStyle = Color.get();
        ctx.fillRect(x, y, size/2, size);
        ctx.fillStyle = Color.revert(ctx.fillStyle);
        ctx.fillRect(x+size/2, y, size/2, size);
        ctx.restore();
    }
    function smile(ctx) {
        var x = this.x, y = this.y, size = this.sideLength, radius = Math.floor(size/2)-1;
        var bun = { x: x+size/2, y: y+size/2 };

        ctx.save();
        ctx.fillStyle = Color.get();
        ctx.beginPath();
        ctx.arc(bun.x, bun.y, radius, 0, Math.PI*2, true); // Outer circle
        radius = size/3;
        ctx.moveTo(bun.x+radius, bun.y);
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = Color.revert(ctx.fillStyle);
        ctx.arc(bun.x, bun.y, radius, 0, Math.PI, false);   // Mouth (clockwise)
        bun = { x: x+radius, y: y+radius }; // left eye's bun
        radius = size/20;
        ctx.moveTo(bun.x+radius, bun.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = ctx.strokeStyle;
        ctx.arc(bun.x, bun.y, radius, 0, Math.PI*2, true);  // Left eye
        bun = { x: x+(size*2/3), y: y+(size/3) };
        ctx.moveTo(bun.x+radius, bun.y);
        ctx.arc(bun.x, bun.y, radius, 0, Math.PI*2, true);  // Right eye
        ctx.fill();
    }
    function circle(ctx) {
        var x = this.x, y = this.y, size = this.sideLength;
        var bun = { x: x+(size/2), y: y+(size/2) };

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = Color.get();
        ctx.arc(bun.x, bun.y, size/2, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = Color.revert(ctx.fillStyle);
        ctx.arc(bun.x, bun.y, size/3, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
    return {
        solid: solid,
        zebra: zebra,
        smile: smile,
        circle: circle
    }
})();

SNAKE.cube_selector = function() {
    var $items = $("<ul>");
    var size = 50;

    for (var style in SNAKE.cube_styles) {
        var $item = $("<li>").attr('id', style);
        var $canvas = $("<canvas>");
        var context = $canvas[0].getContext('2d');
        var cube = new Cube(0, 0, size);

        $canvas.attr('height', size).attr('width', size).appendTo($item);
        $item.click(function() {
            SNAKE.cube_style = $(this).attr('id');
            $(this).siblings().removeClass("selected");
            $(this).addClass("selected");
        }).appendTo($items);
        if (style == SNAKE.cube_style) {
            $item.addClass('selected');
        }
        SNAKE.cube_styles[style].call(cube, context);
    }
    SNAKE.dom.cube_selector.append($items);
}

SNAKE.controller = function() {
    var dom = SNAKE.dom;

    dom.controller.click(function() {
        SNAKE.paused = !SNAKE.paused;
        dom.controller.find("#" + (SNAKE.paused ? 'start' : 'pause')).show();
        dom.controller.find("#" + (!SNAKE.paused ? 'start' : 'pause')).hide();
        trace(SNAKE.paused);
        SNAKE.map[SNAKE.paused ? 'pause' : 'resume']();
    });
    dom.controller.find("#pause").hide();
}

$(document).ready(function() {
    var canvas = document.getElementById('canvas');

    SNAKE.dom.canvas = $(canvas);
    SNAKE.dom.score = $("#score .value");
    SNAKE.dom.cube_selector = $("#cube-selector");
    SNAKE.dom.controller = $("#controller");

    SNAKE.controller();
    SNAKE.score(0);
    SNAKE.cube_selector();

    SNAKE.map = new Map();
    SNAKE.map.init();
    SNAKE.map.pause();
});

var Map = function(canvas) {
    var canvas = SNAKE.dom.canvas[0];

    this.width = canvas.width;
    this.height = canvas.height;
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.border(SNAKE.has_border);
}

Map.prototype.init = function() {
    var map = this;

    this.snake = new Snake();
    this.egg = new Egg();
    this.snake.init(map);
    this.egg.init(map);
}

Map.prototype.pause = function() {
    var ctx = this.context, snake = this.snake, map = this;
    var x = 0, y = 2;

    snake.shock();
}

Map.prototype.resume = function() {
    this.snake.heartbeat();
}

Map.prototype.border = function() {
    if (arguments.length == 1) {
        SNAKE.has_border = arguments[0] === true;
    } else {
        return SNAKE.has_border;
    }
}

var Snake = function() {
    this.direction = 'right';
    this.body = [];
    this.sideLength = SNAKE.cube_size;
}

Snake.prototype.init = function(map) {
    this.map = map;
    this.context = map.context;
    this.body = [];
    for (var i=0; i<3; i++) {
        var c = new Cube(i*this.sideLength, 0, this.sideLength);
        this.body.push(c);
    }
    this.draw();
    (function(snake) {
        $(document).keyup(function(event) {
            snake.turn(event.keyCode);
        });
        snake.heartbeat();
    })(this);
}

Snake.prototype.heartbeat = function() {
    var snake = this, map = this.map;

    snake.forward();
    snake._turned = false;
    if (snake.clash()) {
        snake.reset();
    } else {
        if (snake.eat()) {
            snake.grow();
            SNAKE.speed = 1 + Math.floor( Math.sqrt(snake.body.length/10) );
        }
        snake.heart = setTimeout(function() {
            snake.heartbeat();
        }, Math.round(100/SNAKE.speed));
    }
}

Snake.prototype.shock = function() {
    var snake = this;

    clearTimeout(snake.heart);
}

Snake.prototype.grow = function() {
    var body = this.body, sideLength = this.sideLength;
    var cube = new Cube(0, 0, SNAKE.cube_size);
    var first = body[0];

    switch (this.direction) {
    case 'right':
        cube.x = first.x - sideLength;
        cube.y = first.y;
        break;
    case 'down':
        cube.x = first.x;
        cube.y = first.y - sideLength;
        break;
    case 'up':
        cube.x = first.x;
        cube.y = first.y + sideLength;
        break;
    case 'left':
        cube.x = first.x + sideLength;
        cube.y = first.y;
        break;
    }
    body.unshift(cube);
}

Snake.prototype.eat = function() {
    var map = this.map, egg = map.egg, body = this.body, context = this.context;

    for (var i=0; i<body.length; i++) {
        if (egg.x == body[i].x && egg.y == body[i].y) {
            egg.clear(context);
            body[i].draw(context)
            map.egg = new Egg();
            map.egg.init(map);
            SNAKE.score( SNAKE.score()+1 );
            return true;
        }
    }
    return false;
}

Snake.prototype.turn = function(keyCode) {
    var snake = this;

    if (snake._turned) {
        return;
    }
    switch (keyCode) {
    case Keyboard.a:
    case Keyboard.left:
        if (snake.direction != 'right') {
            snake.direction = 'left';
        }
        break;
    case Keyboard.w:
    case Keyboard.up:
        if (snake.direction != 'down') {
            snake.direction = 'up';
        }
        break;
    case Keyboard.s:
    case Keyboard.down:
        if (snake.direction != 'up') {
            snake.direction = 'down';
        }
        break;
    case Keyboard.d:
    case Keyboard.right:
        if (snake.direction != 'left') {
            snake.direction = 'right';
        }
        break;
    }
    snake._turned = true;
}

Snake.prototype.clash = function() {
    var body = this.body, map = this.map, cube = body[body.length -1];
    var crashed = false;

    crashed = map.border() && (cube.x >= map.width || cube.x < 0 || cube.y >= map.height || cube.y < 0);
    for (var i=0; i<body.length; i++) { // check if snake body is overlapping
        for (var k=0; k<body.length; k++) {
            if (i == k) {
                continue;
            }
            if (body[i].x == body[k].x && body[i].y == body[k].y) {
                return true;
            }
        }
    }
    return crashed;
}

Snake.prototype.reset = function() {
    var body = this.body, context = this.context, heart = this.heart;

    for (var i=0; i<body.length; i++) {
        body[i].clear(context);
    }
    if (heart) { clearTimeout(heart); }
}

Snake.prototype.forward = function() {
    var body = this.body, sideLength = this.sideLength, map = this.map, context = this.context;
    var cube = body.shift();
    var last = body[body.length -1];

    cube.clear(context);
    switch (this.direction) {
    case 'right':
        cube.x = last.x + sideLength;
        cube.y = last.y;
        break;
    case 'down':
        cube.x = last.x;
        cube.y = last.y + sideLength;
        break;
    case 'up':
        cube.x = last.x;
        cube.y = last.y - sideLength;
        break;
    case 'left':
        cube.x = last.x - sideLength;
        cube.y = last.y;
        break;
    }
    if (cube.x >= map.width) {
        cube.x = 0;
    }
    if (cube.x < 0) {
        cube.x = map.width - sideLength;
    }
    if (cube.y >= map.height) {
        cube.y = 0;
    }
    if (cube.y < 0) {
        cube.y = map.height - sideLength;
    }
    cube.draw(context);
    body.push(cube);
}

Snake.prototype.draw = function() {
    var ctx = this.context;

    for (var i=0; i<this.body.length; i++) {
        this.body[i].draw(ctx);
    }
}

var Cube = function(x, y, sideLength) {
    this.x = x || 0;
    this.y = y || 0;
    this.sideLength = sideLength || 0;
}

Cube.prototype.draw =  function(ctx) {
    var style = SNAKE.cube_styles[SNAKE.cube_style];

    style && style.call(this, ctx);
}

Cube.prototype.clear = function(ctx) {
    ctx.clearRect(this.x, this.y, this.sideLength, this.sideLength);
}

var Egg = function(x, y, sideLength) {
    this.x = x || 0;
    this.y = y || 0;
    this.sideLength = sideLength || 0;
}

Egg.prototype = new Cube;

Egg.prototype.draw = function(ctx) {
    ctx.save();
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.sideLength, this.sideLength);
    ctx.restore();
}

Egg.prototype.init = function(map) {
    this.map = map;
    this.context = map.context;
    this.sideLength = SNAKE.cube_size;
    this.setXY();
    this.draw(this.context);
}

Egg.prototype.setXY = function() {
    var map = this.map, body = map.snake.body, size = this.sideLength;
    var pos = random();

    this.x = pos.x; this.y = pos.y;
    function random() {
        var pos = {
            x: round(Math.random()*(map.width-size), size),
            y: round(Math.random()*(map.height-size), size)
        };
        var valid = true;
        for (var i=0; i<body.length; i++) {
            if (body[i].x == pos.x && body[i].y == pos.y) {
                valid = false;
            }
        }
        if (!valid) {
            pos = random();
        }
        return pos;
    }
    function round(number, mod) {
        number = Math.floor(number);
        return number - (number % mod);
    }
}

Egg.prototype.clear = function(ctx) {
    ctx.clearRect(this.x, this.y, this.sideLength, this.sideLength);
}

/**
 * (r,   g,     b,    a);
 * (red, green, blue, alpha);
 */
var Color = (function() {
    function revert(color) {
        color = color.substr(1);
        if (color.length == 3) {
            color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
        }
        color = parseInt(color, 16);
        color = (0xFFFFFF - color).toString(16);
        while (color.length < 6) {
            color = '0' + color;
        }
        return '#' + color;
    }
    function random() {
        color = Math.floor(Math.random() * 255);
        color = color.toString(16);
        return '#' + color + color + color;
    }
    function get() {
        return SNAKE.theme || '#ccc'
    }
    return {
        revert: revert,
        random: random,
        get: get
    };
})();

function trace() {
    if (typeof console !== 'undefined' &&
        typeof console.log === 'function') {
        console.log(Array.prototype.slice.call(arguments).join(", "));
    }
}