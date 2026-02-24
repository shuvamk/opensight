CREATE TABLE IF NOT EXISTS "admin_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_user_id" uuid NOT NULL,
	"token_hash" varchar(255) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'admin' NOT NULL,
	"is_active" boolean DEFAULT true,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "prompt_results" ALTER COLUMN "citation_urls" SET DEFAULT '{}'::text[];--> statement-breakpoint
ALTER TABLE "prompts" ALTER COLUMN "tags" SET DEFAULT '{}'::text[];--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_admin_user_id_fk" FOREIGN KEY ("admin_user_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "admin_sessions_admin_user_id_idx" ON "admin_sessions" USING btree ("admin_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "admin_sessions_token_hash_idx" ON "admin_sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "admin_users_email_idx" ON "admin_users" USING btree ("email");