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

function pad2(n) {
    return n < 10 ? '0' + n : n
}

function getDate() {
    var date = new Date();

    return date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());
}

var src = "";
var queryParms = "";
var certificateUri = "";
var licenseUri = "";
var ticket = "";
var authorization = "";

player.ready(function () {

    var currDate = getDate();
    let key = '';

    player.eme();
    player.src({
        src: src,
        type: 'application/x-mpegURL',
        keySystems: {
            'com.apple.fps.1_0': {
                getCertificate: function (emeOptions, callback) {

                    var sha256encoded = sha256.hmac(key, currDate + "|" + queryParms + "|{}");
                    videojs.xhr({
                        uri: certificateUri + "?" + queryParms,
                        method: 'POST',
                        headers: {
                            "content-type": "application/json",
                            "Authorization": authorization,
                            "X-Dpp-Date": currDate,
                            "X-Dpp-SignedHeaders": sha256encoded
                        },
                    }, (err, response, responseBody) => {

                        if (err) {
                            console.log(err);
                            callback(err);
                            return;
                        }

                        responseBody = JSON.parse(responseBody);

                        if (responseBody.certificate) {

                            let licenseString = responseBody.certificate;

                            let licenseBuff = new Uint8Array(_base64ToArrayBuffer(licenseString));
                            callback(null, licenseBuff);
                        }
                        else {
                            console.log("Certificate response failed");
                        }
                    });
                },

                getContentId: function (emeOptions, initData) {
                    return "CONTENT_ID";
                },

                getLicense: function (emeOptions, contentId, keyMessage, callback) {

                    let message = new Uint8Array(keyMessage);
                    var base64Payload = btoa(String.fromCharCode.apply(null, message));
                    var jsonString = JSON.stringify({"spc": base64Payload, "ticket": ticket});
                    var sha256encoded = sha256.hmac(key, currDate + "|" + queryParms + "|" + jsonString);

                    console.log("X-Dpp-SignedHeaders ", sha256encoded, currDate);

                    videojs.xhr({
                        uri: licenseUri + '?' + queryParms,
                        method: 'POST',
                        body: JSON.stringify({
                            "spc": base64Payload,
                            "ticket": ticket
                        }),
                        headers: {
                            "content-type": "application/json",
                            "Authorization": authorization,
                            "X-Dpp-Date": currDate,
                            "X-Dpp-SignedHeaders": sha256encoded
                        }
                    }, (err, response, responseBody) => {

                        if (err) {
                            console.log(err);
                            callback(err);
                            return;
                        }

                        responseBody = JSON.parse(responseBody);

                        if (responseBody.licence) {

                            let licenseString = responseBody.licence;
                            let licenseBuff = _base64ToArrayBuffer(licenseString);
                            callback(null, licenseBuff);
                        }
                        else {
                            console.log("License response failed");
                        }
                    });
                }
            }
        }
    });
});
