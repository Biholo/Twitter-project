import { TokenType } from "@/domain/enum/TokenType";

export interface Token {
  id: string;
  ownedBy: string;
  token: string;
  type: TokenType;
  scopes: string[];
  deviceName: string;
  deviceIp?: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}
