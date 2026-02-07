// model/actress.model.js
const mongoose = require('mongoose')

const actressSchema = new mongoose.Schema(
  {
    // ✅ required: true (5)
    fullName: {
      type: String,
      required: true
    },
    birthDate: {
      type: Date,
      required: true
    },
    nationality: {
      type: String,
      required: true
    },
    experienceYears: {
      type: Number,
      required: true
    },
    mainGenre: {
      type: String,
      required: true
    },

    // ❌ required: false (5)
    awardsCount: {
      type: Number,
      default: 0
    },
    agency: {
      type: String
    },
    languages: {
      type: [String]
    },
    salaryPerMovie: {
      type: Number
    },
    lastProject: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Actress', actressSchema)
