$(document).ready(function() {

    for (var i = 0; i < 10; i++ ) {
        var $jhandle = $("<div class='jhandle'>");
        var size = random(200);
        var handle_size = random(20);

        $jhandle.css({ background: color(),
                       width: size,
                       height: size,
                       left: random(window.innerWidth - size),
                       top: random(window.innerHeight - size) });

        while (handle_size < 5) {
            handle_size = random(20);
        }
        $jhandle.handles({ size: handle_size });

        $("body").append($jhandle);
    }

});

function random(seed) {
    return Math.floor(Math.random() * seed);
}

function color() {
    return "rgba("
        + random(255) + ', '
        + random(255) + ', '
        + random(255) + ', 0.5)';
}
