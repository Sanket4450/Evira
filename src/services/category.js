const dbRepo = require('../dbRepo')
const constant = require('../constants')

exports.getCategories = ({ page, limit }) => {
    Logger.info(`Inside getCategories => page = ${page} & limit = ${limit}`)

    page ||= 1
    limit ||= 8

    const query = {
        // query for categories
    }
    const data = {
        name: 1,
        icon: 1
    }
    return dbRepo.findPage(constant.COLLECTIONS.CATEGORY, { query, data }, {}, page, limit)
}

exports.getAllCategories = () => {
    Logger.info('Inside getAllCategories')

    const query = {
        // query for categories
    }
    const data = {
        name: 1,
        icon: 1
    }
    return dbRepo.find(constant.COLLECTIONS.CATEGORY, { query, data })
}
