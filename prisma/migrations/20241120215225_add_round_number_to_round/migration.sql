/*
  Warnings:

  - Added the required column `roundNumber` to the `Round` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Round" ADD COLUMN     "roundNumber" INTEGER NOT NULL;
