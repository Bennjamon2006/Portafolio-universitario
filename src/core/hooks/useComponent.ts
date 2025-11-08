import { useContext, useEffect, useRef, useState } from "react";
import ServerContext from "@/server/ServerContext";
import { environment, Env } from "@/shared/constants";
import useCurrentRoute from "./useCurrentRoute";
import { AppPath } from "@/app/routes";
import NotFound from "@/app/pages/NotFound";

export default function useComponent() {
  const ServerComponent = useContext(ServerContext).Component;
  const [Component, setComponent] = useState<React.FC<any>>(() => {
    if (environment === Env.SSR) {
      return ServerComponent;
    }

    return window.Component;
  });
  const { route } = useCurrentRoute();
  const cachedComponents = useRef<Partial<Record<AppPath, React.FC<any>>>>({});
  const [loading, setLoading] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }

    const { path } = route;

    if (path === "/*") {
      setLoading(false);
      setComponent(() => NotFound);
      return;
    }

    if (path in cachedComponents.current) {
      setLoading(false);
      setComponent(() => cachedComponents.current[path]!);

      return;
    }

    setLoading(true);

    route.loader().then(({ default: Component }) => {
      setLoading(false);
      setComponent(() => Component);
      cachedComponents.current[path] = Component;
    });
  }, [route.path]);

  return { Component, loading };
}
