const mongoose = require('mongoose')
const dbRepo = require('../dbRepo')
const constant = require('../constants')

exports.getMessageById = (id) => {
  const query = {
    _id: new mongoose.Types.ObjectId(id),
  }

  const data = {
    _id: 1,
  }

  return dbRepo.findOne(constant.COLLECTIONS.MESSAGE, { query, data })
}

exports.getFullMessageById = (id) => {
  const query = {
    _id: new mongoose.Types.ObjectId(id),
  }
  return dbRepo.findOne(constant.COLLECTIONS.MESSAGE, { query })
}

exports.getMessages = ({ page, limit }) => {
  Logger.info(`Inside getMessages => page = ${page}, limit = ${limit}`)

  page ||= 1
  limit ||= 10

  return dbRepo.findPage(
    constant.COLLECTIONS.MESSAGE,
    { query: {}, data: {} },
    { createdAt: -1 },
    page,
    limit
  )
}

exports.postMessage = (faqBody) => {
  Logger.info('Inside postMessage')

  const data = {
    ...faqBody,
  }

  return dbRepo.create(constant.COLLECTIONS.MESSAGE, { data })
}

exports.deleteMessage = (messageId) => {
  const query = {
    _id: new mongoose.Types.ObjectId(messageId),
  }
  return dbRepo.deleteOne(constant.COLLECTIONS.MESSAGE, { query })
}
