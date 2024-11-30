import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createResponse = mutation({
  args: {
    currentDiscussionId: v.string(),
    customPrompt: v.optional(v.string()),
    selectedStudents: v.array(v.string()),
    students: v.array(v.string()),
    response: v.string(),
    link: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const currentDiscussion = await ctx.db
        .query("discussions")
        .filter((q) => q.eq(q.field("discussionId"), args.currentDiscussionId))
        .first();

      if (!currentDiscussion) {
        return new Error("Discussion not found");
      }

      const response = await ctx.db
        .query("responses")
        .filter((q) => q.eq(q.field("discussionId"), currentDiscussion._id))
        .first();

      const versionNumber = response ? response.version + 1 : 1;

      const newResponse = await ctx.db.insert("responses", {
        discussionId: currentDiscussion._id,
        customPrompt: args.customPrompt,
        students: args.students,
        selectedStudents: args.selectedStudents,
        response: args.response,
        version: versionNumber,
        link: args.link,
      });

      await ctx.db.patch(currentDiscussion._id, {
        numOfResponses: currentDiscussion.numOfResponses + 1,
      });

      return newResponse;
    } catch (error) {
      throw new Error("Server error");
    }
  },
});

export const getResponses = query({
  args: {
    discussionId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const discussion = await ctx.db
        .query("discussions")
        .filter((q) => q.eq(q.field("discussionId"), args.discussionId))
        .first();

      if (!discussion) {
        return [];
      }

      const responses = await ctx.db
        .query("responses")
        .filter((q) => q.eq(q.field("discussionId"), discussion._id))
        .order("desc")
        .take(50);

      if (!responses) {
        return [];
      }

      return await Promise.all(
        responses.map(async (response) => {
          return {
            id: response._id,
            response: response.response,
            version: response.version,
            customPrompt: response.customPrompt,
            selectedStudents: response.selectedStudents,
            students: response.students,
            discussionId: response.discussionId,
            link: response.link,
          };
        })
      );
    } catch (error) {
      return [];
    }
  },
});
