/** @format */

const { Router } = require("express");
const reserveRouter = Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//create reserved spot
reserveRouter.post("/reserve", async (req, res) => {
  const { spotId, userId } = req.body;
  try {
    const reserve = await prisma.reservedSpots.create({
      data: {
        spotId,
        userId,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
    res.status(200).json(reserve);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = reserveRouter;
