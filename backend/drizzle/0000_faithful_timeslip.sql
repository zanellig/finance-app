CREATE TABLE `accounts` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`entity_id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('savings','checking','interest_bearing') NOT NULL,
	`balance` decimal(2) NOT NULL DEFAULT '0.00',
	`annual_nominal_rate` decimal(2) NOT NULL DEFAULT '0.00',
	`is_salary_account` boolean NOT NULL DEFAULT false,
	`overdraft_limit` decimal(2) NOT NULL DEFAULT '0.00',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `accounts_id_unique` UNIQUE(`id`),
	CONSTRAINT `accounts_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `credit_cards` (
	`id` varchar(36) NOT NULL,
	`entity_id` varchar(36),
	`status` enum('active','inactive','blocked','deleted') DEFAULT 'inactive',
	`name` varchar(36) NOT NULL,
	`description` varchar(255),
	`limit` decimal(2) NOT NULL DEFAULT '0.00',
	`number` varchar(16),
	`expiration` timestamp NOT NULL,
	`closing_day` int DEFAULT 30,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `credit_cards_id` PRIMARY KEY(`id`),
	CONSTRAINT `credit_cards_id_unique` UNIQUE(`id`),
	CONSTRAINT `credit_cards_name_unique` UNIQUE(`name`),
	CONSTRAINT `credit_cards_number_unique` UNIQUE(`number`)
);
--> statement-breakpoint
CREATE TABLE `entities` (
	`id` varchar(36) NOT NULL,
	`status` enum('active','inactive','deleted') DEFAULT 'active',
	`user_id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('bank','wallet','asset_manager') DEFAULT 'bank',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `entities_id` PRIMARY KEY(`id`),
	CONSTRAINT `entities_id_unique` UNIQUE(`id`),
	CONSTRAINT `entities_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `loans` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36),
	`entity_id` varchar(36),
	`name` varchar(255),
	`initial_capital` decimal(2) NOT NULL DEFAULT '0.00',
	`annual_interest_rate` decimal(2) NOT NULL DEFAULT '0.00',
	`installments` int unsigned NOT NULL DEFAULT 1,
	`remaining_installments` int unsigned NOT NULL,
	`total_annual_financed_cost` decimal(2) NOT NULL,
	`amortization_strategy` enum('flat','french','german','american'),
	`currency` enum('ARS','USD') DEFAULT 'ARS',
	`remaining_capital` decimal(2) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `loans_id` PRIMARY KEY(`id`),
	CONSTRAINT `loans_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `credit_card_transactions` (
	`id` varchar(36) NOT NULL,
	`credit_card_id` varchar(36) NOT NULL,
	`status` enum('approved','declined','pending','refunded') DEFAULT 'pending',
	`currency` enum('ARS','USD') DEFAULT 'ARS',
	`amount` decimal(2) NOT NULL DEFAULT '0.00',
	`is_installment` boolean NOT NULL DEFAULT false,
	`installments` int unsigned NOT NULL DEFAULT 1,
	`current_installment` int unsigned NOT NULL DEFAULT 1,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `credit_card_transactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `credit_card_transactions_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36),
	`from_account_id` varchar(36) NOT NULL,
	`to_account_id` varchar(36) NOT NULL,
	`loan_id` varchar(36),
	`type` enum('payment','transfer','loan_payment','cc_payment') NOT NULL,
	`currency` enum('ARS','USD') DEFAULT 'ARS',
	`amount` decimal(2) NOT NULL DEFAULT '0.00',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `transactions_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`status` enum('active','inactive','deleted') DEFAULT 'active',
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_entity_id_entities_id_fk` FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `credit_cards` ADD CONSTRAINT `credit_cards_entity_id_entities_id_fk` FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `entities` ADD CONSTRAINT `entities_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `loans` ADD CONSTRAINT `loans_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `loans` ADD CONSTRAINT `loans_entity_id_entities_id_fk` FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `credit_card_transactions` ADD CONSTRAINT `credit_card_transactions_credit_card_id_credit_cards_id_fk` FOREIGN KEY (`credit_card_id`) REFERENCES `credit_cards`(`id`) ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_from_account_id_accounts_id_fk` FOREIGN KEY (`from_account_id`) REFERENCES `accounts`(`id`) ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_to_account_id_accounts_id_fk` FOREIGN KEY (`to_account_id`) REFERENCES `accounts`(`id`) ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_loan_id_loans_id_fk` FOREIGN KEY (`loan_id`) REFERENCES `loans`(`id`) ON DELETE no action ON UPDATE cascade;