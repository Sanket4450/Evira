const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const promotionSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String
    },
    discountPercentage: {
        type: Number,
        required: true
    },
    maxUses: {
        type: Number,
        default: 100
    },
    remainingUses: {
        type: Number,
        default: 0
    },
    validFrom: {
    type: Date
},
    validUntil: {
    type: Date
}
},
{
    timestamps: true
})

promotionSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('Promotion', promotionSchema)
