const express = require("express");
const { User } = require("../db/models");
const { generateToken } = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { email, password, fullName, phone, address } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email и пароль обязательны" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Пароль должен быть не менее 6 символов" });
    }
    if (!fullName || fullName.trim().length < 2) {
      return res.status(400).json({ error: "Укажите ФИО (минимум 2 символа)" });
    }
    if (!phone || !/^\+?\d{7,15}$/.test(phone)) {
      return res.status(400).json({ error: "Некорректный номер телефона (только цифры, 7–15 символов)" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Пользователь с таким email уже существует" });
    }

    const user = await User.create({
      email,
      password,
      fullName: fullName || "Клиент",
      phone: phone || "",
      address: address || "",
      role: "user"
    });

    const token = generateToken(user);
    res.status(201).json({ token, user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email и пароль обязательны" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    const valid = await user.checkPassword(password);
    if (!valid) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    const token = generateToken(user);
    res.json({ token, user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
