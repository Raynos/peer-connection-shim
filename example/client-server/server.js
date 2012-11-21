var PeerConnection = require("peer-connection")
    , WriteStream = require("write-stream")
    , SignalChannel = require("signal-channel/connection")

    , RTCPeerConnection = require("../../index")

var server = PeerConnection(RTCPeerConnection({
    stream: SignalChannel(null, "/v1/relay/x")
}))

server.setLocal("400023")
server.setRemote("400022")

var stream = server.connect("channel name")

stream.write("hello world!")

stream.pipe(WriteStream(function (chunk) {
    console.log("pc2", chunk)
}))
