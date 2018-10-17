var manifestUri = 'manifest.mpd';
var licenseUrl = 'licensekeyserver.com';
var token = "token";

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
            debugger

            request.responseType = 'arraybuffer';
            request.headers = {
                ...request.headers,
                "content-type": "application/octet-stream",
                "customData": token
            }

            request.body = new Uint8Array(request.body)
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