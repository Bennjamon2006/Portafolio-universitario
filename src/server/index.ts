import express from "express";
import { createServer } from "vite";
import { readFileSync } from "fs";
import { resolve } from "path";

const app = express();

const plainHTML = readFileSync(
  resolve(import.meta.dirname, "../../index.html"),
  "utf-8"
);

const vite = await createServer({
  server: {
    middlewareMode: true,
  },
  appType: "custom",
});

const matchRoute = (
  (await vite.ssrLoadModule(
    "@/shared/utils/matchRoute.ts"
  )) as typeof import("@/shared/utils/matchRoute")
).default;

app.use(vite.middlewares);

app.use(async (req, res, next) => {
  const path = req.path;

  if (!path.endsWith("/props.json")) {
    next();
    return;
  }

  const pagePath = path.slice(0, -10);

  const { route, params } = matchRoute(pagePath);

  const module = await route.loader();

  const props = module.getServerProps
    ? await module.getServerProps(params)
    : {};

  res.json(props);
});

app.use(async (req, res) => {
  try {
    const init = Date.now();
    const path = req.path;

    const render = (
      (await vite.ssrLoadModule(
        "@/server/render.tsx"
      )) as typeof import("./render")
    ).default;

    const html = await vite.transformIndexHtml(path, plainHTML);

    const document = await render(html, path);

    res.send(document.html);

    const time = Date.now() - init;

    console.log(`Page for ${path} rendered in ${time}ms`);
  } catch (error: any) {
    vite.ssrFixStacktrace(error);
    console.error(error);
    res.status(500).send(error.message ?? String(error));
  }
});

app.listen(3000, () => {
  console.log("Dev Server running on port 3000");
});
