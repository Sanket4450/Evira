const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const productSchema = new mongoose.Schema(
    {
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
        defaultVariant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Variant',
        },
        sold: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        autoIndex: false,
    }
)

productSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('Product', productSchema)
