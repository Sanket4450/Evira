const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const faqSchema = new mongoose.Schema(
  {
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
  },
  {
    autoIndex: false,
    timestamps: true
  }
)

faqSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('FAQ', faqSchema)
