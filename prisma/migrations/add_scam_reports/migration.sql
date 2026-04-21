-- Migration: Add ScamReport model for community-verified scam database
-- Run: npx prisma migrate dev --name add_scam_reports

CREATE TABLE IF NOT EXISTS "ScamReport" (
    "id"            TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "slug"          TEXT NOT NULL UNIQUE,
    "recruiterName" TEXT NOT NULL,
    "recruiterUrl"  TEXT,
    "platform"      TEXT NOT NULL DEFAULT 'unknown',
    "description"   TEXT NOT NULL,
    "evidence"      TEXT,
    "upvotes"       INTEGER NOT NULL DEFAULT 0,
    "status"        TEXT NOT NULL DEFAULT 'pending',
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "ScamReport_status_idx" ON "ScamReport"("status");
CREATE INDEX IF NOT EXISTS "ScamReport_upvotes_idx" ON "ScamReport"("upvotes" DESC);
