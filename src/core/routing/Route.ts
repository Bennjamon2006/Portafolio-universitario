interface RouteModule {
  generateStaticParams?: () => any;
  getServerProps?: (params: any) => any;
  default: React.FC<any>;
}

type InternaPath = `/${string}`;

export interface Route<P extends InternaPath> {
  path: P;
  loader: () => Promise<RouteModule>;
  useModal: boolean;
}

export function createRoutes<P extends InternaPath>(
  routes: Route<P>[]
): Route<P>[] {
  return routes;
}

type ParsePath<P extends string> =
  P extends `${infer R1}/:${string}/${infer R2}`
    ? `${R1}/${string}/${ParsePath<R2>}`
    : P extends `${infer R1}/:${string}`
    ? `${R1}/${string}`
    : P;

export type Paths<T extends Route<InternaPath>[]> =
  T[number]["path"] extends infer P extends string
    ? P extends P
      ? P | ParsePath<P>
      : never
    : never;
