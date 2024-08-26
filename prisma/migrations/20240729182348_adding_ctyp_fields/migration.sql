-- AlterTable
ALTER TABLE "forms" ADD COLUMN     "tpBackgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
ADD COLUMN     "tpButtonBorderStyle" TEXT NOT NULL DEFAULT 'rounded',
ADD COLUMN     "tpButtonColor" TEXT NOT NULL DEFAULT '#030712',
ADD COLUMN     "tpButtonText" TEXT NOT NULL DEFAULT 'Submit',
ADD COLUMN     "tpButtonUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "tpHeader" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "tpInputBorderStyle" TEXT NOT NULL DEFAULT 'rounded',
ADD COLUMN     "tpMessage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "tpTextColor" TEXT NOT NULL DEFAULT '#000000',
ADD COLUMN     "useCustomThankYouPage" BOOLEAN NOT NULL DEFAULT false;
