const mongoose = require('mongoose')

const connectDB = () => {
    mongoose.connect(process.env.DB_URI)
        .then(data => {
            console.log(`Database connected successfully: ${data.connection.name}`)
        })
        .catch(err => {
            console.error(`Database connection failed: ${err}`)
            process.exit(1)
        })
}

module.exports = connectDB
