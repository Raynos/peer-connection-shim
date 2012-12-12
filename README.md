# peer-connection-shim

Emulating peer connection in node & browser

## Example

Works on either server or client.

```js
var PeerConnection = require("peer-connection")
    , WriteStream = require("write-stream")
    , SignalChannel = require("signal-channel")

    , RTCPeerConnection = require("peer-connection-shim")

var pc1 = PeerConnection(RTCPeerConnection({
    stream: SignalChannel(null, "/v1/relay")
}))

var pc2 = PeerConnection(RTCPeerConnection({
    stream: SignalChannel(null, "/v1/relay")
}))

pc1.createOffer(function (err, offer) {
    pc2.createAnswer(offer, function (err, answer) {
        pc1.setRemote(answer)

        open()
    })
})

pc1.on("connection", function (stream) {
    console.log("open channel", stream.meta)

    stream.pipe(WriteStream(function (chunk) {
        console.log("pc1", chunk)

        stream.write(chunk)
    }))
})

function open() {
    var stream = pc2.createStream("channel name")

    stream.write("hello world!")

    stream.pipe(WriteStream(function (chunk) {
        console.log("pc2", chunk)
    }))
}

```

## Installation

`npm install peer-connection-shim`

## Contributors

 - Raynos

## MIT Licenced
