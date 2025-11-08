import { useEffect, useRef, useState } from "react";
import useCurrentRoute from "./useCurrentRoute";
import usePage from "./usePage";
import Modal, { CloseFN } from "@/app/components/Modal";
import Home from "@/app/pages/Home";

export default function useView() {
  const { loading, page: currentPage } = usePage();
  const { route } = useCurrentRoute();
  const [page, setPage] = useState<React.ReactNode>();
  const [modal, setModal] = useState<React.ReactNode>();

  const closeRef = useRef<CloseFN>(null);

  if (page === undefined && modal === undefined) {
    if (route.useModal) {
      setModal(<Modal closeRef={closeRef}>{currentPage}</Modal>);
      setPage(<Home />);
    } else {
      setPage(currentPage);
    }
  }

  useEffect(() => {
    if (loading) {
      return;
    }

    if (route.useModal) {
      setModal(<Modal closeRef={closeRef}>{currentPage}</Modal>);
      return;
    }

    if (modal) {
      closeRef.current?.(() => {
        closeRef.current = null;
        setModal(null);
      });
    }

    setPage(currentPage);
  }, [loading, currentPage]);

  return {
    loading,
    page,
    modal,
  };
}
