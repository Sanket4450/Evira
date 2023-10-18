const toBoolean = (keyword) => {
    if (keyword === 'true' || keyword === 1) {
        return true
    }
    else {
        return false
    }
}

module.exports = toBoolean
