-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Varonil', 'Femenil');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('Quinta', 'Cuarta', 'Tercera', 'Segunda', 'Primera');

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "age" INTEGER,
    "phone" TEXT,
    "gender" "Gender" NOT NULL,
    "level" "Level" NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);
