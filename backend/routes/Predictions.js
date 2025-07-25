/** @format */

const predictionRouter = require("express").Router();
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

  const totalSpots = spotIds.length;
  const lotNames = spots.map((s) => s.lotName);

  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const reports = await prisma.reports.findMany({
    where: {
      spot_name: { in: lotNames },
      created_at: { gte: twoHoursAgo },
    },
  });

  let baseProbability;
  if (reports.length === 0) {
    baseProbability = 0.5;
  } else {
    const freeReports = reports.filter((r) => r.isOccupied === false).length;
    baseProbability = freeReports / reports.length;
  }

  const baseFree = Math.round(baseProbability * totalSpots);

  const generatePrediction = (free, shift = 0) => {
    const adjusted = Math.max(
      0,
      Math.min(
        totalSpots,
        Math.round(free * (1 - 0.1 * shift + Math.random() * 0.05))
      )
    );

    const availability = Math.round((adjusted / totalSpots) * 100);

    if (availability > 70) {
      availabilityLevel = "High";
    } else if (availability > 50) {
      availabilityLevel = "Medium";
    } else {
      availabilityLevel = "Low";
    }
    const waitTime = `${Math.max(2, 8 - shift)} mins`;
    const peakHour = new Date(Date.now() + shift * 15 * 60000)
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
      .replace(/^0/, "");

    return {
      availability,
      availabilityLevel,
      waitTime,
      peak: peakHour,
      freeCount: adjusted,
      totalSpots,
    };
  };

  return {
    now: generatePrediction(baseFree, 0),
    15: generatePrediction(baseFree, 1),
    30: generatePrediction(baseFree, 2),
    50: generatePrediction(baseFree, 3),
  };
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
            ? new Date(lastReported).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })
            : "Not Reported",

          walkTime: "10 mins",
        };
      })
    );
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch predictions" });
  }
});

module.exports = predictionRouter;
