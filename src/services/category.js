const dbRepo = require('../dbRepo')
const constant = require('../constants')

exports.getCategories = (page = 1, limit = 8) => {
    Logger.info(`Inside getCategories => page = ${page} & limit = ${limit}`)

    const query = {
        // query for categories
    }
    const data = {
        name: 1,
        icon: 1
    }
    return dbRepo.findPage(constant.COLLECTIONS.CATEGORY, { query, data }, page, limit)
}

exports.getAllCategories = () => {
    Logger.log('Inside getAllCategories')

    const query = {
        // query for categories
    }
    const data = {
        name: 1,
        icon: 1
    }
    return dbRepo.find(constant.COLLECTIONS.CATEGORY, { query, data })
}