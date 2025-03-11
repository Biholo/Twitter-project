import { IUser } from "@/models/userModel";
import { Request } from "express";
import { BaseRepository } from "./baseRepository";
import User from "@/models/userModel";

class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmailOrIdentifierName(email: string, identifier_name: string): Promise<IUser | null> {
    return this.model.findOne({ $or: [{ email }, { identifier_name }] });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email });
  }
}


const userRepository = new UserRepository();
export default userRepository;
