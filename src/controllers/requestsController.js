const express = require("express");
const { User, Request } = require("../db/models");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, async (_req, res, next) => {
  try {
    const requests = await Request.findAll({
      order: [["created_at", "ASC"]]
    });
    res.json(requests);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const request = await Request.findByPk(req.params.id, {
      include: [User]
    });
    if (!request) {
      return res.status(404).json({ error: "Заявка не найдена" });
    }
    res.json(request);
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const {
      userId,
      deviceBrand,
      deviceModel,
      imei,
      issueDescription,
      status,
      estimatedCost,
      finalCost
    } = req.body || {};
    const request = await Request.create({
      userId,
      deviceBrand: deviceBrand ?? "Unknown",
      deviceModel: deviceModel ?? "",
      imei: imei ?? "",
      issueDescription: issueDescription ?? "",
      status: status ?? "new",
      estimatedCost: estimatedCost ?? 0,
      finalCost: finalCost ?? 0
    });
    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const request = await Request.findByPk(req.params.id);
    if (!request) {
      return res.status(404).json({ error: "Заявка не найдена" });
    }
    await request.destroy();
    res.status(200).json({ message: "Заявка удалена" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
