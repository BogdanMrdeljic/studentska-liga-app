/*
  Warnings:

  - You are about to drop the column `fouls` on the `PlayerStat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "indexNumber" TEXT;

-- AlterTable
ALTER TABLE "PlayerStat" DROP COLUMN "fouls",
ADD COLUMN     "blocks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "steals" INTEGER NOT NULL DEFAULT 0;
