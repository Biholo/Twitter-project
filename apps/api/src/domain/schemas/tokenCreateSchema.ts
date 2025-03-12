import { TokenType } from "@/domain/enum/TokenType";
import { z } from "zod";

export const tokenCreateSchema = z.object({
  ownedBy: z.string(),
  token: z.string(),
  type: z.nativeEnum(TokenType),
  scopes: z.array(z.string()),
  deviceName: z.string().optional(),
  deviceIp: z.string().optional(),
  expiresAt: z.date(),
});

export type TokenCreate = z.infer<typeof tokenCreateSchema>;
