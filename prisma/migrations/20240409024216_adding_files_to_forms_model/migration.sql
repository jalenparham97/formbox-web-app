/*
  Warnings:

  - Added the required column `formId` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "files" ADD COLUMN     "formId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
