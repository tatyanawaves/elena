import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    courseId: v.optional(v.id("courses")),
    courseName: v.string(),
    message: v.optional(v.string()),
  },
  returns: v.id("applications"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("applications", {
      ...args,
      status: "new",
      createdAt: Date.now(),
    });
  },
});

export const listAll = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("applications"),
      _creationTime: v.number(),
      name: v.string(),
      email: v.string(),
      phone: v.optional(v.string()),
      courseId: v.optional(v.id("courses")),
      courseName: v.string(),
      message: v.optional(v.string()),
      status: v.union(
        v.literal("new"),
        v.literal("contacted"),
        v.literal("closed"),
      ),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db
      .query("applications")
      .withIndex("by_status")
      .collect();
  },
});
