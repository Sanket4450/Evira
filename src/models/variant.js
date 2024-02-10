const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const variantSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        name: {
            type: String,
        },
        size: {
            type: String,
            default: 'default',
        },
        color: {
            type: String,
            default: 'default',
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            default: 0,
        },
    },
    {
        autoIndex: false,
    }
)

variantSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('Variant', variantSchema)
