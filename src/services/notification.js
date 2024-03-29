const mongoose = require('mongoose')
const dbRepo = require('../dbRepo')
const constant = require('../constants')

exports.getNotificationById = (notificationId, userId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(notificationId),
        user: new mongoose.Types.ObjectId(userId),
    }
    return dbRepo.findOne(constant.COLLECTIONS.NOTIFICATION, { query })
}

exports.getNotifications = (userId, { page, limit }) => {
    Logger.info(`Inside getNotifications => page = ${page}, limit = ${limit}`)

    page ||= 1
    limit ||= 20

    const query = {
        user: new mongoose.Types.ObjectId(userId),
    }

    const data = {
        title: 1,
        message: 1,
        icon: 1,
        createdAt: 1,
    }

    return dbRepo.findPage(
        constant.COLLECTIONS.NOTIFICATION,
        { query, data },
        { createdAt: -1 },
        page,
        limit
    )
}

exports.createNotification = (userId, notificationBody) => {
    Logger.info('Inside createNotification')

    const data = {
        user: new mongoose.Types.ObjectId(userId),
        isRead: false,
        createdAt: Date.now(),
        ...notificationBody,
    }
    return dbRepo.create(constant.COLLECTIONS.NOTIFICATION, { data })
}

exports.updateNotification = (notificationId) => {
    Logger.info(`Inside updateNotification => notification = ${notificationId}`)

    const query = {
        _id: new mongoose.Types.ObjectId(notificationId),
    }

    const data = {
        isRead: true,
    }

    return dbRepo.updateOne(constant.COLLECTIONS.NOTIFICATION, { query, data })
}

exports.deleteNotification = (notificationId) => {
    Logger.info(`Inside deleteNotification => notification = ${notificationId}`)

    const query = {
        _id: new mongoose.Types.ObjectId(notificationId),
    }
    return dbRepo.deleteOne(constant.COLLECTIONS.NOTIFICATION, { query })
}
