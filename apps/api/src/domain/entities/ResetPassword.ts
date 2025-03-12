export interface ResetPassword {
  id: string;
  token: string;
  user: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
