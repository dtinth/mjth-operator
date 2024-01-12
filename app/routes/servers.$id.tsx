import { Outlet, useParams } from "@remix-run/react";

export default function ServerLayout() {
  const params = useParams();
  return (
    <>
      <h1>Server - {params.id}</h1>
      <Outlet />
    </>
  );
}
