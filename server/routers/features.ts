import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import * as db from "../db";

export const featuresRouter = router({
  wishlist: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserWishlist(ctx.user.id);
    }),
    add: protectedProcedure
      .input(z.object({
        productHandle: z.string(),
        productTitle: z.string().optional(),
        productImage: z.string().optional(),
        productPrice: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.addToWishlist(ctx.user.id, input.productHandle, input.productTitle, input.productImage, input.productPrice);
        return { success: true };
      }),
    remove: protectedProcedure
      .input(z.object({ productHandle: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await db.removeFromWishlist(ctx.user.id, input.productHandle);
        return { success: true };
      }),
    check: protectedProcedure
      .input(z.object({ productHandle: z.string() }))
      .query(async ({ ctx, input }) => {
        return { inWishlist: await db.isInWishlist(ctx.user.id, input.productHandle) };
      }),
  }),

  reviews: router({
    list: publicProcedure
      .input(z.object({ productHandle: z.string(), limit: z.number().optional(), offset: z.number().optional() }))
      .query(async ({ input }) => {
        return db.getProductReviews(input.productHandle, input.limit || 10, input.offset || 0);
      }),
    rating: publicProcedure
      .input(z.object({ productHandle: z.string() }))
      .query(async ({ input }) => {
        return db.getProductRating(input.productHandle);
      }),
    create: protectedProcedure
      .input(z.object({
        productHandle: z.string(),
        rating: z.number().min(1).max(5),
        title: z.string().optional(),
        comment: z.string().optional(),
        photoUrls: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createReview(ctx.user.id, input.productHandle, input.rating, input.title, input.comment, input.photoUrls);
        return { success: true };
      }),
  }),

  loyalty: router({
    account: protectedProcedure.query(async ({ ctx }) => {
      return db.getOrCreateLoyaltyAccount(ctx.user.id);
    }),
    transactions: protectedProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ ctx, input }) => {
        return db.getLoyaltyTransactions(ctx.user.id, input?.limit || 20);
      }),
  }),

  events: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return db.getUpcomingEvents(input?.limit || 20);
      }),
    rsvp: protectedProcedure
      .input(z.object({ eventId: z.number(), status: z.string().default("interested") }))
      .mutation(async ({ ctx, input }) => {
        await db.rsvpToEvent(ctx.user.id, input.eventId, input.status);
        return { success: true };
      }),
  }),

  community: router({
    photos: publicProcedure
      .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return db.getApprovedCommunityPhotos(input?.limit || 20, input?.offset || 0);
      }),
    submit: protectedProcedure
      .input(z.object({ photoUrl: z.string(), caption: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        await db.uploadCommunityPhoto(ctx.user.id, input.photoUrl, input.caption);
        return { success: true };
      }),
  }),

  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({ email: z.string().email(), source: z.string().optional() }))
      .mutation(async ({ input }) => {
        await db.subscribeEmail(input.email, input.source);
        return { success: true };
      }),
  }),
});
