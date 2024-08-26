/*
  Warnings:

  - You are about to drop the column `key` on the `apiKeys` table. All the data in the column will be lost.
  - You are about to drop the column `scopes` on the `apiKeys` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hashedKey]` on the table `apiKeys` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hashedKey` to the `apiKeys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scope` to the `apiKeys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "apiKeys" DROP COLUMN "key",
DROP COLUMN "scopes",
ADD COLUMN     "hashedKey" TEXT NOT NULL,
ADD COLUMN     "scope" TEXT NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "apiKeys_hashedKey_key" ON "apiKeys"("hashedKey");
