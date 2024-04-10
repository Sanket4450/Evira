const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const variantSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        size: {
            type: String,
            default: null,
        },
        color: {
            type: String,
            default: null,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
    },
    {
        autoIndex: false,
    }
)

variantSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('Variant', variantSchema)
