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

export default http;
