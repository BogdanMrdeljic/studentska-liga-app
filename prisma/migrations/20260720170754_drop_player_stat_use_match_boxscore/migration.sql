/*
  Warnings:

  - You are about to drop the `PlayerStat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlayerStat" DROP CONSTRAINT "PlayerStat_playerId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerStat" DROP CONSTRAINT "PlayerStat_seasonId_fkey";

-- DropTable
DROP TABLE "PlayerStat";
