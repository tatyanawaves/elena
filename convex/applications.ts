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
    const appId = await ctx.db.insert("applications", {
      ...args,
      status: "new",
      createdAt: Date.now(),
    });

    // Queue WhatsApp notification to Elena
    const ELENA_PHONE = "77083856750";
    const msg = `📩 Новая заявка на курс!\n\n📚 Курс: ${args.courseName}\n👤 Имя: ${args.name}\n📧 Email: ${args.email}${args.phone ? `\n📱 Тел: ${args.phone}` : ""}${args.message ? `\n💬 Сообщение: ${args.message}` : ""}`;
    await ctx.db.insert("notifications", {
      type: "application",
      recipientPhone: ELENA_PHONE,
      courseName: args.courseName,
      buyerEmail: args.email,
      buyerName: args.name,
      buyerPhone: args.phone,
      message: msg,
      status: "pending",
      createdAt: Date.now(),
    });

    return appId;
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
