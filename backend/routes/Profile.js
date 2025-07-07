/** @format */

const profileRouter = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const { parse } = require("dotenv");
const prisma = new PrismaClient();

profileRouter.get("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = Number(id);
    const reports = await prisma.reports.findMany({
      where: {
        user_id: user_id,
      },
    });
    if (!reports) {
      return res.status(400).json({ message: "user not found" });
    }
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = profileRouter;
