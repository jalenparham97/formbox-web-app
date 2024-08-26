/*
  Warnings:

  - The required column `id` was added to the `verificationTokens` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updatedAt` to the `verificationTokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "verificationTokens" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "verificationTokens_pkey" PRIMARY KEY ("id");
