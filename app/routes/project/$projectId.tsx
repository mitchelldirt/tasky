import { Outlet, useLoaderData } from "@remix-run/react";
import ProjectNavBar from "~/components/ProjectNavBar";
import { getProjectById } from "~/models/project.server";

import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import React from "react";
import Tasks from "~/components/Tasks";
import { getProjectTasks } from "~/models/task.server";
import { getUserId } from "~/session.server";
import { json } from "@remix-run/node";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title:
        data.name.charAt(0) + data.name.slice(1).toLowerCase() + " project",
    },
  ];
};

export async function loader({ params, request }: LoaderArgs) {
  const projectId = params.projectId;
  const userId = await getUserId(request);
  if (!userId) throw redirect("/");
  if (typeof projectId !== "string") {
    throw new Error("uh oh");
  }

  const project = await getProjectById({ projectId });

  if (project) {
    const projectTasks = await getProjectTasks({
      id: project.id,
      userId: userId,
    });

    return json({
      name: project.name,
      color: project.color,
      id: project.id,
      tasks: projectTasks[0].tasks,
    });
  }

  throw new Error("Uh Oh");
}

export default function ProjectById() {
  const data = useLoaderData<typeof loader>();

  if (!data || typeof data !== "object") {
    return null;
  }

  const name = data.name;
  const color = data.color;
  const id = data.id;
  const tasks = data.tasks;

  return (
    <>
      <ProjectNavBar
        name={name || "Project"}
        color={color || "red"}
        id={id || "null"}
      />
      <Outlet context={{ id, name, color }} />
      {tasks ? <Tasks tasks={data.tasks || []} displayProject={false} /> : null}
    </>
  );
}
