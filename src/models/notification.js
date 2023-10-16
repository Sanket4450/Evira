const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String
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
