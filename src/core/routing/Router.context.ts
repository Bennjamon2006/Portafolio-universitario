import { createContext } from "react";
import { AppPath } from "@/app/routes";

export interface HistoryEntry {
  path: AppPath;
  modal: boolean;
  page: React.ReactNode;
}

export type Params<
  P extends string,
  Acum = {}
> = P extends `${string}/:${infer K}${"" | `/${infer R}`}`
  ? (
      K extends K ? (K extends `${string}/${string}` ? never : K) : never
    ) extends infer Key extends string
    ? Params<R, Acum & { [k in Key]: string }>
    : never
  : Acum;

export type ParamsArgs<P extends string> = Params<P> extends infer T
  ? {} extends T
    ? [params?: T]
    : [params: T]
  : never;

export type NavigateFn = <P extends AppPath>(
  newPage: P,
  ...args: ParamsArgs<P>
) => void;

export interface RouterState {
  path: AppPath;
  navigate: NavigateFn;
  history: HistoryEntry[];
}

const RouterContext = createContext<RouterState>({
  path: "/",
  navigate: () => {},
  history: [],
});

export default RouterContext;
