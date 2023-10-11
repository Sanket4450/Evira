const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const offerSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    discountPercentage: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
},
    {
        timestamps: true
    })

offerSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('Offer', offerSchema)