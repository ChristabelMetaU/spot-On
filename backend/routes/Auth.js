let router = require('express').Router();
let validateEmail = require('../utils/validateEmail')
const bcrypt = require("bcryptjs");
const cors = require('cors');

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        if (!username || !password || !email) {
            return res.status(400).json({ error: "Username and password are required." });
        }
        const isValid = await validateEmail(email);
        if (!isValid) {
            return res.status(400).json({ error: "Invalid email address." });
        }
        if (password.length < 8) {
            return res.status(401).json({ error: "Password must be at least 8 characters long." });
        }
        const newUser = await prisma.users.create({
            data: { username, password_hash: hashedPassword, email, role}
        });
        req.session.userId = newUser.id;
       res.status(201).json({ message: "User created successfully!", user:{id:newUser.id, username:newUser.username, email: newUser.email} });
    } catch (error) {
        return res.status(500).json({ error: "Something went wrong." });
    }

})


router.post('/Login',  async (req, res) =>{
   try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }
        const user = await prisma.users.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(400).json({ error: "Email not found, try again." });
        }
        req.session.userId = user.id;
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(400).json({ error: "Invalid password" });

        }
        res.status(200).json({ message: "Login successful!", user:{id:user.id, username:user.username, email: user.email} });
   } catch (error) {
       return res.status(500).json({ error: "Something went wrong, try again Later." });
   }
})

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) { return res.status(500).json({ error: "Something went wrong, try again Later." }); };
        res.clearCookie('connect.sid');
        res.status(200).json({ message: "Logout successful!" });
    });
})

router.get('/me', async (req, res) => {
    if (req.session.userId) {
        const user = await prisma.users.findUnique({
            where: { id: req.session.userId },
            select: { username: true }
        });
        if (!user) return res.status(401).json({ error: "user not logged in" });
        res.status(200).json({ message: "User logged in", user });
    }else{
        res.status(401).json({ error: "User not logged in  " });
    }
})
module.exports = router;
