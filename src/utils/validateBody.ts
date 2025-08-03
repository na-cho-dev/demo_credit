import { AppError } from "../errors/AppError";

export const validateBody = <T extends object>(
  body: unknown,
  allowedFields: (keyof T)[]
): Partial<T> => {
  const result: Partial<T> = {};
  const invalidFields: string[] = [];

  // Type guard to ensure body is an object
  if (typeof body !== "object" || body === null || Array.isArray(body))
    throw new AppError("Request body must be a valid object");

  const bodyObj = body as Record<string, unknown>;

  for (const key in bodyObj) {
    if (allowedFields.includes(key as keyof T)) {
      result[key as keyof T] = bodyObj[key] as T[keyof T];
    } else {
      invalidFields.push(key);
    }
  }

  if (invalidFields.length > 0)
    throw new AppError(`Invalid fields: ${invalidFields.join(", ")}`);

  return result;
};
