import { User } from "@/domain/entities/User";
import { RegisterSchema } from "@/domain/schemas/registerSchema";
import { UserUpdateSchema } from "@/domain/schemas/userUpdateSchema";
import { AsyncOption } from "@/types/AsyncOption";

export interface UserRepository {
  findOneByEmail(email: string): AsyncOption<User>;
  findOneById(id: string): AsyncOption<User>;
  create(user: RegisterSchema): Promise<User>;
  update(id: string, userUpdate: UserUpdateSchema): AsyncOption<User>
}
