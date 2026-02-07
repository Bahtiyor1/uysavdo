// config/db.js
const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://bakhtierbek2011_db_user:uLVsgj1et4bjHPZf@cluster0.6gwdtls.mongodb.net/'
    )
    console.log('MongoDB ulandi ✅')
  } catch (error) {
    console.log('MongoDB error ❌', error.message)
    process.exit(1)
  }
}

module.exports = connectDB
