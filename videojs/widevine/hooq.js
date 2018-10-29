var player = videojs('video');

var url = "";
var license = "";

// player.eme();
player.ready(function () {
    player.src({
        src: url,
        type: 'application/dash+xml',
        keySystemOptions: [
            {
                name: 'com.widevine.alpha',
                options: {
                    "serverURL": license
                }
            }
        ]
    });

    player.play();