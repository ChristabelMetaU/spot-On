/** @format */
const express = require("express");
const cors = require("cors");
const auth = require("./routes/Auth");
const dotenv = require("dotenv");
const session = require("express-session");
const connectRedis = require("connect-redis");
const redis = require("redis");
const reserveRouter = require("./routes/Reserve");
const map = require("./routes/Map");
const spots = require("./routes/Spots");
const reportRouter = require("./routes/Report");
const profileRouter = require("./routes/Profile");
const e = require("express");
dotenv.config();
const app = express();

const RedisStore = connectRedis.RedisStore;
const redisClient = redis.createClient({ url: process.env.REDIS_URL });
async function startRedis() {
  await redisClient.connect();
}
startRedis();
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
app.use("/spots", reserveRouter);
redisClient.on("error", (err) => {
  console.log("Error " + err);
});
module.exports = {
  app,
  redisClient,
};
