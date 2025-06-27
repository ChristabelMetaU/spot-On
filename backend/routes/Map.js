/** @format */

const spotsRouter = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

spotsRouter.get("/spots", async (req, res) => {
  const spots = await prisma.spots.findMany();
  if (!spots) {
    return res.status(404).json({ message: "No spots found" });
  }
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
