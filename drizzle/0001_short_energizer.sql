CREATE TABLE `admin_emails` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`added_by` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_emails_email_unique` ON `admin_emails` (`email`);--> statement-breakpoint
CREATE TABLE `homepage_stats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text NOT NULL,
	`value` text NOT NULL,
	`icon` text NOT NULL,
	`order_index` integer DEFAULT 0,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `traffic_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`path` text,
	`user_agent` text,
	`ip_hash` text,
	`country` text,
	`city` text,
	`device` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
DROP INDEX "admin_emails_email_unique";--> statement-breakpoint
DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `properties` ALTER COLUMN "bedrooms" TO "bedrooms" integer NOT NULL DEFAULT 0;--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `properties` ALTER COLUMN "bathrooms" TO "bathrooms" integer NOT NULL DEFAULT 0;