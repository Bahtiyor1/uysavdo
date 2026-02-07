const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    login: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
