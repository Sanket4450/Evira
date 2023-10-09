import mongoose from 'mongoose'
import fieldsRemoval from './plugins/fieldsRemoval.js'

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

export default mongoose.model('Wishlist', wishlistSchema)