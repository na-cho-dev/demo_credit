import { v4 as uuidv4 } from "uuid";
import db from "../config/db";
import { CreateUserDto, UserPayload } from "../interfaces/user.interface";

export class UserRepository {
  async create(user: CreateUserDto) {
    const id = uuidv4();
    await db("users").insert({ ...user, id });
    const createdUser = (await this.findById(id)) as UserPayload;

    return createdUser;
  }

  async findByEmail(email: string) {
    const user = (await db("users")
      .where({ email })
      .first()) as UserPayload | null;
    return user;
  }

  async findById(id: string) {
    const user = (await db("users")
      .where({ id })
      .first()) as UserPayload | null;
    return user;
  }
}

export const userRepository = new UserRepository();
