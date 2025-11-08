import { AppPath } from "@/app/routes";
import { Params, ParamsArgs } from "@/core/routing/Router.context";
import useRouter from "@/core/routing/useRouter";
import buildPath from "@/shared/utils/buildPath";

type Base = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

type WithParams<P extends AppPath> = Params<P> extends infer T
  ? {} extends T
    ? {}
    : { params: T }
  : never;

type Props<P extends AppPath> = Base & {
  to: P;
} & WithParams<P>;

export default function Link<P extends AppPath>(props: Props<P>) {
  const { navigate } = useRouter();

  // Extraemos los props y params de forma segura
  const { to, params, onClick, children, ...restProps } = props as Props<P> & {
    params: Params<P>;
  };

  const args: ParamsArgs<P> = [params] as unknown as ParamsArgs<P>;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onClick) onClick(e);
    navigate(to, ...args);
  };

  const href = buildPath(to, ...args);

  return (
    <a {...restProps} href={href} onClick={handleClick}>
      {children}
    </a>
  );
}
