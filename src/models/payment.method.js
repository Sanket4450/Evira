const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const paymentMethodSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String
    },
    cardName: {
        type: String,
        required: true
    },
    cardNumber: {
        type: Number,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    cvv: {
        type: Number,
        required: true
    }
},
    {
        timestamps: true,
        autoIndex: false
    })

paymentMethodSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema)