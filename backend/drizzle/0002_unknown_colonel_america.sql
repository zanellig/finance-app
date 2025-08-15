CREATE TABLE `income` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36),
	`name` varchar(255),
	`amount` decimal(2) NOT NULL DEFAULT '0.00',
	`frequency` enum('monthly','biweekly','quarterly','annually') NOT NULL,
	`is_hourly` boolean DEFAULT false,
	`start_date` timestamp NOT NULL,
	`end_date` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `income_id` PRIMARY KEY(`id`),
	CONSTRAINT `income_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
ALTER TABLE `accounts` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `credit_cards` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `entities` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `loans` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `credit_card_transactions` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `accounts` ADD `account_number` varchar(50);--> statement-breakpoint
ALTER TABLE `accounts` ADD `currency` enum('ARS','USD') DEFAULT 'ARS';--> statement-breakpoint
ALTER TABLE `accounts` ADD `opened_at` timestamp;--> statement-breakpoint
ALTER TABLE `loans` ADD `consolidated_at` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `loans` ADD `payment_frequency` enum('monthly','biweekly','quarterly','annually') DEFAULT 'monthly' NOT NULL;--> statement-breakpoint
ALTER TABLE `loans` ADD `collateral` varchar(255);--> statement-breakpoint
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_account_number_unique` UNIQUE(`account_number`);--> statement-breakpoint
ALTER TABLE `income` ADD CONSTRAINT `income_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE cascade;