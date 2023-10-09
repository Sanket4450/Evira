import dotenv from 'dotenv'

const environment = process.env.NODE_ENV || 'development'
const envFilePath = environment === 'production' ? '.env.production' : '.env.local'

dotenv.config({ path: envFilePath })

export default {
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI
}