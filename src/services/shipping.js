const mongoose = require('mongoose')
const dbRepo = require('../dbRepo')
const constant = require('../constants')

exports.getShippingTypeById = (id) => {
    const query = {
        _id: new mongoose.Types.ObjectId(id)
    }
    return dbRepo.findOne(constant.COLLECTIONS.SHIPPINGTYPE, { query })
}

exports.getShippingTypeByTitle = (title) => {
    const query = {
        title: { $regex: title, $options: 'i' }
    }

    return dbRepo.findOne(constant.COLLECTIONS.SHIPPINGTYPE, { query })
}

exports.getShippingTypes = () => {
    return dbRepo.find(constant.COLLECTIONS.SHIPPINGTYPE, {})
}

exports.createShippingType = (shippingBody) => {
    const data = {
        ...shippingBody
    }
    return dbRepo.create(constant.COLLECTIONS.SHIPPINGTYPE, { data })
}

exports.updateShippingType = (shippingId, shippingBody) => {
    const query = {
        _id: new mongoose.Types.ObjectId(shippingId)
    }

    const data = {
        ...shippingBody
    }

    return dbRepo.updateOne(constant.COLLECTIONS.SHIPPINGTYPE, { query, data })
}

exports.deleteShippingType = (shippingId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(shippingId)
    }
    return dbRepo.deleteOne(constant.COLLECTIONS.SHIPPINGTYPE, { query })
}
