-- CreateEnum
CREATE TYPE "RecurrenceType" AS ENUM ('NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateTable
CREATE TABLE "businessHour" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "openTime" TEXT,
    "closeTime" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "barbershopId" TEXT NOT NULL,

    CONSTRAINT "businessHour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blockedSlot" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "recurrence" "RecurrenceType" NOT NULL DEFAULT 'NONE',
    "recurringUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "barberId" TEXT,
    "barbershopId" TEXT NOT NULL,

    CONSTRAINT "blockedSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "businessHour_barbershopId_idx" ON "businessHour"("barbershopId");

-- CreateIndex
CREATE INDEX "blockedSlot_barbershopId_idx" ON "blockedSlot"("barbershopId");

-- CreateIndex
CREATE INDEX "blockedSlot_barberId_idx" ON "blockedSlot"("barberId");

-- AddForeignKey
ALTER TABLE "businessHour" ADD CONSTRAINT "businessHour_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "barbershop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blockedSlot" ADD CONSTRAINT "blockedSlot_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "barber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blockedSlot" ADD CONSTRAINT "blockedSlot_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "barbershop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
