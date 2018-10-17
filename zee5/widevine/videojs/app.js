var manifestUri = 'manifest.mpd';
var licenseUrl = 'licensekeyserver.com';
var token = "token";

var player = videojs('my_video_1');

player.ready(function () {

    player.eme();
    player.src({
        src: manifestUri,
        type: 'application/dash+xml',
        keySystems: {
            'com.widevine.alpha': {
                getLicense: function (emeOptions, keyMessage, callback) {
                    let message = new Uint8Array(keyMessage);
                    videojs.xhr({
                        uri: licenseUrl,
                        method: 'POST',
                        responseType: 'arraybuffer',
                        body: message,
                        headers: {
                            "content-type": "application/octet-stream",
                            "customData": token
                        }
                    }, (err, response, responseBody) => {
                        if (err) {
                            callback(err);
                            return;
                        }
                        callback(null, responseBody);
                    });
                }
            }
        }
    });
});