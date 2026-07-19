/*
  Warnings:

  - You are about to drop the column `goals` on the `PlayerStat` table. All the data in the column will be lost.
  - You are about to drop the column `redCards` on the `PlayerStat` table. All the data in the column will be lost.
  - You are about to drop the column `yellowCards` on the `PlayerStat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlayerStat" DROP COLUMN "goals",
DROP COLUMN "redCards",
DROP COLUMN "yellowCards",
ADD COLUMN     "fouls" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rebounds" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "colorPrimary" SET DEFAULT '#dc2626';
