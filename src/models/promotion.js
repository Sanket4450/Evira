const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const promotionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            unique: true,
            required: true,
        },
        description: {
            type: String,
        },
        discountPercentage: {
            type: Number,
            required: true,
        },
        maxUses: {
            type: Number,
            required: true,
        },
        remainingUses: {
            type: Number,
            required: true,
        },
        validFrom: {
            type: Date,
            default: Date.now(),
        },
        validUntil: {
            type: Date,
            required: true,
        },
    },
    {
        autoIndex: false,
        timestamps: true,
    }
)

promotionSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('Promotion', promotionSchema)
