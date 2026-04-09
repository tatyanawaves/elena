import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();
auth.addHttpRoutes(http);

// Admin endpoint: seed courses
http.route({
  path: "/admin/seed",
  method: "POST",
  handler: httpAction(async (ctx) => {
    await ctx.runMutation(internal.seed.seedCourses);
    return new Response(JSON.stringify({ success: true, message: "Courses seeded" }), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// Admin endpoint: reseed courses
http.route({
  path: "/admin/reseed",
  method: "POST",
  handler: httpAction(async (ctx) => {
    await ctx.runMutation(internal.seed.reseedCourses);
    await ctx.runMutation(internal.seed.seedCourses);
    return new Response(JSON.stringify({ success: true, message: "Courses reseeded" }), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// Admin endpoint: enroll user in all courses
http.route({
  path: "/admin/enroll",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const email = body.email;
    if (!email) {
      return new Response(JSON.stringify({ error: "email required" }), { status: 400 });
    }
    await ctx.runMutation(internal.seed.enrollUserInAll, { email });
    return new Response(JSON.stringify({ success: true, message: `Enrolled ${email}` }), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// Notification queue: get pending notifications
http.route({
  path: "/admin/notifications/pending",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const pending = await ctx.runQuery(internal.notifications.getPending);
    return new Response(JSON.stringify({ notifications: pending }), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// Notification queue: mark as sent
http.route({
  path: "/admin/notifications/mark-sent",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const id = body.id;
    if (!id) {
      return new Response(JSON.stringify({ error: "id required" }), { status: 400 });
    }
    await ctx.runMutation(internal.notifications.markSent, { id });
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// Notification queue: mark as failed
http.route({
  path: "/admin/notifications/mark-failed",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const id = body.id;
    if (!id) {
      return new Response(JSON.stringify({ error: "id required" }), { status: 400 });
    }
    await ctx.runMutation(internal.notifications.markFailed, { id });
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
