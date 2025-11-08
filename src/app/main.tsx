import RouterProvider from "@/core/routing/Router.provider";
import matchRoute from "@/shared/utils/matchRoute";
import { hydrateRoot } from "react-dom/client";
import Outlet from "./components/Outlet";

const initialRoute = matchRoute(window.location.pathname);
const module = await initialRoute.route.loader();

window.Component = module.default;

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

hydrateRoot(
  root,
  <RouterProvider>
    <Outlet />
  </RouterProvider>
);
