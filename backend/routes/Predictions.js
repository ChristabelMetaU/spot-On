/** @format */

const predictionRouter = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

predictionRouter.get("/", async (req, res) => {});

module.exports = predictionRouter;
