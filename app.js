import express from 'express'
import config from './src/config/config.js'
import connectDB from './src/config/db.js'
import collections from './src/models/index.js'

const app = express()
connectDB()

global.config = config
global.collections = collections

export default app