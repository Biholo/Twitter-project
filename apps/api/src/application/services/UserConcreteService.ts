import { inject, injectable } from "inversify";
import { Repository } from "@/dependencies/constants";
import { UserRepository } from "@/domain/gateway/UserRepository";
import { AsyncOption } from "@/types/AsyncOption";
import { UserSchema } from "@/domain/schemas/userSchema";
import { UserDto } from "@domain/dto/UserDto";
import { serialize } from "@/utils/serialize";
import { None, Some } from "@thames/monads";

@injectable()
export class UserConcreteService {
  constructor(
    @inject(Repository.UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  async findOneById(id: string): AsyncOption<UserDto> {
    const foundUser = await this.userRepository.findOneById(id);

    if (foundUser.isNone()) {
      return None;
    }

    const user = UserConcreteService.toDto(foundUser.unwrap());
    return Some(user);
  }

  public static toDto(user: UserSchema): UserDto {
    return serialize(user);
  }
}
