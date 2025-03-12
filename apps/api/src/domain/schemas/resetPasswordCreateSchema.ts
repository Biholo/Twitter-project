import { z } from "zod";

export const resetPasswordCreateSchema = z.object({
  token: z.string().nonempty(),
  user: z.string().nonempty(),
  expiresAt: z.date().min(new Date()),
});

export type ResetPasswordCreateSchema = z.infer<
  typeof resetPasswordCreateSchema
>;
