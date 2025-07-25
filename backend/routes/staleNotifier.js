/** @format */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cron = require("node-cron");

module.exports = function sendReminder(wss) {
  cron.schedule("0 * * * *", async () => {
    const staleSpots = await prisma.reports.findMany({
      where: {
        isOccupied: true,
        notified: false,
        created_at: {
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    for (const staleSpot of staleSpots) {
      const userId = staleSpot.user_id;
      const message = `You have had ${staleSpot.spot_name} reserved for more than 24 hours. Please release the spot.`;

      let isOnline = false;

      wss.clients.forEach((client) => {
        if (client.readyState === 1 && client.userId === userId) {
          isOnline = true;
          client.send(
            JSON.stringify({
              type: "REMINDER",
              message,
              lotName: staleSpot.spot_name,
            })
          );
        }
      });

      await prisma.reports.update({
        where: { id: staleSpot.id },
        data: { notified: true },
      });

      if (!isOnline) {
        const spot = await prisma.spots.findFirst({
          where: {
            lotName: staleSpot.spot_name,
          },
        });

        if (spot) {
          await prisma.notifications.create({
            data: {
              userId,
              message,
              spotId: spot.id,
            },
          });
        }
      }
    }
  });
};
