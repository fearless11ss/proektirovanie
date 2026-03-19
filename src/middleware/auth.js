const jwt = require("jsonwebtoken");
const { User } = require("../db/models");

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
}

async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Требуется авторизация" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "Пользователь не найден" });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Неверный или просроченный токен" });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Доступ только для администратора" });
  }
  next();
}

module.exports = { generateToken, requireAuth, requireAdmin };
