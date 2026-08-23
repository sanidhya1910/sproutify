-- Phase 2: add Event.type, and the ContactMessage table behind the public
-- contact form.

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('CLEANUP', 'PLANTATION', 'EWASTE', 'RESTORATION', 'COMMUNITY', 'OTHER');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('NEW', 'READ', 'ARCHIVED');

-- AlterTable
ALTER TABLE "events" ADD COLUMN "type" "EventType" NOT NULL DEFAULT 'OTHER';

-- Backfill existing rows from the title. This mirrors `inferType` in
-- lib/event-types.ts EXACTLY, including branch order — the UI used this same
-- heuristic on /events while the column didn't exist, so existing events keep
-- the category users were already seeing. Order matters: 'recycling drive'
-- must land in EWASTE (checked before COMMUNITY), not COMMUNITY.
UPDATE "events" SET "type" = CASE
  WHEN "title" ~* '(clean|beach|shore|coast|litter)'          THEN 'CLEANUP'::"EventType"
  WHEN "title" ~* '(plant|tree|sapling|forest|reforest)'       THEN 'PLANTATION'::"EventType"
  WHEN "title" ~* '(e-?waste|electronic|recycl)'               THEN 'EWASTE'::"EventType"
  WHEN "title" ~* '(restor|habitat|river|wetland|reef)'        THEN 'RESTORATION'::"EventType"
  WHEN "title" ~* '(community|garden|workshop|drive)'          THEN 'COMMUNITY'::"EventType"
  ELSE 'OTHER'::"EventType"
END;

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "status" "ContactStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contact_messages_status_createdAt_idx" ON "contact_messages"("status", "createdAt");
