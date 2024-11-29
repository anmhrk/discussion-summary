import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createDiscussion = mutation({
  args: {
    currentUserId: v.string(),
    discussionId: v.string(),
    link: v.string(),
    students: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const existingDiscussion = await ctx.db
        .query("discussions")
        .filter((q) => q.eq(q.field("discussionId"), args.discussionId))
        .first();

      if (existingDiscussion) {
        return;
      }

      const currentUser = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("userId"), args.currentUserId))
        .first();

      if (!currentUser) {
        return new Error("User not found");
      }

      const discussion = await ctx.db.insert("discussions", {
        userId: currentUser?._id,
        discussionId: args.discussionId,
        link: args.link,
        students: args.students,
      });
      return discussion;
    } catch (error) {
      throw new Error("Server error");
    }
  },
});

export const checkLinkExists = mutation({
  args: {
    link: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const existingDiscussion = await ctx.db
        .query("discussions")
        .filter((q) => q.eq(q.field("link"), args.link))
        .first();

      return existingDiscussion !== null;
    } catch (error) {
      throw new Error("Server error");
    }
  },
});
