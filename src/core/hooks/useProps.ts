import { useContext, useEffect, useRef, useState } from "react";
import {
  getAllPagesProps,
  getEmbededProps,
  getPageProps,
} from "@/core/utils/propsResolver";
import { AppPath } from "@/app/routes";
import useRouter from "@/core/routing/useRouter";
import ServerContext from "@/server/ServerContext";
import { Env, environment } from "@/shared/constants";
import normalizePath from "@/shared/utils/normalizePath";

export default function useProps() {
  const serverProps = useContext(ServerContext).props;
  const cachedProps = useRef<Partial<Record<AppPath, unknown>>>(null);
  const { path } = useRouter();
  const [props, setProps] = useState<any>(() => {
    if (environment === Env.SSR) {
      return serverProps;
    }

    return getEmbededProps();
  });
  const [loading, setLoading] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }

    const key = normalizePath(path) as AppPath;

    if (cachedProps.current !== null && key in cachedProps.current) {
      // If exists, use cached props
      setLoading(false);
      setProps(cachedProps.current[key]);
      return;
    }

    if (environment === Env.CLIENT_PROD && cachedProps.current !== null) {
      // In production, if cache loaded, but path not found, use empty props

      setLoading(false);
      setProps({});
      return;
    }

    setLoading(true);
    const controller = new AbortController();

    if (environment === Env.CLIENT_PROD) {
      getAllPagesProps(controller.signal).then((allProps) => {
        cachedProps.current = allProps;
        setProps(allProps[key] || {});
        setLoading(false);
      });
    } else {
      cachedProps.current ||= {};

      getPageProps(path, controller.signal).then((pageProps) => {
        cachedProps.current![key] = pageProps;

        setLoading(false);
        setProps(pageProps);
      });
    }

    return () => controller.abort();
  }, [path]);

  return { props, loading };
}
