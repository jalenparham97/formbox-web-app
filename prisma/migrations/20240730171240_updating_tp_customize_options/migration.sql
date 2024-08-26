/*
  Warnings:

  - You are about to drop the column `tpButtonBorderStyle` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `tpInputBorderStyle` on the `forms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "forms" DROP COLUMN "tpButtonBorderStyle",
DROP COLUMN "tpInputBorderStyle",
ADD COLUMN     "tpButtonBackgroundColor" TEXT NOT NULL DEFAULT '#f3f4f6';
