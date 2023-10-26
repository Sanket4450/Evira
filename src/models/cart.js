const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        variant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        },
        addedAt: {
            type: Date,
            default: Date.now()
        }
    }]
},
    {
        autoIndex: false
    })

cartSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('Cart', cartSchema)
