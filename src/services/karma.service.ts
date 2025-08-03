import axios from "axios";
import logger from "../utils/logger";
import { envConfig } from "../config/env";

interface KarmaResponse {
  status: string;
  data?: {
    karma_identity?: string;
  };
}

export async function isUserBlacklisted(identity: string): Promise<boolean> {
  if (envConfig.KARMA_CHECK === "false") {
    logger.warn("Karma blacklist check is disabled by environment variable.");
    return false;
  }
  try {
    const response = await axios.get<KarmaResponse>(
      `https://adjutor.lendsqr.com/v2/verification/karma/${identity}`,
      {
        headers: {
          Authorization: `Bearer ${envConfig.ADJUTOR_API_KEY}`,
        },
      }
    );

    // const data = response.data?.data;
    const status = response.data?.status;

    // Convert the response to a boolean indicating if the user is blacklisted
    // const isBlacklisted = !!data?.karma_identity;

    // Use the status field directly
    const isBlacklisted = status === "success";

    return isBlacklisted;
  } catch (error: unknown) {
    logger.error(
      "Karma check failed:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return true;
  }
}
