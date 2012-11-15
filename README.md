# peer-connection-shim

Emulating peer connection in node & browser

## Example

```
var PeerConnection = require("peer-connection-shim")
    , signalingChannel = createSignalingChannel()
    , pc
    , channel

// call start(true) to initiate
function start(isInitiator) {
    // uri is used to relay connections through
    pc = PeerConnection({
        uri: "http://discoverynetwork.co/relay"
    })

    if (isInitiator) {
        pc.createOffer(localDescriptionCreated)
    } else {
        pc.createAnswer(localDescriptionCreated)
    }

    if (isInitiator) {
        // create data channel and setup chat
        channel = pc.createDataChannel("chat")
        setupChat()
    } else {
        // setup chat on incoming data channel
        pc.ondatachannel = function (evt) {
            channel = evt.channel
            setupChat()
        }
    }
}

function localDescriptionCreated(desc) {
    pc.setLocalDescription(desc, function () {
        signalingChannel.emit("sdp", pc.localDescription)
    })
}

signalingChannel.on("sdp", function (sdp) {
    if (!pc) {
        start(false)
    }

    pc.setRemoteDescription(sdp)
}

function setupChat() {
    channel.onopen = function () {
        // e.g. enable send button
        enableChat(channel)
    }

    channel.onmessage = function (evt) {
        showChatMessage(evt.data)
    }
}

function sendChatMessage(msg) {
    channel.send(msg)
}
```

## Installation

`npm install peer-connection-shim`

## Contributors

 - Raynos

## MIT Licenced
