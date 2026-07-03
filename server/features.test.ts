import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("features router", () => {
  it("newsletter.subscribe requires valid email", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.features.newsletter.subscribe({ email: "not-an-email" })
    ).rejects.toThrow();
  });

  it("wishlist.list requires authentication", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.features.wishlist.list()).rejects.toThrow();
  });

  it("reviews.list is public and accepts productHandle", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.features.reviews.list({ productHandle: "test-product" });
    expect(Array.isArray(result)).toBe(true);
  });

  it("loyalty.account requires authentication", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.features.loyalty.account()).rejects.toThrow();
  });
});
