import { UserPayload } from "../interfaces/user.interface";

declare module "http" {
  interface IncomingMessage {
    user?: UserPayload;
  }
}
