import { useEffect, useRef, useState } from "react";
import useCurrentRoute from "./useCurrentRoute";
import usePage from "./usePage";
import Modal, { CloseFN } from "@/app/components/Modal";
import Home from "@/app/pages/Home";
import { AppPath } from "@/app/routes";
import useRouter from "../routing/useRouter";

export default function useView() {
  const { navigate } = useRouter();
  const { loading, page: currentPage } = usePage();
  const { route } = useCurrentRoute();
  const [page, setPage] = useState<React.ReactNode>();
  const [modal, setModal] = useState<React.ReactNode>();

  const backgroundPage = useRef<AppPath>("/");
  const closeRef = useRef<CloseFN>(null);

  const close = () => {
    navigate(backgroundPage.current);
  };

  if (page === undefined && modal === undefined) {
    if (route.useModal) {
      setModal(
        <Modal onClose={close} closeRef={closeRef}>
          {currentPage}
        </Modal>
      );
      setPage(<Home />);
    } else {
      setPage(currentPage);
      backgroundPage.current = route.path as AppPath;
    }
  }

  useEffect(() => {
    if (loading) {
      return;
    }

    if (route.useModal) {
      setModal(
        <Modal
          closeRef={closeRef}
          onClose={close}
          visible={modal !== null && modal !== undefined}
        >
          {currentPage}
        </Modal>
      );
      return;
    }

    if (modal) {
      closeRef.current?.(() => {
        closeRef.current = null;
        setModal(null);
      });
    }

    setPage(currentPage);
    backgroundPage.current = route.path as AppPath;
  }, [loading, currentPage]);

  return {
    loading,
    page,
    modal,
  };
}
