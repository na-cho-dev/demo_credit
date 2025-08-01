import axios from "axios";
import { ADJUTOR_API_KEY, KARMA_CHECK } from "../config/env";
import logger from "../utils/logger";

export async function isUserBlacklisted(identity: string): Promise<boolean> {
  if (KARMA_CHECK === "false") {
    logger.warn("Karma blacklist check is disabled by environment variable.");
    return false;
  }
  try {
    const response = await axios.get(
      `https://adjutor.lendsqr.com/v2/verification/karma/${identity}`,
      {
        headers: {
          Authorization: `Bearer ${ADJUTOR_API_KEY}`,
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
  } catch (error: any) {
    logger.error("Karma check failed:", error.message);
    return true;
  }
}
