import { Outlet } from "@remix-run/react";
import ProjectNavBar from "~/components/ProjectNavBar";

export default function Project() {
  return (
    <>
      <ProjectNavBar name="hello" />
      <Outlet />
    </>
  );
}
