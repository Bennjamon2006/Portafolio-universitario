import { createRoutes, Paths, Route } from "@/core/routing/Route";

const routes = createRoutes([
  {
    path: "/",
    loader: () => import("@/app/pages/Home"),
    useModal: false,
  },
  {
    path: "/contenido",
    loader: () => import("./pages/Content"),
    useModal: true,
  },
  {
    path: "/contenido/sobre-el-proyecto",
    loader: () => import("./pages/NotFound"),
    useModal: true,
  },
  {
    path: "/contenido/sobre-mi",
    loader: () => import("./pages/NotFound"),
    useModal: true,
  },
  {
    path: "/contenido/proyectos",
    loader: () => import("./pages/Projects"),
    useModal: true,
  },
]);

export const fallback: Route<"/*"> = {
  path: "/*",
  loader: () => import("@/app/pages/NotFound"),
  useModal: false,
};

export type AppPath = Paths<typeof routes>;

export default routes;
