-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_submissionId_fkey";

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
