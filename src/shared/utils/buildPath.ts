import { Params, ParamsArgs } from "@/core/routing/Router.context";
import { AppPath } from "@/app/routes";

type ReplaceParams<P extends string, A extends ParamsArgs<P>> = [] extends A
  ? P
  : P extends `${infer R1}/:${infer Key extends keyof A[0] &
      string}${infer R2 extends "" | `/${string}`}`
  ? R2 extends ""
    ? `${R1}/${A[0][Key] & string}`
    : A extends ParamsArgs<R2>
    ? `${R1}/${A[0][Key] & string}${ReplaceParams<R2, A>}`
    : P
  : P;

export default function buildPath<
  P extends AppPath,
  const A extends ParamsArgs<P>
>(path: P, ...args: A): ReplaceParams<P, A> {
  if (!path.includes(":")) {
    return path as ReplaceParams<P, A>;
  }

  if (args.length === 0) {
    throw new Error(`Missing params for path "${path}"`);
  }

  const [params] = args as unknown as [Params<P>];

  return path.replace(/:([^/]+)/g, (_, key) => {
    if (!(key in params)) {
      throw new Error(`Missing param "${key}" for path "${path}"`);
    }

    return params[key as keyof Params<P>] as string;
  }) as ReplaceParams<P, A>;
}
