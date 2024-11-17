-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "scoresJson" JSONB;

-- CreateTable
CREATE TABLE "_TournamentWinners" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TournamentWinners_AB_unique" ON "_TournamentWinners"("A", "B");

-- CreateIndex
CREATE INDEX "_TournamentWinners_B_index" ON "_TournamentWinners"("B");

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_currentLeaderId_fkey" FOREIGN KEY ("currentLeaderId") REFERENCES "Couple"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TournamentWinners" ADD CONSTRAINT "_TournamentWinners_A_fkey" FOREIGN KEY ("A") REFERENCES "Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TournamentWinners" ADD CONSTRAINT "_TournamentWinners_B_fkey" FOREIGN KEY ("B") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;
