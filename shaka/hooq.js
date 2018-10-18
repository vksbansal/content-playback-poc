
var manifestUri = 'http://vod-singtelhawk.quickplay.com/ss/vol2/s/SingTelContentProvider/wabs2713751/2018-10-09-08-28-48/wabs2713751movie/output_ss.ism/index.mpd';

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
                'com.widevine.alpha': 'http://aep-api.singtelhawk.quickplay.com/wvp/getlicense?service=aep_hooq&version=1.0&kid=26A048CF-C1DC-4C7F-AC32-870E0AE02090&ptoken=eyJjb250ZW50SWQiOiI2ODIwMiIsImxpY2Vuc2VFeHBpcnlUaW1lIjoxNTcwNjQ1Nzk5MDAwLCJlbnRpdGxlZENvbnRlbnRJZHMiOiJNalpCTURRNFEwWXRRekZFUXkwMFF6ZEdMVUZETXpJdE9EY3dSVEJCUlRBeU1Ea3ciLCJtYXhVc2VzIjoxLCJzaWduYXR1cmUiOiIxOWYyNzAwYjllZWFmMGE5M2M1Njg2NTM5YTYzYzUxNmY2YmI3ZTJiNmY3M2U3ZTFmNWRjZmZlYjRiMTQ4ZjM4IiwidW5pcXVlSWQiOiJiZGQ4MGEyMmNmYTAxZTBmIiwiaXNzdWVyIjoiU0lHTktFWV9QVE9LRU5fQ09OU1VNRV9JU1NVRVIiLCJhcGlLZXkiOiJhcGlLZXkiLCJrZXlWZXJzaW9uIjoidmVyczAxIiwiZ2VuZXJhdG9yVmFsaWRhdG9yRGF0YSI6IllYQndTV1E5TlRBeE5TWmhjSEJXWlhKemFXOXVQVEV1TUNaallYSnlhV1Z5U1dROU1qTSUzRCIsImV4cGlyeVRpbWUiOjE1Mzk4NTc4NzE5MTcsImNyZWF0ZWRUaW1lIjoxNTM5ODU3NzIxOTE3fQ==',
            }
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