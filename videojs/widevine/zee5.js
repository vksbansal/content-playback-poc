var manifest = '';
var license
var token = '';

var player = videojs('video');

player.ready(function () {

    player.eme();
    player.src({
        src: manifest,
        type: 'application/dash+xml',
        keySystems: {
            'com.widevine.alpha': {
                getLicense: function (emeOptions, keyMessage, callback) {
                    let message = new Uint8Array(keyMessage);
                    videojs.xhr({
                        uri: license,
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
