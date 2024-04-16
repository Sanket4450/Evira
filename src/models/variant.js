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
            default: '',
        },
        color: {
            type: String,
            default: '',
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
        timestamps: true,
    }
)

variantSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('Variant', variantSchema)
