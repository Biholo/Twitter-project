import { Token } from "@/domain/entities/Token";
import { TokenCreate } from "@/domain/schemas/tokenCreateSchema";
import { AsyncOption } from "@/types/AsyncOption";

export interface TokenRepository {
  findOneById(id: string): AsyncOption<Token>;
  create(token: TokenCreate): Promise<Token>;
  delete(id: string): Promise<void>;
}
