const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const messageSchema = new mongoose.Schema(
  {
    email: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
  },
  {
    autoIndex: false,
    timestamps: true,
  }
)

messageSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('Message', messageSchema)
