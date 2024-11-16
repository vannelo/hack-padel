/*
  Warnings:

  - The `level` column on the `Player` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Level" AS ENUM ('Quinta', 'Cuarta', 'Tercera', 'Segunda', 'Primera');

-- DropIndex
DROP INDEX "Player_email_key";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "level",
ADD COLUMN     "level" "Level" NOT NULL DEFAULT 'Quinta';
