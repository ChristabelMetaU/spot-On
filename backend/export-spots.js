/** @format */

// export-spots.js
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function exportSpots() {
  try {
    // Fetch all spots from the database
    const spots = await prisma.spots.findMany(); // replace 'spot' with your actual model name

    // Write spots data to a JSON file
    fs.writeFileSync("./data/spots-seed.json", JSON.stringify(spots, null, 2));
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

exportSpots();
