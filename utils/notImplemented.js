module.exports = NotImplemented

function NotImplemented(message) {
    return thrower

    function thrower() {
        throw new Error(message + " is not implemented")
    }
}
