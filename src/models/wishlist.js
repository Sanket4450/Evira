const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
},
    {
        timestamps: true,
        autoIndex: false
    })

wishlistSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('Wishlist', wishlistSchema)