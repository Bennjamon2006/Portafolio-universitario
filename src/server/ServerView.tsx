import ServerContext from "./ServerContext";
import RouterContext, { RouterState } from "@/core/routing/Router.context";
import { AppPath } from "@/app/routes";
import Outlet from "@/app/components/Outlet";

export default function ServerView({
  Component,
  props,
  path,
}: {
  Component: React.FC<any>;
  props: any;
  path: AppPath;
}) {
  const fakedContext: RouterState = {
    path,
    navigate: () => {},
    history: [],
  };

  return (
    <ServerContext.Provider value={{ Component, props }}>
      <RouterContext.Provider value={fakedContext}>
        <Outlet />
      </RouterContext.Provider>
    </ServerContext.Provider>
  );
}
