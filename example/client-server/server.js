var PeerConnection = require("peer-connection")
    , WriteStream = require("write-stream")
    , relay = require("signal-channel/relay")

    , RTCPeerConnection = require("../../index")

var server = PeerConnection(RTCPeerConnection({
    stream: relay("client-server example")
}))

server.setLocal("400023")
server.setRemote("400022")

var stream = server.createStream("channel name")

stream.write("hello world!")

stream.pipe(WriteStream(function (chunk) {
    console.log("pc2", chunk)
}))
