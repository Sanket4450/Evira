const dbRepo = require('../dbRepo')
const constant = require('../constants')

exports.getFAQs = ({ page, limit }) => {
  Logger.info(`Inside getFAQs => page = ${page}, limit = ${limit}`)

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

exports.postFAQ = (faqBody) => {
  Logger.info('Inside postFAQ')

  const data = {
    ...faqBody
  }

  return dbRepo.create(constant.COLLECTIONS.FAQ, { data })
}