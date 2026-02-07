const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const connectDB = require("./config/db");
const Actress = require("./model/actress");
const User = require("./model/users");
const House = require("./model/house");


const app = express();
app.use(express.json());
app.use(cors());

connectDB();

/* ======================
   GET — barcha aktrisalar
====================== */
app.get("/actresses", async (req, res) => {
  try {
    const actresses = await Actress.find();
    res.json(actresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ======================
   POST — yangi aktrisa
====================== */
app.post("/actresses", async (req, res) => {
  try {
    const actress = new Actress(req.body);
    const savedActress = await actress.save();
    res.status(201).json(savedActress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* =====================
   AUTH – REGISTER
===================== */
app.post("/auth/register", async (req, res) => {
  try {
    let { login, password } = req.body;

    login = String(login || "").trim().toLowerCase();

    if (!login || !password) {
      return res.status(400).json({ message: "Login va parol shart" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Parol kamida 6 ta belgi" });
    }

    const exists = await User.findOne({ login });
    if (exists) {
      return res.status(400).json({ message: "Login band" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      login,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Ro‘yxatdan o‘tildi",
      user: { id: user._id, login: user.login },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =====================
   AUTH – LOGIN
===================== */
app.post("/auth/login", async (req, res) => {
  try {
    let { login, password } = req.body;

    login = String(login || "").trim().toLowerCase();

    if (!login || !password) {
      return res.status(400).json({ message: "Login va parol shart" });
    }

    const user = await User.findOne({ login });
    if (!user) {
      return res.status(400).json({ message: "Login yoki parol xato" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Login yoki parol xato" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login muvaffaqiyatli",
      token,
      user: { id: user._id, login: user.login },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ======================
   GET — barcha uylar
   /houses
   /houses?status=gold
====================== */
app.get("/houses", async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status && status !== "all") {
      filter.status = status;
    }

    const houses = await House.find(filter).sort({ createdAt: -1 });

    res.json(houses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ======================
   POST — yangi uy qo‘shish
   POST /houses
====================== */
app.post("/houses", async (req, res) => {
  try {
    const {
      image,
      name,
      category,
      price,
      currency,
      rooms,
      year,
      area,
      areaUnit,
      status,
    } = req.body;

    // минимальная валидация
    if (!image || !name || !price || !rooms || !year || !area) {
      return res.status(400).json({
        message: "Majburiy maydonlar to‘ldirilmagan",
      });
    }

    const house = await House.create({
      image,
      name,
      category,
      price,
      currency,
      rooms,
      year,
      area,
      areaUnit,
      status,
    });

    res.status(201).json({
      message: "Uy muvaffaqiyatli qo‘shildi",
      house,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



/* ======================
   SERVER START
====================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portda ishlayapti 🚀`);
});
