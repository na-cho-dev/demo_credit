import { v4 as uuidv4 } from "uuid";
import db from "../config/db";
import { CreateUserDto } from "../interfaces/user.interface";

export class UserRepository {
  async create(user: CreateUserDto) {
    const id = uuidv4();
    await db("users").insert({ ...user, id });
    const createdUser = await this.findById(id);

    return createdUser;
  }

  async findByEmail(email: string) {
    return db("users").where({ email }).first();
  }

  async findById(id: string) {
    return db("users").where({ id }).first();
  }
}

export const userRepository = new UserRepository();
