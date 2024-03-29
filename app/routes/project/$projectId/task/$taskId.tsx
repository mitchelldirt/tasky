import EditTask from "~/components/EditTask";
import { LiveReload, useLoaderData } from "@remix-run/react";
import { getTaskById, updateTask } from "~/models/task.server";
import { redirect } from "@remix-run/node";
import { getProjects } from "~/models/project.server";
import { getUserId } from "~/session.server";
import { z } from "zod";
import { badRequest } from "~/utils";

import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { grabCookieValue } from "~/helpers/cookies";
import { addHours } from "date-fns";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Edit task" }];
};

const dataSchema = z.object({
  task: z.object({
    id: z.string(),
    description: z.string(),
    projectId: z.any(),
    priority: z.number(),
    title: z.string(),
    dueDate: z.string().nullable(),
    time: z.boolean(),
  }),
  projects: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      color: z.string(),
    })
  ),
});

function isValidData(input: unknown): input is z.infer<typeof dataSchema> {
  const isValidSchema = dataSchema.safeParse(input);
  return isValidSchema.success;
}

export type TaskContext = z.infer<typeof dataSchema>;

export async function loader({ params, request }: LoaderArgs) {
  if (typeof params.taskId !== "string") {
    throw new Error("Uh Oh");
  }

  const userId = await getUserId(request);

  if (!userId) {
    return { redirect: "/login" };
  }

  // get the current url
  const url = new URL(request.url);

  const projects = await getProjects({ userId: userId });
  const task = await getTaskById({ id: params.taskId });

  return {
    taskContext: { task: task, projects: projects },
    noneId: `none-${userId}`,
    previousRoute: url.pathname.slice(0, url.pathname.indexOf("/task")),
  };
}

export default function EditTaskRoute() {
  const data = useLoaderData<typeof loader>();

  if ("taskContext" in data) {
    if (!data || !isValidData(data.taskContext)) {
      return <p>Something went wrong</p>;
    }

    return (
      <>
        <EditTask
          previousRoute={data.previousRoute}
          taskContext={data.taskContext}
          noneId={data.noneId}
        />
        <LiveReload />
      </>
    );
  }

  return <p>Something went wrong</p>;
}

export async function action({ request }: ActionArgs) {
  const data = await request.formData();
  const title = data.get("title");
  const description = data.get("description");
  const project = data.get("project");
  const priority = data.get("priority");
  let dueDate = data.get("dueDate");
  let dueTime = data.get("dueTime");
  const taskId = data.get("id");
  const previousRoute = data.get("previousRoute");

  const cookies = request.headers.get("Cookie");
  if (!cookies) throw new Response("No cookies found", { status: 400 });
  const tzCookieValue = grabCookieValue("tz", cookies);

  const userId = await getUserId(request);
  if (userId === undefined) return redirect("/login");

  //TODO: Throw some zod validations here
  try {
    const taskIdSchema = z.object({
      id: z.string(),
    });

    let time = false;
    let formattedDueDate = null;

    if (dueDate && dueTime === "") {
      const serverOffset = new Date().getTimezoneOffset();
      formattedDueDate = addHours(
        new Date(dueDate + "T00:00:00.000Z"),
        serverOffset / 60
      );
      console.log("formatted due date", formattedDueDate);
    }

    if (!dueDate && dueTime) {
      return badRequest({
        formError: "Please select a date",
      });
    }

    if (
      dueDate &&
      dueTime &&
      dueTime.length > 0 &&
      typeof dueDate === "string"
    ) {
      const serverOffset = new Date().getTimezoneOffset();
      const seconds = dueTime.length === 5 ? ":00" : "";
      formattedDueDate = addHours(
        new Date(dueDate + "T" + dueTime + seconds + ".000Z"),
        serverOffset / 60
      );
      time = true;
    }

    switch (request.method) {
      case "PATCH": {
        await updateTask(
          taskIdSchema.parse({ id: taskId }),
          z.string().parse(title),
          z.string().parse(description) || "",
          z.number().parse(Number(priority)),
          z.date().nullable().parse(formattedDueDate),
          z.boolean().parse(time),
          z.string().parse(project),
          z.string().parse(tzCookieValue)
        );
        return redirect(
          z.string().parse(previousRoute) || "/project/filteredView/all"
        );
      }
    }
  } catch (error) {
    console.error(error);
  }

  return badRequest({
    formError: "Uh oh - something went wrong on our end.",
  });
}
