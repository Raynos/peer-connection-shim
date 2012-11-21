var uuid = require("node-uuid")
    , MuxDemux = require("mux-demux")
    , header = require("header-stream")
    , PauseStream = require("pause-stream")

    , NotImplemented = require("./utils/notImplemented")
    , DataChannel = require("./dataChannel")
    /*global open:true*/
    , open = require("./open")

    , proto = RTCPeerConnection.prototype

/* Creates a session description, describing the constraints and
    configuration of the connection as well as any mediastreams,
    codecs and candidates attached.

    This is send to the remote through a signaling channel which
        uses it to make an answer which is returned through the
        signaling channel
*/
proto.createOffer = createOffer
/* If the connection has an offer from the remote set as its
    remote description then it will generate a matching answer
    that instructs the peer how to connect to it along with any
    constraints this connection has, what media streams are
    attached and codecs / candidates that have been gathered
*/
proto.createAnswer = createAnswer
/* Used to set the local description used. Must be set with
    the created offer / answer and can be manually updated to
    change the description in the future if circumstances change
*/
proto.setLocalDescription = setLocalDescription
/* Used to store incoming offers / answers. Possible identity
    verification occurs here if the remote description contains
    identity information.
*/
proto.setRemoteDescription = setRemoteDescription
/* Creates and configures a data channel on this peer connection.
    If successful this will emit a datachannel on the peer side.

    A datachannel may or may not be reliable based on
        configuration.
*/
proto.createDataChannel = createDataChannel
/* Destroys the related ICE agent used by this connection. */
proto.close = close

/* Used to set the identity provider if the browser does not
    have one. If necessary it will fetch a new identity assertion
*/
proto.setIdentityProvider = NotImplemented("setIdentityProvider")
/* useful to manually trigger the creation of an identity
    assertion before you create offer/answers. Only useful if
    the browser has a identity providor or if you set one.
*/
proto.getIdentityAssertion =
    NotImplemented("getIdentityAssertion")
/* Gathers statistics for the connection or possibly for a single
    media track. These include things like packets sent /
    received and bytes send / received
*/
proto.getStats = NotImplemented("getStats")

/* Updates the ICE agent. Has the same parameters as the
    RTCPeerConnection constructor.
*/
proto.updateIce = NotImplemented("updateIce")
/* A candidate is possible path through the internet
    to get to the remote peer of this connection
*/
proto.addIceCandidate = noop
/* Add a local stream to the connection. The connection will
    negotiate with the remote peer on how to send the stream
    to the remote.
*/
proto.addStream = NotImplemented("addStream")
/* Removes the stream from the connection. The remote peer will
    get a stream removed event. Presumably this stream is no
    longer send along the connection.
*/
proto.removeStream = NotImplemented("removeStream")

module.exports = RTCPeerConnection

function RTCPeerConnection(configuration) {
    if (!(this instanceof RTCPeerConnection)) {
        return new RTCPeerConnection(configuration)
    }

    this.localDescription = null
    this.remoteDescription = null
    this.readyState = "new"

    // not implemented
    this.localStreams = []
    this.remoteStreams = []
    this.iceGatheringState = null
    this.iceState = null
    this.peerIdentity = null

    // events
    this.onnegotationneeded = null
    this.onicecandidate = null
    this.onopen = null
    this.onstatechange = null
    this.onaddstream = null
    this.onremovestream = null
    this.ongatheringchange = null
    this.onicechange = null
    this.onidentityresult = null

    // internal
    configuration = this._configuration = configuration || {}
    configuration.stream = header(configuration.stream)
    var mdm = configuration.mdm = MuxDemux()
        , ps = configuration.ps = PauseStream()

    mdm.pipe(ps.pause())
}

/* Return a unique identifier. A valid offer-answer pair consist
    of two unique ids that can identify the connection uniquely
    on the relay server.

*/
function createOffer(success, error, constraints) {
    success(uuid())
}

/* Return a unique identifier.*/
function createAnswer(success, error, constraints) {
    success(uuid())
}

/* Merely store the description */
function setLocalDescription(description, success, failure) {
    this.localDescription = description

    if (this.remoteDescription && this.readyState === "new") {
        open(this)
    }

    success && success()
}

/* Merely store the description */
function setRemoteDescription(description, success, failure) {
    this.remoteDescription = description

    if (this.localDescription && this.readyState === "new") {
        open(this)
    }

    success && success()
}

/* Wait until the connection is open.

    Then create a new stream through mux demux on the connection.

    The other peer will get a data channel event through the
        mux demux listener on the other end
*/
function createDataChannel(label, dataChannelDict) {
    var configuration = this._configuration
        , mdm = configuration.mdm
        , stream = configuration.stream
        , channel = mdm.createStream(label)

    return new DataChannel(channel)
}

/* Cleanup open streams */
function close() {
    if (this.readyState === "closed") {
        throw new Error("INVALID_STATE_ERR")
    }

    this.readyState === "closed"
}

function noop() {}
