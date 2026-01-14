const mongoose = require('mongoose')

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_STRING)
        console.log("MongoDB connected successfully")
    } catch (error) {
        console.log("MonogoDB connection failed", error)
        process.end(1)
    }
}

module.exports = connectToDB