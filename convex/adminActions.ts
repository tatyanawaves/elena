/**
 * Admin actions for seeding courses and enrolling users.
 * Called via HTTP endpoints from Viktor.
 */
import { v } from "convex/values";
import { query, action } from "./_generated/server";
import { internal } from "./_generated/api";

// Query: list all users with their auth info
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const result = [];
    for (const user of users) {
      const accounts = await ctx.db
        .query("authAccounts")
        .filter((q) => q.eq(q.field("userId"), user._id))
        .collect();
      result.push({
        _id: user._id,
        email: (accounts[0] as any)?.providerAccountId || "unknown",
        name: (user as any).name || null,
        accountCount: accounts.length,
      });
    }
    return result;
  },
});

// Action: seed courses (calls internal mutation)
export const seedCoursesAction = action({
  args: {},
  handler: async (ctx) => {
    await ctx.runMutation(internal.seed.seedCourses);
    return { success: true, message: "Courses seeded" };
  },
});

// Action: reseed courses (delete all + re-insert)
export const reseedCoursesAction = action({
  args: {},
  handler: async (ctx) => {
    await ctx.runMutation(internal.seed.reseedCourses);
    await ctx.runMutation(internal.seed.seedCourses);
    return { success: true, message: "Courses reseeded" };
  },
});

// Action: enroll user in all courses
export const enrollUserAction = action({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    await ctx.runMutation(internal.seed.enrollUserInAll, { email });
    return { success: true, message: `Enrolled ${email} in all courses` };
  },
});

// Query: list all auth accounts (for debugging)
export const listAuthAccounts = query({
  args: {},
  handler: async (ctx) => {
    const accounts = await ctx.db.query("authAccounts").collect();
    return accounts.map((a: any) => ({
      _id: a._id,
      provider: a.provider,
      providerAccountId: a.providerAccountId,
      userId: a.userId,
    }));
  },
});

// Query: list all enrollments
export const listEnrollments = query({
  args: {},
  handler: async (ctx) => {
    const enrollments = await ctx.db.query("enrollments").collect();
    return enrollments;
  },
});

// Query: list all courses (simple)
export const listCourses = query({
  args: {},
  handler: async (ctx) => {
    const courses = await ctx.db.query("courses").collect();
    return courses.map(c => ({ _id: c._id, slug: c.slug, title: c.title }));
  },
});
