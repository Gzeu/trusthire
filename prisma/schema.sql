-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT NOT NULL,
    "recruiterName" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "finalScore" INTEGER NOT NULL,
    "verdict" TEXT NOT NULL,
    "inputData" TEXT NOT NULL,
    "scoreData" TEXT NOT NULL,
    "redFlags" TEXT NOT NULL,
    "vtResults" TEXT,
    "repoScans" TEXT,
    "shareToken" TEXT NOT NULL UNIQUE
);

-- CreateTable
CREATE TABLE "ScamPattern" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "indicators" TEXT NOT NULL,
    "ecosystem" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "anonymous" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "ScamReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reporterIp" TEXT NOT NULL,
    "recruiterName" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "evidence" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "resolvedAt" DATETIME,
    "resolvedBy" TEXT
);

-- CreateTable
CREATE TABLE "Blacklist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "reportCount" INTEGER NOT NULL DEFAULT 1
);

-- CreateIndex
CREATE INDEX "Assessment_sessionId" ON "Assessment"("sessionId");

-- CreateIndex
CREATE INDEX "Assessment_shareToken" ON "Assessment"("shareToken");

-- CreateIndex
CREATE INDEX "ScamReport_status" ON "ScamReport"("status");

-- CreateIndex
CREATE INDEX "Blacklist_type_value" ON "Blacklist"("type", "value");
