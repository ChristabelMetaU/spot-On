/** @format */

const predictionRouter = require("express").Router();
const { PrismaClient } = require("@prisma/client");
let generateForecast = require("../utils/generateForeCast");
const prisma = new PrismaClient();

predictionRouter.get("/:lotName", async (req, res) => {
  const lotName = req.params.lotName;
  if (!lotName) {
    res.status(400).json({ error: "Missing lot name" });
  }
  try {
    const reports = await prisma.reports.findMany({
      where: { spot_name: lotName },
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
