/*
  Warnings:

  - You are about to drop the column `spot_id` on the `reports` table. All the data in the column will be lost.
  - Added the required column `spot_name` to the `reports` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_spot_id_fkey";

-- AlterTable
ALTER TABLE "reports" DROP COLUMN "spot_id",
ADD COLUMN     "spot_name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_spot_name_fkey" FOREIGN KEY ("spot_name") REFERENCES "spots"("lotName") ON DELETE RESTRICT ON UPDATE CASCADE;
