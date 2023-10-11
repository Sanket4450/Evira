const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    amount: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    }
},
    {
        timestamps: true,
        autoIndex: false
    })

paymentSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('Payment', paymentSchema)