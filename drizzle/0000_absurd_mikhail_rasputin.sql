CREATE TABLE `analysis_reservations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`visitor_hash` text NOT NULL,
	`day` text NOT NULL,
	`hour` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `usage_day` ON `analysis_reservations` (`day`);--> statement-breakpoint
CREATE INDEX `usage_visitor_hour` ON `analysis_reservations` (`visitor_hash`,`hour`);--> statement-breakpoint
CREATE INDEX `usage_expiry` ON `analysis_reservations` (`created_at`);