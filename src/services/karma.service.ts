import axios from "axios";
import { ADJUTOR_API_KEY } from "../config/env";
import logger from "../utils/logger";

export async function isUserBlacklisted(identity: string): Promise<boolean> {
  try {
    const response = await axios.get(
      `https://adjutor.lendsqr.com/v2/verification/karma/${identity}`,
      {
        headers: {
          Authorization: `Bearer ${ADJUTOR_API_KEY}`,
        },
      }
    );

    const data = response.data?.data;

    // Convert the response to a boolean indicating if the user is blacklisted
    const isBlacklisted = !!data?.karma_identity;

    return isBlacklisted;
  } catch (error) {
    logger.error("Karma check failed:", error.message);
    return true;
  }
}
