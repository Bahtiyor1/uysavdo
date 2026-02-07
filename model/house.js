// models/house.js
const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema(
  {
    // image url
    image: {
      type: String,
      required: true,
      trim: true,
    },

    // Yunusobod 15-kvar...
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    // Apartment
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
      default: "Apartment",
    },

    // price - лучше хранить числом (172000), а валюту отдельно
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
      enum: ["USD", "UZS", "EUR"],
    },

    // rooms
    rooms: {
      type: Number,
      required: true,
      min: 0,
    },

    // year
    year: {
      type: Number,
      required: true,
      min: 1800,
      max: 2100,
    },

    // area (в твоём фронте "100 kv")
    area: {
      type: Number,
      required: true,
      min: 0,
    },
    areaUnit: {
      type: String,
      default: "kv",
      enum: ["kv", "m2"],
    },

    // вместо строки "12.12.25 - 12:34" лучше Date
    uploadedAt: {
      type: Date,
      default: Date.now,
    },

    // вкладки: all / gold / blocked / deleted
    status: {
      type: String,
      default: "all",
      enum: ["all", "gold", "blocked", "deleted"],
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("House", houseSchema);
