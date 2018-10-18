var manifestUri = 'https://zee5vod.akamaized.net/drm/True-HD-1080p/HINDI_DUBBED_MOVIES/PHIR_HERA_PHERI_hi.mp4/manifest.mpd';

var licenseUrl = 'https://wv-keyos-aps1.licensekeyserver.com';

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
            request.responseType = 'arraybuffer';
            request.headers = {
                ...request.headers,
                "content-type": "application/octet-stream",
                "customData": "PEtleU9TQXV0aGVudGljYXRpb25YTUw+PERhdGE+PEdlbmVyYXRpb25UaW1lPjIwMTgtMTAtMTcgMDU6MzA6MDMuMDQxPC9HZW5lcmF0aW9uVGltZT48RXhwaXJhdGlvblRpbWU+MjAxOC0xMC0xOSAwNTozMDowMy4wNDE8L0V4cGlyYXRpb25UaW1lPjxVbmlxdWVJZD4zZGViMTY1MTdjYzY0Mzg0OWU5NTJkNDdhNTBkMWI3NDwvVW5pcXVlSWQ+PFJTQVB1YktleUlkPmIxOWQ0MjJkODkwNjQ0ZDUxMTJkMDg0NjljMmU1OTQ2PC9SU0FQdWJLZXlJZD48V2lkZXZpbmVQb2xpY3kgZmxfQ2FuUGxheT0idHJ1ZSIgZmxfQ2FuUGVyc2lzdD0idHJ1ZSI+PExpY2Vuc2VEdXJhdGlvbj4xNzI4MDA8L0xpY2Vuc2VEdXJhdGlvbj48UGxheWJhY2tEdXJhdGlvbj4xNzI4MDA8L1BsYXliYWNrRHVyYXRpb24+PC9XaWRldmluZVBvbGljeT48V2lkZXZpbmVDb250ZW50S2V5U3BlYyBUcmFja1R5cGU9IkhEIj48U2VjdXJpdHlMZXZlbD4xPC9TZWN1cml0eUxldmVsPjwvV2lkZXZpbmVDb250ZW50S2V5U3BlYz48RmFpclBsYXlQb2xpY3kgcGVyc2lzdGVudD0idHJ1ZSI+PFBlcnNpc3RlbmNlU2Vjb25kcz4xNzI4MDA8L1BlcnNpc3RlbmNlU2Vjb25kcz48L0ZhaXJQbGF5UG9saWN5PjxMaWNlbnNlIHR5cGU9InNpbXBsZSI+PFBvbGljeT48SWQ+MGZiMDQwMGQtZDVkNi00YTAzLWIxMjAtZTBkYWQ0NWM0ZTY0PC9JZD48L1BvbGljeT48UGxheT48SWQ+MmE3YTYwNzItYTU2MS00OGE4LWI2MGUtNTViYjVjYTg5NjhjPC9JZD48L1BsYXk+PC9MaWNlbnNlPjxQb2xpY3kgaWQ9IjBmYjA0MDBkLWQ1ZDYtNGEwMy1iMTIwLWUwZGFkNDVjNGU2NCIgcGVyc2lzdGVudD0idHJ1ZSI+PEV4cGlyYXRpb25BZnRlckZpcnN0UGxheT4xNzI4MDA8L0V4cGlyYXRpb25BZnRlckZpcnN0UGxheT48TWluaW11bVNlY3VyaXR5TGV2ZWw+MjAwMDwvTWluaW11bVNlY3VyaXR5TGV2ZWw+PC9Qb2xpY3k+PFBsYXkgaWQ9IjJhN2E2MDcyLWE1NjEtNDhhOC1iNjBlLTU1YmI1Y2E4OTY4YyI+PE91dHB1dFByb3RlY3Rpb25zPjxPUEw+PENvbXByZXNzZWREaWdpdGFsQXVkaW8+MzAwPC9Db21wcmVzc2VkRGlnaXRhbEF1ZGlvPjxVbmNvbXByZXNzZWREaWdpdGFsQXVkaW8+MzAwPC9VbmNvbXByZXNzZWREaWdpdGFsQXVkaW8+PENvbXByZXNzZWREaWdpdGFsVmlkZW8+NTAwPC9Db21wcmVzc2VkRGlnaXRhbFZpZGVvPjxVbmNvbXByZXNzZWREaWdpdGFsVmlkZW8+MzAwPC9VbmNvbXByZXNzZWREaWdpdGFsVmlkZW8+PEFuYWxvZ1ZpZGVvPjIwMDwvQW5hbG9nVmlkZW8+PC9PUEw+PC9PdXRwdXRQcm90ZWN0aW9ucz48RW5hYmxlcnM+PElkPjc4NjYyN2Q4LWMyYTYtNDRiZS04Zjg4LTA4YWUyNTViMDFhNzwvSWQ+PElkPmQ2ODUwMzBiLTBmNGYtNDNhNi1iYmFkLTM1NmYxZWEwMDQ5YTwvSWQ+PElkPjAwMmY5NzcyLTM4YTAtNDNlNS05Zjc5LTBmNjM2MWRjYzYyYTwvSWQ+PC9FbmFibGVycz48L1BsYXk+PC9EYXRhPjxTaWduYXR1cmU+alZlNjhwZkU0SmQxNGExejFNayt2Z1ZHVitycHFkc3lpMVpaN054YWpGS0U4V01zQmpOZDhFS29zVkZYTlNvTkRTZkFLY3ZoM3VHcHNpc09qNlorMkxpSTJ5UVlCejV4Zk5iRmNzTWlLWVYrZUZVMjhyR21VcWF6ZjExNkpRM0hsZllwV2xidWRCZTUwSGREenRVbU82dGdwRjBNV040NzQrOFg4NzVKSEt3SWxuNmJMSW5pUGtMWi84blg4SDd4K1V1SDhjNVVKYzlmMURxMkIzamRPb1lYMG5RVTZveTdaWUNEbFdiYlljSHBocTdTV2hCNUpjc1VLY2d1aFpxTmFwbjhxN2ViWCsrWW12eXVpcTUzQ3BnekFZTFdZc1pNVjRKRjl5VWZrUGc5ZXgvcjFwTUZTNFhMa3R4NFpnbjcxZzcyTW1pN3pKL3Z3NVpoclB3WklBPT08L1NpZ25hdHVyZT48L0tleU9TQXV0aGVudGljYXRpb25YTUw+"
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