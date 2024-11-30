import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    userId: v.string(),
  }).index("by_userId", ["userId"]),
  discussions: defineTable({
    userId: v.id("users"),
    discussionId: v.string(),
    link: v.string(),
    numOfResponses: v.number(),
  }).index("by_discussionId", ["discussionId"]),
  responses: defineTable({
    discussionId: v.id("discussions"),
    link: v.string(),
    customPrompt: v.optional(v.string()),
    students: v.array(v.string()),
    selectedStudents: v.array(v.string()),
    response: v.string(),
    version: v.number(),
  }).index("by_discussionId", ["discussionId"]),
});
