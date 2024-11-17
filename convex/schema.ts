import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    userId: v.number(),
  }).index("by_userId", ["userId"]),
});
