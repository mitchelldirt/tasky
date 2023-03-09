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
import { format } from "date-fns-tz";

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
  let dueTime = data.get("dueTime");
  let time = true;

  const userId = await getUserId(request);

  if (!userId) {
    return redirect("/login");
  }

  if (!name || !projectId || !project) {
    return badRequest({
      formError: "Please fill out all required fields",
    });
  }

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
  if (!dueTime) {
    dueTime = "00:00";
    time = false;
  }

  //TODO: Extract this date stuff into a function
  let localDate;

  if (!dueDate) {
    localDate = null;
  } else {
    let date = format(new Date(dueDate + "T" + dueTime), "yyyy-MM-dd HH:mm z") || "2023-01-31T01:24:51.564Z";
    localDate = new Date(date);
  }

  // TODO: update time property. Need to check if time was filled out up above
  await createTask(
    { userId: userId },
    { projectId: project },
    name,
    description,
    Number(priority),
    localDate,
    time
  );

  return redirect(`/project/${projectId}`);
}
