/** @format */

const { Router } = require("express");
const reserveRouter = Router();
const { PrismaClient } = require("@prisma/client");
const spots = require("./Spots");
const prisma = new PrismaClient();

reserveRouter.post("/reserve", async (req, res) => {
  const { lotName, userId } = req.body;

  const spot = await prisma.spots.findFirst({
    where: {
      lotName,
    },
  });
  try {
    if (spot) {
      const reserve = await prisma.reservedSpots.create({
        data: {
          spotId: spot.id,
          userId,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      });
      res.status(200).json(reserve);
    } else {
      res.status(404).json({ message: "No spot found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

reserveRouter.get("/get/reserve", async (req, res) => {
  const now = new Date();
  const userId = req.session.userId;
  try {
    const reserve = await prisma.reservedSpots.findMany({
      where: {
        userId,
        expiresAt: {
          lte: now,
        },
      },
    });
    if (reserve.length > 0) {
      const spots = await prisma.spots.findMany({
        where: {
          id: {
            in: reserve.map((r) => r.spotId),
          },
        },
      });

      const reserveWithSpots = reserve.map((r) => {
        const spot = spots.find((s) => s.id === r.spotId);
        return {
          ...r,
          lotName: spot.lotName,
        };
      });
      res.status(200).json(reserveWithSpots);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

reserveRouter.put("/cancel", async (req, res) => {
  const { spotId, userId, cancelReservationAt } = req.body;
  try {
    const reserve = await prisma.reservedSpots.findFirst({
      where: {
        spotId,
        userId,
        expiresAt: {
          gte: cancelReservationAt,
        },
      },
    });
    if (reserve) {
      await prisma.reservedSpots.update({
        where: {
          id: reserve.id,
        },
        data: {
          expiresAt: cancelReservationAt,
        },
      });
      res.status(200).json({ message: "Reservation cancelled" });
    } else {
      res.status(404).json({ message: "No reservation found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

reserveRouter.get("/current/reserve/:id", async (req, res) => {
  const { id } = req.params;
  const userId = parseInt(id);
  try {
    const reserve = await prisma.reservedSpots.findFirst({
      where: {
        expiresAt: {
          gte: new Date(),
        },
        userId,
      },
    });
    if (reserve) {
      res.json(reserve);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = reserveRouter;
