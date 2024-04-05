const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const productSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: null,
        },
        imageFile: {
            type: String,
            default: null,
        },
        description: {
            type: String,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        defaultVariant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Variant',
        },
        sold: {
            type: Number,
            default: 0,
        },
        savedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        orderedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
        autoIndex: false,
    }
)

productSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('Product', productSchema)
