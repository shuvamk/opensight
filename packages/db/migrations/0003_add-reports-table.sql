CREATE TABLE IF NOT EXISTS "analysis_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"domain" varchar(255) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"result" jsonb,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(32) NOT NULL,
	"email" varchar(255) NOT NULL,
	"domain" varchar(255) NOT NULL,
	"brand_id" uuid,
	"user_id" uuid,
	"title" varchar(255) NOT NULL,
	"report_type" varchar(50) DEFAULT 'analysis' NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"data" jsonb,
	"summary" text,
	"error_message" text,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"completed_at" timestamp with time zone,
	CONSTRAINT "reports_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "prompt_results" ALTER COLUMN "citation_urls" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "prompts" ALTER COLUMN "tags" SET DEFAULT '{}';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reports" ADD CONSTRAINT "reports_brand_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "analysis_requests_email_idx" ON "analysis_requests" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "analysis_requests_status_idx" ON "analysis_requests" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "reports_slug_idx" ON "reports" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reports_email_idx" ON "reports" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reports_status_idx" ON "reports" USING btree ("status");