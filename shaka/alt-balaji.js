var manifestUri = 'https://cdn.cloud.altbalaji.com/content/2017-03/1762-58d5091b52c57/manifest.mpd';

var licenseUrl = 'https://api.cloud.altbalaji.com/player/drm/widevine-modular';
var ticket = "5013b3d5-02a0-4340-8ab6-61a9e9eee490";
var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6MH0.eyJqdGkiOiIwNjAyYjY0OC04MzIxLTQzNzgtODRmYS03NzA4M2U4OTkwNTgiLCJpYXQiOjE1Mzk4NDQ0NjksImV4cCI6MTUzOTkzMDg2OSwicHJvZmlsZUlkIjoiMjM3NDk1MDYiLCJkZXZpY2VJZCI6bnVsbCwiZGV2aWNlVXVpZCI6bnVsbCwiYWNjb3VudElkIjoiMjM3NDk1MDUiLCJyb2xlcyI6WyJST0xFX0ZST05UX1VTRVIiXSwidGVuYW50IjoiYmFsYWppIiwiaXNzIjoiZnJvbnQiLCJhdWQiOiJmcm9udCJ9.8wlwKajfa8UqFBy0so9TSNOnsC62MK8yctddH6mUsPs";
var contentId = "ALTBALAJI_EPISODE_1091";

function initApp() {
    // Install built-in polyfills to patch browser incompatibilities.
    shaka.polyfill.installAll();

    // Check to see if the browser supports the basic APIs Shaka needs.
    if (shaka.Player.isBrowserSupported()) {
        // Everything looks good!
        initPlayer();
    } else {
        // This browser does not have the minimum set of APIs we need.
        console.error('Browser not supported!');
    }
}

function initPlayer() {
    // Create a Player instance.
    var video = document.getElementById('video');

    var player = new shaka.Player(video);
    player.configure({
        drm: {
            servers: {
                'com.widevine.alpha': licenseUrl,
            }
        }
    });


    player.getNetworkingEngine().registerRequestFilter(function (type, request) {
        // Alias some utilities provided by the library.
        var StringUtils = shaka.util.StringUtils;
        var Uint8ArrayUtils = shaka.util.Uint8ArrayUtils;

        // Only manipulate license requests:
        if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {

            request.headers = {
                ...request.headers,
                "content-type": "application/JSON",
                "XSSESSION": token
            }

            var base64Payload = Uint8ArrayUtils.toBase64(new Uint8Array(request.body));

            var body = {
                "ticket": ticket,
                "content_id": contentId,
                "payload": base64Payload
            }

            request.body = JSON.stringify(body);
        }
    });


    player.getNetworkingEngine().registerResponseFilter(function (type, response) {
        // Alias some utilities provided by the library.
        var StringUtils = shaka.util.StringUtils;
        var Uint8ArrayUtils = shaka.util.Uint8ArrayUtils;

        // Only manipulate license responses:
        if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {

            // This is the wrapped license, which is a JSON string.
            var responseBody = StringUtils.fromUTF8(response.data);
            // Parse the JSON string into an object.
            var wrapped = JSON.parse(responseBody);

            // This is a base64-encoded version of the raw license.
            var rawLicenseBase64 = wrapped.license;

            // Decode that base64 string into a Uint8Array and replace the response
            // data.  The raw license will be fed to the Widevine CDM.
            response.data = Uint8ArrayUtils.fromBase64(rawLicenseBase64);

            // Read additional fields from the server.
            // The server we are using in this tutorial does not send anything useful.
            // In practice, you could send any license metadata the client might need.
            // Here we log what the server sent to the JavaScript console for
            // inspection.
            console.log(wrapped);
        }
    });


    // Attach player to the window to make it easy to access in the JS console.
    window.player = player;

    // Listen for error events.
    player.addEventListener('error', onErrorEvent);

    // Try to load a manifest.
    // This is an asynchronous process.
    player.load(manifestUri).then(function () {
        // This runs if the asynchronous load is successful.
        console.log('The video has now been loaded!');
    }).catch(onError);  // onError is executed if the asynchronous load fails.
}

function onErrorEvent(event) {
    // Extract the shaka.util.Error object from the event.
    onError(event.detail);
}

function onError(error) {
    // Log the error.
    console.error('Error code', error.code, 'object', error);
}

document.addEventListener('DOMContentLoaded', initApp);