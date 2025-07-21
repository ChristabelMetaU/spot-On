/** @format */

const predictionRouter = require("express").Router();
const { PrismaClient } = require("@prisma/client");
let generateForecast = require("../utils/generateForeCast");
const prisma = new PrismaClient();

predictionRouter.get("/:spotId", async (req, res) => {
  try {
    const { spotId } = req.params;
    const spot = await prisma.spots.findFirst({
      where: { id: parseInt(spotId) },
    });
    if (!spot) {
      return res.status(404).json({ error: "Spot not found" });
    }

    const reports = await prisma.reports.findMany({
      where: { spot_name: spot.lotName },
      orderBy: { created_at: "asc" },
    });

    const timeseries = reports.map((r) => ({
      time: new Date(r.created_at).getTime(),
      value: r.isOccupied ? 0 : 1,
    }));
    const forecast = generateForecast(timeseries);
    res.json(forecast);
  } catch (error) {
    res.status(500).json({ error: "Predictions not genreated" });
  }
});

module.exports = predictionRouter;
