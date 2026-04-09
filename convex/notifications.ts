import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

// Get pending notifications (called by Viktor cron via HTTP)
export const getPending = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .take(20);
  },
});

// Mark notification as sent
export const markSent = internalMutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "sent",
      sentAt: Date.now(),
    });
  },
});

// Mark notification as failed
export const markFailed = internalMutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "failed",
    });
  },
});
