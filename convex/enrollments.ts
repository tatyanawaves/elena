import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";

export const myEnrollments = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("enrollments"),
      _creationTime: v.number(),
      userId: v.id("users"),
      courseId: v.id("courses"),
      stripePaymentIntentId: v.optional(v.string()),
      enrolledAt: v.number(),
      status: v.union(
        v.literal("active"),
        v.literal("expired"),
        v.literal("refunded"),
      ),
    }),
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const isEnrolled = query({
  args: { courseId: v.id("courses") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;
    const enrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user_course", (q) =>
        q.eq("userId", userId).eq("courseId", args.courseId),
      )
      .unique();
    return enrollment !== null && enrollment.status === "active";
  },
});

export const enroll = mutation({
  args: {
    courseId: v.id("courses"),
    stripePaymentIntentId: v.optional(v.string()),
  },
  returns: v.id("enrollments"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if already enrolled
    const existing = await ctx.db
      .query("enrollments")
      .withIndex("by_user_course", (q) =>
        q.eq("userId", userId).eq("courseId", args.courseId),
      )
      .unique();

    if (existing && existing.status === "active") {
      return existing._id;
    }

    return await ctx.db.insert("enrollments", {
      userId,
      courseId: args.courseId,
      stripePaymentIntentId: args.stripePaymentIntentId,
      enrolledAt: Date.now(),
      status: "active",
    });
  },
});
