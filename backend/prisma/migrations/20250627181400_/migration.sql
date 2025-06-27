/*
  Warnings:

  - You are about to drop the column `coord_lat` on the `spots` table. All the data in the column will be lost.
  - You are about to drop the column `coord_lng` on the `spots` table. All the data in the column will be lost.
  - You are about to drop the column `lot_name` on the `spots` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lotName]` on the table `spots` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `coordLat` to the `spots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coordLong` to the `spots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lotName` to the `spots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `spots` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "spots_lot_name_key";

-- AlterTable
ALTER TABLE "spots" DROP COLUMN "coord_lat",
DROP COLUMN "coord_lng",
DROP COLUMN "lot_name",
ADD COLUMN     "coordLat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "coordLong" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lotName" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "spots_lotName_key" ON "spots"("lotName");
