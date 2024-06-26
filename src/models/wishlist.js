const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const wishlistSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                addedAt: {
                    type: Date,
                    default: Date.now(),
                },
            },
        ],
    },
    {
        autoIndex: false,
    }
)

wishlistSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('Wishlist', wishlistSchema)
