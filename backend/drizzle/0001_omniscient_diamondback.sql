ALTER TABLE `accounts` DROP FOREIGN KEY `accounts_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `loans` DROP FOREIGN KEY `loans_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `accounts` DROP COLUMN `user_id`;--> statement-breakpoint
ALTER TABLE `loans` DROP COLUMN `user_id`;