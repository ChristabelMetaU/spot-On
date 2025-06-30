/*
  Warnings:

  - Added the required column `type` to the `spots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "spots" ADD COLUMN     "type" TEXT NOT NULL;
