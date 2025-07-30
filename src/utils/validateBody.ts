import { AppError } from "../errors/AppError";

export const validateBody = <T extends object>(
  body: any,
  allowedFields: (keyof T)[]
): Partial<T> => {
  const result: Partial<T> = {};
  const invalidFields: string[] = [];

  for (const key in body) {
    if (allowedFields.includes(key as keyof T)) {
      result[key as keyof T] = body[key];
    } else {
      invalidFields.push(key);
    }
  }

  if (invalidFields.length > 0) {
    throw new AppError(`Invalid fields: ${invalidFields.join(", ")}`);
  }

  return result;
};
