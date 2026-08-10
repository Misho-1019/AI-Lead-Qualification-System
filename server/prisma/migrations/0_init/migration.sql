-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "role" TEXT,
    "website" TEXT,
    "industry" TEXT,
    "company_size" TEXT,
    "budget_range" TEXT,
    "source" TEXT,
    "pain_point" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadAnalysis" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "priority" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "qualification_reason" TEXT NOT NULL,
    "outreach_email_subject" TEXT NOT NULL,
    "outreach_email_body" TEXT NOT NULL,
    "recommended_next_step" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeadAnalysis_lead_id_key" ON "LeadAnalysis"("lead_id");

-- AddForeignKey
ALTER TABLE "LeadAnalysis" ADD CONSTRAINT "LeadAnalysis_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
