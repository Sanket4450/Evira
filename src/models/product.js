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
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number
    },
    variants: [{
        size: {
            type: String,
            default: 'default'
        },
        color: {
            type: String,
            required: true
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
        type: Number,
        default: 0
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
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