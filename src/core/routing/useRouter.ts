import { useContext } from "react";
import RouterContext from "./Router.context";

export default function useRouter() {
  return useContext(RouterContext);
}
