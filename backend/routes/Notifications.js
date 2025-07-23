/** @format */

const notifyRouter = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

notifyRouter.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const notifications = await prisma.notifications.findMany({
    where: {
      userId: Number(userId),
      read: false,
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

//update notification to read
notifyRouter.put("/update", async (req, res) => {
  const { isRead, userId, id } = req.body;
  const notification = await prisma.notifications.updateMany({
    where: {
      userId: Number(userId),
      id: Number(id),
    },
    data: {
      read: isRead,
    },
  });
  console.log(notification);
  if (notification) {
    res.status(200).json(notification);
  } else {
    res.status(404).json({ message: "No notifications found for user" });
  }
});
module.exports = notifyRouter;
