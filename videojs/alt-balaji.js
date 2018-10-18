var manifest = '';
var token = '';
var license = ''


var video = document.getElementById('video');
var player = videojs(video);

function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

player.ready(function () {

    player.eme();
    player.src({
        src: manifest,
        type: 'application/dash+xml',
        keySystems: {
            'com.widevine.alpha': {
                getLicense: function (emeOptions, keyMessage, callback) {
                    let message = new Uint8Array(keyMessage);

                    var base64Payload = btoa(String.fromCharCode.apply(null, message));

                    videojs.xhr({
                        uri: license,
                        method: 'POST',
                        // responseType: 'arraybuffer',
                        body: JSON.stringify({
                            "ticket": "aa70184c-f1e5-4f52-a1b3-3573183fdbae",
                            "content_id": "ALTBALAJI_EPISODE_1091",
                            "payload": base64Payload
                        }),
                        headers: {
                            // "content-type": "application/octet-stream",
                            "content-type": "application/JSON",
                            "XSSESSION": token
                        }
                    }, (err, response, responseBody) => {

                        if (err) {
                            callback(err);
                            return;
                        }

                        responseBody = JSON.parse(responseBody)

                        if (responseBody.license) {

                            let licenseString = responseBody.license;

                            let licenseBuff = _base64ToArrayBuffer(licenseString);

                            callback(null, licenseBuff);
                        }
                        else {
                            console.error(responseBody)
                            debugger
                        }
                    });
                }
            }
        }
    });
});
