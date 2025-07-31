import { parse } from "url";

export function getRouteParams(
  routePattern: string,
  urlPath: string
): Record<string, string> {
  const paramNames = [...routePattern.matchAll(/:([^/]+)/g)].map((m) => m[1]);
  const regexPattern = routePattern.replace(/:([^/]+)/g, "([^/]+)");
  const regex = new RegExp(`^${regexPattern}$`);
  const match = urlPath.match(regex);
  if (!match) return {};
  const params: Record<string, string> = {};
  paramNames.forEach((name, i) => {
    params[name] = match[i + 1];
  });
  return params;
}

export function getQueryParams(url: string, param: string): string | undefined {
  const { query } = parse(url, true);
  return query[param] as string | undefined;
}
