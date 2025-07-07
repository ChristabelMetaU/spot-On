/*
  Warnings:

  - You are about to drop the column `status` on the `reports` table. All the data in the column will be lost.
  - Added the required column `description` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `reports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reports" DROP COLUMN "status",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
