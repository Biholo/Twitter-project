import { ResetPassword } from "@/domain/entities/ResetPassword";
import { ResetPasswordRepository } from "@/domain/gateway/ResetPasswordRepository";
import { ResetPasswordCreateSchema } from "@/domain/schemas/resetPasswordCreateSchema";
import ResetPasswordModel, {
  ResetPasswordDocument,
} from "@/infrastructure/database/models/ResetPassword";
import { AsyncOption } from "@/types/AsyncOption";
import { None, Some } from "@thames/monads";

export class ResetPasswordMongoRepository implements ResetPasswordRepository {
  async findOneByToken(token: string): AsyncOption<ResetPassword> {
    const foundResetPassword = await ResetPasswordModel.findOne({
      token,
    }).exec();

    if (!foundResetPassword) {
      return None;
    }

    const resetPassword = this.mapToDomain(foundResetPassword);
    return Some(resetPassword);
  }

  async create(
    resetPassword: ResetPasswordCreateSchema
  ): Promise<ResetPassword> {
    const createdResetPassword = await ResetPasswordModel.create(resetPassword);
    return this.mapToDomain(createdResetPassword);
  }

  async delete(id: string): Promise<void> {
    await ResetPasswordModel.findByIdAndDelete(id).exec();
  }

  private mapToDomain(resetPassword: ResetPasswordDocument): ResetPassword {
    const plainResetPassword = resetPassword.toObject<ResetPasswordDocument>({
      flattenMaps: true,
      flattenObjectIds: true,
    });

    return {
      ...plainResetPassword,
      id: plainResetPassword._id.toString(),
      user: plainResetPassword.user.toString(),
    };
  }
}
