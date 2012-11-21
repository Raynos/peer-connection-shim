var WriteStream = require("write-stream")

    , emit = require("./utils/emit")

    , proto = DataChannel.prototype

proto.send = send
proto.close = close

module.exports = DataChannel

function DataChannel(stream, options) {
    var self = this
    self.label = stream.meta
    self.reliable = true
    self.readyState = "open"
    self.bufferedAmount = 0
    self.binaryType = ""

    self._stream = stream

    emit(self, "open")

    stream.on("error", error)
    stream.on("end", close)
    stream.pipe(WriteStream(message))
    stream.on("data", message)

    // events
    self.onerror = null
    self.onmessage = null
    self.onopen = null
    self.onclose = null

    function open(stream) {
        self.readyState = "open"
        emit(self, "open")
    }

    function error(err) {
        emit(self, "error", err)
    }

    function close() {
        self.readyState = "closed"
        emit(self, "close")
    }

    function message(data) {
        emit(self, "message", {
            data: data
        })
    }
}

function send(data) {
    this._stream.write(data)
}

function close() {
    this._stream.end()
}
