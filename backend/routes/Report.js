/** @format */

const { Router } = require("express");
const reportRouter = Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//create new reports
reportRouter.post("/create", async (req, res) => {
  try {
    const { description, type, user_id, spot_name } = req.body;
    if (!user_id || !spot_name) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newReport = await prisma.reports.create({
      data: {
        description,
        type,
        user_id: parseInt(user_id),
        spot_name,
      },
    });
    if (!newReport) {
      return res.status(400).json({ message: "Report not created" });
    }
    res.json({ message: "Report created successfully", newReport });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//fetch report for a spot
reportRouter.get("/spot/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const reports = await prisma.reports.findMany({
      where: {
        spot_name: name,
      },
    });
    if (!reports) {
      return res.status(404).json({ message: "Reports not found" });
    }
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = reportRouter;
