import EditTask from "~/components/editTask";
import { LiveReload, useLoaderData } from "@remix-run/react";
import { getTaskById } from "~/models/task.server";
import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import { getProjects } from "~/models/project.server";
import { getUserId } from "~/session.server";
import { z } from "zod";
import { badRequest } from "~/utils";

const dataSchema = z.object({
  task: z.object({
    id: z.string(),
    description: z.string(),
    projectId: z.any(),
    priority: z.number(),
    title: z.string(),
    dueDate: z.string(),
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
  const dueDate = data.get("dueDate");
  const time = data.get("time");
  const taskId = data.get("id");

  const userId = await getUserId(request);
  if (userId === undefined) return redirect("/login");

  //TODO: Throw some zod validations here

  //TODO: switch editProject to editTask
  switch (request.method) {
    case "PATCH": {
      await editProject({
        id: projectId,
        name: name.toUpperCase(),
        color: color,
      });
      return redirect(`/project/${projectId}`);
    }
  }

  return badRequest({
    formError: "Uh oh - something went wrong on our end.",
  });
}
