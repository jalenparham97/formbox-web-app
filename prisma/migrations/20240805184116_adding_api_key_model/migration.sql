-- CreateTable
CREATE TABLE "apiKeys" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "keyId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apiKeys_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "apiKeys" ADD CONSTRAINT "apiKeys_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
