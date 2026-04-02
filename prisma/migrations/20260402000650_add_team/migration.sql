/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `barber` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "barber" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "barber_userId_key" ON "barber"("userId");

-- AddForeignKey
ALTER TABLE "barber" ADD CONSTRAINT "barber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
