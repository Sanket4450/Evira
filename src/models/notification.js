const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
},
    {
        autoIndex: false
    })

notificationSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('Notification', notificationSchema)