-- AlterTable
ALTER TABLE "integrations" ADD COLUMN     "webhookUrl" TEXT DEFAULT '',
ALTER COLUMN "connectionId" DROP NOT NULL,
ALTER COLUMN "connectionId" SET DEFAULT '';
