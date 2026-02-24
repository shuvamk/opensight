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
CREATE INDEX IF NOT EXISTS "analysis_requests_email_idx" ON "analysis_requests" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "analysis_requests_status_idx" ON "analysis_requests" USING btree ("status");