import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: { phrase: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    try {
      const existingUser = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("phrase"), args.phrase))
        .first();

      if (existingUser) {
        return existingUser.userId;
      } else {
        await ctx.db.insert("users", {
          phrase: args.phrase,
          userId: args.userId,
        });
      }
    } catch (error) {
      throw new Error("Server error");
    }
  },
});
