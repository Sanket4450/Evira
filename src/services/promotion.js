const mongoose = require('mongoose')
const dbRepo = require('../dbRepo')
const constant = require('../constants')

exports.getPromoCodeById = (id) => {
    const query = {
        _id: new mongoose.Types.ObjectId(id),
    }
    return dbRepo.findOne(constant.COLLECTIONS.PROMOTION, { query })
}

exports.getPromoCodeByTitle = (title) => {
    const query = {
        title: { $regex: new RegExp(`^${title}$`, 'i') },
    }
    return dbRepo.findOne(constant.COLLECTIONS.PROMOTION, { query })
}

exports.getPromoCodeByIdAndTitle = (promoId, title) => {
    const query = {
        $and: [
            { title: { $regex: title, $options: 'i' } },
            { _id: { $ne: new mongoose.Types.ObjectId(promoId) } },
        ],
    }
    return dbRepo.findOne(constant.COLLECTIONS.PROMOTION, { query })
}

exports.getPromoCodes = (date) => {
    Logger.info(`Inside getPromoCodes => date = ${date}`)

    date = typeof date !== 'number' ? date.getTime() : date

    const query = {
        validFrom: { $lte: date },
        validUntil: { $gte: date },
    }

    const data = {
        title: 1,
        description: 1,
        discountPercentage: 1,
    }

    const sortQuery = {
        createdAt: -1
    }

    return dbRepo.find(constant.COLLECTIONS.PROMOTION, { query, data }, sortQuery)
}

exports.checkPromoCodeValidity = (promoId, date) => {
    Logger.info(
        `Inside checkPromoCodeValidity => promoCode = ${promoId}, date = ${date}`
    )

    date = typeof date !== 'number' ? date.getTime() : date

    const query = {
        _id: new mongoose.Types.ObjectId(promoId),
        remainingUses: { $gte: 1 },
        validFrom: { $lte: date },
        validUntil: { $gte: date },
    }

    const data = {
        remainingUses: 1,
        discountPercentage: 1,
    }

    return dbRepo.findOne(constant.COLLECTIONS.PROMOTION, { query, data })
}

exports.getAdminPromoCodes = ({ page, limit }) => {
    Logger.info(`Inside getAdminPromoCodes => page = ${page}, limit = ${limit}`)

    page ||= 1
    limit ||= 10

    return dbRepo.findWithCount(
        constant.COLLECTIONS.PROMOTION,
        {},
        { createdAt: -1 },
        page,
        limit
    )
}

exports.createPromoCode = (promoBody) => {
    Logger.info('Inside createPromoCode')

    const data = {
        ...promoBody,
    }
    return dbRepo.create(constant.COLLECTIONS.PROMOTION, { data })
}

exports.updatePromoCode = (promoId, promoBody) => {
    Logger.info(`Inside updatePromoCode => promoCode = ${promoId}`)

    const query = {
        _id: new mongoose.Types.ObjectId(promoId),
    }

    const data = {
        $set: {
            ...promoBody,
        },
    }

    return dbRepo.updateOne(constant.COLLECTIONS.PROMOTION, { query, data })
}

exports.deleteShippingType = (promoId) => {
    Logger.info(`Inside deleteShippingType => promoCode = ${promoId}`)

    const query = {
        _id: new mongoose.Types.ObjectId(promoId),
    }
    return dbRepo.deleteOne(constant.COLLECTIONS.PROMOTION, { query })
}
