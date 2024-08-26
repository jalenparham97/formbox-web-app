/*
  Warnings:

  - You are about to drop the column `keyId` on the `apiKeys` table. All the data in the column will be lost.
  - Added the required column `partialKey` to the `apiKeys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "apiKeys" DROP COLUMN "keyId",
ADD COLUMN     "partialKey" TEXT NOT NULL,
ADD COLUMN     "scopes" TEXT[];
