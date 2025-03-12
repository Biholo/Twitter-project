import { Token } from "@/domain/entities/Token";
import { TokenRepository } from "@/domain/gateway/TokenRepository";
import { TokenCreate } from "@/domain/schemas/tokenCreateSchema";
import TokenModel, {
  TokenDocument,
} from "@/infrastructure/database/models/Token";
import { AsyncOption } from "@/types/AsyncOption";
import { None, Some } from "@thames/monads";

export class TokenMongoRepository implements TokenRepository {
  async findOneById(id: string): AsyncOption<Token> {
    // const foundToken = await TokenModel.findById(id).populate("ownedBy").exec();
    const foundToken = await TokenModel.findById(id).exec();

    if (!foundToken) {
      return None;
    }

    const token = this.mapToDomain(foundToken);
    return Some(token);
  }

  async create(tokenCreate: TokenCreate): Promise<Token> {
    const token = await TokenModel.create(tokenCreate);
    return this.mapToDomain(token);
  }

  async delete(id: string): Promise<void> {
    await TokenModel.findByIdAndDelete(id).exec();
  }

  private mapToDomain(token: TokenDocument): Token {
    const plainUser = token.toObject<TokenDocument>({
      flattenMaps: true,
      flattenObjectIds: true,
    });

    return {
      ...plainUser,
      id: plainUser._id.toString(),
      ownedBy: plainUser.ownedBy.toString(),
    };
  }
}
