/** @format */

// seed.js
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seed() {
  try {
    // Read spots data from JSON file
    const spotsData = JSON.parse(
      fs.readFileSync("./data/spots-seed.json", "utf8")
    );

    // Optional: clear existing spots (depends on your app logic)
    await prisma.spots.deleteMany();

    // Insert spots from JSON
    for (const spot of spotsData) {
      await prisma.spots.create({
        data: spot,
      });
    }
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
