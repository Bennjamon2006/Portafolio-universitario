import { appVersion } from "../constants";

export default function hydrateHTML(
  html: string,
  pageHTML: string,
  props: any
) {
  return html
    .replace("<!-- Page Content -->", pageHTML)
    .replace("<!-- Page Props -->", JSON.stringify(props))
    .replace("<!-- App Version -->", appVersion);
}
