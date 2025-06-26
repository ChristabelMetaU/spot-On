/** @format */

const spots = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
spots.post("/", async (req, res) => {
  const { lot_name, coord_lng, coord_lat, isOccupied } = req.body;
  if (!coord_lng || !coord_lat) {
    return res.status(400).json({ error: "Missing cordinates" });
  }
  try {
    const newSpot = await prisma.spots.create({
      data: {
        lot_name,
        coord_lng,
        coord_lat,
        isOccupied: isOccupied ? isOccupied : false,
      },
    });
    res.status(201).json(newSpot);
  } catch (error) {
    res.status(300).json({ error: "Error creating spot" });
  }
});

module.exports = spots;
