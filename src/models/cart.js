const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: String,
            default: 1
        }
    }]
},
    {
        autoIndex: false
    })

cartSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('Cart', cartSchema)