require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const httpStatus = require('http-status')
const connectDB = require('./src/config/db')
const Logger = require('./src/middlewares/logger')
const domain = require('./src/models/index.model')
const pathToSwaggerUi = require('swagger-ui-dist').absolutePath()
const swaggerRoutes = require('./src/utils/swagger')
const { userRouter, adminRouter } = require('./src/routes/index.route')
const ApiError = require('./src/utils/ApiError')
const { errorConverter, errorHandler } = require('./src/middlewares/error')

const app = express()

global.Logger = Logger
global.domain = domain

connectDB()

app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Authorization, Content-Type, Accept'
    )
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    next()
})

app.use(
    cors({
        allowedHeaders: [
            'Origin',
            'X-Requested-With',
            'Authorization',
            'Content-Type',
            'Accept',
        ],
    })
)
app.use(
    bodyParser.urlencoded({
        extended: true,
        limit: '1mb',
    })
)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(pathToSwaggerUi))

app.use('/api/docs', swaggerRoutes)

app.get('/', (_, res) => {
    res.send('App is running...')
})

app.use('/api/v1', userRouter)
app.use('/api/v1/admin', adminRouter)

app.use((_, __, next) => {
    next(new ApiError('Route not Found', httpStatus.NOT_FOUND))
})

app.use(errorConverter)

app.use(errorHandler)

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server is listening on PORT: ${port}`)
})
