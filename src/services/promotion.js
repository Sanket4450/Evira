const mongoose = require('mongoose')
const dbRepo = require('../dbRepo')
const constant = require('../constants')

exports.getPromoCodeById = (id) => {
    const query = {
        _id: new mongoose.Types.ObjectId(id)
    }
    return dbRepo.findOne(constant.COLLECTIONS.PROMOTION, { query })
}

exports.getPromoCodeByCode = (code) => {
    const query = {
        code: { $regex: code, $options: 'i' }
    }
    return dbRepo.findOne(constant.COLLECTIONS.PROMOTION, { query })
}

exports.getPromoCodeByIdAndCode = (promoId, code) => {
    const query = {
        $and: [
            { code: { $regex: code, $options: 'i' } },
            { _id: { $ne: new mongoose.Types.ObjectId(promoId) } }
        ]
    }
    return dbRepo.findOne(constant.COLLECTIONS.PROMOTION, { query })
}

exports.getPromoCodes = (date) => {
    date = (typeof date !== 'number') ? date.getTime() : date

    const query = {
        validFrom: { $lte: date },
        validUntil: { $gte: date }
    }

    const data = {
        code: 1,
        description: 1
    }

    return dbRepo.find(constant.COLLECTIONS.PROMOTION, { query, data })
}

exports.checkPromoCodeValidity = (promoId, date) => {
    date = (typeof date !== 'number') ? date.getTime() : date

    const query = {
        _id: new mongoose.Types.ObjectId(promoId),
        remainingUses: { $gte: 1 },
        validFrom: { $lte: date },
        validUntil: { $gte: date }
    }

    const data = {
        discountPercentage: 1
    }

    return dbRepo.findOne(constant.COLLECTIONS.PROMOTION, { query, data })
}

exports.getAdminPromoCodes = ({ page, limit }) => {
    page ||= 1
    limit ||= 10

    const data = {
        code: 1,
        description: 1
    }

    const sortQuery = {
        createdAt: -1
    }

    return dbRepo.findPage(constant.COLLECTIONS.PROMOTION, { data }, sortQuery, page, limit)
}

exports.createPromoCode = (promoBody) => {
    const data = {
        ...promoBody
    }
    return dbRepo.create(constant.COLLECTIONS.PROMOTION, { data })
}

exports.updatePromoCode = (promoId, promoBody) => {
    const query = {
        _id: new mongoose.Types.ObjectId(promoId)
    }

    const data = {
        ...promoBody
    }

    return dbRepo.updateOne(constant.COLLECTIONS.PROMOTION, { query, data })
}

exports.deleteShippingType = (promoId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(promoId)
    }
    return dbRepo.deleteOne(constant.COLLECTIONS.PROMOTION, { query })
}
