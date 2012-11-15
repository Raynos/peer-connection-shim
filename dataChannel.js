var emit = require("./utils/emit")

    , proto = DataChannel.prototype

proto.send = send
proto.close = close

module.exports = DataChannel

function DataChannel(stream, options) {
    var self = this
    self.label = stream.meta
    self.reliable = true
    self.readyState = "connecting"
    self.bufferedAmount = 0
    self.binaryType = ""

    self._stream = stream

    if (options.open) {
        self.readyState = "open"
    }

    /* If options is an event emitter then self channel is
        opened locally and we wait for the underlying stream
        to be opened before we declare the channel open
    */
    if (options && options.on) {
        options.on("stream", open)
    }

    stream.on("error", error)
    stream.on("end", close)
    stream.on("data", message)

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
        emit(self, "message", data)
    }
}

function send(data) {
    this._stream.write(data)
}

function close() {
    this._stream.end()
}
