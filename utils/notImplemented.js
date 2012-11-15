module.exports = NotImplemented

function NotImplemented(message) {
    return function throw() {
        throw new Error(message + " is not implemented")
    }
}
