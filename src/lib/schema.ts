import { z } from "zod";

export const tokenSchema = z.object({
  token: z
    .string()
    .min(60, "Invalid API access token")
    .regex(/^[a-zA-Z0-9~]+$/, "Invalid API access token"),
});
