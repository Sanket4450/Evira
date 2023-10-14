const mongoose = require('mongoose')

const connectDB = () => {
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(data => {
            console.log(`Database connected successfully: ${data.connection.name}`)
        })
        .catch(err => {
            console.error(`Database connection failed: ${err}`)
        })
}

module.exports = connectDB