const dbRepo = require('../dbRepo')
const constant = require('../constants')

exports.getOffers = ({ page, limit }) => {
    Logger.info(`Inside getOffers => page = ${page} & limit = ${limit}`)

    page ||= 1
    limit ||= 3

    const query = {
        // query for offers
    }
    const data = {
        image: 1
    }
    return dbRepo.findPage(constant.COLLECTIONS.OFFER, { query, data }, {}, page, limit)
}

exports.getAllOffers = () => {
    Logger.info('Inside getAllOffers')

    const query = {
        // query for offers
    }
    const data = {
        image: 1
    }
    return dbRepo.find(constant.COLLECTIONS.OFFER, { query, data })
}
