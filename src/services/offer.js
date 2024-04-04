const mongoose = require('mongoose')
const dbRepo = require('../dbRepo')
const constant = require('../constants')

exports.getOfferById = (id) => {
    Logger.info(`Inside getOfferById => offer = ${id}`)

    const query = {
        _id: new mongoose.Types.ObjectId(id),
    }
    return dbRepo.findOne(constant.COLLECTIONS.OFFER, { query })
}

exports.getOffersByProduct = (productId) => {
    const query = {
        product: new mongoose.Types.ObjectId(productId),
    }

    return dbRepo.find(constant.COLLECTIONS.OFFER, { query })
}

exports.getOfferByProduct = (productId) => {
    const query = {
        product: new mongoose.Types.ObjectId(productId),
    }

    const data = {
        _id: 1,
    }

    return dbRepo.findOne(constant.COLLECTIONS.OFFER, { query, data })
}

exports.checkOfferValidity = (productId, date = Date.now()) => {
    Logger.info(
        `Inside checkOfferValidity => product = ${productId}, date = ${date}`
    )

    date = typeof date !== 'number' ? date.getTime() : date

    const query = {
        product: new mongoose.Types.ObjectId(productId),
        startDate: { $lte: date },
        endDate: { $gte: date },
    }

    const data = {
        discountPercentage: 1,
    }

    return dbRepo.findOne(constant.COLLECTIONS.OFFER, { query, data })
}

exports.getOffers = ({ page, limit }) => {
    Logger.info(`Inside getOffers => page = ${page}, limit = ${limit}`)

    page ||= 1
    limit ||= 10

    const query = {
        // query for offers
    }
    const data = {
        image: 1,
    }
    return dbRepo.findPage(
        constant.COLLECTIONS.OFFER,
        { query, data },
        {},
        page,
        limit
    )
}

exports.getAllOffers = () => {
    Logger.info('Inside getAllOffers')

    const query = {
        // query for offers
    }
    const data = {
        image: 1,
    }
    return dbRepo.find(constant.COLLECTIONS.OFFER, { query, data })
}

exports.createOffer = (offerBody) => {
    Logger.info('Inside createOffer')

    const data = {
        ...offerBody,
    }
    return dbRepo.create(constant.COLLECTIONS.OFFER, { data })
}

exports.updateOffer = (offerId, offerBody) => {
    Logger.info(`Inside updateOffer => offer = ${offerId}`)

    const query = {
        _id: new mongoose.Types.ObjectId(offerId),
    }

    const data = {
        ...offerBody,
    }

    return dbRepo.updateOne(constant.COLLECTIONS.OFFER, { query, data })
}

exports.deleteOffer = (offerId) => {
    Logger.info(`Inside deleteOffer => offer = ${offerId}`)

    const query = {
        _id: new mongoose.Types.ObjectId(offerId),
    }
    return dbRepo.deleteOne(constant.COLLECTIONS.OFFER, { query })
}
