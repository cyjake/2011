var CLOCK = {
    version: 0.1
};

window.onload = function() {

    var clock_box = document.getElementById("clock-box");
    var clock = document.getElementById("clock");

    clock.width = parseInt(clock_box.style.width, 10);
    clock.height = parseInt(clock_box.style.height, 10);

    var c = clock.getContext("2d");
    var r = Math.floor(clock.width / 2) - 1;

    c.translate(r, clock.height / 2);

    c.beginPath();
    c.strokeStyle = "#777";
    c.arc(0, 0, r, 0, Math.PI * 2, true);
    c.stroke();
    c.closePath();

    c.strokeStyle = "#333";
    c.font = "30px Georgia";
    c.textAlign = "center";

    if (typeof G_vmlCanvasManager === "undefined") { // not IE
        c.fillText("12", 0, 30 - r);
        c.fillText("3", r - 20, 5);
        c.fillText("6", 0, r - 20);
        c.fillText("9", 20 - r, 5);
    }

    c.beginPath();
    c.fillStyle = "#000";
    c.arc(0, 0, 5, 0, Math.PI * 2, true);
    c.fill();
    c.closePath();

    // register global
    CLOCK.width = clock.width;
    CLOCK.height = clock.height;
    CLOCK.radius = r;

    var clock_hands = hands();

    clock_hands.init();
};

var hands = function() {
    var second = document.getElementById("second-hand");
    var minute = document.getElementById("minute-hand");
    var hour = document.getElementById("hour-hand");
    var current = new Date();

    second.width = minute.width = hour.width = CLOCK.width;
    second.height = minute.height = hour.height = CLOCK.height;

    return {
        init: function() {
            this.second();
            this.minute();
            this.hour();
        },
        second: function() {
            var c = second.getContext("2d");
            var r = CLOCK.radius;

            c.translate(r, second.height / 2);
            c.rotate(Math.PI / 30 * current.getSeconds() + Math.PI);
            c.fillStyle = "#333";
            c.fillRect(-1, -1, 2, r * 3 / 4);
            setInterval(function() {
                c.clearRect(-r, -( second.height / 2), second.width, second.height);
                c.rotate(Math.PI / 30);
                c.fillRect(-1, -1, 2, r * 3 / 4);
            }, 1000);
        },
        minute: function() {
            var c = minute.getContext("2d");
            var r = CLOCK.radius;

            c.translate(r, minute.height / 2);
            c.rotate(Math.PI / 30 * current.getMinutes() + Math.PI);
            c.fillStyle = "#555";
            c.fillRect(-2, -2, 4, r * 2 / 3);
            setInterval(function() {
                c.clearRect(-r, -( minute.height / 2), minute.width, minute.height);
                c.rotate(Math.PI / 30);
                c.fillRect(-2, -2, 4, r * 2 / 3);
            }, 60000);
        },
        hour: function() {
            var c = hour.getContext("2d");
            var r = CLOCK.radius;

            c.translate(r, hour.height / 2);
            c.rotate(Math.PI / 6 * (current.getHours() % 12) + Math.PI);
            c.fillStyle = "#777";
            c.fillRect(-5, -5, 10, r / 2);
            setInterval(function() {
                c.clearRect(-r, -( hour.height / 2), hour.width, hour.height);
                c.rotate(Math.PI / 12);
                c.fillRect(-5, -5, 10, r / 2);
            }, 3600000);
        }
    };
}
