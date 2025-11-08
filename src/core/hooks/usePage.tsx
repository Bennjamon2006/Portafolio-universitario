import { useMemo } from "react";
import useComponent from "./useComponent";
import useProps from "./useProps";

type Result = {
  loading: boolean;
  page: React.ReactNode;
};

export default function usePage(): Result {
  const { Component, loading: componentLoading } = useComponent();
  const { props, loading: propsLoading } = useProps();
  const loading = componentLoading || propsLoading;

  const page = useMemo(
    () => (loading ? null : Component && props && <Component {...props} />),
    [Component, props]
  );

  return {
    page: page,
    loading,
  };
}
