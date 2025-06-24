let router = require('express').Router();
let validateEmail = require('../utils/validateEmail')
const bcrypt = require("bcryptjs");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        if (!username || !password || !email) {
            return res.status(400).json({ error: "Username and password are required." });
        }
        const result = await validateEmail(email);
        if (!result.valid) {
            return res.status(400).json({ error: "Invalid email address." });
        }else if(!result.isSchoolEmail){
            return res.status(400).json({ error: "Email must be a valid school email" })
        }
        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long." });
        }
        const newUser = await prisma.users.create({
            data: { username, password: hashedPassword, email, role}
        });
       req.session.id = newUser.id;
       res.status(201).json({ token, message: "User created successfully!", user:{id:newUser.id, username:newUser.username, email: newUser.email} });
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
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: "Invalid password" });

        }

       req.session.id = user.id;
        res.status(200).json({ token, message: "Login successful!", user:{id:user.id, username:user.username, email: user.email} });
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
module.exports = router;
