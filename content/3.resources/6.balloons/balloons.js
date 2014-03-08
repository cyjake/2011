/*!
 * nil's hidden lab
 * http://lab.dotnil.org/
 *
 * Copyright 2010, Jake Chen
 * licensed under the MIT licenses.
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

var BALLOON = {
    min: 24,
    max: 48
};

window.onload = function() {
    var board = BALLOON.board;

    board = document.getElementById("board");

    board.onclick = function(event) {
        var x, y;
        var event = event || window.event;

        x = event.clientX;
        y = event.clientY;

        var balloon = new Balloon(x, y);

        if (balloon) {
            board.appendChild(balloon);
        }
    }

    var refresh = document.getElementsByName('refresh')[0];

    refresh.onclick = function() {
        var min = document.getElementsByName('min_radius')[0].value;
        var max = document.getElementsByName('max_radius')[0].value;

        BALLOON.min = parseInt(min, 10);
        BALLOON.max = parseInt(max, 10);
    }

    var remove = document.getElementById('remove_all');

    remove.onclick = function () {
        var balloons = document.getElementsByTagName('canvas');

        while (balloons.length > 0) {
            board.removeChild(balloons[0]);
        }
        return false;
    }

    var invert = document.getElementById('invert');

    invert.onclick = function() {
        var cls = board.className;

        if (cls == "white") {
            cls = "black";
        } else {
            cls = "white";
        }
        board.className = cls;
        return false;
    }
}

var Balloon = function(x, y) {
    var min = BALLOON.min, max = BALLOON.max;
    var r = min + Math.floor(Math.random() * (max - min));

    this.x = x;
    this.y = y;
    this.r = r;

    this.a = Math.floor(r*r / min/min); // acceleration
    this.canvas = document.createElement('canvas');
    this.draw();

    return this.canvas;
};

Balloon.prototype.draw = function() {
    var x = this.x, y = this.y, r = this.r, canvas = this.canvas;

    canvas.height = canvas.width = r * 2;
    canvas.style.left = (x - r) + 'px';
    canvas.style.top = (y - r) + 'px';
    canvas.style.position = "absolute";

    /* ie always gets special treatment.
     * http://code.google.com/p/explorercanvas/wiki/Instructions
     */
    if (typeof G_vmlCanvasManager != "undefined") {
        G_vmlCanvasManager.initElement(canvas);
    }

    c = canvas.getContext('2d');
    c.beginPath();
    c.arc(r, r, r, 0, 2*Math.PI, true);
    c.fillStyle = color();
    c.fill();

    this.levitate(0);
}

Balloon.prototype.levitate = function(i) {
    var y = this.y, r = this.r, a = this.a, canvas = this.canvas;
    var that = this;
    var y2 = y - r - a*i*i;

    if (y2 < 0) {
        if (y - r > r) {
            that.rebound(0);
        } else {
            canvas.style.top = 0 + 'px';
        }
        return;
    }
    setTimeout(function() {
        canvas.style.top = y2 + 'px';
        that.levitate(++i);
    }, 50);
}

Balloon.prototype.rebound = function(i) {
    var y = this.y, r = this.r, a = this.a, canvas = this.canvas;
    var that = this;
    var max = BALLOON.max;
    var y2 = Math.floor(y/20*i - a*i*i);

    if (y/20 - 2*a*i + a < 0) { // when it should be levitated again.
        this.y = y2 + r;
        that.levitate(0);
        return;
    }
    setTimeout(function() {
        canvas.style.top = y2 + 'px';
        that.rebound(++i);
    }, 50);
}

function color() {
    return "rgba("
        + Math.floor(Math.random() * 255) + ', '
        + Math.floor(Math.random() * 255) + ', '
        + Math.floor(Math.random() * 255) + ', 0.5)';
}


function log() {
    var i = 0;

    for (i = 0; i < arguments.length; i++) {
        console.log(arguments[i]);
    }
}