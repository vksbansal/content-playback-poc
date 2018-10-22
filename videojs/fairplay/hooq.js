var player = videojs('my_video_1');

var srcUrl = "";
var certificateUrl = "";
var licenseUrl = "";

player.ready(function () {

    player.eme();
    player.src({
        src: srcUrl,
        type: 'application/x-mpegURL',
        keySystems: {
            "com.apple.fps.1_0": {
                licenseUri: licenseUrl,
                certificateUri: certificateUrl,
            }
        }
    });
});
