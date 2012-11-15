var EventEmitter = require("events").EventEmitter
    , RTCPeerConnection = require("peer-connection-shim")

    , DataStream = require("./dataStream")

module.exports = PeerConnection

function PeerConnection() {
    var pc = new EventEmitter()
        , _pc = RTCPeerConnection()

    pc.createAnswer = createAnswer
    pc.createOffer = createOffer
    pc.setRemote = setRemote
    pc.addCandidate = addCandidate
    pc.connect = connect

    _pc.onicecandidate = function (candidate) {
        pc.emit("candidate", candidate)
    }

    _pc.ondatachannel = function (channel) {
        pc.emit("connection", DataStream(channel))
    }

    return pc

    function createOffer(callback) {
        call(_pc, "createOffer", callback)
    }

    function createAnswer(offer, callback) {
        if (arguments.length === 1) {
            callback = offer
            offer = null
        }

        if (offer) {
            _pc.setLocalDescription(offer, function () {
                call(_pc, "createAnswer", callback)
            }, function (err) {
                callback(err)
            })
        } else {
            call(_pc, "createAnswer", callback)
        }
    }

    function setRemote(description) {
        _pc.setRemoteDescription(description)
    }

    function addCandidate(cancidate) {
        _pc.addIceCandidate(candidate)
    }

    function connect(meta) {
        return DataStream(_pc.createDataChannel(meta))
    }
}

function call(obj, method, callback) {
    obj[method].call(obj, function (value) {
        callback(null, value)
    }, function (err) {
        callback(err)
    })
}
