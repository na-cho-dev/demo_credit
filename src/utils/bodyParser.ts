import { IncomingMessage } from "http";

export const parseBody = <T = any>(req: IncomingMessage): Promise<T> => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error("Invalid JSON"));
      }
    });
  });
};
