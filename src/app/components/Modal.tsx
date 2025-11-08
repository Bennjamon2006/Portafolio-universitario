import { RefObject } from "react";

export type CloseFN = (cb: () => void) => void;

interface Props {
  children: React.ReactNode;
  closeRef: RefObject<CloseFN | null>;
}

export default function Modal({ children, closeRef }: Props) {
  closeRef.current = (cb) => {
    console.log("Close");
    cb();
  };

  return <div className="modal">{children}</div>;
}
