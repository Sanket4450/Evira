const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const offerSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        image: {
            type: String,
            default: null,
        },
        discountPercentage: {
            type: Number,
            required: true,
        },
        startDate: {
            type: Date,
            default: Date.now(),
        },
        endDate: {
            type: Date,
            required: true,
        },
    },
    {
        autoIndex: false,
        timestamps: true,
    }
)

offerSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('Offer', offerSchema)
