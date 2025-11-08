export enum Env {
  SSR,
  CLIENT_DEV,
  CLIENT_PROD,
}

export const environment = import.meta.env.SSR
  ? Env.SSR
  : import.meta.env.DEV
  ? Env.CLIENT_DEV
  : Env.CLIENT_PROD;

export const appVersion = await (async () => {
  if (environment === Env.SSR) {
    const packageJSON = await import("@/../package.json");

    return packageJSON.version;
  }

  const meta = document.getElementById(
    "__APP__VERSION__"
  ) as HTMLMetaElement | null;

  if (!meta) {
    throw new Error("It has not been possible resolve App Version");
  }

  return meta.content;
})();

export const source =
  "https://github.com/Bennjamon2006/Portafolio-universitario";

export const github = "https://github.com/Bennjamon2006";

export const linkedin =
  "https://www.linkedin.com/in/benjam%C3%ADn-alexis-rivas-beltr%C3%A1n-185579366";
