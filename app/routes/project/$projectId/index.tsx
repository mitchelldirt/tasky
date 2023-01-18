import { Outlet } from "@remix-run/react";
import ProjectNavBar from "~/components/ProjectNavBar";
import { getProjectById } from "~/models/project.server";

import type { LoaderArgs } from "@remix-run/node";

export async function loader({ params }: LoaderArgs) {
  const projectId = params.projectId;

  if (typeof projectId !== "string") {
    return null;
  }

  const project = await getProjectById({ projectId });

  return null;
}

export default function ProjectById() {
  return (
    <>
      <ProjectNavBar />
      <p>This is working</p>
      <Outlet />
    </>
  );
}
