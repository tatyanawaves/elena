import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  // Course catalog
  courses: defineTable({
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    longDescription: v.optional(v.string()),
    whatYouLearn: v.optional(v.array(v.string())),  // bullet points
    forWhom: v.optional(v.array(v.string())),       // target audience
    programBlocks: v.optional(v.array(v.object({
      title: v.string(),
      description: v.string(),
    }))),
    duration: v.string(),
    priceKzt: v.optional(v.number()),       // null = "По запросу"
    originalPriceKzt: v.optional(v.number()), // strikethrough price
    stripePriceId: v.optional(v.string()),
    stripeProductId: v.optional(v.string()),
    badge: v.optional(v.string()),           // "Хит продаж", "Популярный", "Игра"
    category: v.union(
      v.literal("training"),
      v.literal("game"),
      v.literal("youtube"),
    ),
    order: v.number(),
    isActive: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_order", ["order"]),

  // Lessons within a course (YouTube videos)
  lessons: defineTable({
    courseId: v.id("courses"),
    title: v.string(),
    description: v.optional(v.string()),
    youtubeUrl: v.string(),
    durationMinutes: v.number(),
    order: v.number(),
  })
    .index("by_course", ["courseId"])
    .index("by_course_order", ["courseId", "order"]),

  // User enrollments (purchased courses)
  enrollments: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    stripePaymentIntentId: v.optional(v.string()),
    enrolledAt: v.number(),
    status: v.union(
      v.literal("active"),
      v.literal("expired"),
      v.literal("refunded"),
    ),
  })
    .index("by_user", ["userId"])
    .index("by_user_course", ["userId", "courseId"])
    .index("by_stripe_pi", ["stripePaymentIntentId"]),

  // Applications for "По запросу" courses
  applications: defineTable({
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
  })
    .index("by_status", ["status"])
    .index("by_email", ["email"]),
});

export default schema;
