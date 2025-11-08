import useRouter from "@/core/routing/useRouter";
import matchRoute from "@/shared/utils/matchRoute";
import { useMemo } from "react";

export default function useCurrentRoute() {
  const { path } = useRouter();

  const route = useMemo(() => matchRoute(path), [path]);

  return route;
}
