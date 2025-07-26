/*
  Warnings:

  - You are about to drop the column `title` on the `Task` table. All the data in the column will be lost.
  - Added the required column `name` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_routineId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "title",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "validated" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "routineId" DROP NOT NULL,
ALTER COLUMN "startTime" DROP NOT NULL,
ALTER COLUMN "endTime" DROP NOT NULL,
ALTER COLUMN "requiresProof" SET DEFAULT false;

-- AlterTable
ALTER TABLE "TaskCompletion" ADD COLUMN     "emergencyJustification" TEXT,
ADD COLUMN     "proofSubmitted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "proofText" TEXT,
ADD COLUMN     "proofUrl" TEXT,
ADD COLUMN     "usedEmergencyMode" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
