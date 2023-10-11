const winston = require('winston')
const path = require('path')

const { createLogger, format, transports } = winston
const { combine, timestamp, json } = format

const fileOptions = {
    filename: path.resolve(process.cwd(), 'logs/app.log'),
    maxsize: 2097152,
    maxFiles: 5
}

const logger = createLogger({
    level: 'info',
    format: combine(timestamp(), json()),
    transports: [
        new transports.File(fileOptions),
        new transports.Console()
    ]
})

module.exports = logger