const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const addressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['home', 'office', 'other'],
            required: true,
        },
        street: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        landmark: {
            type: String,
        },
        state: {
            type: String,
        },
        postalCode: {
            type: Number,
            required: true,
        },
        default: {
            type: Boolean,
            default: true,
        },
    },
    {
        autoIndex: false,
    }
)

addressSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('Address', addressSchema)
