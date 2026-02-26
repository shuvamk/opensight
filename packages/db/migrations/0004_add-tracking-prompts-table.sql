CREATE TABLE IF NOT EXISTS "tracking_prompts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"domain" varchar(255) NOT NULL,
	"discovery" jsonb DEFAULT '[]' NOT NULL,
	"comparison" jsonb DEFAULT '[]' NOT NULL,
	"recommendation" jsonb DEFAULT '[]' NOT NULL,
	"buying_decision" jsonb DEFAULT '[]' NOT NULL,
	"problem_solution" jsonb DEFAULT '[]' NOT NULL,
	"review_sentiment" jsonb DEFAULT '[]' NOT NULL,
	"feature_deep_dive" jsonb DEFAULT '[]' NOT NULL,
	"use_case_specific" jsonb DEFAULT '[]' NOT NULL,
	"industry_landscape" jsonb DEFAULT '[]' NOT NULL,
	"reputation_risks" jsonb DEFAULT '[]' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tracking_prompts" ADD CONSTRAINT "tracking_prompts_report_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tracking_prompts_report_id_idx" ON "tracking_prompts" USING btree ("report_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tracking_prompts_domain_idx" ON "tracking_prompts" USING btree ("domain");