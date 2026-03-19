require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const { initDb, sequelizeInstance } = require("./db");
const authRouter = require("./controllers/authController");
const usersRouter = require("./controllers/usersController");
const requestsRouter = require("./controllers/requestsController");

require("./db/models");

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.set("Cache-Control", "no-store");
  }
  next();
});
app.use(
  express.static(path.join(__dirname, "..", "public"), {
    etag: true,
    lastModified: true,
    maxAge: "10m"
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/requests", requestsRouter);

app.use((err, _req, res, _next) => {
  res.status(400).json({
    error: err?.message || "Bad Request"
  });
});

async function bootstrap() {
  await initDb();
  await sequelizeInstance.sync({ alter: true });

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
