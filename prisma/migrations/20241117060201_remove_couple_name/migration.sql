/*
  Warnings:

  - You are about to drop the column `name` on the `Couple` table. All the data in the column will be lost.
  - Made the column `player1Id` on table `Couple` required. This step will fail if there are existing NULL values in that column.
  - Made the column `player2Id` on table `Couple` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Couple" DROP CONSTRAINT "Couple_player1Id_fkey";

-- DropForeignKey
ALTER TABLE "Couple" DROP CONSTRAINT "Couple_player2Id_fkey";

-- AlterTable
ALTER TABLE "Couple" DROP COLUMN "name",
ALTER COLUMN "player1Id" SET NOT NULL,
ALTER COLUMN "player2Id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Couple" ADD CONSTRAINT "Couple_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Couple" ADD CONSTRAINT "Couple_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
