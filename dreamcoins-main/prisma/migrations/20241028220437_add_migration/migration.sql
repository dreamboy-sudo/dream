/*
  Warnings:

  - You are about to drop the column `mediaAssetId` on the `Dream` table. All the data in the column will be lost.
  - You are about to drop the `MediaAsset` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Dream" DROP CONSTRAINT "Dream_mediaAssetId_fkey";

-- AlterTable
ALTER TABLE "Dream" DROP COLUMN "mediaAssetId",
ADD COLUMN     "metadata" JSONB;

-- DropTable
DROP TABLE "MediaAsset";
