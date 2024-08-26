/*
  Warnings:

  - You are about to drop the column `hashedKey` on the `apiKeys` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[key]` on the table `apiKeys` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `apiKeys` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "apiKeys_hashedKey_key";

-- AlterTable
ALTER TABLE "apiKeys" DROP COLUMN "hashedKey",
ADD COLUMN     "expires" TIMESTAMP(3),
ADD COLUMN     "key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "apiKeys_key_key" ON "apiKeys"("key");
