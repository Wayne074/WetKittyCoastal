import { eq, and, desc, asc, gte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  wishlistItems,
  productReviews,
  loyaltyPoints,
  loyaltyTransactions,
  beachRallyEvents,
  eventRsvps,
  communityGallery,
  communityGalleryLikes,
  emailSubscribers,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Wishlist queries
export async function addToWishlist(
  userId: number,
  productHandle: string,
  productTitle?: string,
  productImage?: string,
  productPrice?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(wishlistItems).values({
    userId,
    productHandle,
    productTitle,
    productImage,
    productPrice,
  });
}

export async function removeFromWishlist(userId: number, productHandle: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(wishlistItems)
    .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productHandle, productHandle)));
}

export async function getUserWishlist(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(wishlistItems).where(eq(wishlistItems.userId, userId)).orderBy(desc(wishlistItems.createdAt));
}

export async function isInWishlist(userId: number, productHandle: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(wishlistItems)
    .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productHandle, productHandle)))
    .limit(1);

  return result.length > 0;
}

// Review queries
export async function createReview(
  userId: number,
  productHandle: string,
  rating: number,
  title?: string,
  comment?: string,
  photoUrls?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(productReviews).values({
    userId,
    productHandle,
    rating,
    title,
    comment,
    photoUrls,
    status: "pending",
  });

  return result;
}

export async function getProductReviews(productHandle: string, limit = 10, offset = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(productReviews)
    .where(and(eq(productReviews.productHandle, productHandle), eq(productReviews.status, "approved")))
    .orderBy(desc(productReviews.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getProductRating(productHandle: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const reviews = await db
    .select()
    .from(productReviews)
    .where(and(eq(productReviews.productHandle, productHandle), eq(productReviews.status, "approved")));

  if (reviews.length === 0) return { average: 0, count: 0 };

  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return { average: sum / reviews.length, count: reviews.length };
}

// Loyalty queries
export async function getOrCreateLoyaltyAccount(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db.select().from(loyaltyPoints).where(eq(loyaltyPoints.userId, userId)).limit(1);

  if (existing.length > 0) return existing[0];

  const result = await db.insert(loyaltyPoints).values({ userId, balance: 0, tier: "bronze" });
  return { userId, balance: 0, tier: "bronze", id: result[0].insertId };
}

export async function addLoyaltyPoints(userId: number, amount: number, type: string, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Update balance
  const account = await getOrCreateLoyaltyAccount(userId);
  const newBalance = account.balance + amount;

  await db
    .update(loyaltyPoints)
    .set({ balance: newBalance })
    .where(eq(loyaltyPoints.userId, userId));

  // Log transaction
  await db.insert(loyaltyTransactions).values({
    userId,
    type: type as any,
    amount,
    description,
  });
}

export async function getLoyaltyAccount(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(loyaltyPoints).where(eq(loyaltyPoints.userId, userId)).limit(1);
}

export async function getLoyaltyTransactions(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(loyaltyTransactions)
    .where(eq(loyaltyTransactions.userId, userId))
    .orderBy(desc(loyaltyTransactions.createdAt))
    .limit(limit);
}

// Event queries
export async function getUpcomingEvents(limit = 20) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(beachRallyEvents)
    .where(gte(beachRallyEvents.eventDate, new Date()))
    .orderBy(asc(beachRallyEvents.eventDate))
    .limit(limit);
}

export async function getEventById(eventId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(beachRallyEvents).where(eq(beachRallyEvents.id, eventId)).limit(1);
}

export async function rsvpToEvent(userId: number, eventId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(eventRsvps)
    .where(and(eq(eventRsvps.userId, userId), eq(eventRsvps.eventId, eventId)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(eventRsvps)
      .set({ status: status as any })
      .where(and(eq(eventRsvps.userId, userId), eq(eventRsvps.eventId, eventId)));
  } else {
    await db.insert(eventRsvps).values({ userId, eventId, status: status as any });
  }
}

export async function getEventRsvps(eventId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(eventRsvps).where(eq(eventRsvps.eventId, eventId));
}

// Community Gallery queries
export async function uploadCommunityPhoto(userId: number, photoUrl: string, caption?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(communityGallery).values({ userId, photoUrl, caption, status: "pending" });
}

export async function getApprovedCommunityPhotos(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(communityGallery)
    .where(eq(communityGallery.status, "approved"))
    .orderBy(desc(communityGallery.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function likePhoto(userId: number, photoId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(communityGalleryLikes)
    .where(and(eq(communityGalleryLikes.userId, userId), eq(communityGalleryLikes.photoId, photoId)))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(communityGalleryLikes).values({ userId, photoId });
    await db
      .update(communityGallery)
      .set({ likeCount: (await db.select().from(communityGallery).where(eq(communityGallery.id, photoId)))[0]?.likeCount || 0 + 1 })
      .where(eq(communityGallery.id, photoId));
  }
}

export async function unlikePhoto(userId: number, photoId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(communityGalleryLikes)
    .where(and(eq(communityGalleryLikes.userId, userId), eq(communityGalleryLikes.photoId, photoId)));
}

// Email subscriber queries
export async function subscribeEmail(email: string, source?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db.select().from(emailSubscribers).where(eq(emailSubscribers.email, email)).limit(1);

  if (existing.length > 0) {
    await db.update(emailSubscribers).set({ isSubscribed: true }).where(eq(emailSubscribers.email, email));
  } else {
    await db.insert(emailSubscribers).values({ email, source, isSubscribed: true });
  }
}

export async function unsubscribeEmail(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(emailSubscribers).set({ isSubscribed: false }).where(eq(emailSubscribers.email, email));
}

export async function getEmailSubscribers(isSubscribed = true) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(emailSubscribers).where(eq(emailSubscribers.isSubscribed, isSubscribed));
}
