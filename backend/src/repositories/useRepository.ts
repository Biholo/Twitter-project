import { IUser } from "@/models/userModel";
import { Request } from "express";
import { BaseRepository } from "./baseRepository";
import User from "@/models/userModel";

class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email });
  }
}


const userRepository = new UserRepository();
export default userRepository;
