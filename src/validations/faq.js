const joi = require('joi')

const {
    pageAndLimit,
    stringReqValidation,
    stringValidation,
    idReqValidation
} = require('./common')

const getFaqs = {
  query: joi.object().keys({
    ...pageAndLimit,
  }),
}

const postFaq = {
  body: joi.object().keys({
    title: stringReqValidation.max(80),
    description: stringReqValidation.max(500),
  }),
}

const updateFaq = {
  params: joi.object().keys({
    faqId: idReqValidation,
  }),
  body: joi.object().keys({
    title: stringValidation.max(80),
    description: stringValidation.max(500),
  }),
}

const deleteFaq = {
  params: joi.object().keys({
    faqId: idReqValidation,
  }),
}

module.exports = {
  getFaqs,
  postFaq,
  updateFaq,
  deleteFaq,
}
