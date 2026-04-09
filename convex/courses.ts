import { v } from "convex/values";
import { query } from "./_generated/server";

const courseValidator = v.object({
  _id: v.id("courses"),
  _creationTime: v.number(),
  slug: v.string(),
  title: v.string(),
  description: v.string(),
  longDescription: v.optional(v.string()),
  whatYouLearn: v.optional(v.array(v.string())),
  forWhom: v.optional(v.array(v.string())),
  programBlocks: v.optional(
    v.array(
      v.object({
        title: v.string(),
        description: v.string(),
      }),
    ),
  ),
  duration: v.string(),
  priceKzt: v.optional(v.number()),
  originalPriceKzt: v.optional(v.number()),
  stripePriceId: v.optional(v.string()),
  stripeProductId: v.optional(v.string()),
  badge: v.optional(v.string()),
  category: v.union(
    v.literal("training"),
    v.literal("game"),
    v.literal("youtube"),
  ),
  order: v.number(),
  isActive: v.boolean(),
});

export const list = query({
  args: {},
  returns: v.array(courseValidator),
  handler: async (ctx) => {
    const courses = await ctx.db
      .query("courses")
      .withIndex("by_order")
      .collect();
    return courses.filter((c) => c.isActive);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  returns: v.union(courseValidator, v.null()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const getLessons = query({
  args: { courseId: v.id("courses") },
  returns: v.array(
    v.object({
      _id: v.id("lessons"),
      _creationTime: v.number(),
      courseId: v.id("courses"),
      title: v.string(),
      description: v.optional(v.string()),
      youtubeUrl: v.string(),
      durationMinutes: v.number(),
      order: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lessons")
      .withIndex("by_course_order", (q) => q.eq("courseId", args.courseId))
      .collect();
  },
});
