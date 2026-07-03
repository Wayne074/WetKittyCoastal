CREATE TABLE `beach_rally_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`location` varchar(255) NOT NULL,
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`eventDate` timestamp NOT NULL,
	`eventEndDate` timestamp,
	`imageUrl` text,
	`rsvpCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `beach_rally_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `community_gallery` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`photoUrl` text NOT NULL,
	`caption` text,
	`likeCount` int DEFAULT 0,
	`status` enum('pending','approved','rejected') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `community_gallery_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `community_gallery_likes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`photoId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `community_gallery_likes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `email_subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`source` varchar(50),
	`isSubscribed` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_subscribers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `event_rsvps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`eventId` int NOT NULL,
	`status` enum('interested','attending','not_attending') DEFAULT 'interested',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `event_rsvps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `loyalty_points` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`balance` int NOT NULL DEFAULT 0,
	`tier` enum('bronze','silver','gold') DEFAULT 'bronze',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `loyalty_points_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `loyalty_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('purchase','review','community','redemption') NOT NULL,
	`amount` int NOT NULL,
	`description` text,
	`orderId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `loyalty_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productHandle` varchar(255) NOT NULL,
	`rating` int NOT NULL,
	`title` varchar(255),
	`comment` text,
	`photoUrls` text,
	`isVerifiedPurchase` boolean DEFAULT false,
	`helpfulCount` int DEFAULT 0,
	`unhelpfulCount` int DEFAULT 0,
	`status` enum('pending','approved','rejected') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `product_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wishlist_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productHandle` varchar(255) NOT NULL,
	`productTitle` text,
	`productImage` text,
	`productPrice` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wishlist_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `community_gallery` ADD CONSTRAINT `community_gallery_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `community_gallery_likes` ADD CONSTRAINT `community_gallery_likes_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `community_gallery_likes` ADD CONSTRAINT `community_gallery_likes_photoId_community_gallery_id_fk` FOREIGN KEY (`photoId`) REFERENCES `community_gallery`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `event_rsvps` ADD CONSTRAINT `event_rsvps_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `event_rsvps` ADD CONSTRAINT `event_rsvps_eventId_beach_rally_events_id_fk` FOREIGN KEY (`eventId`) REFERENCES `beach_rally_events`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `loyalty_points` ADD CONSTRAINT `loyalty_points_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `loyalty_transactions` ADD CONSTRAINT `loyalty_transactions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_reviews` ADD CONSTRAINT `product_reviews_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wishlist_items` ADD CONSTRAINT `wishlist_items_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `event_eventDate_idx` ON `beach_rally_events` (`eventDate`);--> statement-breakpoint
CREATE INDEX `gallery_userId_idx` ON `community_gallery` (`userId`);--> statement-breakpoint
CREATE INDEX `gallery_status_idx` ON `community_gallery` (`status`);--> statement-breakpoint
CREATE INDEX `like_user_photo_idx` ON `community_gallery_likes` (`userId`,`photoId`);--> statement-breakpoint
CREATE INDEX `subscriber_email_idx` ON `email_subscribers` (`email`);--> statement-breakpoint
CREATE INDEX `rsvp_user_event_idx` ON `event_rsvps` (`userId`,`eventId`);--> statement-breakpoint
CREATE INDEX `loyalty_userId_idx` ON `loyalty_points` (`userId`);--> statement-breakpoint
CREATE INDEX `transaction_userId_idx` ON `loyalty_transactions` (`userId`);--> statement-breakpoint
CREATE INDEX `review_userId_idx` ON `product_reviews` (`userId`);--> statement-breakpoint
CREATE INDEX `review_productHandle_idx` ON `product_reviews` (`productHandle`);--> statement-breakpoint
CREATE INDEX `wishlist_userId_idx` ON `wishlist_items` (`userId`);--> statement-breakpoint
CREATE INDEX `wishlist_user_product_idx` ON `wishlist_items` (`userId`,`productHandle`);