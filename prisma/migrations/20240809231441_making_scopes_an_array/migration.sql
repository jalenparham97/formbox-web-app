/*
  Warnings:

  - You are about to drop the column `scope` on the `apiKeys` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "apiKeys" DROP COLUMN "scope",
ADD COLUMN     "scopes" TEXT[];
