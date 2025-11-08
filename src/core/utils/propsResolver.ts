import { appVersion } from "@/shared/constants";
import normalizePath from "@/shared/utils/normalizePath";

export function getEmbededProps() {
  const script = document.getElementById(
    "__PAGE__PROPS__"
  ) as HTMLScriptElement | null;

  if (script == null) {
    console.warn("Embeded props not found");

    return {};
  }

  try {
    return JSON.parse(script.textContent || "{}");
  } catch {
    console.warn("Embeded props has a invalid format");

    return {};
  }
}

export async function getAllPagesProps(signal?: AbortSignal) {
  const cached = localStorage.getItem("pages");

  if (cached !== null) {
    const data = JSON.parse(cached);

    if (data.version === appVersion) {
      return data.pages;
    }
  }

  console.info("Loading pages data...");

  try {
    const res = await fetch("/pages.json", { signal });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const pages = await res.json();

    localStorage.setItem(
      "pages",
      JSON.stringify({
        version: appVersion,
        pages,
      })
    );

    return pages;
  } catch (e) {
    console.error("Error fetching all pages props: ", e);

    return {};
  }
}

export async function getPageProps(path: string, signal?: AbortSignal) {
  try {
    const url = normalizePath(`${path}/props.json`);
    const res = await fetch(url, { signal });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    return await res.json();
  } catch (e) {
    console.error(`Error fetching pages props for "${path}": `, e);

    return {};
  }
}
