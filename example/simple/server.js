var http = require("http")
    , sock = require("../../server")

var server = http.createServer(function (req, res) {
    res.end("running demo server")
}).listen(8080)

sock.install(server, "/v1/echo")
