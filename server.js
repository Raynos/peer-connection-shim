var shoe = require("shoe")
    , header = require("header-stream")
    , LRU = require("lru-cache")
    , wrap = require("streams2")

    , sock = shoe(connection)
    , streams = LRU({
        max: 500
        , maxAge: 1000 * 60 * 60
    })
    , uuid = 0

module.exports = sock

function connection(stream) {
    var id = (++uuid)

    // stream.on("data", function (data) {
    //     console.log("incoming data", id, data)
    // })

    // console.log("got connection", id)
    var headerStream = header(stream)

    stream = wrap(headerStream)

    headerStream.on("header", function (options) {
        // console.log("got header", id, options)

        var remote = options.remote
            , local = options.local
            , other = streams.get(remote + ":" + local)

        if (other) {
            // console.log("piping")
            other.pipe(stream).pipe(other)
        } else {
            streams.set(local + ":" + remote, stream)
        }
    })
}
