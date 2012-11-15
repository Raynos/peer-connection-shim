var shoe = require("shoe")

    , emit = require("./utils/emit")
    , DataChannel = require("./dataChannel")

function open(connection) {
    var configuration = connection._configuration
        , stream = shoe(connection._configuration.uri + "/" +
            connection.localDescription + "/" +
            connection.remoteDescription)
        , mdm = configuration.mdm

    mdm.on("connection", onConnection)

    mdm.pipe(stream).pipe(mdm)

    stream.on("connect", onConnect)

    stream.on("end", onEnd)

    configuration.mdm = mdm
    configuration.stream = stream
    configuration.signal.emit("stream", stream)

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
        emit(connection, "ondatachannel", {
            channel: new DataChannel(stream, {
                remote: true
            })
        })
    }
}
