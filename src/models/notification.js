import mongoose from 'mongoose'
import fieldsRemoval from './plugins/fieldsRemoval.js'

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

export default mongoose.model('Notification', notificationSchema)