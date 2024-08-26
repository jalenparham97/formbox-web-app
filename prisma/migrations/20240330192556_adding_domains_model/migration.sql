-- CreateEnum
CREATE TYPE "DomainStatus" AS ENUM ('not_started', 'pending', 'verified', 'failure');

-- CreateTable
CREATE TABLE "domains" (
    "id" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "status" "DomainStatus" NOT NULL,
    "records" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "domains_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "domains_name_key" ON "domains"("name");

-- AddForeignKey
ALTER TABLE "domains" ADD CONSTRAINT "domains_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
