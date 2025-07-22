/** @format */

const predictionRouter = require("express").Router();
const ARIMA = require("arima").default;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
let clusters;
async function getLatestReport(spotId) {
  const spot = await prisma.spots.findFirst({
    where: { id: spotId },
    select: { lotName: true },
  });
  if (!spot) return null;

  const report = await prisma.reports.findFirst({
    where: { spot_name: spot.lotName },
    orderBy: { created_at: "desc" },
  });
  return report?.created_at || null;
}

async function predictAvailabilityForCluster(spotIds) {
  const spots = await prisma.spots.findMany({
    where: { id: { in: spotIds } },
    select: { id: true, lotName: true },
  });

  const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60);
  const reports = await prisma.reports.findMany({
    where: {
      spot_name: { in: spots.map((s) => s.lotName) },
      created_at: { gte: oneHourAgo },
    },
    orderBy: { created_at: "asc" },
  });

  const buckets = new Map();
  for (let rpt of reports) {
    const m = new Date(rpt.created_at);
    m.setSeconds(0, 0);
    const key = m.getTime();
    const prev = buckets.get(key) || 0;
    buckets.set(key, rpt.isOccupied ? prev : prev + 1);
  }

  const history = [];
  for (let i = 60; i >= 1; i--) {
    const t = new Date(Date.now() - i * 60000);
    t.setSeconds(0, 0, 0);
    history.push(buckets.get(t.getTime()) || 0);
  }

  if (history.length < 10 || new Set(history).size === 1) {
    const mean = Math.round(
      history.reduce((a, b) => a + b, 0) / history.length || 0
    );
    return buildResponse(mean);
  }

  const p = 1,
    d = 1,
    q = 1;
  const arima = new ARIMA({
    p,
    d,
    q,
    verbose: false,
  }).train(history);

  const horizon = 50;
  const [predictions] = arima.predict(horizon);
  const forecastAt = (n) => {
    const v = predictions[n - 1];
    return Math.max(0, Math.round(v));
  };

  return {
    now: buildInterval(forecastAt(1)),
    15: buildInterval(forecastAt(15)),
    30: buildInterval(forecastAt(30)),
    50: buildInterval(forecastAt(50)),
  };

  function buildInterval(count) {
    return {
      availability: count,
      freeCount: count,
      totalSpots: spotIds.length,
    };
  }

  function buildResponse(mean) {
    return {
      now: buildInterval(mean),
      15: buildInterval(mean),
      30: buildInterval(mean),
      50: buildInterval(mean),
    };
  }
}

predictionRouter.post("/clusters", async (req, res) => {
  try {
    clusters = req.body;
    res.json({ success: true });
  } catch (error) {
    throw error;
  }
});

predictionRouter.get("/", async (req, res) => {
  try {
    if (!clusters) {
      return res.status(400).json({ error: "No clusters set" });
    }
    const predictions = await Promise.all(
      clusters.map(async (cluster) => {
        const spotIds = cluster.spots.map((spot) => spot.id);
        const prediction = await predictAvailabilityForCluster(spotIds);

        const lastReportedTimes = await Promise.all(
          spotIds.map((id) => getLatestReport(id))
        );

        const lastReported = lastReportedTimes.reduce(
          (a, b) => (a > b ? a : b),
          null
        );

        return {
          id: cluster.spots[0].id + "-" + (cluster?.spots[1]?.id || ""),
          name: (cluster.spots[0].lotName || "")
            .split(" ")
            .slice(0, 2)
            .join(" "),
          predictions: prediction,
          lastReported: lastReported
            ? `${Math.floor(
                (Date.now() - new Date(lastReported)) / 60000
              )} mins ago`
            : "N/A",
          walkTime: "3 mins",
        };
      })
    );
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch predictions" });
  }
});

module.exports = predictionRouter;
