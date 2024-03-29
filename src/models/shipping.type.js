const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const shippingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        charge: {
            type: Number,
            required: true,
        },
    },
    {
        autoIndex: false,
        timestamps: true,
    }
)

shippingSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('ShippingType', shippingSchema)
