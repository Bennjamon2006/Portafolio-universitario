import { useEffect, useRef, useState } from "react";
import RouterContext, { HistoryEntry, NavigateFn } from "./Router.context";
import buildPath from "@/shared/utils/buildPath";
import { AppPath } from "@/app/routes";

export default function RouterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [path, setPath] = useState<AppPath>(
    window.location.pathname as AppPath
  );
  const historyRef = useRef<HistoryEntry[]>([]);
  const pushStateRef = useRef<History["pushState"]>(null);

  const navigate: NavigateFn = (to, ...args) => {
    const newPath = buildPath(to, ...args);

    if (path != newPath) {
      pushStateRef.current!({}, "", newPath);
      setPath(newPath as AppPath);
    }
  };

  useEffect(() => {
    pushStateRef.current = history.pushState.bind(history);

    history.pushState = (data, unused, url) => {
      pushStateRef.current!(data, unused, url);

      if (url) {
        const urlString = url.toString();

        if (urlString.startsWith("/") && urlString != path) {
          setPath(urlString as AppPath);
        }
      }
    };

    const callback = () => {
      setPath(window.location.pathname as AppPath);
    };

    window.addEventListener("popstate", callback);

    return () => {
      history.pushState = pushStateRef.current!;
      window.removeEventListener("popstate", callback);
    };
  }, []);

  return (
    <RouterContext.Provider
      value={{
        path,
        navigate,
        history: historyRef.current,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
}
