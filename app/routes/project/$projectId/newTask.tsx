import {
  useActionData,
  useOutletContext,
  useLoaderData,
} from "@remix-run/react";
import { V2_MetaFunction, redirect } from "@remix-run/node";
import NewTaskModal from "~/components/NewTask";
import { getUserId } from "~/session.server";
import { getProjects } from "~/models/project.server";
import { badRequest } from "~/utils";
import { createTask } from "~/models/task.server";
import { formatUserDate } from "~/helpers/dueDateFunctions";
import { grabCookieValue } from "~/helpers/cookies";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New task" }];
};

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);

  if (!userId) {
    return { redirect: "/login" };
  }

  const projects = await getProjects({ userId: userId });

  return { projects, userId };
}

export default function NewTask() {
  const loaderData = useLoaderData();
  const data = useActionData();
  const context = useOutletContext<typeof data>();

  let taskContext = {
    projects: loaderData.projects,
    projectId: context.id,
    noneId: `none-${loaderData.userId}`,
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

  const cookies = request.headers.get("Cookie");
  if (!cookies) throw new Response("No cookies found", { status: 400 });
  const tzCookieValue = grabCookieValue("tz", cookies);

  if (typeof tzCookieValue !== "string") {
    return badRequest({
      formError: "Server Error TZ1: Please try again",
    });
  }

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

  let userLocalTime = formatUserDate(dueDate, dueTime);

  await createTask(
    { userId: userId },
    { projectId: project },
    name,
    description,
    Number(priority),
    userLocalTime,
    time,
    tzCookieValue
  );

  return redirect(`/project/${projectId}`);
}
