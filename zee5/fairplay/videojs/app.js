var manifestUri = 'manifest.mpd';
var licenseUrl = 'licensekeyserver.com';
var token = "token";
var contentId = "";
var assetId = "";


var player = videojs('video');

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
        src: manifestUri,
        type: 'application/x-mpegURL',
        keySystems: {
            "com.apple.fps.1_0": {
                licenseUri: licenseUrl,
                certificateUri: certificateUri,

                getContentId: function (emeOptions, initData) {
                    //Not needed
                    return contentId;
                },

                getLicense: function (emeOptions, contentId, keyMessage, callback) {

                    var postData = "spc=" + btoa(String.fromCharCode.apply(null, new Uint8Array(keyMessage))) + "&assetId=" + assetId;

                    videojs.xhr({
                        body: postData,
                        method: 'POST',
                        uri: licensekeyserver,
                        headers: {
                            "customdata": token,
                            "Content-type": "plain/text"
                        }
                    }, (err, response, responseBody) => {

                        if (err) {
                            console.log(err);
                            callback(err);
                            return;
                        }

                        let licenseBuff = _base64ToArrayBuffer(responseBody);
                        console.log(licenseBuff);
                        callback(null, licenseBuff);

                    });
                }
            }
        }
    });
});