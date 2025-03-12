import { injectable } from "inversify";
import { User } from "@/domain/entities/User";
import UserModel, { UserDocument } from "@/infrastructure/database/models/User";
import { AsyncOption } from "@/types/AsyncOption";
import { Some, None } from "@thames/monads";
import { UserRepository } from "@/domain/gateway/UserRepository";
import { RegisterSchema } from "@/domain/schemas/registerSchema";
import { UserUpdateSchema } from "@/domain/schemas/userUpdateSchema";

@injectable()
export class UserMongoRepository implements UserRepository {
  async findOneByEmail(email: string): AsyncOption<User> {
    const foundUser = await UserModel.findOne({ email });

    if (!foundUser) {
      return None;
    }

    const user = UserMongoRepository.mapToDomain(foundUser);
    return Some(user);
  }

  async findOneById(id: string): AsyncOption<User> {
    const foundUser = await UserModel.findById(id).exec();

    if (!foundUser) {
      return None;
    }

    const user = UserMongoRepository.mapToDomain(foundUser);
    return Some(user);
  }

  async create(user: RegisterSchema): Promise<User> {
    const createdUser = await UserModel.create(user);
    return UserMongoRepository.mapToDomain(createdUser);
  }

  async update(id: string, userUpdate: UserUpdateSchema): AsyncOption<User> {
    const updatedUser = await UserModel.findByIdAndUpdate(id, userUpdate, {
      new: true,
    });

    if (!updatedUser) {
      return None;
    }

    const user = UserMongoRepository.mapToDomain(updatedUser);
    return Some(user);
  }

  public static mapToDomain(user: UserDocument): User {
    const plainUser = user.toObject<UserDocument>({
      flattenMaps: true,
      flattenObjectIds: true,
    });

    return {
      ...plainUser,
      id: plainUser._id.toString(),
    };
  }
}
