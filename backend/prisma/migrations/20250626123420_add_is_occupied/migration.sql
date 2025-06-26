/*
  Warnings:

  - You are about to drop the column `type` on the `spots` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Users_username_key";

-- AlterTable
ALTER TABLE "spots" DROP COLUMN "type",
ADD COLUMN     "isOccupied" BOOLEAN NOT NULL DEFAULT false;
