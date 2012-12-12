var PeerConnection = require("peer-connection")
    , WriteStream = require("write-stream")
    , relay = require("signal-channel/relay")

    , RTCPeerConnection = require("../../index")

var client = PeerConnection(RTCPeerConnection({
    stream: relay("client-server example")
}))

client.setLocal("400022")
client.setRemote("400023")

client.on("connection", function (stream) {
    console.log("open channel", stream.meta)

    stream.pipe(WriteStream(function (chunk) {
        console.log("pc1", chunk)

        stream.write(chunk)
    }))
})
