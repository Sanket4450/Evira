/**
 * @param {object} object
 * @param {string[]} keys
 * @returns {object}
 */

const pick = (object, keys) => {
    return keys.reduce((obj, key) => {
        if (object && object.prototype.hasOwnProperty.call(object, key)) {
            obj[key] = object[key]
        }
        return obj
    }, {})
}

export default pick