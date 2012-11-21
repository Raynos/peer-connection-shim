var emit = require("./utils/emit")
    , DataChannel = require("./dataChannel")

module.exports = open

function open(connection) {
    var configuration = connection._configuration
        , stream = configuration.stream
        , mdm = configuration.mdm
        , ps = configuration.ps

    stream.setHeader("remote", connection.remoteDescription)
    stream.setHeader("local", connection.localDescription)
    stream.writeHead()

    mdm.on("connection", onConnection)

    ps.pipe(stream).pipe(mdm)

    ps.resume()

    stream.on("connect", onConnect)

    stream.on("end", onEnd)

    function onConnect() {
        connection.readyState = "active"
        emit(connection, "statechange")
        emit(connection, "open")
    }

    function onEnd() {
        connection.readyState = "closed"
        emit(connection, "statechange")
    }

    function onConnection(stream) {
        emit(connection, "datachannel", {
            channel: new DataChannel(stream, {
                remote: true
            })
        })
    }
}
