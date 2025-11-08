import { createContext } from "react";

interface ServerState {
  props: any;
  Component: React.FC<any>;
}

const ServerContext = createContext<ServerState>({
  props: {},
  Component: () => null,
});

export default ServerContext;
