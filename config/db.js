const mongoose = require('mongoose');
const config=require('config');

const DB_STRING=config.get('mongoURI')
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB_STRING, {

    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

module.exports = connectDB
