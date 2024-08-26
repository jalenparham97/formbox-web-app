/*
  Warnings:

  - Added the required column `orgId` to the `integrations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "integrations" ADD COLUMN     "orgId" TEXT NOT NULL;
