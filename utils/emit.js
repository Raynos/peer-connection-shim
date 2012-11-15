module.exports = emit

function emit(connection, event, arg) {
    var handler = connection["on" + event]

    if (handler) {
        if (arguments.length === 3) {
            handler.call(connection, arg)
        } else {
            handler.call(connection)
        }
    }
}
