import { Outlet, useLoaderData } from "@remix-run/react";
import ProjectNavBar from "~/components/ProjectNavBar";
import { getProjectById } from "~/models/project.server";

import type { LoaderArgs } from "@remix-run/node";
import React from "react";
import Tasks from "~/components/Tasks";

export async function loader({ params }: LoaderArgs) {
  const projectId = params.projectId;

  if (typeof projectId !== "string") {
    return null;
  }

  const project = await getProjectById({ projectId });

  if (project) {
    return {
      name: project.name,
      color: project.color,
      id: project.id,
    };
  }

  return null
}

export default function ProjectById() {
  const loaderData = useLoaderData<typeof loader>();

  const name = loaderData?.name;
  const color = loaderData?.color;
  const id = loaderData?.id;

  return (
    <>
      <ProjectNavBar
        name={name || "Project"}
        color={color || "red"}
        id={id || "null"}
      />
      <Outlet context={{id, name, color}} />
      <Tasks />
    </>
  );
}
