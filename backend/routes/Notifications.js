/** @format */

const notifyRouter = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

notifyRouter.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const notifications = await prisma.notifications.findMany({
    where: {
      userId: Number(userId),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (notifications) {
    res.status(200).json(notifications);
  } else {
    res.status(404).json({ message: "No notifications found for user" });
  }
});

module.exports = notifyRouter;
