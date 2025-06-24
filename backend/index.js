const express = require('express');
const cors = require('cors');
const app = express();
const auth = require('./routes/Auth');
const dotenv = require('dotenv');
const session = require('express-session');
const connectRedis =  require('connect-redis');
const redis = require('redis');
dotenv.config();

app.use(express.json());
app.use('/auth', auth);


const RedisStore = connectRedis.RedisStore;
const redisClient = redis.createClient({ url: process.env.REDIS_URL });
redisClient.connect().catch(console.error);
const store = new RedisStore({
    client: redisClient,
    prefix: "spotonspoton"
});
app.use(session({
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        sameSite:"lax",
        maxAge: 60000 * 60 * 60 * 24
    }
}))

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))

app.get('/spots', (req, res) => {
    //Todo
    //check if session is valid before returning data
    //if (!req.session.user) {
})
const PORT = process.env.PORT || 9000;
app.listen(PORT, ()=>{
    console.log(`Port running on ${PORT}`);
})
