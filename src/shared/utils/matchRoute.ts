import { match } from "path-to-regexp";
import { Route } from "@/core/routing/Route";
import routes, { AppPath, fallback } from "@/app/routes";

interface Result {
  route: Route<AppPath | "/*">;
  params: any;
}

const cache = new Map<string, ReturnType<typeof match>>();

const getMatch = (path: string) => {
  if (!cache.has(path)) {
    cache.set(path, match(path));
  }

  return cache.get(path)!;
};

export default function matchRoute(path: string): Result {
  for (const route of routes) {
    const pattern = getMatch(route.path);
    const result = pattern(path);

    if (result) {
      return {
        route,
        params: result.params,
      };
    }
  }

  return {
    route: fallback,
    params: {},
  };
}
