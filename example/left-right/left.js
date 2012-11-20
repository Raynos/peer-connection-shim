var PeerConnection = require("peer-connection")
    , WriteStream = require("write-stream")
    , store = require("local-store")("peer-connection-demo")
    , SignalChannel = require("signal-channel")

    , RTCPeerConnection = require("../../index")

store.set("left id", null)
store.set("right id", null)

var pc = PeerConnection(RTCPeerConnection({
     stream: SignalChannel(null, "/v1/relay")
}))

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
