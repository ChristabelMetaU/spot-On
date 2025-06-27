/*
  Warnings:

  - You are about to drop the column `coordLong` on the `spots` table. All the data in the column will be lost.
  - Added the required column `coordLng` to the `spots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "spots" DROP COLUMN "coordLong",
ADD COLUMN     "coordLng" DOUBLE PRECISION NOT NULL;
