const spotsRouter = require("express").Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

spotsRouter.get("/spots", async (req, res) => {
    const spots = await prisma.spots.findMany();
    if (!spots) {
        return res.status(404).json({ message: "No spots found" });
    }
    res.json(spots);

});

module.exports = spotsRouter;
