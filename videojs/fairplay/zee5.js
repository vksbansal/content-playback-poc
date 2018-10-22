var player = videojs('my_video_1');

function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

var srcUrl = "";
var certificateUrl = "";
var licenseUrl = "";
var assetId = "";
var customData = "";

player.ready(function () {

    player.eme();
    player.src({
        src: srcUrl,
        type: 'application/x-mpegURL',
        keySystems: {
            "com.apple.fps.1_0": {
                licenseUri: licenseUrl,
                certificateUri: certificateUrl,

                getContentId: function (emeOptions, initData) {
                    //Not needed
                    return "CONTENT_ID";
                },
                getLicense: function (emeOptions, contentId, keyMessage, callback) {

                    var postData = "spc=" + btoa(String.fromCharCode.apply(null, new Uint8Array(keyMessage))) + "&assetId=" + assetId;

                    videojs.xhr({
                        body: postData,
                        method: 'POST',
                        uri: licenseUrl,
                        headers: {
                            "customdata": customData,
                            "Content-type": "plain/text"
                        }
                    }, (err, response, responseBody) => {

                        if (err) {
                            callback(err);
                            return;
                        }

                        let licenseBuff = _base64ToArrayBuffer(responseBody);
                        callback(null, licenseBuff);

                    });
                }
            }
        }
    });
});
