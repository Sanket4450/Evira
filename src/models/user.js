import mongoose from 'mongoose'
import fieldsRemoval from './plugins/fieldsRemoval.js'

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    nickName: {
        type: String
    },
    profileImage: {
        type: String,
        default: null
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        trim: true
    },
    mobile: {
        type: Number,
        unique: true
    },
    dateOfBirth: {
        type: Date
    },
    gender: {
        type: String
    },
    language: {
        type: String
    },
    role: {
        type: Number,
        default: 1
    },
    isNotificationEnabled: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
        autoIndex: false
    })

userSchema.plugin(fieldsRemoval)

export default mongoose.model('User', userSchema)