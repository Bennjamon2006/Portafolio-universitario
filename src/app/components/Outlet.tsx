import useView from "@/core/hooks/useView";

export default function Outlet() {
  const { page, modal, loading } = useView();

  return (
    <>
      {page}
      {modal}
      {loading && <p>Loading</p> /* TODO */}
    </>
  );
}
