const mongoose = require('mongoose')

const DB_URI = process.env.DB_URI

const connectDB = () => {
    console.log(`Inside connectDB => ${DB_URI}`)

    mongoose.connect(DB_URI)
        .then(data => {
            console.log(`Database connected successfully: ${data.connection.name}`)
        })
        .catch(err => {
            console.error(`Database connection failed: ${err}`)
            process.exit(1)
        })
}

module.exports = connectDB
