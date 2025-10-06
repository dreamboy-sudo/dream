/*
  Warnings:

  - Added the required column `environment` to the `Dream` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Environment" AS ENUM ('LOCAL', 'PRODUCTION');

-- AlterTable
ALTER TABLE "Dream" ADD COLUMN     "environment" "Environment" NOT NULL;
