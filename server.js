// server.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const cors = require("cors");

const connectDB = require("./config/db");
const User = require("./model/users");
const House = require("./model/house");

const app = express();

// middlewares
app.use(express.json());
app.use(
  cors({
    origin: "*", // for testing; in prod лучше указать домен фронта
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ OpenAPI JSON with correct host (Render / local)
app.get("/docs.json", (req, res) => {
  const host = req.get("host");
  const proto = req.headers["x-forwarded-proto"] || req.protocol;

  res.json({
    ...swaggerSpec,
    servers: [{ url: `${proto}://${host}` }],
  });
});

// ✅ Swagger UI (global)
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(null, {
    swaggerOptions: { url: "/docs.json" },
  })
);

// DB connect
connectDB();

/* =====================
   AUTH – REGISTER
===================== */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [login, password]
 *             properties:
 *               login:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
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
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user (returns JWT token)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [login, password]
 *             properties:
 *               login:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login success
 *       400:
 *         description: Wrong login/password or validation error
 *       500:
 *         description: Server error
 */
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
/**
 * @swagger
 * /houses:
 *   get:
 *     summary: Get all houses (optional filter by status)
 *     tags: [Houses]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           example: gold
 *         description: Filter by status (use "all" to disable filter)
 *     responses:
 *       200:
 *         description: List of houses
 *       500:
 *         description: Server error
 */
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
/**
 * @swagger
 * /houses:
 *   post:
 *     summary: Create a new house
 *     tags: [Houses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [image, name, price, rooms, year, area]
 *             properties:
 *               image:
 *                 type: string
 *                 example: https://picsum.photos/300/200
 *               name:
 *                 type: string
 *                 example: Yunusobod 15-kvar...
 *               category:
 *                 type: string
 *                 example: Apartment
 *               price:
 *                 type: number
 *                 example: 172000
 *               currency:
 *                 type: string
 *                 example: USD
 *               rooms:
 *                 type: number
 *                 example: 3
 *               year:
 *                 type: number
 *                 example: 2025
 *               area:
 *                 type: number
 *                 example: 100
 *               areaUnit:
 *                 type: string
 *                 example: kv
 *               status:
 *                 type: string
 *                 example: gold
 *     responses:
 *       201:
 *         description: House created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
