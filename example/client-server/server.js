var PeerConnection = require("peer-connection")
    , WriteStream = require("write-stream")

    , RTCPeerConnection = require("../../index")

var server = PeerConnection(RTCPeerConnection)

server.setLocal("400023")
server.setRemote("400022")

var stream = server.connect("channel name")

stream.write("hello world!")

stream.pipe(WriteStream(function (chunk) {
    console.log("pc2", chunk)
}))
