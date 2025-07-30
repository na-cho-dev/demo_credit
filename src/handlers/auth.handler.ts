import { IncomingMessage, ServerResponse } from "http";
import { parseBody } from "../utils/bodyParser";
import { sendResponse } from "../utils/response";
import logger from "../utils/logger";
import { authService } from "../services/auth.service";
import { validateBody } from "../utils/validateBody";
import { CreateUserDto, LoginUserDto } from "../interfaces/user.interface";

export class AuthHandler {
  async register(req: IncomingMessage, res: ServerResponse) {
    try {
      const body = await parseBody(req);
      const validatedBody = validateBody<CreateUserDto>(body, [
        "full_name",
        "email",
      ]);
      const { full_name, email } = validatedBody;
      if (!full_name || !email) {
        return sendResponse(res, 400, false, {
          error: "Name, email, and password are required",
        });
      }

      const { user, token } = await authService.register(full_name, email);

      sendResponse(res, 201, true, {
        message: "User registered successfully",
        data: { ...user, token },
      });
    } catch (err: any) {
      sendResponse(res, err.statusCode || 500, false, {
        error: err.message,
      });
    }
  }

  async login(req: IncomingMessage, res: ServerResponse) {
    try {
      const body = await parseBody(req);
      const validatedBody = validateBody<LoginUserDto>(body, ["email"]);
      const { email } = validatedBody;
      if (!email) {
        return sendResponse(res, 400, false, { error: "Email is required" });
      }

      const { user, token } = await authService.login(email);

      sendResponse(res, 200, true, {
        message: "Login successful",
        data: { ...user, token },
      });
    } catch (err: any) {
      logger.error(`[AUTH LOGIN ERROR]: ${err.message}`);
      sendResponse(res, err.statusCode || 500, false, { error: err.message });
    }
  }
}

export const authHandler = new AuthHandler();
