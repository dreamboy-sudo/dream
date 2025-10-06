-- DropForeignKey
ALTER TABLE "Dream" DROP CONSTRAINT "Dream_userId_fkey";

-- AlterTable
ALTER TABLE "Dream" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Dream" ADD CONSTRAINT "Dream_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
