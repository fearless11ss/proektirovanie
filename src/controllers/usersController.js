const express = require("express");
const { User, Request } = require("../db/models");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { sendConditionalJson } = require("../utils/httpCache");

const router = express.Router();

router.get("/", requireAuth, async (_req, res, next) => {
  try {
    const users = await User.findAll({
      order: [["created_at", "ASC"]],
      attributes: { exclude: ["password"] }
    });
    sendConditionalJson(_req, res, users, { maxAge: 30 });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [Request],
      attributes: { exclude: ["password"] }
    });
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    sendConditionalJson(req, res, user, { maxAge: 20 });
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { email, password, fullName, phone, address, role } = req.body || {};
    const user = await User.create({
      email: email ?? "",
      password: password ?? "",
      fullName: fullName ?? "Клиент",
      phone: phone ?? "",
      address: address ?? "",
      role: role === "admin" ? "admin" : "user"
    });
    res.status(201).json(user.toSafeJSON());
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    await user.destroy();
    res.status(200).json({ message: "Пользователь удалён" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
