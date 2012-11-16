# peer-connection-shim

Emulating peer connection in node & browser

## Example

Left side:

  - create offer
  - store locally
  - pool local store for answer
  - wait for incoming data channel
  - echo message back to remote

```js
var PeerConnection = require("peer-connection")
    , WriteStream = require("write-stream")
    , store = require("local-store")("peer-connection-demo")

    , RTCPeerConnection = require("peer-connection-shim")

store.set("left id", null)
store.set("right id", null)

var pc = PeerConnection(RTCPeerConnection, {
    uri: "http://localhost:8080"
})

pc.createOffer(function (err, offer) {
    store.set("left id", offer)
    // console.log("left id", offer)

    var token = setInterval(function () {
        var right = store.get("right id")

        if (right) {
            // console.log("right id", right)
            pc.setRemote(right)

            next()

            clearInterval(token)
        }
    }, 1000)
})

function next() {
    pc.on("connection", function (stream) {
        stream.pipe(WriteStream(function (chunk) {
            console.log("chunk", chunk)

            stream.write(chunk)
        }))
    })
}
```

Right side:

 - poll local storage for offer
 - create answer
 - store answer
 - open data channel
 - write message to it
 - wait for message to be echod back

```js
var PeerConnection = require("peer-connection")
    , WriteStream = require("write-stream")
    , store = require("local-store")("peer-connection-demo")

    , RTCPeerConnection = require("peer-connection-shim")

var pc = PeerConnection(RTCPeerConnection, {
    uri: "http://localhost:8080"
})

var token = setInterval(function () {
    var left = store.get("left id")

    if (left) {
        // console.log("left id", left)
        pc.createAnswer(left, function (err, answer) {
            store.set("right id", answer)
            // console.log("right id", answer)

            next()
        })

        clearInterval(token)
    }
}, 1000)

function next() {
    // console.log("creating stream")
    var stream = pc.connect("name")

    stream.write("hello world!")

    stream.pipe(WriteStream(function (chunk) {
        console.log("chunk", chunk)
    }))
}
```

## Installation

`npm install peer-connection-shim`

## Contributors

 - Raynos

## MIT Licenced
