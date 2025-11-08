import { renderToString } from "react-dom/server";
import matchRoute from "@/shared/utils/matchRoute";
import ServerView from "./ServerView";
import { AppPath } from "@/app/routes";
import hydrateHTML from "@/shared/utils/hydrateHTML";

export default async function render(html: string, path: string) {
  const { route, params } = matchRoute(path);

  const module = await route.loader();
  const Component = module.default;

  const props = module.getServerProps
    ? await module.getServerProps(params)
    : {};

  const pageHTML = renderToString(
    <ServerView path={path as AppPath} Component={Component} props={props} />
  );

  return {
    html: hydrateHTML(html, pageHTML, props),
    props,
  };
}
