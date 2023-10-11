const dotenv = require('dotenv')

const environment = process.env.NODE_ENV || 'development'
const envFilePath = environment === 'production' ? '.env.production' : '.env.local'

dotenv.config({ path: envFilePath })

module.exports = {
    environment,
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    RESET_TOKEN_SECRET: process.env.RESET_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
    RESET_TOKEN_EXPIRY: process.env.RESET_TOKEN_EXPIRY
}