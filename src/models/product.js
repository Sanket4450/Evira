const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const productSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String
    },
    image: {
        type: String,
        default: null
    },
    description: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    quantity: {
        type: Number
    },
    variants: [{
        color: {
            type: String,
            required: true
        },
        size: {
            type: String,
            default: 'default'
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: String,
            default: 0
        }
    }],
    sold: {
        type: Number
    },
    savedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    orderedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
},
    {
        timestamps: true,
        autoIndex: false
    })

productSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('Product', productSchema)