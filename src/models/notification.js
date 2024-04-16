const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
        },
        icon: {
            type: String,
            default: null,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        autoIndex: false,
        timestamps: true,
    }
)

notificationSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('Notification', notificationSchema)
