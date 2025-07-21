/** @format */

const { Router } = require("express");
const reportRouter = Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
dotenv.config();
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_KEY;
reportRouter.post("/create", async (req, res) => {
  try {
    const { description, type, user_id, spot_name, isOccupied } = req.body;
    if (!user_id || !spot_name) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newReport = await prisma.reports.create({
      data: {
        description,
        type,
        user_id: parseInt(user_id),
        spot_name,
        isOccupied,
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

reportRouter.get("/spot/latlng/:lat/:lng", async (req, res) => {
  try {
    const { lat, lng } = req.params;

    const spot = await prisma.spots.findFirst({
      where: {
        coordLat: parseFloat(lat),
        coordLng: parseFloat(lng),
      },
    });
    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }
    const reports = await prisma.reports.findMany({
      where: {
        spot_name: spot.name,
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

reportRouter.get(
  "/spot/direction/:lat1/:lat2/:lng1/:lng2",
  async (req, res) => {
    try {
      const { lat1, lat2, lng1, lng2 } = req.params;
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat1},${lng1}&destinations=${lat2},${lng2}&departure_time=now&key=${GOOGLE_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      if (!data) {
        return res.status(404).json({ message: "Distance not found" });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
module.exports = reportRouter;
