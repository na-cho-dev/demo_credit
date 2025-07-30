import { ServerResponse } from "http";

export const sendResponse = (
  res: ServerResponse,
  statusCode: number,
  success: boolean = true,
  payload: Record<string, any>
) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
  });
  res.end(
    JSON.stringify({
      success,
      status: statusCode,
      message: payload?.message,
      ...payload,
    })
  );
};
