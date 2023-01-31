import {
  useActionData,
  useOutletContext,
  useLoaderData,
} from "@remix-run/react";
import { redirect } from "@remix-run/node";
import NewTaskModal from "~/components/newTask";
import { getUserId } from "~/session.server";
import { getProjects } from "~/models/project.server";
import { badRequest } from "~/utils";
import { createTask } from "~/models/task.server";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { sub } from "date-fns";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);

  if (!userId) {
    return { redirect: "/login" };
  }

  const projects = await getProjects({ userId: userId });

  return projects;
}

export default function NewTask() {
  const loaderData = useLoaderData();
  const data = useActionData();
  const context = useOutletContext<typeof data>();

  let taskContext = {
    projects: loaderData,
    projectId: context.id,
  } as const;

  return <NewTaskModal actionData={data || null} context={taskContext} />;
}

export async function action({ request }: ActionArgs) {
  const data = await request.formData();

  const name = data.get("name");
  const projectId = data.get("projectId");
  const project = data.get("project");
  const description = data.get("description");
  const dueDate = data.get("dueDate");
  const priority = data.get("priority");
  const dueTime = data.get("dueTime");

  const userId = await getUserId(request);

  if (!userId) {
    return redirect("/login");
  }

  if (!name || !projectId || !project) {
    return badRequest({
      formError: "Please fill out all required fields",
    });
  }

  console.log(
    typeof name,
    typeof projectId,
    typeof project,
    typeof description,
    typeof dueDate,
    typeof priority,
    typeof dueTime
  );
  if (
    typeof name !== "string" ||
    typeof projectId !== "string" ||
    typeof project !== "string" ||
    typeof description !== "string" ||
    typeof dueDate !== "string" ||
    typeof priority !== "string" ||
    typeof dueTime !== "string"
  ) {
    return badRequest({
      formError: "Please fill out all required fields",
    });
  }

  let date = new Date(dueDate + "T" + dueTime || "2023-01-31T01:24:51.564Z");
  const localDate = sub(date, {
    hours: 5,
  });

  // TODO: update time property. Need to check if time was filled out up above
  await createTask(
    { userId: userId },
    { projectId: project },
    name,
    description,
    Number(priority),
    localDate,
    true
  );

  return redirect(`/project/${projectId}`);
}
