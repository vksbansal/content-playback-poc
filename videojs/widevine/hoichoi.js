var manifest = ''

var player = videojs('video');

player.ready(function () {
    player.src({
        src: manifest,
        type: 'application/x-mpegURL'
    });
});