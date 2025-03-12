import { ResetPassword } from "@/domain/entities/ResetPassword";
import { ResetPasswordCreateSchema } from "@/domain/schemas/resetPasswordCreateSchema";
import { AsyncOption } from "@/types/AsyncOption";

export interface ResetPasswordRepository {
  findOneByToken(token: string): AsyncOption<ResetPassword>;
  create(resetPassword: ResetPasswordCreateSchema): Promise<ResetPassword>;
  delete(id: string): Promise<void>;
}
