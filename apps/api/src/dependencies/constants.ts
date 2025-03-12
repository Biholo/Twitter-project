export const Service = {
  AuthService: Symbol.for("AuthService"),
};

export const Repository = {
  UserRepository: Symbol.for("UserRepository"),
  TokenRepository: Symbol.for("TokenRepository"),
  ResetPasswordRepository: Symbol.for("ResetPasswordRepository"),
  NotificationRepository: Symbol.for("NotificationRepository"),
  HashtagRepository: Symbol.for("HashtagRepository"),
};
