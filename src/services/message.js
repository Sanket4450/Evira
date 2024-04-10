const dbRepo = require('../dbRepo')
const constant = require('../constants')

exports.postMessage = (faqBody) => {
  Logger.info('Inside postMessage')

  const data = {
    ...faqBody,
  }

  return dbRepo.create(constant.COLLECTIONS.MESSAGE, { data })
}

exports.getMessages = ({ page, limit }) => {
  Logger.info(`Inside getMessages => page = ${page}, limit = ${limit}`)

  page ||= 1
  limit ||= 10

  const sortQuery = {
    createdAt: -1,
  }

  return dbRepo.findPage(
    constant.COLLECTIONS.MESSAGE,
    { query: {}, data: {} },
    sortQuery,
    page,
    limit
  )
}
