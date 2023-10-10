import express from 'express'
import config from './src/config/config.js'
import connectDB from './src/config/db.js'
import Logger from './src/middlewares/logger.js'
import domain from './src/models/index.model.js'
import { errorConverter, errorHandler } from './src/middlewares/error.js'

const app = express()
connectDB()

global.config = config
global.Logger = Logger
global.domain = domain

app.use(errorConverter)

app.use(errorHandler)

export default app