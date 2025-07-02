/** @format */
const spotsRouter = require("express").Router();
const { PrismaClient, Prisma } = require("@prisma/client");
const { haversineSQL } = require("../utils/Haversine.sql");
const prisma = new PrismaClient();
spotsRouter.get("/spots", async (req, res) => {
  const { lat, lng, radius } = req.query;
  if (!lat || !lng || !radius) {
    return res.status(400).json({ message: "Missing required parameters" });
  }
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  const rad = parseFloat(radius);

  const degLat = rad / 111320;
  const degLng = rad / (111320 * Math.cos(latitude * (Math.PI / 180)));

  const minLat = latitude - degLat;
  const maxLat = latitude + degLat;
  const minLng = longitude - degLng;
  const maxLng = longitude + degLng;
  const spots = await prisma.$queryRaw`
    SELECT * FROM  (
    SELECT *, ${Prisma.raw(haversineSQL(latitude, longitude))} AS distance
    FROM  "spots"
    WHERE "coordLat" BETWEEN ${minLat} AND ${maxLat}
    AND "coordLng" BETWEEN ${minLng} AND ${maxLng})
    AS sub
    WHERE distance <= ${rad}
    ORDER BY distance;
    `;
  res.json(spots);
});

spotsRouter.put("/spots/:id", async (req, res) => {
  const { id } = req.params;
  const { isOccupied } = req.body;
  const spot = await prisma.spots.update({
    where: {
      id: Number(id),
    },
    data: {
      isOccupied: isOccupied,
    },
  });
  if (!spot) {
    return res.status(404).json({ message: "No spot match found" });
  }
  res.json(spot);
});
module.exports = spotsRouter;
