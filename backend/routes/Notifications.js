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
    //remove repeated notifications if they have the same spotId
    const uniqueNotifications = notifications.filter(
      (notification, index, self) =>
        index ===
        self.findIndex(
          (t) => t.spotId === notification.spotId && t.id === notification.id
        )
    );
    res.status(200).json(uniqueNotifications);
  } else {
    res.status(404).json({ message: "No notifications found for user" });
  }
});

//update notification to read true
notifyRouter.put("/update", async (req, res) => {
  const { isRead, id } = req.body;
  const notification = await prisma.notifications.update({
    where: {
      id: Number(id),
    },
    data: {
      read: isRead,
    },
  });
  if (notification) {
    res.status(200).json(notification);
  } else {
    res.status(404).json({ message: "No notifications found for user" });
  }
});
module.exports = notifyRouter;
