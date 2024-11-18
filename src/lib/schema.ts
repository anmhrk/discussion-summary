import { z } from "zod";

export const tokenSchema = z.object({
  token: z
    .string()
    .min(60, "Invalid API access token")
    .regex(/^[a-zA-Z0-9~]+$/, "Invalid API access token"),
});

export const discussionSchema = z.object({
  token: z
    .string()
    .min(60, "Invalid API access token")
    .regex(/^[a-zA-Z0-9~]+$/, "Invalid API access token"),
  link: z
    .string()
    .url("Invalid discussion link")
    .refine((val) => val.includes("canvas"), {
      message: "Invalid discussion link",
    }),
  customPrompt: z.string().optional(),
});
