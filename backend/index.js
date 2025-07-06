/** @format */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const cors = require("cors");
const auth = require("./routes/Auth");
const dotenv = require("dotenv");
const session = require("express-session");
const connectRedis = require("connect-redis");
const redis = require("redis");
const map = require("./routes/Map");
const spots = require("./routes/Spots");
const reportRouter = require("./routes/Report");
const profileRouter = require("./routes/Profile");
const webSocket = require("ws");
const http = require("http");
const e = require("express");
dotenv.config();
const app = express();

const RedisStore = connectRedis.RedisStore;
const redisClient = redis.createClient({ url: process.env.REDIS_URL });
redisClient.connect();
const store = new RedisStore({
  client: redisClient,
  prefix: "spotonspoton",
});
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(
  session({
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60000 * 60 * 60 * 24,
    },
  })
);
app.use(express.json());
app.use("/auth", auth);
app.use("/map", map);
app.use("/spots", spots);
app.use("/report", reportRouter);
app.use("/user", profileRouter);

const server = http.createServer(app);
const wss = new webSocket.Server({ server });
let lockedSpots = {};
wss.on("connection", (ws) => {
  ws.on("message", async (message) => {
    const data = JSON.parse(message);
    console.log("data", data);
    let broadCastData = null;
    //check to see before user update a spot through a report it is not locked
    if (data.type === "UPDATE_SPOT_BY_REPORT") {
      console.log("update spot by report", data);
      const now = Date.now();
      //get spot id by data.spotName return only id
      const spot = await prisma.spots.findFirst({
        where: {
          lotName: data.spotName,
        },
      });
      if (!spot) {
        console.log("spot does not exist");
        ws.send(
          JSON.stringify({
            type: "REPORT_ERROR",
            spotName: data.spotName,
            message: "This spot does not exist",
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
      console.log("spot", lockedSpots);
      console.log("active lock", activeLock);
      if (activeLock) {
        console.log("spot is locked );");
        ws.send(
          JSON.stringify({
            type: "REPORT_ERROR",
            spotName: spot.lotName,
            message: "This spot is being updated by another user",
          })
        );
        return;
      } else {
        console.log("spot is not locked");
        ws.send(
          JSON.stringify({
            type: "REPORT_SUCCESS",
            spotName: spot.lotName,
          })
        );
      }
      //create a lock for the spot
      const lockSpot = await prisma.lockedSpot.create({
        data: {
          spotId: spot.id,
          userId: data.userId,
          expiresAt: new Date(now + 2000),
        },
      });
      console.log("lock spot", lockSpot);
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
          broadCastAll(
            {
              type: "SPOT_UNLOCKED",
              locked: false,
              spotId: data.spotId,
              userId: data.userId,
            },
            ws
          );
        }
      }, 3000);
    }
    if (data.type == "LOCK_SPOT") {
      console.log("lock spot on line 154");
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
        console.log("spot is sending an error` on line 167);");
        ws.send(
          JSON.stringify({
            type: "ERROR",
            message: "This spot is being updated by another user",
          })
        );
        console.log("active lock  on line 174", activeLock);
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
      console.log("lock spot  on line 184", lockSpot);
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

          broadCastAll(
            {
              type: "SPOT_UNLOCKED",
              locked: false,
              spotId: data.spotId,
              userId: data.userId,
            },
            ws
          );
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
      console.log("update spot on line 215");
      if (lockedSpots[data.spotId]) {
        console.log("spot is locked on line 218");
        broadCastAll(
          {
            type: "SPOT_UPDATED",
            data: data.spot,
          },
          ws
        );

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
        console.log("spot is not locked on line 228");
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

function broadCastAll(data, excludes) {
  const updatedSpot = JSON.stringify(data);

  wss.clients.forEach((client) => {
    if (client !== excludes && client.readyState === excludes.OPEN) {
      client.send(updatedSpot);
    }
  });
}
wss.on("close", () => {});

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {});
