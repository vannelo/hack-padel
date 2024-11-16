-- AlterTable
ALTER TABLE "Couple" ADD COLUMN     "player1Id" TEXT,
ADD COLUMN     "player2Id" TEXT;

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "age" INTEGER,
    "phone" TEXT,
    "gender" TEXT NOT NULL,
    "level" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_email_key" ON "Player"("email");

-- AddForeignKey
ALTER TABLE "Couple" ADD CONSTRAINT "Couple_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Couple" ADD CONSTRAINT "Couple_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
