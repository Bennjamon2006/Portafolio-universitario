import { createServer, build } from "vite";
import { join, resolve } from "path";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";

const init = Date.now();

const dist = resolve(import.meta.dirname, "../dist");

if (existsSync(dist)) {
  rmSync(dist, { recursive: true });
}

await build({
  build: {
    outDir: dist,
    rollupOptions: {
      output: {
        hoistTransitiveImports: false,
        manualChunks(id) {
          if (id.includes("react")) return "react";
          if (id.includes("core")) return "core";
        },
      },
    },
  },
  logLevel: "silent",
});

console.log("Client bundled");

const baseHTML = readFileSync(join(dist, "index.html"), "utf-8");

const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});

const { default: routes } = (await vite.ssrLoadModule(
  "@/app/routes.ts"
)) as typeof import("@/app/routes");

const buildPath = (
  (await vite.ssrLoadModule(
    "@/shared/utils/buildPath.ts"
  )) as typeof import("@/shared/utils/buildPath")
).default;

const normalizePath = (
  (await vite.ssrLoadModule(
    "@/shared/utils/normalizePath.ts"
  )) as typeof import("@/shared/utils/normalizePath")
).default;

const render = (
  (await vite.ssrLoadModule(
    "@/server/render.tsx"
  )) as typeof import("@/server/render")
).default;

const pages: Record<string, any> = {};

await Promise.all(
  routes.map(async (route) => {
    const module = await route.loader();

    if (route.path.includes(":")) {
      const staticParams = module.generateStaticParams
        ? await module.generateStaticParams()
        : [];

      if (staticParams.length === 0) {
        console.warn(`No static params for page "${route.path}"`);
      }

      for (const params of staticParams) {
        // Type correction for generic path
        const rest = [params] as unknown as [];

        const path = buildPath(route.path, ...rest);

        const document = await render(baseHTML, path);

        pages[normalizePath(path)] = document.props;

        mkdirSync(join(dist, path), { recursive: true });
        writeFileSync(join(dist, path, "index.html"), document.html);
        console.log(`Page ${path} generated`);
      }

      return;
    }

    const document = await render(baseHTML, route.path);

    pages[normalizePath(route.path)] = document.props;

    mkdirSync(join(dist, route.path), { recursive: true });
    writeFileSync(join(dist, route.path, "index.html"), document.html);
    console.log(`Page ${route.path} generated`);
  })
);

const notFound = await render(baseHTML, "/any-page");

writeFileSync(join(dist, "notFound.html"), notFound.html);
console.log(`Page not found generated`);

writeFileSync(join(dist, "pages.json"), JSON.stringify(pages));
console.log("Pages props generated");

await vite.close();

console.log(`Build time: ${Date.now() - init}ms`);
4;
