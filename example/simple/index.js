var PeerConnection = require("peer-connection")
    , WriteStream = require("write-stream")
    , SignalChannel = require("signal-channel")

    , RTCPeerConnection = require("../../index")

var pc1 = PeerConnection(RTCPeerConnection({
    stream: SignalChannel(null, "/v1/relay/x")
}))

var pc2 = PeerConnection(RTCPeerConnection({
    stream: SignalChannel(null, "/v1/relay/x")
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
    var stream = pc2.connect("channel name")

    stream.write("hello world!")

    stream.pipe(WriteStream(function (chunk) {
        console.log("pc2", chunk)
    }))
}
