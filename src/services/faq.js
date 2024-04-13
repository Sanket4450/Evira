const mongoose = require('mongoose')
const dbRepo = require('../dbRepo')
const constant = require('../constants')

exports.getFaqById = (id) => {
  const query = {
    _id: new mongoose.Types.ObjectId(id),
  }

  const data = {
    _id: 1,
  }

  return dbRepo.findOne(constant.COLLECTIONS.FAQ, { query, data })
}

exports.getFaqByTitle = (title) => {
  const query = {
    title: { $regex: title, $options: 'i' },
  }

  const data = {
    _id: 1,
  }

  return dbRepo.findOne(constant.COLLECTIONS.FAQ, { query, data })
}

exports.getFullFaqById = (id) => {
  const query = {
    _id: new mongoose.Types.ObjectId(id),
  }
  return dbRepo.findOne(constant.COLLECTIONS.FAQ, { query })
}

exports.getFaqs = ({ page, limit }) => {
  Logger.info(`Inside getFaqs => page = ${page}, limit = ${limit}`)

  page ||= 1
  limit ||= 10

  return dbRepo.findPage(
    constant.COLLECTIONS.FAQ,
    { query: {}, data: {} },
    { createdAt: -1 },
    page,
    limit
  )
}

exports.postFaq = (faqBody) => {
  Logger.info('Inside postFaq')

  const data = {
    ...faqBody,
  }

  return dbRepo.create(constant.COLLECTIONS.FAQ, { data })
}

exports.updateFaq = (faqId, faqBody) => {
  Logger.info('Inside udpateFaq')

  const query = {
    _id: new mongoose.Types.ObjectId(faqId),
  }

  const data = {
    $set: {
      ...faqBody,
    },
  }

  return dbRepo.updateOne(constant.COLLECTIONS.FAQ, { query, data })
}

exports.deleteFaq = (faqId) => {
  const query = {
    _id: new mongoose.Types.ObjectId(faqId),
  }
  return dbRepo.deleteOne(constant.COLLECTIONS.FAQ, { query })
}
