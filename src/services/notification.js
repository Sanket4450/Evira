const mongoose = require('mongoose')
const dbRepo = require('../dbRepo')
const constant = require('../constants')

exports.getNotifications = (userId, { page, limit }) => {
    Logger.info(`Inside getNotifications => page = ${page} & limit = ${limit}`)

    page ||= 1
    limit ||= 20

    const query = {
        user: new mongoose.Types.ObjectId(userId)
    }

    const data = {
        title: 1,
        message: 1,
        icon: 1,
        createdAt: 1
    }

    return dbRepo.findPage(constant.COLLECTIONS.NOTIFICATION, { query, data }, { createdAt: -1 }, page, limit)
}