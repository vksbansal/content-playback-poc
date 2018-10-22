var manifest = '';

var player = videojs('video');

player.ready(function () {

    videojs.Hls.xhr.beforeRequest = function (opt) {
        opt.headers = {}
        // TODO: get the header name changed as it is forbiddne to set
        opt.headers["Cookie"] = "CloudFront-Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6Imh0dHA6Ly8qLmFpcnRlbC50di8qIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNTM5NjcxOTczfX19XX0_;CloudFront-Key-Pair-Id=APKAIWHAQM7JDJRYIKDA;CloudFront-Signature=ZUWeu~E74csZWEh5oqBBfcZJ5uUPAkFtk7VdjZH7SDhLorBhOFi-q6g8efNOIXJBhTunW5jz5yxhbyDDnNwbvotOoGJJi9ctrhE34g0KdbSzi4xpyqoKPSbfnoI5s6AthQhS5PboVZwU14Zjx3uULyzkiNBda0iZV-R5ZKDr2VAADIH-3Aa8LXOA9CejUINBbi249XQGxAF-XvHOwLRY7pq84LVdkeij-9MzSOKyg9mANnYdaSo4Jj5eZNnbaBHDWXR3OyQItw7ILZD5OFSC9Smj3O~BPHVvYXHxienEbE7dHRWqwyov3-9EsbP-KXNq0Nq3GvC7q~PjSfB2lbZ3pw__"
    }

    player.src({
        src: manifest,
        type: 'application/x-mpegURL',
        withCredentials: true
    });
});