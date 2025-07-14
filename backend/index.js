/** @format */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const webSocket = require("ws");
const http = require("http");
const app = require("./app");
const e = require("express");
const server = http.createServer(app);
const wss = new webSocket.Server({ server });
let lockedSpots = {};
const presenceMap = new Map();
wss.on("connection", (ws) => {
  ws.on("message", async (message) => {
    const data = JSON.parse(message);
    let broadCastData = null;
    if (data.type === "USER_ENTERED_MAP") {
      currentUserId = data.userId;
      presenceMap.set(data.userId, {
        userId: data.userId,
        location: data.location,
      });
      const allUsers = Array.from(presenceMap.values());
      broadCastAll({
        type: "PRESENCE_UPDATE",
        users: allUsers,
      });
    }
    if (data.type === "RESERVE_SPOT") {
      //get spot id from spot name
      const spot = await prisma.spots.findFirst({
        where: {
          lotName: data.lotName,
        },
      });
      const now = Date.now();
      const activeReservation = await prisma.reservedSpots.findFirst({
        where: {
          userId: data.userId,
          expiresAt: {
            gte: new Date(now),
          },
        },
      });
      if (activeReservation) {
        ws.send(
          JSON.stringify({
            type: "RESERVE_ERROR",
            message: "You already have an active reservation",
          })
        );
        return;
      }
      const activeLock = await prisma.lockedSpot.findFirst({
        where: {
          spotId: spot.id,
          expiresAt: {
            gte: new Date(now),
          },
        },
      });
      if (activeLock) {
        ws.send(
          JSON.stringify({
            type: "RESERVE_ERROR",
            message: "This spot is being updated by another user",
          })
        );
        return;
      }
      const reservedSpot = await prisma.reservedSpots.findFirst({
        where: {
          spotId: spot.id,
          expiresAt: {
            gte: new Date(now),
          },
        },
      });
      if (reservedSpot) {
        ws.send(
          JSON.stringify({
            type: "RESERVE_ERROR",
            message: "This spot is already reserved",
          })
        );
        return;
      }
      ws.send(
        JSON.stringify({
          type: "RESERVE_SUCCESS",
          spotId: spot.id,
        })
      );
    }

    if (data.type === "UPDATE_SPOT_BY_REPORT") {
      const now = Date.now();

      const spot = await prisma.spots.findFirst({
        where: {
          lotName: data.spotName,
        },
      });
      if (!spot) {
        ws.send(
          JSON.stringify({
            type: "REPORT_ERROR",
            spotName: data.spotName,
            message: "This spot does not exist",
          })
        );
        return;
      }
      const activeReservation = await prisma.reservedSpots.findFirst({
        where: {
          spotId: spot.id,
          expiresAt: {
            gte: new Date(now),
          },
        },
      });
      if (activeReservation) {
        ws.send(
          JSON.stringify({
            type: "REPORT_ERROR",
            spotName: spot.lotName,
            message: `This spot is reserved until ${new Date(
              activeReservation.expiresAt
            ).toLocaleString()}`,
          })
        );
        return;
      }
      const activeLock = await prisma.lockedSpot.findFirst({
        where: {
          spotId: spot.id,
          expiresAt: {
            gte: new Date(now),
          },
        },
      });
      if (activeLock) {
        ws.send(
          JSON.stringify({
            type: "REPORT_ERROR",
            spotName: spot.lotName,
            message: "This spot is being updated by another user",
          })
        );
        return;
      } else {
        ws.send(
          JSON.stringify({
            type: "REPORT_SUCCESS",
            spotName: spot.lotName,
          })
        );
      }

      const lockSpot = await prisma.lockedSpot.create({
        data: {
          spotId: spot.id,
          userId: data.userId,
          expiresAt: new Date(now + 2000),
        },
      });

      lockedSpots[spot.id] = lockSpot;
      broadCastData = {
        type: "SPOT_LOCKED",
        locked: true,
        spotId: data.spotId,
        userId: data.userId,
      };
      setTimeout(async () => {
        if (
          lockedSpots[data.spotId] &&
          lockedSpots[data.spotId].expiresAt <= Date.now()
        ) {
          await prisma.lockedSpot.delete({
            where: {
              id: lockedSpots[data.spotId].id,
            },
          });
          delete lockedSpots[data.spotId];
          broadCastAll({
            type: "SPOT_UNLOCKED",
            locked: false,
            spotId: data.spotId,
            userId: data.userId,
          });
        }
      }, 3000);
    }
    if (data.type == "LOCK_SPOT") {
      const now = Date.now();
      const expires = new Date(now + 60_000);
      const activeLock = await prisma.lockedSpot.findFirst({
        where: {
          spotId: data.spotId,
          expiresAt: {
            gte: new Date(now),
          },
        },
      });

      if (activeLock) {
        ws.send(
          JSON.stringify({
            type: "ERROR",
            message: "This spot is being updated by another user",
          })
        );

        return;
      }
      const activeReservation = await prisma.reservedSpots.findFirst({
        where: {
          spotId: data.spotId,
          expiresAt: {
            gte: new Date(now),
          },
        },
      });
      if (activeReservation) {
        ws.send(
          JSON.stringify({
            type: "ERROR",
            message: `This spot is reserved until ${new Date(
              activeReservation.expiresAt
            ).toLocaleString()}`,
          })
        );
        return;
      }
      const lockSpot = await prisma.lockedSpot.create({
        data: {
          spotId: data.spotId,
          userId: data.userId,
          expiresAt: expires,
        },
      });
      lockedSpots[data.spotId] = lockSpot;

      broadCastData = {
        type: "SPOT_LOCKED",
        locked: true,
        spotId: data.spotId,
        userId: data.userId,
      };
      setTimeout(async () => {
        if (
          lockedSpots[data.spotId] &&
          lockedSpots[data.spotId].expiresAt <= Date.now()
        ) {
          await prisma.lockedSpot.delete({
            where: {
              id: lockedSpots[data.spotId].id,
            },
          });
          delete lockedSpots[data.spotId];

          broadCastAll({
            type: "SPOT_UNLOCKED",
            locked: false,
            spotId: data.spotId,
            userId: data.userId,
          });
        }
      }, 60000);
    }
    if (data.type === "UNCLOCK_SPOT") {
      if (lockedSpots[data.spotId]?.userId === data.userId) {
        await prisma.lockedSpot.delete({
          where: {
            id: lockedSpots[data.spotId].id,
          },
        });
        delete lockedSpots[data.spotId];
        broadCastData = {
          type: "SPOT_UNLOCKED",
          locked: false,
          spotId: data.spotId,
          userId: data.userId,
        };
      }
    }
    if (data.type === "UPDATE_SPOT") {
      if (lockedSpots[data.spotId]) {
        broadCastAll({
          type: "SPOT_UPDATED",
          spotId: data.spotId,
          data: data.spot,
        });

        broadCastData = {
          type: "SPOT_UNLOCKED",
          locked: false,
          spotId: data.spotId,
        };
        await prisma.lockedSpot.delete({
          where: {
            id: lockedSpots[data.spotId].id,
          },
        });
        delete lockedSpots[data.spotId];
      } else {
        ws.send(
          JSON.stringify({
            type: "ERROR",
            message: "An error occoured, Please try again.",
          })
        );
      }
    }

    if (broadCastData) {
      broadCastAll(broadCastData, ws);
    }
  });
});

function broadCastAll(data, excludeWs = null) {
  const updatedSpot = JSON.stringify(data);

  wss.clients.forEach((client) => {
    if (client.readyState === webSocket.OPEN && client !== excludeWs) {
      client.send(updatedSpot);
    }
  });
}
wss.on("close", () => {
  setTimeout(() => {
    if (!Array.from(wss.clients).some((c) => c.userId === currentUserId)) {
      presenceMap.delete(currentUserId);
      const allUsers = Array.from(presenceMap.values());
      broadCastAll({
        type: "PRESENCE_UPDATE",
        users: allUsers,
      });
    }
  }, 3000);
});

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {});
