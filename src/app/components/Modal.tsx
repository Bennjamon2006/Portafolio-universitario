import { RefObject, useEffect, useState } from "react";
import styles from "@/app/styles/Modal.module.css";

export type CloseFN = (cb: () => void) => void;

interface Props {
  children: React.ReactNode;
  closeRef: RefObject<CloseFN | null>;
  onClose: () => void;
  visible?: boolean;
}

export default function Modal({
  children,
  closeRef,
  onClose,
  visible: isVisible,
}: Props) {
  const [visible, setVisible] = useState(isVisible ?? false);

  closeRef.current = (cb) => {
    setVisible(false);

    setTimeout(() => {
      cb();
    }, 750);
  };

  useEffect(() => {
    const animation = requestAnimationFrame(() => {
      setVisible(true);
    });

    const callback = (e: KeyboardEvent) => {
      if (e.key.toUpperCase() === "ESCAPE") {
        onClose();
      }
    };

    window.addEventListener("keydown", callback);

    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener("keydown", callback);
    };
  }, []);

  return (
    <div className={styles.modal__wrapper}>
      <div className={`${styles.modal} ${visible ? styles.visible : ""}`}>
        <header className={styles.header}>
          <nav>{/* TODO: Navigation */}</nav>
          <h1>Content</h1>
          <div className={styles.close__wrapper}>
            <button onClick={onClose}>&times;</button>
          </div>
        </header>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
