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
const checkForReservedSpots = async (spotId, now) => {
  const reservedSpot = await prisma.reservedSpots.findFirst({
    where: {
      spotId: spotId,
      expiresAt: {
        gte: new Date(now),
      },
    },
  });
  if (reservedSpot) {
    return reservedSpot;
  } else {
    return null;
  }
};
const isSpotLocked = async (spotId, now) => {
  const activeLock = await prisma.lockedSpot.findFirst({
    where: {
      spotId: spotId,
      expiresAt: {
        gte: new Date(now),
      },
    },
  });
  if (activeLock) {
    return true;
  } else {
    return false;
  }
};

const createLockedSpot = async (spotId, userId, expires) => {
  const lockSpot = await prisma.lockedSpot.create({
    data: {
      spotId: spotId,
      userId: userId,
      expiresAt: expires,
    },
  });
  lockedSpots[spotId] = lockSpot;
  return lockSpot;
};
const getSpotsByLotName = async (lotName, ws) => {
  const spot = await prisma.spots.findFirst({
    where: {
      lotName: lotName,
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
  }
  return spot;
};
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
      const spot = await getSpotsByLotName(data.lotName, ws);
      if (!spot) {
        return;
      }
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
      const activeLock = await isSpotLocked(spot.id, now);
      if (activeLock) {
        sendToUserIfLocked(ws);
        return;
      }
      const reservedSpot = await checkForReservedSpots(spot.id, now);
      if (reservedSpot) {
        sendToUserIfReserved(ws, data, reservedSpot);
        return;
      } else {
        broadCastData = {
          type: "RESERVE_UPDATE",
          spotId: spot.id,
          userId: data.userId,
        };
        ws.send(
          JSON.stringify({
            type: "RESERVE_SUCCESS",
            spotId: spot.id,
          })
        );
        //unreserve the spot after 10 minutes
      }
    }
    if (data.type === "UNRESERVE_SPOT") {
      broadCastData = {
        type: "SPOT_UNRESERVED",
        spotId: data.spotId,
        userId: data.userId,
      };
    }

    if (data.type === "UPDATE_SPOT_BY_REPORT") {
      const now = Date.now();
      const spot = await getSpotsByLotName(data.spotName, ws);
      if (!spot) {
        return;
      }
      const activeReservation = await checkForReservedSpots(spot.id, now);
      if (activeReservation) {
        sendToUserIfReserved(ws, data, activeReservation);
        return;
      }
      const activeLock = await isSpotLocked(spot.id, now);
      if (activeLock) {
        sendToUserIfLocked(ws);
        return;
      } else {
        ws.send(
          JSON.stringify({
            type: "REPORT_SUCCESS",
            spotName: spot.lotName,
          })
        );
      }
      const expires = new Date(now + 2000);
      const lockSpot = await createLockedSpot(spot.id, data.userId, expires);
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
            isOccupied: data.isOccupied,
          });
        }
      }, 3000);
    }
    if (data.type == "LOCK_SPOT") {
      const now = Date.now();
      const expires = new Date(now + 60_000);
      const activeLock = await isSpotLocked(data.spotId, now);
      if (activeLock) {
        sendToUserIfLocked(ws);
        return;
      }
      const activeReservation = await checkForReservedSpots(data.spotId, now);
      if (activeReservation) {
        sendToUserIfReserved(ws, data, activeReservation);
        return;
      }
      const lockSpot = await createLockedSpot(
        data.spotId,
        data.userId,
        expires
      );
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
            isOccupied: data.isOccupied,
          });
        }
      }, 60000);
    }
    if (data.type === "UNLOCK_SPOT") {
      if (lockedSpots[data.spotId]?.userId === data.userId) {
        await prisma.lockedSpot.delete({
          where: {
            id: lockedSpots[data.spotId].id,
          },
        });
        delete lockedSpots[data.spotId];
        broadCastData = {
          type: "SPOT_UNLOCKED",
          isOccupied: data.isOccupied,
          locked: false,
          spotId: data.spotId,
          userId: data.userId,
        };
      }
    }
    if (data.type === "UPDATE_SPOT") {
      if (lockedSpots[data.spotId]) {
        broadCastData = {
          type: "SPOT_UNLOCKED",
          locked: false,
          spotId: data.spotId,
          isOccupied: data.isOccupied,
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
function sendToUserIfReserved(ws, data, activeReservation) {
  let message;
  if (activeReservation.userId === data.userId) {
    message = `This spot is reserved by you until ${new Date(
      activeReservation.expiresAt
    ).toLocaleString()}`;
  } else {
    message = `This spot is reserved by another user until ${new Date(
      activeReservation.expiresAt
    ).toLocaleString()}`;
  }
  ws.send(
    JSON.stringify({
      type: "ERROR",
      message: message,
    })
  );
}
function sendToUserIfLocked(ws) {
  ws.send(
    JSON.stringify({
      type: "ERROR",
      message: "This spot is being updated by another user",
    })
  );
}

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
