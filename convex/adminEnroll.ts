import { query } from "./_generated/server";
import { v } from "convex/values";
// Query to check enrollment status
export const checkEnrollment = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), email))
      .first();
    if (!user) return { found: false, email };

    const courses = await ctx.db.query("courses").collect();
    const enrollments = [];
    for (const course of courses) {
      const existing = await ctx.db
        .query("enrollments")
        .withIndex("by_user_course", (q) =>
          q.eq("userId", user._id).eq("courseId", course._id),
        )
        .first();
      enrollments.push({
        course: course.title,
        enrolled: !!existing,
      });
    }
    return { found: true, email, userId: user._id, enrollments };
  },
});
