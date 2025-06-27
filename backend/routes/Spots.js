/** @format */

const spots = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
spots.post("/", async (req, res) => {
  const { lotName, coordLng, coordLat, isOccupied } = req.body;
  if (!coordLng || !coordLat || !lotName) {
    return res.status(400).json({ error: "Missing cordinates" });
  }
  try {
    const newSpot = await prisma.spots.create({
      data: {
        lotName,
        coordLat,
        coordLng,
        isOccupied: isOccupied ? isOccupied : false,
      },
    });
    res.status(201).json(newSpot);
  } catch (error) {
    res.status(400).json({ error: "Error creating spot" });
  }
});

module.exports = spots;
