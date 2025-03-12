import { bindIdentifier, container } from "@/dependencies/container";
import { Service, Repository } from "@/dependencies/constants";
import { AuthConcreteService } from "@/application/services/AuthConcreteService";
import { AuthService } from "@/domain/usecases/AuthService";
import { UserMongoRepository } from "@/infrastructure/database/repositories/UserMongoRepository";
import { UserRepository } from "@/domain/gateway/UserRepository";
import { TokenMongoRepository } from "@/infrastructure/database/repositories/TokenMongoRepository";
import { TokenRepository } from "@/domain/gateway/TokenRepository";
import { ResetPasswordMongoRepository } from "@/infrastructure/database/repositories/ResetPasswordRepository";
import { ResetPasswordRepository } from "@/domain/gateway/ResetPasswordRepository";

export function loadDependencies() {
  bindIdentifier<AuthService>(Service.AuthService, AuthConcreteService);
  bindIdentifier<UserRepository>(
    Repository.UserRepository,
    UserMongoRepository
  );
  bindIdentifier<TokenRepository>(
    Repository.TokenRepository,
    TokenMongoRepository
  );
  bindIdentifier<ResetPasswordRepository>(
    Repository.ResetPasswordRepository,
    ResetPasswordMongoRepository
  );
}
