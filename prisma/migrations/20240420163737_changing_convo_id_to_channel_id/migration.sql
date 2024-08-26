/*
  Warnings:

  - You are about to drop the column `slackConversationId` on the `integrations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "integrations" DROP COLUMN "slackConversationId",
ADD COLUMN     "slackChannelId" TEXT DEFAULT '';
