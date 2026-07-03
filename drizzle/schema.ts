import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Wishlist — users can save products for later
 */
export const wishlistItems = mysqlTable(
  "wishlist_items",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productHandle: varchar("productHandle", { length: 255 }).notNull(),
    productTitle: text("productTitle"),
    productImage: text("productImage"),
    productPrice: varchar("productPrice", { length: 50 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("wishlist_userId_idx").on(table.userId),
    userProductIdx: index("wishlist_user_product_idx").on(table.userId, table.productHandle),
  })
);

export type WishlistItem = typeof wishlistItems.$inferSelect;
export type InsertWishlistItem = typeof wishlistItems.$inferInsert;

/**
 * Product Reviews — customer reviews with ratings and photos
 */
export const productReviews = mysqlTable(
  "product_reviews",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productHandle: varchar("productHandle", { length: 255 }).notNull(),
    rating: int("rating").notNull(), // 1-5 stars
    title: varchar("title", { length: 255 }),
    comment: text("comment"),
    photoUrls: text("photoUrls"), // JSON array of URLs
    isVerifiedPurchase: boolean("isVerifiedPurchase").default(false),
    helpfulCount: int("helpfulCount").default(0),
    unhelpfulCount: int("unhelpfulCount").default(0),
    status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("review_userId_idx").on(table.userId),
    productIdx: index("review_productHandle_idx").on(table.productHandle),
  })
);

export type ProductReview = typeof productReviews.$inferSelect;
export type InsertProductReview = typeof productReviews.$inferInsert;

/**
 * Loyalty Points — track user points and redemptions
 */
export const loyaltyPoints = mysqlTable(
  "loyalty_points",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    balance: int("balance").default(0).notNull(),
    tier: mysqlEnum("tier", ["bronze", "silver", "gold"]).default("bronze"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("loyalty_userId_idx").on(table.userId),
  })
);

export type LoyaltyPoints = typeof loyaltyPoints.$inferSelect;
export type InsertLoyaltyPoints = typeof loyaltyPoints.$inferInsert;

/**
 * Loyalty Transactions — log of points earned/redeemed
 */
export const loyaltyTransactions = mysqlTable(
  "loyalty_transactions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: mysqlEnum("type", ["purchase", "review", "community", "redemption"]).notNull(),
    amount: int("amount").notNull(),
    description: text("description"),
    orderId: varchar("orderId", { length: 255 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("transaction_userId_idx").on(table.userId),
  })
);

export type LoyaltyTransaction = typeof loyaltyTransactions.$inferSelect;
export type InsertLoyaltyTransaction = typeof loyaltyTransactions.$inferInsert;

/**
 * Beach Rally Events — calendar of upcoming events
 */
export const beachRallyEvents = mysqlTable(
  "beach_rally_events",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    location: varchar("location", { length: 255 }).notNull(),
    latitude: decimal("latitude", { precision: 10, scale: 8 }),
    longitude: decimal("longitude", { precision: 11, scale: 8 }),
    eventDate: timestamp("eventDate").notNull(),
    eventEndDate: timestamp("eventEndDate"),
    imageUrl: text("imageUrl"),
    rsvpCount: int("rsvpCount").default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    eventDateIdx: index("event_eventDate_idx").on(table.eventDate),
  })
);

export type BeachRallyEvent = typeof beachRallyEvents.$inferSelect;
export type InsertBeachRallyEvent = typeof beachRallyEvents.$inferInsert;

/**
 * Event RSVPs — track user interest in events
 */
export const eventRsvps = mysqlTable(
  "event_rsvps",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    eventId: int("eventId")
      .notNull()
      .references(() => beachRallyEvents.id, { onDelete: "cascade" }),
    status: mysqlEnum("status", ["interested", "attending", "not_attending"]).default("interested"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userEventIdx: index("rsvp_user_event_idx").on(table.userId, table.eventId),
  })
);

export type EventRsvp = typeof eventRsvps.$inferSelect;
export type InsertEventRsvp = typeof eventRsvps.$inferInsert;

/**
 * Community Gallery — user-submitted lifestyle photos
 */
export const communityGallery = mysqlTable(
  "community_gallery",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    photoUrl: text("photoUrl").notNull(),
    caption: text("caption"),
    likeCount: int("likeCount").default(0),
    status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("gallery_userId_idx").on(table.userId),
    statusIdx: index("gallery_status_idx").on(table.status),
  })
);

export type CommunityGalleryPhoto = typeof communityGallery.$inferSelect;
export type InsertCommunityGalleryPhoto = typeof communityGallery.$inferInsert;

/**
 * Community Gallery Likes — track which users liked which photos
 */
export const communityGalleryLikes = mysqlTable(
  "community_gallery_likes",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    photoId: int("photoId")
      .notNull()
      .references(() => communityGallery.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userPhotoIdx: index("like_user_photo_idx").on(table.userId, table.photoId),
  })
);

export type CommunityGalleryLike = typeof communityGalleryLikes.$inferSelect;
export type InsertCommunityGalleryLike = typeof communityGalleryLikes.$inferInsert;

/**
 * Email Subscribers — track newsletter signups
 */
export const emailSubscribers = mysqlTable(
  "email_subscribers",
  {
    id: int("id").autoincrement().primaryKey(),
    email: varchar("email", { length: 320 }).notNull().unique(),
    source: varchar("source", { length: 50 }), // "homepage", "crew", etc.
    isSubscribed: boolean("isSubscribed").default(true),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("subscriber_email_idx").on(table.email),
  })
);

export type EmailSubscriber = typeof emailSubscribers.$inferSelect;
export type InsertEmailSubscriber = typeof emailSubscribers.$inferInsert;
