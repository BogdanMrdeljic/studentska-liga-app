/*
  Warnings:

  - You are about to drop the column `assists` on the `PlayerStat` table. All the data in the column will be lost.
  - You are about to drop the column `blocks` on the `PlayerStat` table. All the data in the column will be lost.
  - You are about to drop the column `rebounds` on the `PlayerStat` table. All the data in the column will be lost.
  - You are about to drop the column `steals` on the `PlayerStat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlayerStat" DROP COLUMN "assists",
DROP COLUMN "blocks",
DROP COLUMN "rebounds",
DROP COLUMN "steals",
ADD COLUMN     "fouls" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "threePointers" INTEGER NOT NULL DEFAULT 0;
